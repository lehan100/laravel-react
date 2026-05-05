<?php

namespace App\Http\Controllers\Admin\Catalog;

use App\Http\Controllers\MainController;
use App\Http\Requests\Catalog\ProductRequest;
use App\Http\Resources\Catalog\ProductCollection;
use App\Http\Resources\Catalog\ProductResource;
use App\Repositories\Category\CategoryRepositoryInterface;
use App\Repositories\Product\ProductRepositoryInterface as RepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class ProductController extends MainController
{
    protected string $controllerView = 'Admin/Product/';

    protected string $routeName = 'product.';

    protected RepositoryInterface $mainModel;

    protected CategoryRepositoryInterface $categoryModel;

    public function __construct(RepositoryInterface $repository, CategoryRepositoryInterface $categoryModel)
    {
        parent::__construct();
        $this->mainModel = $repository;
        $this->categoryModel = $categoryModel;

        $this->middleware(function ($request, $next) {
            $configPath = config('image.path.product');
            $languageConfigPath = config('image.path.photo');
            Inertia::share([
                'config_path' => $configPath,
                'languageConfigPath' => $languageConfigPath,
            ]);

            return $next($request);
        });
    }

    public function index()
    {
        $items = $this->mainModel->lists(null, [
            'task' => 'admin-list-items',
        ]);

        return Inertia::render($this->controllerView.'Index', [
            'items' => new ProductCollection($items),
        ]);
    }

    public function create()
    {
        $itemsCategoryActive = $this->categoryModel->lists(null, [
            'task' => 'admin-list-items-active',
            'type' => 'product',
        ]);

        return Inertia::render($this->controllerView.'Created', [
            'item' => null,
            'itemsCategoryActive' => $itemsCategoryActive,
        ]);
    }

    public function store(ProductRequest $request)
    {
        try {
            $params = $request->all();
            $product = $this->mainModel->save($params, ['task' => 'add-item']);

            if (($params['undo'] ?? 0) == 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.catalog.product.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $product->id)
                ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.catalog.product.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.created', ['name' => mb_strtolower(__('hancms.catalog.product.name'))]));
        }
    }

    public function edit(string $id)
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);
        $itemsCategoryActive = $this->categoryModel->lists(null, [
            'task' => 'admin-list-items-active',
            'type' => 'product',
        ]);

        return Inertia::render($this->controllerView.'Edit', [
            'item' => new ProductResource($item),
            'itemsCategoryActive' => $itemsCategoryActive,
        ]);
    }

    public function update(ProductRequest $request, string $id)
    {
        try {
            $params = $request->all();
            $params['id'] = $id;
            $product = $this->mainModel->save($params, ['task' => 'edit-item']);

            if (($params['undo'] ?? 0) == 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.catalog.product.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $product->id)
                ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.catalog.product.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.catalog.product.name'))]));
        }
    }

    public function destroy(string $id)
    {
        try {
            $params['id'] = $id;
            $this->mainModel->delete($params, ['task' => 'delete-item']);

            return Redirect::to(route($this->routeName.'index'))
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.catalog.product.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        try {
            $params = $request::all();
            $this->mainModel->delete($params, ['task' => 'delete-items']);

            return Redirect::route($this->routeName.'index')
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.catalog.product.name'))]));
        } catch (\Throwable $th) {
            return Redirect::route($this->routeName.'index')
                ->with('error', __('hancms.message.error.deleted'));
        }
    }
}
