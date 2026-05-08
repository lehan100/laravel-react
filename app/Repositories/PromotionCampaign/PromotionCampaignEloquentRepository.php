<?php

namespace App\Repositories\PromotionCampaign;

use App\Models\Catalog\Product;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionCampaign;
use App\Models\Promotion\PromotionCoupon;
use App\Models\Promotion\PromotionSaleOffer;
use App\Pipelines\HandleSlugHistory;
use App\Repositories\EloquentRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PromotionCampaignEloquentRepository extends EloquentRepository implements PromotionCampaignRepositoryInterface
{
    private array $FIELDSELECT = [
        'id',
        'starts_at',
        'ends_at',
        'priority',
        'is_active',
    ];

    public function getModel()
    {
        return PromotionCampaign::class;
    }

    public function lists($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (! in_array($task, ['admin-list-items', 'admin-list-items-active'], true)) {
            return null;
        }

        $currentLocale = app()->getLocale();
        $query = $this->_model->select($this->FIELDSELECT)
            ->with([
                'translations' => function ($builder) use ($currentLocale): void {
                    $builder->select(['id', 'promotion_campaign_id', 'locale', 'name', 'description'])
                        ->where('locale', $currentLocale);
                },
                'slugs' => function ($builder) use ($currentLocale): void {
                    $builder->select(['id', 'slug', 'locale', 'sluggable_id', 'sluggable_type', 'redirect_to', 'status', 'is_default'])
                        ->where('locale', $currentLocale);
                },
            ])
            ->orderBy('promotion_campaigns.priority')
            ->orderByDesc('promotion_campaigns.id');

        if (! empty($params['search'])) {
            $search = trim((string) $params['search']);
            $query->where(function ($q) use ($search): void {
                $q->whereHas('translations', function ($translationQuery) use ($search): void {
                    $translationQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%");
                })->orWhereHas('slugs', function ($slugQuery) use ($search): void {
                    $slugQuery->where('slug', 'like', "%{$search}%");
                });
            });
        }

        if ($task === 'admin-list-items-active') {
            $query->where('is_active', true);
        }

        $perPage = $params['pagination']['totalItemsPerPage'] ?? 20;

        return $query->paginate($perPage);
    }

    /**
     * @return Collection<int, array{id: int, name: string, ends_at: string|null}>
     */
    public function activeOptions(): Collection
    {
        $currentLocale = app()->getLocale();

        return $this->_model->query()
            ->select(['id', 'ends_at', 'priority', 'is_active'])
            ->where('is_active', true)
            ->with([
                'translations' => function ($builder) use ($currentLocale): void {
                    $builder->select(['id', 'promotion_campaign_id', 'locale', 'name'])
                        ->where('locale', $currentLocale);
                },
            ])
            ->orderBy('priority')
            ->orderByDesc('id')
            ->get()
            ->map(function (PromotionCampaign $campaign): array {
                $translations = $campaign->translations ?? collect();

                return [
                    'id' => (int) $campaign->id,
                    'name' => optional($translations->first())->name ?: ('#'.$campaign->id),
                    'ends_at' => optional($campaign->ends_at)->format('Y-m-d\\TH:i'),
                ];
            })
            ->values();
    }

    public function get($params = null, $options = null)
    {
        if (($options['task'] ?? null) !== 'get-item') {
            return null;
        }

        return $this->_model->with([
            'translations' => function ($builder): void {
                $builder->select(['id', 'promotion_campaign_id', 'locale', 'name', 'description']);
            },
            'slugs',
            'coupons' => function ($builder): void {
                $builder->select(['id', 'code', 'name', 'description', 'campaign_id', 'ends_at', 'is_active', 'is_public']);
            },
            'saleOffers' => function ($builder): void {
                $builder->select(['id', 'code', 'name', 'description', 'campaign_id', 'ends_at', 'priority', 'is_active', 'stackable']);
            },
            'buyToGiftOffers' => function ($builder): void {
                $builder->select(['id', 'code', 'name', 'description', 'campaign_id', 'ends_at', 'priority', 'is_active', 'stackable']);
            },
        ])->find($params['id'] ?? null);
    }

    public function save($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (! $task) {
            return false;
        }

        if ($task === 'change-status') {
            $item = $this->_model->find($params['id'] ?? null);
            if (! $item) {
                return false;
            }

            $item->is_active = ! $item->is_active;

            return $item->save();
        }

        DB::beginTransaction();
        try {
            $item = $task === 'add-item'
                ? new $this->_model
                : $this->_model->find($params['id'] ?? null);

            if (! $item) {
                DB::rollBack();

                return false;
            }

            $item->starts_at = $params['starts_at'] ?? $item->starts_at;
            $item->ends_at = $params['ends_at'] ?? $item->ends_at;
            $item->priority = $params['priority'] ?? $item->priority ?? 100;
            $item->is_active = $params['is_active'] ?? $item->is_active ?? true;
            $translationsData = is_array($params['translations'] ?? null) ? $params['translations'] : [];
            $item->save();

            foreach ($translationsData as $locale => $translationData) {
                $translation = $item->translateOrNew((string) $locale);
                $translation->fill(Arr::except($translationData, ['slug']));
                $translation->save();
            }

            app(Pipeline::class)
                ->send([
                    'item' => $item,
                    'translations' => $translationsData,
                ])
                ->through([
                    HandleSlugHistory::class,
                ])
                ->thenReturn();

            if (array_key_exists('product_ids', (array) $params)) {
                $item->products()->sync($params['product_ids'] ?? []);
            }

            $this->syncPromotionModules($item, $params);
            $this->syncPromotionModuleDates($item, $params);

            DB::commit();

            return $item;
        } catch (\Throwable $e) {
            DB::rollBack();
            logger('Error save promotion campaign: '.$e->getMessage());

            return false;
        }
    }

    public function delete($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (! $task) {
            return false;
        }

        if ($task === 'delete-item') {
            $item = $this->_model->find($params['id'] ?? null);

            return $item ? $item->delete() : false;
        }

        if ($task === 'delete-items') {
            $ids = is_array($params['ids'] ?? null)
                ? $params['ids']
                : explode(',', (string) ($params['ids'] ?? ''));

            return $this->_model->whereIn('id', $ids)->delete();
        }

        return false;
    }

    public function appliedProductsPaginator(int $promotionCampaignId, object $campaign, int $perPage = 20): LengthAwarePaginator
    {
        $currentLocale = app()->getLocale();
        $productsPaginator = Product::query()
            ->select(['products.id', 'products.sku', 'products.price', 'products.status'])
            ->join('promotion_campaign_products as pcp', 'pcp.product_id', '=', 'products.id')
            ->where('pcp.promotion_campaign_id', $promotionCampaignId)
            ->with(['translations' => function ($query) use ($currentLocale): void {
                $query->select(['id', 'product_id', 'locale', 'name'])
                    ->where('locale', $currentLocale);
            }])
            ->orderBy('products.id')
            ->paginate($perPage)
            ->withQueryString();

        $rows = collect($productsPaginator->items())->map(function (Product $product) use ($campaign): array {
            $translations = $product->translations ?? collect();
            $name = optional($translations->first())->name ?: ($product->sku ?: ('#'.$product->id));

            return [
                'id' => (int) $product->id,
                'sku' => $product->sku,
                'name' => $name,
                'price' => (float) ($product->price ?? 0),
                'status' => (int) ($product->status ?? 0),
                'ends_at' => optional($campaign->ends_at)->format('Y-m-d H:i:s'),
            ];
        })->values();

        $productsPaginator->setCollection($rows);

        return $productsPaginator;
    }

    public function findBySlug(string $slug): ?object
    {
        return $this->_model->with([
            'translations' => function ($builder): void {
                $builder->select(['id', 'promotion_campaign_id', 'locale', 'name', 'description']);
            },
            'slugs',
            'coupons' => function ($builder): void {
                $builder->select(['id', 'code', 'name', 'description', 'campaign_id', 'ends_at', 'is_active', 'is_public']);
            },
            'saleOffers' => function ($builder): void {
                $builder->select(['id', 'code', 'name', 'description', 'campaign_id', 'ends_at', 'priority', 'is_active', 'stackable']);
            },
            'buyToGiftOffers' => function ($builder): void {
                $builder->select(['id', 'code', 'name', 'description', 'campaign_id', 'ends_at', 'priority', 'is_active', 'stackable']);
            },
        ])->whereHas('slugs', function ($query) use ($slug): void {
            $query->where('slug', $slug)
                ->where('is_default', true)
                ->whereNull('redirect_to');
        })->first();
    }

    private function syncPromotionModules(PromotionCampaign $item, array $params): void
    {
        $this->syncModuleGroup(PromotionCoupon::query(), 'coupon_ids', $item->id, $params);
        $this->syncModuleGroup(PromotionSaleOffer::query(), 'saleoffer_ids', $item->id, $params);
        $this->syncModuleGroup(PromotionBuyToGiftOffer::query(), 'buytogift_ids', $item->id, $params);
    }

    private function syncModuleGroup($query, string $field, int $campaignId, array $params): void
    {
        if (! array_key_exists($field, $params)) {
            return;
        }

        $selectedIds = collect($params[$field] ?? [])
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->values()
            ->all();

        (clone $query)->where('campaign_id', $campaignId)
            ->whereNotIn('id', $selectedIds)
            ->update(['campaign_id' => null]);

        if (! empty($selectedIds)) {
            (clone $query)->whereIn('id', $selectedIds)->update(['campaign_id' => $campaignId]);
        }
    }

    private function syncPromotionModuleDates(PromotionCampaign $item, array $params): void
    {
        if (! filter_var($params['sync_module_ends_at'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            return;
        }

        $startsAt = $item->starts_at;
        $endsAt = $item->ends_at;
        $selectedCouponIds = collect($params['coupon_ids'] ?? [])->map(fn ($id) => (int) $id)->filter()->values()->all();
        $selectedSaleOfferIds = collect($params['saleoffer_ids'] ?? [])->map(fn ($id) => (int) $id)->filter()->values()->all();
        $selectedBuyToGiftIds = collect($params['buytogift_ids'] ?? [])->map(fn ($id) => (int) $id)->filter()->values()->all();

        if (! empty($selectedCouponIds)) {
            PromotionCoupon::query()
                ->whereIn('id', $selectedCouponIds)
                ->update([
                    'starts_at' => $startsAt,
                    'ends_at' => $endsAt,
                ]);
        }

        if (! empty($selectedSaleOfferIds)) {
            PromotionSaleOffer::query()
                ->whereIn('id', $selectedSaleOfferIds)
                ->update([
                    'starts_at' => $startsAt,
                    'ends_at' => $endsAt,
                ]);
        }

        if (! empty($selectedBuyToGiftIds)) {
            PromotionBuyToGiftOffer::query()
                ->whereIn('id', $selectedBuyToGiftIds)
                ->update([
                    'starts_at' => $startsAt,
                    'ends_at' => $endsAt,
                ]);
        }
    }
}
