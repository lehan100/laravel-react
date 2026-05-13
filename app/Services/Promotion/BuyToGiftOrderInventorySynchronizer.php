<?php

namespace App\Services\Promotion;

use App\Models\Catalog\Product;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionBuyToGiftOfferRule;
use App\Models\Promotion\PromotionBuyToGiftRuleGiftVariantOption;
use App\Models\Promotion\PromotionBuyToGiftRuleStockAllocation;
use App\Repositories\BuyToGift\BuyToGiftRepositoryInterface;
use App\Repositories\Product\ProductRepositoryInterface;
use Illuminate\Support\Collection;

class BuyToGiftOrderInventorySynchronizer
{
    public function __construct(
        private readonly BuyToGiftAvailabilityService $availabilityService,
        private readonly ProductRepositoryInterface $productRepository,
        private readonly BuyToGiftRepositoryInterface $buyToGiftRepository
    ) {}

    /**
     * Synchronize sold quantities and promotion gift allocations for an order status transition.
     *
     * @param  array<int, array<string, mixed>>  $originalItems
     * @param  array<int, array<string, mixed>>  $nextItems
     */
    public function syncForTransition(
        mixed $order,
        string $oldOrderStatus,
        string $oldShippingStatus,
        array $originalItems,
        array $nextItems
    ): void {
        $wasConsuming = $this->isInventoryConsumingStatus($oldOrderStatus, $oldShippingStatus);
        $isConsuming = $this->isInventoryConsumingStatus((string) ($order->order_status ?? ''), (string) ($order->shipping_status ?? ''));

        if (! $wasConsuming && ! $isConsuming) {
            return;
        }

        $previousItems = $wasConsuming ? $originalItems : [];
        $currentItems = $isConsuming ? $nextItems : [];

        $this->applySoldQuantityAdjustments(
            $this->buildItemQuantityDeltaMap($previousItems, $currentItems),
            (int) ($order->id ?? 0),
            (string) ($order->order_number ?? ''),
            $wasConsuming && ! $isConsuming
                ? 'Order cancelled/returned (sold quantity rollback)'
                : 'Order active (sold quantity update)',
            $wasConsuming && ! $isConsuming ? 'order_sold_rollback' : 'order_sold'
        );

        $this->applyPromotionGiftAdjustments(
            $previousItems,
            $currentItems,
            (int) ($order->id ?? 0),
            (string) ($order->order_number ?? '')
        );
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     * @return array<int, int>
     */
    private function buildItemQuantityMap(array $items): array
    {
        $map = [];

        foreach ($items as $item) {
            if ((bool) data_get($item, 'is_gift', data_get($item, 'meta.is_gift', false))) {
                continue;
            }

            $productId = (int) ($item['product_id'] ?? 0);
            $quantity = max(0, (int) ($item['quantity'] ?? 0));

            if ($productId <= 0 || $quantity <= 0) {
                continue;
            }

            $map[$productId] = ($map[$productId] ?? 0) + $quantity;
        }

        return $map;
    }

    /**
     * @param  array<int, array<string, mixed>>  $previousItems
     * @param  array<int, array<string, mixed>>  $currentItems
     * @return array<int, int>
     */
    private function buildItemQuantityDeltaMap(array $previousItems, array $currentItems): array
    {
        $previousMap = $this->buildItemQuantityMap($previousItems);
        $currentMap = $this->buildItemQuantityMap($currentItems);

        $productIds = collect(array_keys($previousMap))
            ->merge(array_keys($currentMap))
            ->map(fn (mixed $productId): int => (int) $productId)
            ->filter()
            ->unique()
            ->values();

        $deltaMap = [];
        foreach ($productIds as $productId) {
            $delta = (int) ($currentMap[$productId] ?? 0) - (int) ($previousMap[$productId] ?? 0);
            if ($delta !== 0) {
                $deltaMap[$productId] = $delta;
            }
        }

        return $deltaMap;
    }

    /**
     * @param  array<int, int>  $deltaMap
     */
    private function applySoldQuantityAdjustments(
        array $deltaMap,
        int $orderId,
        string $orderNumber,
        string $reason,
        string $action
    ): void {
        if ($deltaMap === []) {
            return;
        }

        $productIds = array_keys($deltaMap);

        $this->productRepository->getProductsForUpdate($productIds)
            ->each(function (Product $product) use ($deltaMap, $orderId, $orderNumber, $reason, $action): void {
                $delta = (int) ($deltaMap[$product->id] ?? 0);
                if ($delta === 0) {
                    return;
                }

                $oldSoldQuantity = (int) ($product->sold_quantity ?? 0);
                $newSoldQuantity = max(0, $oldSoldQuantity + $delta);

                request()->attributes->set('inventory_log_context', [
                    'action' => $action,
                    'reason' => $reason,
                    'meta' => [
                        'channel' => 'order',
                        'type' => 'sold_quantity',
                        'order_id' => $orderId,
                        'order_number' => $orderNumber,
                        'delta' => $delta,
                        'old_sold_quantity' => $oldSoldQuantity,
                        'new_sold_quantity' => $newSoldQuantity,
                    ],
                ]);

                $product->sold_quantity = $newSoldQuantity;
                $product->save();
            });
    }

    /**
     * @param  array<int, array<string, mixed>>  $previousItems
     * @param  array<int, array<string, mixed>>  $currentItems
     */
    private function applyPromotionGiftAdjustments(
        array $previousItems,
        array $currentItems,
        int $orderId,
        string $orderNumber
    ): void {
        $offers = $this->buyToGiftRepository->getOffersWithRulesForSync();

        if ($offers->isEmpty()) {
            return;
        }

        $allocationAdjustments = [];
        $variantReserveAdjustments = [];
        $soldQuantityAdjustments = [];
        $previousGiftMap = $this->buildGiftQuantityMap($previousItems);
        $currentGiftMap = $this->buildGiftQuantityMap($currentItems);

        foreach ($offers as $offer) {
            /** @var Collection<int, PromotionBuyToGiftOfferRule> $rules */
            $rules = $offer->rules;

            foreach ($rules as $rule) {
                $ruleGiftKeys = collect(array_keys($previousGiftMap))
                    ->merge(array_keys($currentGiftMap))
                    ->filter(fn (string $key): bool => str_starts_with($key, $rule->id.':'))
                    ->unique()
                    ->values();

                foreach ($ruleGiftKeys as $key) {
                    $previousQuantity = (int) ($previousGiftMap[$key] ?? 0);
                    $currentQuantity = (int) ($currentGiftMap[$key] ?? 0);
                    $deltaQuantity = $currentQuantity - $previousQuantity;

                    if ($deltaQuantity === 0) {
                        continue;
                    }

                    [$ruleId, $productId, $variantId] = $this->parseGiftKey((string) $key);
                    $soldQuantityAdjustments[$productId] = ($soldQuantityAdjustments[$productId] ?? 0) + $deltaQuantity;
                    $allocationKey = $this->allocationKey($productId, $variantId);
                    $allocationAdjustments[$ruleId][$allocationKey] = ($allocationAdjustments[$ruleId][$allocationKey] ?? 0) + $deltaQuantity;
                    if ($variantId !== null) {
                        $variantReserveAdjustments[$ruleId][$allocationKey] = ($variantReserveAdjustments[$ruleId][$allocationKey] ?? 0) + $deltaQuantity;
                    }
                }
            }
        }

        $this->applySoldQuantityAdjustments(
            $soldQuantityAdjustments,
            $orderId,
            $orderNumber,
            'Buy X Get Y promotion gift sold quantity update',
            'promotion_buytogift_sold'
        );

        foreach ($allocationAdjustments as $ruleId => $productAdjustments) {
            $rule = $offers
                ->flatMap(fn (PromotionBuyToGiftOffer $offer): Collection => $offer->rules)
                ->firstWhere('id', (int) $ruleId);

            if (! $rule instanceof PromotionBuyToGiftOfferRule) {
                continue;
            }

            $this->applyAllocationAdjustments($offer, $rule, $productAdjustments, $orderId, $orderNumber);
        }

        foreach ($variantReserveAdjustments as $ruleId => $productAdjustments) {
            $rule = $offers
                ->flatMap(fn (PromotionBuyToGiftOffer $offer): Collection => $offer->rules)
                ->firstWhere('id', (int) $ruleId);

            if (! $rule instanceof PromotionBuyToGiftOfferRule) {
                continue;
            }

            $this->applyVariantReserveAdjustments($rule, $productAdjustments, $orderId, $orderNumber);
        }
    }

    /**
     * @param  array<string, int>  $productAdjustments
     */
    private function applyAllocationAdjustments(
        PromotionBuyToGiftOffer $offer,
        PromotionBuyToGiftOfferRule $rule,
        array $productAdjustments,
        int $orderId,
        string $orderNumber
    ): void {
        if ($productAdjustments === []) {
            return;
        }

        $allocations = $rule->stockAllocations
            ->keyBy(fn ($allocation): string => $this->allocationKey((int) $allocation->product_id, $allocation->variant_id !== null ? (int) $allocation->variant_id : null));
        $allocationKeys = collect(array_keys($productAdjustments))
            ->merge($allocations->keys())
            ->filter()
            ->unique()
            ->values();

        if ($allocationKeys->isEmpty()) {
            return;
        }

        $this->buyToGiftRepository->getAllocationsForUpdate($rule->id, $allocationKeys->toArray())
            ->each(function (PromotionBuyToGiftRuleStockAllocation $allocation) use ($productAdjustments, $orderId, $orderNumber, $rule): void {
                $allocationKey = $this->allocationKey((int) $allocation->product_id, $allocation->variant_id !== null ? (int) $allocation->variant_id : null);
                $delta = (int) ($productAdjustments[$allocationKey] ?? 0);
                if ($delta === 0) {
                    return;
                }

                $currentQuantity = (int) ($allocation->allocated_quantity ?? 0);
                $nextQuantity = max(0, $currentQuantity - $delta);

                request()->attributes->set('inventory_log_context', [
                    'action' => $delta > 0 ? 'promotion_buytogift_consume' : 'promotion_buytogift_restore',
                    'reason' => $delta > 0
                        ? 'Consume reserved stock for buy x get y promotion'
                        : 'Restore reserved stock for buy x get y promotion',
                    'meta' => [
                        'channel' => 'order',
                        'type' => 'promotion_allocation',
                        'order_id' => $orderId,
                        'order_number' => $orderNumber,
                        'promotion_buytogift_offer_rule_id' => (int) $rule->id,
                        'promotion_buytogift_offer_id' => (int) $rule->promotion_buytogift_offer_id,
                        'product_id' => (int) $allocation->product_id,
                        'variant_id' => $allocation->variant_id !== null ? (int) $allocation->variant_id : null,
                        'delta' => $delta,
                        'old_quantity' => $currentQuantity,
                        'new_quantity' => $nextQuantity,
                    ],
                ]);

                $allocation->allocated_quantity = $nextQuantity;
                $allocation->save();
            });
    }

    /**
     * @param  array<string, int>  $productAdjustments
     */
    private function applyVariantReserveAdjustments(
        PromotionBuyToGiftOfferRule $rule,
        array $productAdjustments,
        int $orderId,
        string $orderNumber
    ): void {
        if ($productAdjustments === []) {
            return;
        }

        $variants = $rule->giftVariantOptions
            ->keyBy(fn (PromotionBuyToGiftRuleGiftVariantOption $option): string => $this->allocationKey((int) $option->product_id, $option->variant_id !== null ? (int) $option->variant_id : null));

        $allocationKeys = collect(array_keys($productAdjustments))
            ->merge($variants->keys())
            ->filter()
            ->unique()
            ->values();

        if ($allocationKeys->isEmpty()) {
            return;
        }

        PromotionBuyToGiftRuleGiftVariantOption::query()
            ->where('promotion_buytogift_offer_rule_id', $rule->id)
            ->where(function ($query) use ($allocationKeys): void {
                foreach ($allocationKeys as $key) {
                    [$productId, $variantId] = $this->parseAllocationKey((string) $key);
                    $query->orWhere(function ($innerQuery) use ($productId, $variantId): void {
                        $innerQuery->where('product_id', $productId)
                            ->when(
                                $variantId !== null,
                                fn ($builder) => $builder->where('variant_id', $variantId),
                                fn ($builder) => $builder->whereNull('variant_id')
                            );
                    });
                }
            })
            ->lockForUpdate()
            ->get()
            ->each(function (PromotionBuyToGiftRuleGiftVariantOption $option) use ($productAdjustments, $orderId, $orderNumber, $rule): void {
                $allocationKey = $this->allocationKey((int) $option->product_id, $option->variant_id !== null ? (int) $option->variant_id : null);
                $delta = (int) ($productAdjustments[$allocationKey] ?? 0);
                if ($delta === 0) {
                    return;
                }

                $currentQuantity = max(0, (int) ($option->reserve_qty ?? 0));
                $nextQuantity = max(0, $currentQuantity - $delta);

                request()->attributes->set('inventory_log_context', [
                    'action' => $delta > 0 ? 'promotion_buytogift_reserve' : 'promotion_buytogift_release',
                    'reason' => $delta > 0
                        ? 'Consume reserved variant stock for buy x get y promotion'
                        : 'Restore reserved variant stock for buy x get y promotion',
                    'meta' => [
                        'channel' => 'order',
                        'type' => 'promotion_variant_reserve',
                        'order_id' => $orderId,
                        'order_number' => $orderNumber,
                        'promotion_buytogift_offer_rule_id' => (int) $rule->id,
                        'promotion_buytogift_offer_id' => (int) $rule->promotion_buytogift_offer_id,
                        'product_id' => (int) $option->product_id,
                        'variant_id' => $option->variant_id !== null ? (int) $option->variant_id : null,
                        'delta' => $delta,
                        'old_quantity' => $currentQuantity,
                        'new_quantity' => $nextQuantity,
                    ],
                ]);

                $option->reserve_qty = $nextQuantity;
                $option->save();
            });
    }

    private function isInventoryConsumingStatus(string $orderStatus, string $shippingStatus): bool
    {
        return $orderStatus !== 'cancelled'
            && $shippingStatus !== 'returned';
    }

    private function isPromotionActive(PromotionBuyToGiftOffer $offer): bool
    {
        if (! (bool) $offer->is_active) {
            return false;
        }

        if ($offer->ends_at === null) {
            return true;
        }

        return $offer->ends_at->greaterThanOrEqualTo(now());
    }

    private function allocationKey(int $productId, ?int $variantId): string
    {
        return $productId.':'.($variantId ?? 0);
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     * @return array<string, int>
     */
    private function buildGiftQuantityMap(array $items): array
    {
        $map = [];

        foreach ($items as $item) {
            $isGift = (bool) ($item['is_gift'] ?? data_get($item, 'meta.is_gift', false));
            if (! $isGift) {
                continue;
            }

            $ruleId = (int) ($item['rule_id'] ?? data_get($item, 'meta.rule_id', 0));
            $productId = (int) ($item['product_id'] ?? 0);
            $variantId = $this->nullableIntegerValue($item['variant_id'] ?? data_get($item, 'meta.variant.id'));
            $quantity = max(0, (int) ($item['quantity'] ?? 0));

            if ($ruleId <= 0 || $productId <= 0 || $quantity <= 0) {
                continue;
            }

            $key = $this->giftKey($ruleId, $productId, $variantId);
            $map[$key] = ($map[$key] ?? 0) + $quantity;
        }

        return $map;
    }

    private function giftKey(int $ruleId, int $productId, ?int $variantId): string
    {
        return $ruleId.':'.$productId.':'.($variantId ?? 0);
    }

    /**
     * @return array{0:int,1:int|null}
     */
    private function parseAllocationKey(string $key): array
    {
        [$productId, $variantId] = array_pad(explode(':', $key, 2), 2, '0');

        $variantId = (int) $variantId;

        return [(int) $productId, $variantId > 0 ? $variantId : null];
    }

    private function nullableIntegerValue(mixed $value): ?int
    {
        if ($value === null || $value === '' || $value === false) {
            return null;
        }

        return (int) $value;
    }

    /**
     * @return array{0:int,1:int,2:int|null}
     */
    private function parseGiftKey(string $key): array
    {
        [$ruleId, $productId, $variantId] = array_pad(explode(':', $key, 3), 3, '0');

        $variantId = (int) $variantId;

        return [(int) $ruleId, (int) $productId, $variantId > 0 ? $variantId : null];
    }
}
