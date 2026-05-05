<?php

namespace App\Http\Controllers\Admin\Promotion;

use App\Http\Controllers\MainController;
use App\Http\Requests\Catalog\CategoryProductPickerRequest;
use App\Http\Requests\Promotion\CouponRequest;
use App\Http\Resources\Promotion\CouponCollection;
use App\Http\Resources\Promotion\CouponResource;
use App\Repositories\Category\CategoryRepositoryInterface;
use App\Repositories\Coupon\CouponRepositoryInterface as RepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request as RequestFacade;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends MainController
{
    protected string $controllerView = 'Admin/Promotion/Coupon/';

    protected string $routeName = 'coupon.';

    protected RepositoryInterface $mainModel;

    protected CategoryRepositoryInterface $categoryModel;

    public function __construct(
        RepositoryInterface $repository,
        CategoryRepositoryInterface $categoryModel
    ) {
        parent::__construct();
        $this->mainModel = $repository;
        $this->categoryModel = $categoryModel;
    }

    public function index(): Response
    {
        $this->params = array_merge(RequestFacade::all(), $this->params);
        $items = $this->mainModel->lists($this->params, ['task' => 'admin-list-items']);

        return Inertia::render($this->controllerView.'Index', [
            'items' => new CouponCollection($items),
        ]);
    }

    public function create(): Response
    {
        $itemsCategoryActive = $this->categoryModel->lists(null, [
            'task' => 'admin-list-items-active',
            'type' => 'product',
        ]);

        return Inertia::render($this->controllerView.'Created', [
            'item' => null,
            'itemsCategoryActive' => $itemsCategoryActive,
            'itemsSelectedProducts' => [],
        ]);
    }

    public function store(CouponRequest $request): RedirectResponse
    {
        try {
            $params = $request->all();
            $coupon = $this->mainModel->save($params, ['task' => 'add-item']);

            if (($params['undo'] ?? 0) == 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.promotion.coupon.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $coupon->id)
                ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.promotion.coupon.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.created', ['name' => mb_strtolower(__('hancms.promotion.coupon.name'))]));
        }
    }

    public function show(string $id): Response|RedirectResponse
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);

        if (! $item) {
            return redirect()->route($this->routeName.'index')
                ->with('error', __('hancms.message.error.nodata'));
        }

        $item->load([
            'categories' => function ($query) {
                $query->select(['categories.id'])
                    ->withCount('products')
                    ->with([
                        'translations' => function ($translationQuery) {
                            $translationQuery->select(['id', 'category_id', 'locale', 'name'])
                                ->where('locale', app()->getLocale());
                        },
                    ]);
            },
            'products' => function ($query) {
                $query->select(['products.id', 'products.sku', 'products.price', 'products.status'])
                    ->with([
                        'translations' => function ($translationQuery) {
                            $translationQuery->select(['id', 'product_id', 'locale', 'name'])
                                ->where('locale', app()->getLocale());
                        },
                    ]);
            },
        ]);

        return Inertia::render($this->controllerView.'Show', [
            'item' => new CouponResource($item),
        ]);
    }

    public function edit(string $id): Response
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);
        $itemsCategoryActive = $this->categoryModel->lists(null, [
            'task' => 'admin-list-items-active',
            'type' => 'product',
        ]);
        $selectedProductIds = $item?->products?->pluck('id')->values()->all() ?? [];
        $itemsSelectedProducts = $this->categoryModel->getSelectedProductRows($selectedProductIds);

        return Inertia::render($this->controllerView.'Edit', [
            'item' => new CouponResource($item),
            'itemsCategoryActive' => $itemsCategoryActive,
            'itemsSelectedProducts' => $itemsSelectedProducts,
        ]);
    }

    public function productsPicker(CategoryProductPickerRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $categoryId = $validated['category_id'] ?? null;
        $categoryIds = (! empty($categoryId) && $categoryId !== 'all')
            ? $this->categoryModel->getCategoryAndDescendantIds((int) $categoryId)
            : [];

        return response()->json($this->categoryModel->getProductPickerData(
            (int) ($validated['per_page'] ?? 10),
            trim((string) ($validated['search'] ?? '')),
            $categoryIds,
        ));
    }

    public function update(CouponRequest $request, string $id): RedirectResponse
    {
        try {
            $params = $request->all();
            $params['id'] = $id;
            $coupon = $this->mainModel->save($params, ['task' => 'edit-item']);

            if (($params['undo'] ?? 0) == 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.promotion.coupon.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $coupon->id)
                ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.promotion.coupon.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.promotion.coupon.name'))]));
        }
    }

    public function destroy(string $id): RedirectResponse
    {
        try {
            $this->mainModel->delete(['id' => $id], ['task' => 'delete-item']);

            return Redirect::to(route($this->routeName.'index'))
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.promotion.coupon.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        try {
            $params = $request->all();
            $this->mainModel->delete($params, ['task' => 'delete-items']);

            return Redirect::to(route($this->routeName.'index'))
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.promotion.coupon.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }
}
