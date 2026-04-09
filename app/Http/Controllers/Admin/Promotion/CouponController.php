<?php

namespace App\Http\Controllers\Admin\Promotion;

use App\Http\Controllers\MainController;
use App\Http\Requests\Promotion\CouponRequest;
use App\Http\Resources\Promotion\CouponCollection;
use App\Http\Resources\Promotion\CouponResource;
use App\Models\Catalog\Product;
use Illuminate\Database\Eloquent\Builder;
use App\Repositories\Category\CategoryRepositoryInterface as CategoryRepositoryInterface;
use App\Repositories\Coupon\CouponRepositoryInterface as RepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request as RequestFacade;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends MainController
{
    protected $controllerView = 'Admin/Promotion/Coupon/';
    protected $routeName = 'coupon.';
    protected $mainModel;
    protected $categoryModel;

    public function __construct(
        RepositoryInterface $repository,
        CategoryRepositoryInterface $categoryModel
    )
    {
        $this->mainModel = $repository;
        $this->categoryModel = $categoryModel;
    }

    public function index(): Response
    {
        $this->params = array_merge(RequestFacade::all(), $this->params);
        $items = $this->mainModel->lists($this->params, ['task' => 'admin-list-items']);

        return Inertia::render($this->controllerView . 'Index', [
            'items' => new CouponCollection($items),
        ]);
    }

    public function create(): Response
    {
        $itemsCategoryActive = $this->categoryModel->lists(null, [
            'task' => 'admin-list-items-active',
            'type' => 'product',
        ]);

        return Inertia::render($this->controllerView . 'Created', [
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
                return Redirect::to(route($this->routeName . 'index'))
                    ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.promotion.coupon.name'))]));
            }

            return Redirect::route($this->routeName . 'edit', $coupon->id)
                ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.promotion.coupon.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.created', ['name' => mb_strtolower(__('hancms.promotion.coupon.name'))]));
        }
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id): Response
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);
        $itemsCategoryActive = $this->categoryModel->lists(null, [
            'task' => 'admin-list-items-active',
            'type' => 'product',
        ]);
        $selectedProductIds = $item?->products?->pluck('id')->values()->all() ?? [];
        $itemsSelectedProducts = $this->fetchProductRowsByIds($selectedProductIds);

        return Inertia::render($this->controllerView . 'Edit', [
            'item' => new CouponResource($item),
            'itemsCategoryActive' => $itemsCategoryActive,
            'itemsSelectedProducts' => $itemsSelectedProducts,
        ]);
    }

    public function productsPicker(Request $request): JsonResponse
    {
        $currentLocale = app()->getLocale();
        $pageSize = max(1, min(100, (int) $request->input('per_page', 10)));
        $search = trim((string) $request->input('search', ''));
        $categoryId = $request->input('category_id');

        $query = Product::query()
            ->select(['id', 'sku', 'price', 'status'])
            ->where('status', 1)
            ->with([
                'translations' => function ($query) use ($currentLocale) {
                    $query->select(['id', 'product_id', 'locale', 'name'])
                        ->where('locale', $currentLocale);
                },
                'categories:id',
            ])
            ->orderBy('id');

        if ($search !== '') {
            $query->where(function (Builder $q) use ($search, $currentLocale) {
                $q->where('id', 'like', '%' . $search . '%')
                    ->orWhere('sku', 'like', '%' . $search . '%')
                    ->orWhereHas('translations', function (Builder $tq) use ($search, $currentLocale) {
                        $tq->where('locale', $currentLocale)
                            ->where('name', 'like', '%' . $search . '%');
                    });
            });
        }

        if (!empty($categoryId) && $categoryId !== 'all') {
            $query->whereHas('categories', function (Builder $q) use ($categoryId) {
                $q->where('categories.id', (int) $categoryId);
            });
        }

        $paginator = $query->paginate($pageSize)->appends($request->query());

        return response()->json([
            'data' => $this->mapProductsForPicker(collect($paginator->items())),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    private function fetchProductRowsByIds(array $ids): array
    {
        if (empty($ids)) {
            return [];
        }

        $currentLocale = app()->getLocale();

        $products = Product::query()
            ->select(['id', 'sku', 'price', 'status'])
            ->whereIn('id', $ids)
            ->with([
                'translations' => function ($query) use ($currentLocale) {
                    $query->select(['id', 'product_id', 'locale', 'name'])
                        ->where('locale', $currentLocale);
                },
                'categories:id',
            ])
            ->get()
            ->sortBy(function ($item) use ($ids) {
                return array_search($item->id, $ids, true);
            })
            ->values();

        return $this->mapProductsForPicker($products);
    }

    private function mapProductsForPicker($products): array
    {
        return $products->map(function ($item) {
            $translations = $item->translations ?? collect();
            $name = optional($translations->first())->name ?: ($item->sku ?: ('#' . $item->id));

            return [
                'id' => (int) $item->id,
                'sku' => $item->sku,
                'price' => (float) ($item->price ?? 0),
                'status' => (int) ($item->status ?? 0),
                'name' => $name,
                'category_ids' => ($item->categories ?? collect())->pluck('id')->map(fn($id) => (int) $id)->values()->all(),
            ];
        })->values()->all();
    }

    public function update(CouponRequest $request, string $id): RedirectResponse
    {
        try {
            $params = $request->all();
            $params['id'] = $id;
            $coupon = $this->mainModel->save($params, ['task' => 'edit-item']);

            if (($params['undo'] ?? 0) == 1) {
                return Redirect::to(route($this->routeName . 'index'))
                    ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.promotion.coupon.name'))]));
            }

            return Redirect::route($this->routeName . 'edit', $coupon->id)
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
            return Redirect::to(route($this->routeName . 'index'))
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

            return Redirect::to(route($this->routeName . 'index'))
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.promotion.coupon.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }
}
