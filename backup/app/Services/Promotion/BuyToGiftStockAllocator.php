<?php

namespace App\Services\Promotion;

use App\Models\Catalog\Product;
use App\Models\Catalog\ProductVariant;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionBuyToGiftOfferRule;
use App\Models\Promotion\PromotionBuyToGiftRuleStockAllocation;
use App\Repositories\BuyToGift\BuyToGiftRepositoryInterface;
use App\Repositories\Product\ProductRepositoryInterface;
use RuntimeException;

class BuyToGiftStockAllocator
{
    public function __construct(
        private readonly BuyToGiftAvailabilityService $availabilityService,
        private readonly ProductRepositoryInterface $productRepository,
        private readonly BuyToGiftRepositoryInterface $buyToGiftRepository
    ) {}

    public function syncOffer(PromotionBuyToGiftOffer $offer): void
    {
        $offer->loadMissing([
            'rules.buyProducts',
            'rules.buyProducts.variants',
            'rules.giftProducts',
            'rules.giftProducts.variants',
            'rules.giftVariantOptions',
            'rules.giftVariantOptions.variant',
            'rules.stockAllocations',
        ]);

        if (! (bool) $offer->is_active) {
            $this->releaseOffer($offer);

            return;
        }

        foreach ($offer->rules as $rule) {
            $this->syncRule($rule);
        }
    }

    public function releaseOffer(PromotionBuyToGiftOffer $offer): void
    {
        $offer->loadMissing([
            'rules.buyProducts',
            'rules.buyProducts.variants',
            'rules.giftProducts',
            'rules.giftProducts.variants',
            'rules.giftVariantOptions',
            'rules.giftVariantOptions.variant',
            'rules.stockAllocations',
        ]);

        foreach ($offer->rules as $rule) {
            $this->releaseRule($rule);
        }
    }

    public function syncRule(PromotionBuyToGiftOfferRule $rule): void
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

