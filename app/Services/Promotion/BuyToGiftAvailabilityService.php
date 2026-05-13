<?php

namespace App\Services\Promotion;

use App\Models\Promotion\PromotionBuyToGiftOfferRule;
use App\Repositories\Order\OrderRepositoryInterface;
use Illuminate\Support\Collection;

class BuyToGiftAvailabilityService
{
    /**
     * @var array<string, int>
     */
    private array $soldQuantityCache = [];

    public function __construct(private OrderRepositoryInterface $orderRepository) {}

    /**
     * @return array{
     *     buy_qty: int,
     *     gift_qty: int,
     *     slot_size: int,
     *     buy_stock_quantity: int,
     *     gift_stock_quantity: int,
     *     buy_slots: int,
     *     gift_slots: int,
     *     max_slots_by_stock_limit: int|null,
     *     available_slots: int,
     *     usable_stock: int,
     *     wasted_stock: int|null,
     *     is_sold_out: bool,
     *     max_gift_slots: int|null,
     *     max_gift_shortage: int|null,
     *     reserved_quantity: int,
     *     sold_quantity: int
     * }
     */
    public function summarizeRule(PromotionBuyToGiftOfferRule $rule, ?int $excludeOrderId = null): array
    {
        $rule->loadMissing([
            'buyProducts',
            'buyProducts.variants',
            'giftProducts',
            'giftProducts.variants',
            'giftVariantOptions',
            'giftVariantOptions.variant',
            'stockAllocations',
        ]);

        $buyProducts = $this->relationCollection($rule->buyProducts);
        $giftProducts = $this->relationCollection($rule->giftProducts);
        $giftVariantOptions = $this->relationCollection($rule->giftVariantOptions);
        $stockAllocations = $this->relationCollection($rule->stockAllocations);
        $isBuyProductCondition = ($rule->condition_type ?? 'order_amount') === 'buy_product' && $buyProducts->isNotEmpty();
        $variantGiftProductIds = $giftVariantOptions->pluck('product_id')->map(fn ($id): int => (int) $id)->unique()->values();

        $buyQty = max(1, (int) ($buyProducts->first()?->pivot?->buy_qty ?? 1));
        $giftQty = max(1, (int) ($giftProducts->first()?->pivot?->gift_qty ?? 1));
        $slotSize = $isBuyProductCondition ? ($buyQty + $giftQty) : $giftQty;

        $buyStockQuantity = $this->sumProductQuantity($buyProducts, $stockAllocations);
        $giftStockQuantity = $this->sumProductQuantity(
            $giftProducts->reject(fn ($product): bool => $variantGiftProductIds->contains((int) $product->id)),
            $stockAllocations
        )
            + $this->sumGiftVariantOptionQuantity($giftVariantOptions, $stockAllocations);

        $buySlots = $isBuyProductCondition ? intdiv($buyStockQuantity, $buyQty) : 0;
        $giftSlots = intdiv($giftStockQuantity, $giftQty);
        $stockBasedSlots = $isBuyProductCondition
            ? min($buySlots, $giftSlots)
            : $giftSlots;
        $soldQuantity = $this->calculateSoldQuantityForRule($rule, $excludeOrderId);

        $maxSlotsByStockLimit = null;
        if (($rule->stock_scope ?? 'all') === 'limited' && $rule->stock_limit !== null) {
            $remainingLimit = max(0, (int) $rule->stock_limit - $soldQuantity);
            $maxSlotsByStockLimit = intdiv($remainingLimit, max(1, $slotSize));
        }

        $maxGiftSlots = $rule->max_gift_qty !== null
            ? intdiv(max(0, (int) $rule->max_gift_qty - $soldQuantity), max(1, $giftQty))
            : null;

        $stockConstrainedSlots = $maxSlotsByStockLimit !== null
            ? min($stockBasedSlots, $maxSlotsByStockLimit)
            : $stockBasedSlots;

        $availableSlots = $stockConstrainedSlots;
        if ($maxGiftSlots !== null) {
            $availableSlots = min($availableSlots, $maxGiftSlots);
        }

        $usableStock = $availableSlots * max(1, $slotSize);
        $maxGiftReferenceSlots = $stockBasedSlots;
        $maxGiftShortage = $maxGiftSlots !== null
            ? max(0, $maxGiftReferenceSlots - $maxGiftSlots)
            : null;
        $reservedQuantity = (int) $stockAllocations->sum('allocated_quantity');

        return [
            'buy_qty' => $buyQty,
            'gift_qty' => $giftQty,
            'slot_size' => $slotSize,
            'buy_stock_quantity' => $buyStockQuantity,
            'gift_stock_quantity' => $giftStockQuantity,
            'buy_slots' => $buySlots,
            'gift_slots' => $giftSlots,
            'max_slots_by_stock_limit' => $maxSlotsByStockLimit,
            'available_slots' => $availableSlots,
            'usable_stock' => $usableStock,
            'wasted_stock' => $rule->stock_scope === 'limited' && $rule->stock_limit !== null
                ? max(0, (int) $rule->stock_limit - $usableStock)
                : null,
            'is_sold_out' => $availableSlots <= 0,
            'max_gift_slots' => $maxGiftSlots,
            'max_gift_shortage' => $maxGiftShortage,
            'reserved_quantity' => $reservedQuantity,
            'sold_quantity' => $soldQuantity,
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     */
    public function calculateRequestedSets(PromotionBuyToGiftOfferRule $rule, array $items): int
    {
        $rule->loadMissing(['buyProducts']);

        $buyProductIds = $this->relationCollection($rule->buyProducts)
            ->map(fn ($product): array => [
                'product_id' => (int) $product->id,
                'variant_id' => $product->pivot?->variant_id !== null ? (int) $product->pivot?->variant_id : null,
            ])
            ->all();

        if ($buyProductIds === []) {
            return 0;
        }

        $buyQty = max(1, (int) ($this->relationCollection($rule->buyProducts)->first()?->pivot?->buy_qty ?? 1));

        $totalBuyQuantity = collect($items)
            ->filter(function (array $item) use ($buyProductIds): bool {
                $itemProductId = (int) ($item['product_id'] ?? 0);
                $itemVariantId = $this->nullableInteger($item['variant_id'] ?? null);

                foreach ($buyProductIds as $buyProduct) {
                    if ($itemProductId !== (int) ($buyProduct['product_id'] ?? 0)) {
                        continue;
                    }

                    $ruleVariantId = $buyProduct['variant_id'];
                    if ($ruleVariantId === null || $ruleVariantId === $itemVariantId) {
                        return true;
                    }
                }

                return false;
            })
            ->sum(fn (array $item): int => max(0, (int) ($item['quantity'] ?? 0)));

        return intdiv($totalBuyQuantity, $buyQty);
    }

    private function sumProductQuantity(Collection $products, ?Collection $allocations = null): int
    {
        return $products->sum(function ($product) use ($allocations): int {
            $variantId = $product->pivot?->variant_id !== null ? (int) $product->pivot?->variant_id : null;
            $currentStock = $this->getCurrentStockForProduct($product, $variantId);
            $allocated = $allocations ? (int) $allocations->where('product_id', $product->id)->where('variant_id', $variantId)->sum('allocated_quantity') : 0;

            return max(0, $currentStock + $allocated);
        });
    }

    private function sumGiftVariantOptionQuantity(Collection $options, ?Collection $allocations = null): int
    {
        return $options->sum(function ($option) use ($allocations): int {
            $variantId = (int) ($option->variant_id ?? 0);
            if ($variantId <= 0) {
                return 0;
            }

            $variant = $option->relationLoaded('variant')
                ? $option->variant
                : $option->variant()->select(['id', 'product_id', 'stock'])->find($variantId);

            $currentStock = (int) ($variant?->stock ?? 0);
            $allocated = $allocations ? (int) $allocations->where('product_id', $option->product_id)->where('variant_id', $variantId)->sum('allocated_quantity') : 0;

            return max(0, $currentStock + $allocated);
        });
    }

    private function getCurrentStockForProduct(mixed $product, ?int $variantId): int
    {
        if ($variantId !== null) {
            $variant = $product->relationLoaded('variants')
                ? $product->variants->firstWhere('id', $variantId)
                : $product->variants()->select(['id', 'stock'])->find($variantId);

            return (int) ($variant?->stock ?? 0);
        }

        if ((int) ($product->is_stock ?? 0) !== 1) {
            return 0;
        }

        if ($product->relationLoaded('variants') && $product->variants->isNotEmpty()) {
            return (int) $product->variants->sum('stock');
        }

        return (int) ($product->quantity ?? 0);
    }

    private function calculateSoldQuantityForRule(PromotionBuyToGiftOfferRule $rule, ?int $excludeOrderId = null): int
    {
        $cacheKey = $rule->id.':'.($excludeOrderId ?? 0);
        if (array_key_exists($cacheKey, $this->soldQuantityCache)) {
            return $this->soldQuantityCache[$cacheKey];
        }

        $soldQuantity = $this->orderRepository->calculateSoldQuantityForRule($rule, $excludeOrderId);

        $this->soldQuantityCache[$cacheKey] = $soldQuantity;

        return $soldQuantity;
    }

    private function nullableInteger(mixed $value): ?int
    {
        if ($value === null || $value === '' || $value === false) {
            return null;
        }

        return (int) $value;
    }

    private function relationCollection(mixed $items): Collection
    {
        return $items instanceof Collection ? $items : collect($items);
    }
}
