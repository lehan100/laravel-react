<?php

namespace App\Http\Controllers\Admin\Promotion;

use App\Http\Controllers\MainController;
use App\Http\Requests\Catalog\CategoryProductPickerRequest;
use App\Http\Requests\Promotion\BuyToGiftRequest;
use App\Http\Resources\Promotion\BuyToGiftCollection;
use App\Http\Resources\Promotion\BuyToGiftResource;
use App\Repositories\BuyToGift\BuyToGiftRepositoryInterface as RepositoryInterface;
use App\Repositories\Category\CategoryRepositoryInterface;
use App\Repositories\PromotionCampaign\PromotionCampaignRepositoryInterface as CampaignRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request as RequestFacade;
use Inertia\Inertia;
use Inertia\Response;

class BuyToGiftController extends MainController
{
    protected string $controllerView = 'Admin/Promotion/BuyToGift/';

    protected string $routeName = 'buytogift.';

    protected RepositoryInterface $mainModel;

    protected CategoryRepositoryInterface $categoryModel;

    protected CampaignRepositoryInterface $campaignModel;

    public function __construct(
        RepositoryInterface $repository,
        CategoryRepositoryInterface $categoryModel,
        CampaignRepositoryInterface $campaignModel
    ) {
        parent::__construct();
        $this->mainModel = $repository;
        $this->categoryModel = $categoryModel;
        $this->campaignModel = $campaignModel;
    }

    public function index(): Response
    {
        $this->params = array_merge(RequestFacade::all(), $this->params);
        $items = $this->mainModel->lists($this->params, ['task' => 'admin-list-items']);

        return Inertia::render($this->controllerView.'Index', [
            'items' => new BuyToGiftCollection($items),
        ]);
    }

    public function create(): Response
    {
        $itemsCategoryActive = $this->categoryModel->lists(null, [
            'task' => 'admin-list-items-active',
            'type' => 'product',
        ]);
        $itemsProductActive = $this->categoryModel->getActiveProductRows();
        $itemsCampaignActive = $this->campaignModel->activeOptions();

        return Inertia::render($this->controllerView.'Created', [
            'item' => null,
            'itemsCategoryActive' => $itemsCategoryActive,
            'itemsProductActive' => $itemsProductActive,
            'itemsCampaignActive' => $itemsCampaignActive,
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
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.promotion.buytogift.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $offer->id)
                ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.promotion.buytogift.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.created', ['name' => mb_strtolower(__('hancms.promotion.buytogift.name'))]));
        }
    }

    public function show(string $id): Response|RedirectResponse
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);
        if (! $item) {
            return Redirect::to(route($this->routeName.'index'))
                ->with('error', __('hancms.message.error.deleted'));
        }

        $selectedProductIds = $this->collectAllRuleProductIds($item);

        return Inertia::render($this->controllerView.'Show', [
            'item' => new BuyToGiftResource($item),
            'itemsSelectedBuyProducts' => $this->categoryModel->getSelectedProductRows($selectedProductIds),
            'itemsSelectedGiftProducts' => $this->categoryModel->getSelectedProductRows($selectedProductIds),
        ]);
    }

    public function edit(string $id): Response
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);
        $itemsCategoryActive = $this->categoryModel->lists(null, [
            'task' => 'admin-list-items-active',
            'type' => 'product',
        ]);
        $itemsProductActive = $this->categoryModel->getActiveProductRows();
        $itemsCampaignActive = $this->campaignModel->activeOptions();
        if ($item?->campaign && ! $itemsCampaignActive->firstWhere('id', (int) $item->campaign->id)) {
            $itemsCampaignActive->prepend([
                'id' => (int) $item->campaign->id,
                'name' => $item->campaign->name ?? optional($item->campaign->translations->first())->name ?? ('#'.$item->campaign->id),
                'starts_at' => optional($item->campaign->starts_at)->format('Y-m-d\\TH:i'),
                'ends_at' => optional($item->campaign->ends_at)->format('Y-m-d\\TH:i'),
            ]);
        }
        $selectedProductIds = $this->collectAllRuleProductIds($item);

        return Inertia::render($this->controllerView.'Edit', [
            'item' => new BuyToGiftResource($item),
            'itemsCategoryActive' => $itemsCategoryActive,
            'itemsProductActive' => $itemsProductActive,
            'itemsCampaignActive' => $itemsCampaignActive,
            'itemsSelectedBuyProducts' => $this->categoryModel->getSelectedProductRows($selectedProductIds),
            'itemsSelectedGiftProducts' => $this->categoryModel->getSelectedProductRows($selectedProductIds),
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

    public function update(BuyToGiftRequest $request, string $id): RedirectResponse
    {
        try {
            $params = $request->all();
            $params['id'] = $id;
            $offer = $this->mainModel->save($params, ['task' => 'edit-item']);

            if (($params['undo'] ?? 0) == 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.promotion.buytogift.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $offer->id)
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

            return Redirect::to(route($this->routeName.'index'))
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

            return Redirect::to(route($this->routeName.'index'))
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.promotion.buytogift.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }

    private function getPrimaryRule($item)
    {
        if (! $item) {
            return null;
        }

        if ($item->relationLoaded('rules')) {
            return $item->rules
                ->sortBy(fn ($rule) => sprintf('%010d-%010d', (int) ($rule->priority ?? 100), (int) $rule->id))
                ->first();
        }

        return $item->rules()->orderBy('priority')->orderBy('id')->first();
    }

    private function collectAllRuleProductIds($item): array
    {
        if (! $item) {
            return [];
        }

        $rules = $item->relationLoaded('rules')
            ? $item->rules
            : $item->rules()->with(['buyProducts:id', 'giftProducts:id'])->get();

        return $rules->flatMap(function ($rule) {
            $buyIds = $rule->buyProducts?->pluck('id')->all() ?? [];
            $giftIds = $rule->giftProducts?->pluck('id')->all() ?? [];

            return array_merge($buyIds, $giftIds);
        })->map(fn ($id) => (int) $id)->unique()->values()->all();
    }
}
