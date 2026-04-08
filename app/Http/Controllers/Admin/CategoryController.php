<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\MainController;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryCollection;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Repositories\Category\CategoryRepositoryInterface as RepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class CategoryController extends MainController
{
    protected $controllerView = 'Admin/Category/';
    protected $routeName = 'category.';
    protected $mainModel;
    public function __construct(RepositoryInterface $repository)
    {
        $this->mainModel = $repository;
        $this->middleware(function ($request, $next) {
            $currentLocale = app()->getLocale();
            $configPath = config('image.path.category');
            $languageConfigPath = config('image.path.photo');
            $itemsCategory = $this->mainModel->lists(null, [
                'task' => 'admin-list-items'
            ]);
            Inertia::share([
                'config_path' => $configPath,
                'languageConfigPath' => $languageConfigPath,
                'itemsCategory' => new CategoryCollection($itemsCategory)
            ]);

            return $next($request);
        });
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //

        return Inertia::render($this->controllerView . 'Index', []);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $itemsCategoryActive = $this->mainModel->lists(null, [
            'task' => 'admin-list-items-active'
        ]);
        return Inertia::render($this->controllerView . 'Created', [
            'itemsCategoryActive' => $itemsCategoryActive
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        //
        try {
            $params = $request->all();
            $category = $this->mainModel->save($params, ['task' => 'add-item']);
            if ($params['undo'] == 1) {
                return Redirect::to(route($this->routeName . 'index'))->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]));
            }
            return Redirect::route($this->routeName . 'edit', $category->id)->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]));
        } catch (\Throwable $th) {
            //throw $th;
            return Redirect::back()->with('error',  __('hancms.message.error.created', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]));
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
    public function edit(Category $category)
    {
        //
        $itemsCategoryActive = $this->mainModel->lists(null, [
            'task' => 'admin-list-items-active'
        ]);
        // echo "<pre>";print_r(new CategoryResource($category));die();
        return Inertia::render($this->controllerView . 'Edit', [
            'item' => new CategoryResource($category),
            'itemsCategoryActive' => $itemsCategoryActive
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryRequest $request, string $id)
    {
        //
        try {
            $params = $request->all();
            $params['id'] = $id;
            // print_r($params);die();
            $banner = $this->mainModel->save($params, ['task' => 'edit-item']);
            if ($params['undo'] == 1) {
                return Redirect::to(route($this->routeName . 'index'))->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]));
            }
            return Redirect::route($this->routeName . 'edit', $banner->id)->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]));
        } catch (\Throwable $th) {
            //throw $th;
            return Redirect::back()->with('error',  __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]));
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        try {
            $params['id'] = $id;
            $this->mainModel->delete($params, ['task' => 'delete-item']);
            return Redirect::to(route($this->routeName . 'index'))->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.catalog.category.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }

    public function reorder(HttpRequest $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'integer', 'exists:categories,id'],
            'items.*.parent_id' => ['nullable', 'integer', 'exists:categories,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        $success = $this->mainModel->save($validated, ['task' => 'reorder-tree']);

        if (!$success) {
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
