<?php

namespace App\Services\Promotion;

use App\Models\Catalog\Product;
use App\Models\Promotion\PromotionBuyToGiftOfferRule;
use App\Models\Promotion\PromotionBuyToGiftRuleGiftVariantOption;
use App\Models\Promotion\PromotionCoupon;
use App\Repositories\BuyToGift\BuyToGiftRepositoryInterface;
use App\Repositories\Coupon\CouponRepositoryInterface;
use App\Repositories\SaleOffer\SaleOfferRepositoryInterface;
use Illuminate\Support\Collection;

class PromotionEngineService
{
    public function __construct(
        private readonly SaleOfferRepositoryInterface $saleOfferRepository,
        private readonly BuyToGiftRepositoryInterface $buyToGiftRepository,
        private readonly CouponRepositoryInterface $couponRepository
    ) {}

    /**
     * Evaluate the cart/order items and apply eligible promotions.
     *
     * @param  array<int, array{product_id: int, variant_id: ?int, quantity: int, unit_price: float}>  $items
     * @return array{
     *     items: array,
     *     discount_total: float,
     *     shipping_total: float,
     *     applied_promotions: array
     * }
     */
    public function calculate(array $items, ?string $couponCode = null, ?int $orderId = null): array
    {
        $discountTotal = 0.0;
        $appliedPromotions = [];
        $giftItems = [];

        $now = now();
        $subtotal = 0.0;

        // Calculate initial subtotal
        foreach ($items as &$item) {
            $item['line_total'] = ($item['quantity'] ?? 1) * ($item['unit_price'] ?? 0);
            $item['line_discount'] = 0.0;
            $subtotal += $item['line_total'];
        }
        unset($item);

        // 1. Process Sale Offers
        $saleOffers = $this->saleOfferRepository->getActiveOffersForCalculation($now);

        foreach ($saleOffers as $offer) {
            $offerProductIds = $offer->products->pluck('id')->all();
            $offerApplied = false;
            $offerDiscountTotal = 0;

            foreach ($items as &$item) {
                if (($item['is_gift'] ?? false) === true) {
                    continue;
                }
                if (! in_array($item['product_id'], $offerProductIds)) {
                    continue;
                }

                // Calculate discount for this item
                $currentDiscount = 0;
                if (($offer->discount_type ?? 'percent') === 'percent') {
                    $currentDiscount = ($item['line_total'] * ($offer->discount_value ?? 0)) / 100;
                } else {
                    $currentDiscount = ($offer->discount_value ?? 0) * ($item['quantity'] ?? 1);
                }

                if ($offer->max_discount_amount > 0 && $currentDiscount > $offer->max_discount_amount) {
                    $currentDiscount = (float) $offer->max_discount_amount;
                }

                // Ensure discount doesn't exceed item's line total minus already applied discounts
                $maxPossibleDiscount = max(0, $item['line_total'] - $item['line_discount']);
                if ($currentDiscount > $maxPossibleDiscount) {
                    $currentDiscount = $maxPossibleDiscount;
                }

                if ($currentDiscount > 0) {
                    $item['line_discount'] += $currentDiscount;
                    $discountTotal += $currentDiscount;
                    $offerDiscountTotal += $currentDiscount;
                    $offerApplied = true;
                }
            }
            unset($item);

            if ($offerApplied) {
                $appliedPromotions[] = [
                    'type' => 'sale_offer',
                    'id' => $offer->id,
                    'name' => $offer->name,
                    'discount_amount' => $offerDiscountTotal,
                ];

                if (! $offer->stackable) {
                    break; // Stop processing other sale offers if not stackable
                }
            }
        }

        // 2. Process Buy-To-Gift Offers
        $buyToGiftOffers = $this->buyToGiftRepository->getActiveOffersForCalculation($now);

        $availabilityService = app(BuyToGiftAvailabilityService::class);

        foreach ($buyToGiftOffers as $offer) {
            $offerApplied = false;
            $appliedBuyProductProductIds = [];

            $buyProductRules = $offer->rules->filter(function ($rule): bool {
                return (string) ($rule->condition_type ?? 'order_amount') === 'buy_product';
            });

            $orderAmountRules = $offer->rules->filter(function ($rule): bool {
                return (string) ($rule->condition_type ?? 'order_amount') === 'order_amount';
            });

            foreach ($buyProductRules as $rule) {
                $requestedSets = $availabilityService->calculateRequestedSets($rule, $items);
                if ($requestedSets <= 0) {
                    continue;
                }

                $summary = $availabilityService->summarizeRule($rule, $orderId);
                $availableSlots = $summary['available_slots'] ?? 0;
                $grantedSets = min($requestedSets, $availableSlots);

                if ($grantedSets <= 0) {
                    continue;
                }

                $giftProduct = $rule->giftProducts->first();
                if (! $giftProduct) {
                    continue;
                }

                $appliedBuyProductProductIds = array_values(array_unique(array_merge(
                    $appliedBuyProductProductIds,
                    $rule->buyProducts->pluck('id')->map(fn (mixed $value): int => (int) $value)->all()
                )));

                $giftQtyPerSet = (int) ($giftProduct->pivot?->gift_qty ?? 1);
                $totalGiftQty = $grantedSets * $giftQtyPerSet;
                $giftVariantOptions = $rule->relationLoaded('giftVariantOptions') ? $rule->giftVariantOptions : collect();

                if ($giftVariantOptions->isNotEmpty()) {
                    $giftItems = array_merge(
                        $giftItems,
                        $this->buildGiftItemsForVariantOptions($rule, $giftProduct, $giftVariantOptions, $totalGiftQty)
                    );
                } else {
                    $variantId = $giftProduct->pivot?->variant_id !== null ? (int) $giftProduct->pivot?->variant_id : null;
                    $giftItems[] = [
                        'product_id' => $giftProduct->id,
                        'variant_id' => $variantId,
                        'quantity' => $totalGiftQty,
                        'unit_price' => 0.0,
                        'line_total' => 0.0,
                        'line_discount' => 0.0,
                        'is_gift' => true,
                        'rule_id' => $rule->id,
                    ];
                }

                $offerApplied = true;

                $appliedPromotions[] = [
                    'type' => 'buy_to_gift',
                    'id' => $offer->id,
                    'rule_id' => $rule->id,
                    'name' => $offer->name,
                    'gift_quantity' => $totalGiftQty,
                ];
            }

            $orderAmountSubtotal = $this->calculateOrderAmountSubtotal($items, $appliedBuyProductProductIds);

            foreach ($orderAmountRules as $rule) {
                $requestedSets = $this->calculateOrderAmountRequestedSets($rule, $orderAmountSubtotal);
                if ($requestedSets <= 0) {
                    continue;
                }

                $summary = $availabilityService->summarizeRule($rule, $orderId);
                $availableSlots = $summary['available_slots'] ?? 0;
                $grantedSets = min($requestedSets, $availableSlots);

                if ($grantedSets <= 0) {
                    continue;
                }

                $giftProduct = $rule->giftProducts->first();
                if (! $giftProduct) {
                    continue;
                }

                $giftQtyPerSet = (int) ($giftProduct->pivot?->gift_qty ?? 1);
                $totalGiftQty = $grantedSets * $giftQtyPerSet;
                $giftVariantOptions = $rule->relationLoaded('giftVariantOptions') ? $rule->giftVariantOptions : collect();

                if ($giftVariantOptions->isNotEmpty()) {
                    $giftItems = array_merge(
                        $giftItems,
                        $this->buildGiftItemsForVariantOptions($rule, $giftProduct, $giftVariantOptions, $totalGiftQty)
                    );
                } else {
                    $variantId = $giftProduct->pivot?->variant_id !== null ? (int) $giftProduct->pivot?->variant_id : null;
                    $giftItems[] = [
                        'product_id' => $giftProduct->id,
                        'variant_id' => $variantId,
                        'quantity' => $totalGiftQty,
                        'unit_price' => 0.0,
                        'line_total' => 0.0,
                        'line_discount' => 0.0,
                        'is_gift' => true,
                        'rule_id' => $rule->id,
                    ];
                }

                $offerApplied = true;

                $appliedPromotions[] = [
                    'type' => 'buy_to_gift',
                    'id' => $offer->id,
                    'rule_id' => $rule->id,
                    'name' => $offer->name,
                    'gift_quantity' => $totalGiftQty,
                ];
            }

            if ($offerApplied && ! $offer->stackable) {
                // If the offer is applied and not stackable, what does stackable mean for B2G?
                // Usually it means it cannot be stacked with other B2G offers.
                // We'll leave it as is for now.
            }
        }

        // 3. Process Coupons
        $couponStatus = null;
        if ($couponCode) {
            $couponStatus = [
                'success' => false,
                'message' => __('hancms.sales.orders.coupon_status.not_found'),
            ];

            $coupon = PromotionCoupon::where('code', $couponCode)->first();

            if ($coupon) {
                if (! $coupon->is_active) {
                    $couponStatus['message'] = __('hancms.sales.orders.coupon_status.inactive');
                } elseif (($coupon->starts_at && $now->lt($coupon->starts_at)) || ($coupon->ends_at && $now->gt($coupon->ends_at))) {
                    $couponStatus['message'] = __('hancms.sales.orders.coupon_status.invalid_date');
                } else {
                    // Fetch product info to check is_coupon
                    $productIds = collect($items)->pluck('product_id')->unique()->filter()->all();
                    $products = Product::query()->whereIn('id', $productIds)->get(['id', 'is_coupon'])->keyBy('id');

                    $couponEligibleSubtotal = 0.0;
                    $eligibleItemsCount = 0;
                    foreach ($items as $item) {
                        if (($item['is_gift'] ?? false) === true) {
                            continue;
                        }
                        $product = $products->get((int) ($item['product_id'] ?? 0));
                        if ($product && $product->is_coupon) {
                            $couponEligibleSubtotal += (float) ($item['line_total'] ?? 0);
                            $eligibleItemsCount++;
                        }
                    }

                    $couponDiscount = 0;
                    $validForOrder = true;

                    if ($eligibleItemsCount === 0) {
                        $validForOrder = false;
                        $couponStatus['message'] = __('hancms.sales.orders.coupon_status.no_eligible_items');
                    } elseif ($coupon->min_order_amount > 0 && $couponEligibleSubtotal < $coupon->min_order_amount) {
                        $validForOrder = false;
                        $formattedMin = number_format($coupon->min_order_amount, 0, ',', '.').'₫';
                        $couponStatus['message'] = __('hancms.sales.orders.coupon_status.min_order_amount', ['min_amount' => $formattedMin]);
                    } elseif ($coupon->max_order_amount > 0 && $couponEligibleSubtotal > $coupon->max_order_amount) {
                        $validForOrder = false;
                        $formattedMax = number_format($coupon->max_order_amount, 0, ',', '.').'₫';
                        $couponStatus['message'] = __('hancms.sales.orders.coupon_status.max_order_amount', ['max_amount' => $formattedMax]);
                    } elseif ($coupon->usage_limit_total > 0 && $coupon->used_count >= $coupon->usage_limit_total) {
                        $validForOrder = false;
                        $couponStatus['message'] = __('hancms.sales.orders.coupon_status.limit_exceeded');
                    }

                    if ($validForOrder) {
                        if (($coupon->discount_type ?? 'percent') === 'percent') {
                            $couponDiscount = ($couponEligibleSubtotal * ($coupon->discount_value ?? 0)) / 100;
                        } else {
                            $couponDiscount = (float) ($coupon->discount_value ?? 0);
                        }

                        if ($coupon->max_discount_amount > 0 && $couponDiscount > $coupon->max_discount_amount) {
                            $couponDiscount = (float) $coupon->max_discount_amount;
                        }

                        // Coupon discount cannot exceed eligible subtotal
                        // (Actually it should consider existing line discounts too, but let's keep it simple for now as requested)
                        $maxPossibleDiscount = max(0, $couponEligibleSubtotal);
                        if ($couponDiscount > $maxPossibleDiscount) {
                            $couponDiscount = $maxPossibleDiscount;
                        }

                        if ($couponDiscount > 0) {
                            $discountTotal += $couponDiscount;
                            $appliedPromotions[] = [
                                'type' => 'coupon',
                                'id' => $coupon->id,
                                'code' => $coupon->code,
                                'name' => $coupon->name,
                                'discount_amount' => $couponDiscount,
                            ];
                            $couponStatus = [
                                'success' => true,
                                'message' => __('hancms.sales.orders.coupon_status.success'),
                            ];
                        } else {
                            $couponStatus['message'] = __('hancms.sales.orders.coupon_status.no_discount');
                        }
                    }
                }
            }
        }

        return [
            'items' => array_merge($items, $giftItems),
            'discount_total' => round($discountTotal, 2),
            'shipping_total' => 0.0, // Shipping discount logic can be added later
            'applied_promotions' => $appliedPromotions,
            'coupon_status' => $couponStatus,
        ];
    }

