<?php

namespace App\Http\Controllers\Admin\Promotion;

use App\Http\Controllers\MainController;
use App\Http\Requests\Promotion\PromotionCampaignRequest;
use App\Http\Resources\Promotion\PromotionCampaignResource;
use App\Repositories\BuyToGift\BuyToGiftRepositoryInterface;
use App\Repositories\Coupon\CouponRepositoryInterface;
use App\Repositories\PromotionCampaign\PromotionCampaignRepositoryInterface as RepositoryInterface;
use App\Repositories\SaleOffer\SaleOfferRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request as RequestFacade;
use Inertia\Inertia;
use Inertia\Response;

class PromotionCampaignController extends MainController
{
    protected string $controllerView = 'Admin/Promotion/PromotionCampaign/';

    protected string $routeName = 'promotion-campaign.';

    protected RepositoryInterface $mainModel;

    protected CouponRepositoryInterface $couponModel;

    protected SaleOfferRepositoryInterface $saleOfferModel;

    protected BuyToGiftRepositoryInterface $buyToGiftModel;

    public function __construct(
        RepositoryInterface $repository,
        CouponRepositoryInterface $couponModel,
        SaleOfferRepositoryInterface $saleOfferModel,
        BuyToGiftRepositoryInterface $buyToGiftModel
    ) {
        parent::__construct();
        $this->mainModel = $repository;
        $this->couponModel = $couponModel;
        $this->saleOfferModel = $saleOfferModel;
        $this->buyToGiftModel = $buyToGiftModel;
    }

    public function index(): Response
    {
        $this->params = array_merge(RequestFacade::all(), $this->params);
        $items = $this->mainModel->lists($this->params, ['task' => 'admin-list-items']);

        return Inertia::render($this->controllerView.'Index', [
            'items' => PromotionCampaignResource::collection($items),
        ]);
    }

    public function create(): Response
    {
        $itemsCouponActive = $this->couponModel->activeOptions();
        $itemsSaleOfferActive = $this->saleOfferModel->activeOptions();
        $itemsBuyToGiftActive = $this->buyToGiftModel->activeOptions();

        return Inertia::render($this->controllerView.'Created', [
            'item' => null,
            'itemsCouponActive' => $itemsCouponActive,
            'itemsSaleOfferActive' => $itemsSaleOfferActive,
            'itemsBuyToGiftActive' => $itemsBuyToGiftActive,
        ]);
    }

    public function store(PromotionCampaignRequest $request): RedirectResponse
    {
        try {
            $params = $request->all();
            $campaign = $this->mainModel->save($params, ['task' => 'add-item']);

            if (($params['undo'] ?? 0) == 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.promotion.campaign.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $campaign->id)
                ->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.promotion.campaign.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.created', ['name' => mb_strtolower(__('hancms.promotion.campaign.name'))]));
        }
    }

    public function show(string $id): Response|RedirectResponse
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);
        if (! $item) {
            return Redirect::to(route($this->routeName.'index'))
                ->with('error', __('hancms.message.error.deleted'));
        }

        return Inertia::render($this->controllerView.'Show', [
            'item' => new PromotionCampaignResource($item),
            'itemsProductsApplied' => $this->mainModel->appliedProductsPaginator((int) $id, $item),
        ]);
    }

    public function edit(string $id): Response
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);
        $itemsCouponActive = $this->couponModel->activeOptions();
        $itemsSaleOfferActive = $this->saleOfferModel->activeOptions();
        $itemsBuyToGiftActive = $this->buyToGiftModel->activeOptions();
        $coupon = $item?->coupons?->first();
        if ($coupon && ! $itemsCouponActive->firstWhere('id', (int) $coupon->id)) {
            $itemsCouponActive->prepend([
                'id' => (int) $coupon->id,
                'name' => $coupon->name ?? $coupon->code ?? ('#'.$coupon->id),
                'ends_at' => optional($coupon->ends_at)->format('Y-m-d\\TH:i'),
            ]);
        }
        $saleOffer = $item?->saleOffers?->first();
        if ($saleOffer && ! $itemsSaleOfferActive->firstWhere('id', (int) $saleOffer->id)) {
            $itemsSaleOfferActive->prepend([
                'id' => (int) $saleOffer->id,
                'name' => $saleOffer->name ?? $saleOffer->code ?? ('#'.$saleOffer->id),
                'ends_at' => optional($saleOffer->ends_at)->format('Y-m-d\\TH:i'),
            ]);
        }
        $buyToGift = $item?->buyToGiftOffers?->first();
        if ($buyToGift && ! $itemsBuyToGiftActive->firstWhere('id', (int) $buyToGift->id)) {
            $itemsBuyToGiftActive->prepend([
                'id' => (int) $buyToGift->id,
                'name' => $buyToGift->name ?? $buyToGift->code ?? ('#'.$buyToGift->id),
                'ends_at' => optional($buyToGift->ends_at)->format('Y-m-d\\TH:i'),
            ]);
        }

        return Inertia::render($this->controllerView.'Edit', [
            'item' => new PromotionCampaignResource($item),
            'itemsCouponActive' => $itemsCouponActive,
            'itemsSaleOfferActive' => $itemsSaleOfferActive,
            'itemsBuyToGiftActive' => $itemsBuyToGiftActive,
        ]);
    }

    public function update(PromotionCampaignRequest $request, string $id): RedirectResponse
    {
        try {
            $params = $request->all();
            $params['id'] = $id;
            $campaign = $this->mainModel->save($params, ['task' => 'edit-item']);

            if (($params['undo'] ?? 0) == 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.promotion.campaign.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $campaign->id)
                ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.promotion.campaign.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.promotion.campaign.name'))]));
        }
    }

    public function toggleStatus(string $id): RedirectResponse
    {
        try {
            $item = $this->mainModel->save(['id' => $id], ['task' => 'change-status']);

            if (! $item) {
                return Redirect::back()
                    ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.promotion.campaign.name'))]));
            }

            return Redirect::back()
                ->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.promotion.campaign.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()
                ->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.promotion.campaign.name'))]));
        }
    }

    public function destroy(string $id): RedirectResponse
    {
        try {
            $this->mainModel->delete(['id' => $id], ['task' => 'delete-item']);

            return Redirect::to(route($this->routeName.'index'))
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.promotion.campaign.name'))]));
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
                ->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.promotion.campaign.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }

    public function publicShow(string $slug): Response|RedirectResponse
    {
        $item = $this->mainModel->findBySlug($slug);

        if (! $item) {
            return Redirect::to(route($this->routeName.'index'))
                ->with('error', __('hancms.message.error.deleted'));
        }

        $item->load(['products', 'coupons', 'saleOffers', 'buyToGiftOffers']);

        return Inertia::render('Promotion/Campaign/Show', [
            'item' => (new PromotionCampaignResource($item))->resolve(),
            'itemsProductsApplied' => $this->mainModel->appliedProductsPaginator((int) $item->id, $item),
        ]);
    }
}
