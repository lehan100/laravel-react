<?php

namespace App\Repositories\BuyToGift;

use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionBuyToGiftOfferRule;
use App\Models\Promotion\PromotionBuyToGiftRuleStockAllocation;
use App\Models\Promotion\PromotionCampaign;
use App\Repositories\EloquentRepository;
use App\Services\Promotion\BuyToGiftStockAllocator;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class BuyToGiftEloquentRepository extends EloquentRepository implements BuyToGiftRepositoryInterface
{
    private array $FIELDSELECT = [
        'id',
        'code',
        'name',
        'description',
        'campaign_id',
        'starts_at',
        'ends_at',
        'priority',
        'is_active',
        'stackable',
    ];

    public function getModel()
    {
        return PromotionBuyToGiftOffer::class;
    }

    public function lists($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (! in_array($task, ['admin-list-items', 'admin-list-items-active'], true)) {
            return null;
        }

        $query = $this->_model->select($this->FIELDSELECT)
            ->with([
                'rules' => function ($q) {
                    $q->select([
                        'id',
                        'promotion_buytogift_offer_id',
                        'condition_type',
                        'min_order_amount',
                        'max_sets_per_order',
                        'max_gift_qty',
                        'priority',
                        'is_active',
                        'stackable',
                        'stock_scope',
                        'stock_limit',
                    ])
                        ->orderBy('priority')
                        ->orderBy('id');
                },
                'rules.buyProducts:id,sku,quantity,sold_quantity,is_stock,status,price',
                'rules.buyProducts.variants:id,product_id,sku,price,stock',
                'rules.giftProducts:id,sku,quantity,sold_quantity,is_stock,status,price',
                'rules.giftProducts.variants:id,product_id,sku,price,stock',
                'rules.giftVariantOptions:id,promotion_buytogift_offer_rule_id,product_id,variant_id,reserve_qty',
                'rules.giftVariantOptions.product:id,sku,quantity,sold_quantity,is_stock,status,price',
                'rules.giftVariantOptions.product.variants:id,product_id,sku,price,stock',
                'rules.giftVariantOptions.variant:id,product_id,sku,price,stock',
                'rules.stockAllocations:id,promotion_buytogift_offer_rule_id,product_id,variant_id,allocated_quantity',
            ])
            ->orderBy('priority')
            ->orderByDesc('id');

        if (! empty($params['search'])) {
            $search = trim((string) $params['search']);
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        if ($task === 'admin-list-items-active') {
            $query->where('is_active', true);
        }

        $perPage = $params['pagination']['totalItemsPerPage'] ?? 20;

        return $query->paginate($perPage);
    }

    public function get($params = null, $options = null)
    {
        if (($options['task'] ?? null) !== 'get-item') {
            return null;
        }

        return $this->_model->with([
            'rules' => function ($q) {
                $q->orderBy('priority')->orderBy('id');
            },
            'rules.buyProducts:id,sku,quantity,sold_quantity,is_stock,status,price',
            'rules.buyProducts.variants:id,product_id,sku,price,stock',
            'rules.giftProducts:id,sku,quantity,sold_quantity,is_stock,status,price',
            'rules.giftProducts.variants:id,product_id,sku,price,stock',
            'rules.giftVariantOptions:id,promotion_buytogift_offer_rule_id,product_id,variant_id,reserve_qty',
            'rules.giftVariantOptions.product:id,sku,quantity,sold_quantity,is_stock,status,price',
            'rules.giftVariantOptions.product.variants:id,product_id,sku,price,stock',
            'rules.giftVariantOptions.variant:id,product_id,sku,price,stock',
            'rules.stockAllocations:id,promotion_buytogift_offer_rule_id,product_id,variant_id,allocated_quantity',
            'campaign' => function ($query): void {
                $query->select(['id', 'ends_at'])
                    ->with([
                        'translations' => function ($translationQuery): void {
                            $translationQuery->select(['id', 'promotion_campaign_id', 'locale', 'name'])
                                ->where('locale', app()->getLocale());
                        },
                    ]);
            },
        ])->find($params['id'] ?? null);
    }

    /**
     * @return Collection<int, array{id: int, name: string, ends_at: string|null}>
     */
    public function activeOptions(): Collection
    {
        return $this->_model->query()
            ->select(['id', 'code', 'name', 'ends_at', 'is_active'])
            ->where('is_active', true)
            ->orderByDesc('id')
            ->get()
            ->map(fn (PromotionBuyToGiftOffer $offer): array => [
                'id' => (int) $offer->id,
                'name' => $offer->name ?: $offer->code ?: ('#'.$offer->id),
                'ends_at' => optional($offer->ends_at)->format('Y-m-d\\TH:i'),
            ])
            ->values();
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

        return DB::transaction(function () use ($task, $params) {
            $item = $task === 'add-item'
                ? new $this->_model
                : $this->_model->find($params['id'] ?? null);

            if (! $item) {
                return false;
            }

            $item->code = $params['code'] ?? $item->code;
            $item->name = $params['name'] ?? $item->name;
            $item->description = $params['description'] ?? $item->description;
            $campaignId = $params['campaign_id'] ?? $item->campaign_id;
            $item->campaign_id = $campaignId !== '' ? $campaignId : null;
            $item->starts_at = $params['starts_at'] ?? $item->starts_at;
            if (! empty($item->campaign_id)) {
                $campaign = PromotionCampaign::query()->select(['id', 'starts_at', 'ends_at'])->find($item->campaign_id);
                $item->starts_at = $campaign?->starts_at ?? $item->starts_at;
                $item->ends_at = $campaign?->ends_at ?? ($params['ends_at'] ?? $item->ends_at);
            } else {
                $endsAt = $params['ends_at'] ?? $item->ends_at;
                $item->ends_at = $endsAt !== '' ? $endsAt : null;
            }
            $item->priority = $params['priority'] ?? $item->priority ?? 100;
            $item->is_active = $params['is_active'] ?? $item->is_active ?? true;
            $item->stackable = $params['stackable'] ?? $item->stackable ?? false;

            $previousFingerprint = null;
            if ($task === 'edit-item') {
                $item->load([
                    'rules.buyProducts',
                    'rules.giftProducts',
                    'rules.giftVariantOptions',
                    'rules.stockAllocations',
                ]);
                $previousFingerprint = $this->buildOfferFingerprint($item);
            }

            $item->save();

            if (is_array($params['rules'] ?? null) && count($params['rules']) > 0) {
                $this->syncMultiRules($item, $params['rules'], $params);
            } else {
                $this->syncLegacySingleRule($item, $params, $task);
            }

            $item->load([
                'rules.buyProducts',
                'rules.giftProducts',
                'rules.giftVariantOptions',
                'rules.stockAllocations',
            ]);
            $nextFingerprint = $this->buildOfferFingerprint($item);

            if ($previousFingerprint === null || $previousFingerprint !== $nextFingerprint) {
                app(BuyToGiftStockAllocator::class)->syncOffer($item);
            }

            return $item;
        });
    }

    public function delete($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (! $task) {
            return false;
        }

        return DB::transaction(function () use ($task, $params) {
            if ($task === 'delete-item') {
                $item = $this->_model->find($params['id'] ?? null);

                if ($item) {
                    app(BuyToGiftStockAllocator::class)->releaseOffer($item);
                }

                return $item ? $item->delete() : false;
            }

            if ($task === 'delete-items') {
                $ids = is_array($params['ids'] ?? null)
                    ? $params['ids']
                    : explode(',', (string) ($params['ids'] ?? ''));

                $items = $this->_model->query()
                    ->with(['rules.giftProducts', 'rules.stockAllocations'])
                    ->whereIn('id', $ids)
                    ->get();

                $allocator = app(BuyToGiftStockAllocator::class);
                foreach ($items as $item) {
                    $allocator->releaseOffer($item);
                }

                return $this->_model->whereIn('id', $ids)->delete();
            }

            return false;
        });
    }

    private function syncLegacySingleRule(PromotionBuyToGiftOffer $item, array $params, string $task): void
    {
        $rule = null;
        if ($task === 'add-item') {
            $rule = new PromotionBuyToGiftOfferRule;
            $rule->promotion_buytogift_offer_id = $item->id;
        } else {
            $rule = $item->rules()->orderBy('priority')->orderBy('id')->first();
            if (! $rule) {
                $rule = new PromotionBuyToGiftOfferRule;
                $rule->promotion_buytogift_offer_id = $item->id;
            }
        }

        $rule->condition_type = $params['condition_type'] ?? $rule->condition_type ?? 'order_amount';
        $rule->min_order_amount = $params['min_order_amount'] ?? $rule->min_order_amount;
        $rule->max_sets_per_order = $params['max_sets_per_order'] ?? $rule->max_sets_per_order;
        $rule->max_gift_qty = $params['max_gift_qty'] ?? $rule->max_gift_qty;
        $rule->priority = $params['priority'] ?? $rule->priority ?? 100;
        $rule->is_active = $params['is_active'] ?? $rule->is_active ?? true;
        $rule->stackable = $params['stackable'] ?? $rule->stackable ?? false;
        $rule->stock_scope = $params['stock_scope'] ?? $rule->stock_scope ?? 'all';
        $rule->stock_limit = ($rule->stock_scope ?? 'all') === 'limited'
            ? ($params['stock_limit'] ?? $rule->stock_limit)
            : null;
        $rule->save();

        $this->syncRuleProducts(
            $rule->buyProducts(),
            $this->normalizeRuleItems($params, 'buy'),
            'buy_qty',
            [],
            max(1, (int) ($params['buy_qty'] ?? 1))
        );

        $this->syncRuleProducts(
            $rule->giftProducts(),
            $this->normalizeRuleItems($params, 'gift'),
            'gift_qty',
            ['is_auto_add' => true],
            max(1, (int) ($params['gift_qty'] ?? 1))
        );

        $this->syncGiftVariantOptions(
            $rule,
            $this->normalizeGiftVariantOptions($params)
        );
    }

    private function syncMultiRules(PromotionBuyToGiftOffer $item, array $rulesInput, array $params): void
    {
        $existingRules = $item->rules()->get()->keyBy('id');
        $keepIds = [];

        foreach ($rulesInput as $index => $row) {
            if (! is_array($row)) {
                continue;
            }

            $ruleId = isset($row['id']) ? (int) $row['id'] : null;
            $rule = $ruleId && $existingRules->has($ruleId)
                ? $existingRules->get($ruleId)
                : new PromotionBuyToGiftOfferRule(['promotion_buytogift_offer_id' => $item->id]);

            $rule->condition_type = $row['condition_type'] ?? 'order_amount';
            $rule->min_order_amount = $row['min_order_amount'] ?? null;
            $rule->max_sets_per_order = $row['max_sets_per_order'] ?? null;
            $rule->max_gift_qty = $row['max_gift_qty'] ?? null;
            $rule->priority = isset($row['priority']) ? (int) $row['priority'] : ((int) ($params['priority'] ?? 100) + (int) $index);
            $rule->is_active = array_key_exists('is_active', $row)
                ? filter_var($row['is_active'], FILTER_VALIDATE_BOOLEAN)
                : true;
            $rule->stackable = array_key_exists('stackable', $row)
                ? filter_var($row['stackable'], FILTER_VALIDATE_BOOLEAN)
                : false;
            $rule->stock_scope = $row['stock_scope'] ?? 'all';
            $rule->stock_limit = ($rule->stock_scope ?? 'all') === 'limited'
                ? ($row['stock_limit'] ?? null)
                : null;
            $rule->promotion_buytogift_offer_id = $item->id;
            $rule->save();

            $keepIds[] = (int) $rule->id;

            $this->syncRuleProducts(
                $rule->buyProducts(),
                $this->normalizeRuleItems($row, 'buy'),
                'buy_qty',
                [],
                max(1, (int) ($row['buy_qty'] ?? 1))
            );

            $this->syncRuleProducts(
                $rule->giftProducts(),
                $this->normalizeRuleItems($row, 'gift'),
                'gift_qty',
                ['is_auto_add' => true],
                max(1, (int) ($row['gift_qty'] ?? 1))
            );

            $this->syncGiftVariantOptions(
                $rule,
                $this->normalizeGiftVariantOptions($row)
            );
        }

        if (! empty($keepIds)) {
            $removedRules = $item->rules()->whereNotIn('id', $keepIds)->get();
            $allocator = app(BuyToGiftStockAllocator::class);
            foreach ($removedRules as $removedRule) {
                $allocator->releaseRule($removedRule);
            }
            $item->rules()->whereNotIn('id', $keepIds)->delete();
        } else {
            $allocator = app(BuyToGiftStockAllocator::class);
            $item->rules()->get()->each(fn (PromotionBuyToGiftOfferRule $rule) => $allocator->releaseRule($rule));
            $item->rules()->delete();
        }
    }

    /**
     * @return array<int, array{product_id: int, variant_id: int|null}>
     */
    private function normalizeRuleItems(array $source, string $prefix): array
    {
        $itemsKey = $prefix.'_items';
        if (is_array($source[$itemsKey] ?? null) && $source[$itemsKey] !== []) {
            return collect($source[$itemsKey])
                ->map(function ($row): array {
                    return [
                        'product_id' => (int) ($row['product_id'] ?? 0),
                        'variant_id' => $this->normalizeNullableInteger($row['variant_id'] ?? null),
                    ];
                })
                ->filter(fn (array $row): bool => $row['product_id'] > 0)
                ->values()
                ->all();
        }

        $idsKey = $prefix.'_product_ids';

        return collect($source[$idsKey] ?? [])
            ->map(fn ($id): array => [
                'product_id' => (int) $id,
                'variant_id' => null,
            ])
            ->filter(fn (array $row): bool => $row['product_id'] > 0)
            ->values()
            ->all();
    }

    /**
     * @param  BelongsToMany  $relation
     * @param  array<int, array{product_id: int, variant_id: int|null}>  $items
     * @param  array<string, mixed>  $extraPivot
     */
    private function syncRuleProducts($relation, array $items, string $qtyKey, array $extraPivot, int $defaultQty): void
    {
        $sync = [];

        foreach ($items as $item) {
            $productId = (int) ($item['product_id'] ?? 0);
            if ($productId <= 0) {
                continue;
            }

            $pivot = array_merge($extraPivot, [
                'variant_id' => $item['variant_id'] !== null ? (int) $item['variant_id'] : null,
                $qtyKey => $defaultQty,
            ]);

            $sync[$productId] = $pivot;
        }

        $relation->sync($sync);
    }

    /**
     * @return array<int, array{product_id: int, variant_id: int, reserve_qty: int}>
     */
    private function normalizeGiftVariantOptions(array $source): array
    {
        $items = $source['gift_variant_options'] ?? null;
        if (! is_array($items) || $items === []) {
            return [];
        }

        return collect($items)
            ->map(function ($row): array {
                return [
                    'product_id' => (int) ($row['product_id'] ?? 0),
                    'variant_id' => (int) ($row['variant_id'] ?? 0),
                    'reserve_qty' => max(0, (int) ($row['reserve_qty'] ?? 0)),
                ];
            })
            ->filter(fn (array $row): bool => $row['product_id'] > 0 && $row['variant_id'] > 0)
            ->values()
            ->all();
    }

    /**
     * @param  array<int, array{product_id: int, variant_id: int, reserve_qty: int}>  $items
     */
    private function syncGiftVariantOptions(PromotionBuyToGiftOfferRule $rule, array $items): void
    {
        $sync = [];

        foreach ($items as $item) {
            $key = (int) $item['product_id'].':'.(int) $item['variant_id'];
            $sync[$key] = [
                'promotion_buytogift_offer_rule_id' => $rule->id,
                'product_id' => (int) $item['product_id'],
                'variant_id' => (int) $item['variant_id'],
                'reserve_qty' => (int) $item['reserve_qty'],
            ];
        }

        $existing = $rule->giftVariantOptions()->get()->keyBy(fn ($option): string => (int) $option->product_id.':'.(int) $option->variant_id);

        $keepKeys = array_keys($sync);
        $existing->each(function ($option, string $key) use ($keepKeys): void {
            if (! in_array($key, $keepKeys, true)) {
                $option->delete();
            }
        });

        foreach ($sync as $key => $payload) {
            $option = $existing->get($key);
            if ($option) {
                $option->fill($payload);
                $option->save();

                continue;
            }

            $rule->giftVariantOptions()->create($payload);
        }
    }

    private function buildOfferFingerprint(PromotionBuyToGiftOffer $offer): string
    {
        $offer->loadMissing([
            'rules.buyProducts',
            'rules.giftProducts',
            'rules.giftVariantOptions',
            'rules.stockAllocations',
        ]);

        $normalizedRules = $offer->rules
            ->map(function (PromotionBuyToGiftOfferRule $rule): array {
                $buyProducts = $rule->buyProducts
                    ->sortBy('id')
                    ->values()
                    ->map(fn ($product): array => [
                        'product_id' => (int) $product->id,
                        'variant_id' => $product->pivot?->variant_id !== null ? (int) $product->pivot?->variant_id : null,
                        'buy_qty' => (int) ($product->pivot?->buy_qty ?? 1),
                    ])
                    ->all();

                $giftProducts = $rule->giftProducts
                    ->sortBy('id')
                    ->values()
                    ->map(fn ($product): array => [
                        'product_id' => (int) $product->id,
                        'variant_id' => $product->pivot?->variant_id !== null ? (int) $product->pivot?->variant_id : null,
                        'gift_qty' => (int) ($product->pivot?->gift_qty ?? 1),
                        'is_auto_add' => (bool) ($product->pivot?->is_auto_add ?? false),
                    ])
                    ->all();

                $giftVariantOptions = $rule->giftVariantOptions
                    ->sortBy('id')
                    ->values()
                    ->map(fn ($option): array => [
                        'product_id' => (int) $option->product_id,
                        'variant_id' => (int) $option->variant_id,
                        'reserve_qty' => (int) ($option->reserve_qty ?? 0),
                    ])
                    ->all();

                $stockAllocations = $rule->stockAllocations
                    ->sortBy('id')
                    ->values()
                    ->map(fn ($allocation): array => [
                        'product_id' => (int) $allocation->product_id,
                        'variant_id' => $allocation->variant_id !== null ? (int) $allocation->variant_id : null,
                        'allocated_quantity' => (int) ($allocation->allocated_quantity ?? 0),
                    ])
                    ->all();

                return [
                    'id' => (int) $rule->id,
                    'condition_type' => (string) $rule->condition_type,
                    'min_order_amount' => $rule->min_order_amount !== null ? (float) $rule->min_order_amount : null,
                    'max_sets_per_order' => $rule->max_sets_per_order !== null ? (int) $rule->max_sets_per_order : null,
                    'max_gift_qty' => $rule->max_gift_qty !== null ? (int) $rule->max_gift_qty : null,
                    'priority' => (int) $rule->priority,
                    'is_active' => (bool) $rule->is_active,
                    'stackable' => (bool) $rule->stackable,
                    'stock_scope' => (string) ($rule->stock_scope ?? 'all'),
                    'stock_limit' => $rule->stock_limit !== null ? (int) $rule->stock_limit : null,
                    'buy_products' => $buyProducts,
                    'gift_products' => $giftProducts,
                    'gift_variant_options' => $giftVariantOptions,
                    'stock_allocations' => $stockAllocations,
                ];
            })
            ->sortBy('id')
            ->values()
            ->all();

        return md5(json_encode([
            'id' => (int) $offer->id,
            'code' => (string) $offer->code,
            'name' => (string) $offer->name,
            'campaign_id' => $offer->campaign_id !== null ? (int) $offer->campaign_id : null,
            'starts_at' => optional($offer->starts_at)?->format('Y-m-d H:i:s'),
            'ends_at' => optional($offer->ends_at)?->format('Y-m-d H:i:s'),
            'priority' => (int) $offer->priority,
            'is_active' => (bool) $offer->is_active,
            'stackable' => (bool) $offer->stackable,
            'rules' => $normalizedRules,
        ]) ?: '[]');
    }

    private function normalizeNullableInteger(mixed $value): ?int
    {
        if ($value === null || $value === '' || $value === false) {
            return null;
        }

        return (int) $value;
    }

    public function getOffersWithRulesForSync(): Collection
    {
        return $this->_model->query()
            ->with([
                'rules' => function ($query): void {
                    $query->where('is_active', true)
                        ->orderBy('priority')
                        ->orderBy('id')
                        ->with([
                            'buyProducts:id,quantity,is_stock,status',
                            'buyProducts.variants:id,product_id,stock',
                            'giftProducts:id,quantity,is_stock,status',
                            'giftProducts.variants:id,product_id,stock',
                            'giftVariantOptions:id,promotion_buytogift_offer_rule_id,product_id,variant_id,reserve_qty',
                            'stockAllocations:id,promotion_buytogift_offer_rule_id,product_id,variant_id,allocated_quantity',
                        ]);
                },
            ])
            ->get();
    }

    public function getAllocationsForUpdate(int $ruleId, array $allocationKeys): Collection
    {
        return PromotionBuyToGiftRuleStockAllocation::query()
            ->where('promotion_buytogift_offer_rule_id', $ruleId)
            ->where(function ($query) use ($allocationKeys): void {
                foreach ($allocationKeys as $allocationKey) {
                    [$productId, $variantId] = array_pad(explode(':', (string) $allocationKey, 2), 2, '0');
                    $productId = (int) $productId;
                    $variantId = (int) $variantId > 0 ? (int) $variantId : null;

                    $query->orWhere(function ($nested) use ($productId, $variantId): void {
                        $nested->where('product_id', $productId);
                        if ($variantId === null) {
                            $nested->whereNull('variant_id');
                        } else {
                            $nested->where('variant_id', $variantId);
                        }
                    });
                }
            })
            ->lockForUpdate()
            ->get();
    }

    public function createAllocation(array $payload): void
    {
        PromotionBuyToGiftRuleStockAllocation::query()->create($payload);
    }

    public function getActiveOffersForCalculation(Carbon $now): Collection
    {
        return $this->_model->query()
            ->where('is_active', true)
            ->where(fn ($q) => $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now))
            ->where(fn ($q) => $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now))
            ->with([
                'rules' => function ($q) {
                    $q->where('is_active', true)->orderBy('priority')->orderBy('id')
                        ->with([
                            'buyProducts',
                            'buyProducts.variants',
                            'giftProducts',
                            'giftProducts.variants',
                            'giftVariantOptions',
                            'giftVariantOptions.variant',
                        ]);
                },
            ])
            ->get();
    }

    public function getAllOffersWithRuleCount(): Collection
    {
        return $this->_model->query()->withCount('rules')->get();
    }
}