        $desiredAllocations = $this->buildDesiredAllocations($rule);
        $this->synchronizeRuleAllocations($rule, $desiredAllocations);
    }

    public function releaseRule(PromotionBuyToGiftOfferRule $rule): void
    {
        $rule->loadMissing(['buyProducts', 'buyProducts.variants', 'giftProducts', 'giftProducts.variants', 'stockAllocations']);
        $this->synchronizeRuleAllocations($rule, []);
    }

    /**
     * @param  array<int, int>  $desiredAllocations
     */
    private function synchronizeRuleAllocations(PromotionBuyToGiftOfferRule $rule, array $desiredAllocations): void
    {
        $existingAllocations = $rule->stockAllocations
            ->keyBy(fn (PromotionBuyToGiftRuleStockAllocation $allocation) => $this->allocationKey(
                (int) $allocation->product_id,
                $allocation->variant_id !== null ? (int) $allocation->variant_id : null
            ));

        $productIds = collect(array_keys($desiredAllocations))
            ->merge($existingAllocations->keys())
            ->unique()
            ->values();

        if ($productIds->isEmpty()) {
            return;
        }

        $productIdsToLock = [];
        $variantIdsToLock = [];
        foreach ($productIds as $key) {
            [$productId, $variantId] = $this->parseAllocationKey((string) $key);
            $productIdsToLock[] = $productId;
            if ($variantId !== null) {
                $variantIdsToLock[] = $variantId;
            }
        }

        $products = $this->productRepository->getProductsForUpdate(array_values(array_unique($productIdsToLock)))->keyBy('id');

        $variants = $this->productRepository->getVariantsForUpdate(array_values(array_unique($variantIdsToLock)))->keyBy('id');

        foreach ($productIds as $key) {
            [$productId, $variantId] = $this->parseAllocationKey((string) $key);
            $desiredQuantity = (int) ($desiredAllocations[$key] ?? 0);
            $allocation = $existingAllocations->get($key);
            $currentQuantity = (int) ($allocation?->allocated_quantity ?? 0);
            $delta = $desiredQuantity - $currentQuantity;

            if ($delta === 0) {
                continue;
            }

            if ($variantId !== null) {
                $variant = $variants->get($variantId);
                if (! $variant) {
                    continue;
                }

                $this->adjustVariantQuantity(
                    $variant,
                    -$delta,
                    $delta > 0 ? 'promotion_buytogift_reserve' : 'promotion_buytogift_release',
                    [
                        'promotion_buytogift_offer_rule_id' => (int) $rule->id,
                        'promotion_buytogift_offer_id' => (int) $rule->promotion_buytogift_offer_id,
                        'product_id' => (int) $variant->product_id,
                        'variant_id' => (int) $variant->id,
                        'stock_scope' => (string) ($rule->stock_scope ?? 'all'),
                        'stock_limit' => $rule->stock_limit !== null ? (int) $rule->stock_limit : null,
                        'allocated_quantity' => $desiredQuantity,
                    ]
                );
            } else {
                $product = $products->get($productId);
                if (! $product) {
                    continue;
                }

                $this->adjustProductQuantity(
                    $product,
                    -$delta,
                    $delta > 0 ? 'promotion_buytogift_reserve' : 'promotion_buytogift_release',
                    [
                        'promotion_buytogift_offer_rule_id' => (int) $rule->id,
                        'promotion_buytogift_offer_id' => (int) $rule->promotion_buytogift_offer_id,
                        'product_id' => (int) $product->id,
                        'stock_scope' => (string) ($rule->stock_scope ?? 'all'),
                        'stock_limit' => $rule->stock_limit !== null ? (int) $rule->stock_limit : null,
                        'allocated_quantity' => $desiredQuantity,
                    ]
                );
            }

            if ($desiredQuantity <= 0) {
                if ($allocation) {
                    $allocation->delete();
                }

                continue;
            }

            if ($allocation) {
                $allocation->allocated_quantity = $desiredQuantity;
                $allocation->save();

                continue;
            }

            $this->buyToGiftRepository->createAllocation([
                'promotion_buytogift_offer_rule_id' => $rule->id,
                'product_id' => $productId,
                'variant_id' => $variantId,
                'allocated_quantity' => $desiredQuantity,
            ]);
        }
    }

    /**
     * @return array<int, int>
     */
    private function buildDesiredAllocations(PromotionBuyToGiftOfferRule $rule): array
    {
        $summary = $this->availabilityService->summarizeRule($rule);
        $availableSlots = max(0, (int) ($summary['available_slots'] ?? 0));
        $allocations = [];

        $variantOptions = $rule->relationLoaded('giftVariantOptions') ? $rule->giftVariantOptions : collect();
        if ($variantOptions->isNotEmpty()) {
            foreach ($variantOptions as $option) {
                $variantId = (int) ($option->variant_id ?? 0);
                if ($variantId <= 0) {
                    continue;
                }

                $reserveQty = max(0, (int) ($option->reserve_qty ?? 0));
                $key = $this->allocationKey((int) $option->product_id, $variantId);
                $allocations[$key] = $reserveQty;
            }

            return $allocations;
        }

        foreach ($rule->giftProducts as $product) {
            $giftQty = max(1, (int) ($product->pivot?->gift_qty ?? 1));
            $variantId = $product->pivot?->variant_id !== null ? (int) $product->pivot?->variant_id : null;
            $key = $this->allocationKey((int) $product->id, $variantId);
            $allocations[$key] = ($allocations[$key] ?? 0) + ($availableSlots * $giftQty);
        }

        return $allocations;
    }

    private function adjustProductQuantity(Product $product, int $delta, string $action, array $meta = []): void
    {
        if ($delta === 0) {
            return;
        }

        $oldQuantity = (int) ($product->quantity ?? 0);
        $newQuantity = $oldQuantity + $delta;

        if ($newQuantity < 0) {
            throw new RuntimeException(sprintf(
                'Not enough stock for product %d to reserve promotion quantity.',
                $product->id
            ));
        }

        $product->quantity = $newQuantity;
        $product->is_stock = $newQuantity > 0;
        $product->saveQuietly();

        $this->productRepository->createInventoryAdjustment([
            'product_id' => $product->id,
            'user_id' => auth()->id(),
            'action' => $action,
            'old_quantity' => $oldQuantity,
            'new_quantity' => $newQuantity,
            'delta' => $newQuantity - $oldQuantity,
            'reason' => $action === 'promotion_buytogift_reserve'
                ? 'Reserve stock for buy x get y promotion'
                : 'Release stock from buy x get y promotion',
            'meta' => $meta,
        ]);
    }

    private function adjustVariantQuantity(ProductVariant $variant, int $delta, string $action, array $meta = []): void
    {
        if ($delta === 0) {
            return;
        }

        $oldQuantity = (int) ($variant->stock ?? 0);
        $newQuantity = $oldQuantity + $delta;

        if ($newQuantity < 0) {
            throw new RuntimeException(sprintf(
                'Not enough stock for variant %d to reserve promotion quantity.',
                $variant->id
            ));
        }

        $variant->stock = $newQuantity;
        $variant->saveQuietly();

        $this->productRepository->createInventoryAdjustment([
            'product_id' => $variant->product_id,
            'user_id' => auth()->id(),
            'action' => $action,
            'old_quantity' => $oldQuantity,
            'new_quantity' => $newQuantity,
            'delta' => $newQuantity - $oldQuantity,
            'reason' => $action === 'promotion_buytogift_reserve'
                ? 'Reserve stock for buy x get y promotion'
                : 'Release stock from buy x get y promotion',
            'meta' => array_merge($meta, [
                'variant_stock' => true,
            ]),
        ]);

        $this->syncParentStockFromVariant((int) $variant->product_id);
    }

    private function syncParentStockFromVariant(int $productId): void
    {
        $product = $this->productRepository->getProductsForUpdate([$productId])->first();

        if (! $product) {
            return;
        }

        $product->loadMissing('variants');

        if ($product->variants->isEmpty()) {
            return;
        }

        $totalStock = (int) $product->variants->sum('stock');
        $product->quantity = $totalStock;
        $product->is_stock = $totalStock > 0;
        $product->saveQuietly();
    }

    private function allocationKey(int $productId, ?int $variantId): string
    {
        return $productId.':'.($variantId ?? 0);
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
}