    /**
     * @param  Collection<int, PromotionBuyToGiftRuleGiftVariantOption>  $giftVariantOptions
     * @return array<int, array<string, mixed>>
     */
    private function buildGiftItemsForVariantOptions(
        PromotionBuyToGiftOfferRule $rule,
        mixed $giftProduct,
        Collection $giftVariantOptions,
        int $totalGiftQty
    ): array {
        $items = [];
        $remainingQuantity = max(0, $totalGiftQty);

        foreach ($giftVariantOptions
            ->filter(fn (PromotionBuyToGiftRuleGiftVariantOption $option): bool => (int) ($option->variant_id ?? 0) > 0)
            ->sortBy('id')
            ->values() as $option
        ) {
            if ($remainingQuantity <= 0) {
                break;
            }

            $reserveQty = max(0, (int) ($option->reserve_qty ?? 0));
            if ($reserveQty <= 0) {
                continue;
            }

            $allocatedQuantity = min($remainingQuantity, $reserveQty);
            $items[] = [
                'product_id' => (int) $giftProduct->id,
                'variant_id' => (int) $option->variant_id,
                'quantity' => $allocatedQuantity,
                'unit_price' => 0.0,
                'line_total' => 0.0,
                'line_discount' => 0.0,
                'is_gift' => true,
                'rule_id' => $rule->id,
            ];
            $remainingQuantity -= $allocatedQuantity;
        }

        return $items;
    }

