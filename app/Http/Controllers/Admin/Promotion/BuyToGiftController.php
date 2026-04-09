<?php

namespace App\Http\Controllers\Admin\Promotion;

use App\Http\Controllers\MainController;
use App\Http\Requests\Promotion\BuyToGiftRequest;
use App\Http\Resources\Promotion\BuyToGiftCollection;
use App\Http\Resources\Promotion\BuyToGiftResource;
use App\Models\Catalog\Product;
use Illuminate\Database\Eloquent\Builder;
use App\Repositories\Category\CategoryRepositoryInterface as CategoryRepositoryInterface;
use App\Repositories\BuyToGift\BuyToGiftRepositoryInterface as RepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request as RequestFacade;
use Inertia\Inertia;
use Inertia\Response;

class BuyToGiftController extends MainController
{
    protected $controllerView = 'Admin/Promotion/BuyToGift/';
    protected $routeName = 'buytogift.';
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
            'items' => new BuyToGiftCollection($items),
        ]);
    }

    public function create(): Response
    {
        $itemsCategoryActive = $this->categoryModel->lists(null, [
            'task' => 'admin-list-items-active',
            'type' => 'product',
        ]);
        $currentLocale = app()->getLocale();
        $itemsProductActive = Product::query()
            ->select(['id', 'sku'])
            ->where('status', 1)
            ->with(['translations' => function ($query) use ($currentLocale) {
                $query->select(['id', 'product_id', 'locale', 'name'])
                    ->where('locale', $currentLocale);
            }])
            ->orderBy('id')
            ->get();

        return Inertia::render($this->controllerView . 'Created', [
            'item' => null,
            'itemsCategoryActive' => $itemsCategoryActive,
            'itemsProductActive' => $itemsProductActive,
            'itemsSelectedBuyProducts' => [],
            'itemsSelectedGiftProducts' => [],
        ]);
    }

    public function store(BuyToGiftRequest $request): RedirectResponse
    {
        try {
            $params = $request->all();
            $offer = $this->mainModel->save($params, ['task' => 'add-item']);

            if (($params['undo'] ?? 0) == 1) {
                return Redirect::to(route($this->routeName . 'index'))
                    ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.promotion.buytogift.name'))]));
            }

            return Redirect::route($this->routeName . 'edit', $offer->id)
                ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.promotion.buytogift.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.created', ['name' => mb_strtolower(__('hancms.promotion.buytogift.name'))]));
        }
    }

    public function show(string $id): Response|RedirectResponse
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);
        if (!$item) {
            return Redirect::to(route($this->routeName . 'index'))
                ->with('error', __('hancms.message.error.deleted'));
        }

        $selectedProductIds = $this->collectAllRuleProductIds($item);

        return Inertia::render($this->controllerView . 'Show', [
            'item' => new BuyToGiftResource($item),
            'itemsSelectedBuyProducts' => $this->fetchProductRowsByIds($selectedProductIds),
            'itemsSelectedGiftProducts' => $this->fetchProductRowsByIds($selectedProductIds),
        ]);
    }

    public function edit(string $id): Response
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);
        $itemsCategoryActive = $this->categoryModel->lists(null, [
            'task' => 'admin-list-items-active',
            'type' => 'product',
        ]);
        $currentLocale = app()->getLocale();
        $itemsProductActive = Product::query()
            ->select(['id', 'sku'])
            ->where('status', 1)
            ->with(['translations' => function ($query) use ($currentLocale) {
                $query->select(['id', 'product_id', 'locale', 'name'])
                    ->where('locale', $currentLocale);
            }])
            ->orderBy('id')
            ->get();
        $selectedProductIds = $this->collectAllRuleProductIds($item);

        return Inertia::render($this->controllerView . 'Edit', [
            'item' => new BuyToGiftResource($item),
            'itemsCategoryActive' => $itemsCategoryActive,
            'itemsProductActive' => $itemsProductActive,
            'itemsSelectedBuyProducts' => $this->fetchProductRowsByIds($selectedProductIds),
            'itemsSelectedGiftProducts' => $this->fetchProductRowsByIds($selectedProductIds),
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

    public function update(BuyToGiftRequest $request, string $id): RedirectResponse
    {
        try {
            $params = $request->all();
            $params['id'] = $id;
            $offer = $this->mainModel->save($params, ['task' => 'edit-item']);

            if (($params['undo'] ?? 0) == 1) {
                return Redirect::to(route($this->routeName . 'index'))
                    ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.promotion.buytogift.name'))]));
            }

            return Redirect::route($this->routeName . 'edit', $offer->id)
                ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.promotion.buytogift.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.promotion.buytogift.name'))]));
        }
    }

    public function destroy(string $id): RedirectResponse
    {
        try {
            $this->mainModel->delete(['id' => $id], ['task' => 'delete-item']);
            return Redirect::to(route($this->routeName . 'index'))
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.promotion.buytogift.name'))]));
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
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.promotion.buytogift.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }

    private function getPrimaryRule($item)
    {
        if (!$item) {
            return null;
        }

        if ($item->relationLoaded('rules')) {
            return $item->rules
                ->sortBy(fn($rule) => sprintf('%010d-%010d', (int) ($rule->priority ?? 100), (int) $rule->id))
                ->first();
        }

        return $item->rules()->orderBy('priority')->orderBy('id')->first();
    }

    private function collectAllRuleProductIds($item): array
    {
        if (!$item) {
            return [];
        }

        $rules = $item->relationLoaded('rules')
            ? $item->rules
            : $item->rules()->with(['buyProducts:id', 'giftProducts:id'])->get();

        return $rules->flatMap(function ($rule) {
            $buyIds = $rule->buyProducts?->pluck('id')->all() ?? [];
            $giftIds = $rule->giftProducts?->pluck('id')->all() ?? [];
            return array_merge($buyIds, $giftIds);
        })->map(fn($id) => (int) $id)->unique()->values()->all();
    }
}
