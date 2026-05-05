<?php

namespace App\Http\Controllers\Admin\Catalog;

use App\Http\Controllers\MainController;
use App\Http\Requests\Catalog\CategoryProductPickerRequest;
use App\Http\Requests\Catalog\CategoryReorderRequest;
use App\Http\Requests\Catalog\CategoryRequest;
use App\Http\Resources\Catalog\CategoryCollection;
use App\Http\Resources\Catalog\CategoryResource;
use App\Models\Catalog\Category;
use App\Repositories\Category\CategoryRepositoryInterface as RepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends MainController
{
    protected string $controllerView = 'Admin/Category/';

    protected string $routeName = 'category.';

    protected RepositoryInterface $mainModel;

    public function __construct(RepositoryInterface $repository)
    {
        parent::__construct();
        $this->mainModel = $repository;
        $this->middleware(function ($request, $next) {
            $configPath = config('image.path.category');
            $languageConfigPath = config('image.path.photo');
            $itemsCategory = $this->mainModel->lists(null, [
                'task' => 'admin-list-items',
            ]);
            Inertia::share([
                'config_path' => $configPath,
                'languageConfigPath' => $languageConfigPath,
                'itemsCategory' => new CategoryCollection($itemsCategory),
            ]);

            return $next($request);
        });
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        //

        return Inertia::render($this->controllerView.'Index', []);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        //
        $itemsCategoryActive = $this->mainModel->lists(null, [
            'task' => 'admin-list-items-active',
        ]);

        return Inertia::render($this->controllerView.'Created', [
            'itemsCategoryActive' => $itemsCategoryActive,
            'itemsSelectedProducts' => [],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request): RedirectResponse
    {
        //
        try {
            $params = $request->all();
            $category = $this->mainModel->save($params, ['task' => 'add-item']);
            if ($params['undo'] == 1) {
                return Redirect::to(route($this->routeName.'index'))->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $category->id)->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]));
        } catch (\Throwable $th) {
            // throw $th;
            return Redirect::back()->with('error', __('hancms.message.error.created', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]));
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category): Response
    {
        //
        $category->load(['products:id'])->loadCount('products');
        $itemsCategoryActive = $this->mainModel->lists(null, [
            'task' => 'admin-list-items-active',
        ]);
        $selectedProductIds = $category?->products?->pluck('id')->values()->all() ?? [];
        $itemsSelectedProducts = $this->mainModel->getSelectedProductRows($selectedProductIds);

        // echo "<pre>";print_r(new CategoryResource($category));die();
        return Inertia::render($this->controllerView.'Edit', [
            'item' => new CategoryResource($category),
            'itemsCategoryActive' => $itemsCategoryActive,
            'itemsSelectedProducts' => $itemsSelectedProducts,
        ]);
    }

    public function productsPicker(CategoryProductPickerRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $pageSize = (int) ($validated['per_page'] ?? 10);
        $search = trim((string) ($validated['search'] ?? ''));
        $paginator = $this->mainModel->getProductPickerData($pageSize, $search);

        return response()->json([
            'data' => $paginator['data'],
            'meta' => $paginator['meta'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, string $id): RedirectResponse
    {
        //
        try {
            $params = $request->all();
            $params['id'] = $id;
            // print_r($params);die();
            $banner = $this->mainModel->save($params, ['task' => 'edit-item']);
            if ($params['undo'] == 1) {
                return Redirect::to(route($this->routeName.'index'))->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $banner->id)->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]));
        } catch (\Throwable $th) {
            // throw $th;
            return Redirect::back()->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]));
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        //
        try {
            $params = ['id' => $id];
            $this->mainModel->delete($params, ['task' => 'delete-item']);

            return Redirect::to(route($this->routeName.'index'))->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }

    public function reorder(CategoryReorderRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $success = $this->mainModel->save($validated, ['task' => 'reorder-tree']);

        if (! $success) {
            return response()->json([
                'status' => false,
                'message' => __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]),
            ], 422);
        }

        return response()->json([
            'status' => true,
            'message' => __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]),
        ]);
    }
}