    /**
     * @param  array<int, array{product_id: int, variant_id: ?int, quantity: int, unit_price: float, line_total?: float, is_gift?: bool}>  $items
     * @param  array<int, int>  $excludedProductIds
     */
    private function calculateOrderAmountSubtotal(array $items, array $excludedProductIds): float
    {
        $excludedLookup = array_fill_keys($excludedProductIds, true);
        $subtotal = 0.0;

        foreach ($items as $item) {
            if (($item['is_gift'] ?? false) === true) {
                continue;
            }

            $productId = (int) ($item['product_id'] ?? 0);
            if ($productId > 0 && isset($excludedLookup[$productId])) {
                continue;
            }

            $subtotal += (float) ($item['line_total'] ?? 0);
        }

        return $subtotal;
    }

    private function calculateOrderAmountRequestedSets(PromotionBuyToGiftOfferRule $rule, float $subtotal): int
    {
        $minOrderAmount = (float) ($rule->min_order_amount ?? 0);
        if ($minOrderAmount <= 0) {
            return 0;
        }

        $requestedSets = (int) floor($subtotal / $minOrderAmount);
        $maxSetsPerOrder = (int) ($rule->max_sets_per_order ?? 0);
        if ($maxSetsPerOrder > 0) {
            $requestedSets = min($requestedSets, $maxSetsPerOrder);
        }

        return max(0, $requestedSets);
    }
}
