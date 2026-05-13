<?php

namespace App\Http\Resources\Promotion;

use App\Http\Resources\Concerns\ResolvesPromotionStatus;
use App\Services\Promotion\BuyToGiftAvailabilityService;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class BuyToGiftResource extends JsonResource
{
    use ResolvesPromotionStatus;

    public function toArray($request): array
    {
        $rule = null;
        $rules = collect();
        if ($this->relationLoaded('rules') && $this->rules->isNotEmpty()) {
            $rules = $this->rules
                ->sortBy(fn ($item) => sprintf('%010d-%010d', (int) ($item->priority ?? 100), (int) $item->id))
                ->values();
            $rule = $rules->first();
        }

        $buyProducts = $rule?->relationLoaded('buyProducts') ? $rule->buyProducts : collect();
        $giftProducts = $rule?->relationLoaded('giftProducts') ? $rule->giftProducts : collect();
        $giftVariantOptions = $rule?->relationLoaded('giftVariantOptions') ? $rule->giftVariantOptions : collect();
        $stockAllocations = $rule?->relationLoaded('stockAllocations') ? $rule->stockAllocations : collect();

        $buyQty = 1;
        $giftQty = 1;

        if ($buyProducts->isNotEmpty()) {
            $buyQty = (int) ($buyProducts->first()?->pivot?->buy_qty ?? 1);
        }
        if ($giftProducts->isNotEmpty()) {
            $giftQty = (int) ($giftProducts->first()?->pivot?->gift_qty ?? 1);
        }
        $allocatedStock = (int) $stockAllocations->sum('allocated_quantity');
        $soldQuantity = (int) $giftProducts->sum('sold_quantity');
        $allocationsTotalMap = $this->buildAllocationTotalMap($stockAllocations);
        $availabilityService = app(BuyToGiftAvailabilityService::class);
        $summary = $rule ? $availabilityService->summarizeRule($rule) : null;

        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'campaign_id' => $this->campaign_id,
            'condition_type' => $rule?->condition_type ?? 'order_amount',
            'min_order_amount' => $rule?->min_order_amount !== null ? (float) $rule->min_order_amount : null,
            'max_sets_per_order' => $rule?->max_sets_per_order !== null ? (int) $rule->max_sets_per_order : null,
            'max_gift_qty' => $rule?->max_gift_qty !== null ? (int) $rule->max_gift_qty : null,
            'stock_scope' => $rule?->stock_scope ?? 'all',
            'stock_limit' => $rule?->stock_limit !== null ? (int) $rule->stock_limit : null,
            'allocated_stock' => $allocatedStock,
            'reserved_quantity' => is_array($summary) ? ($summary['reserved_quantity'] ?? $allocatedStock) : $allocatedStock,
            'sold_quantity' => is_array($summary) ? ($summary['sold_quantity'] ?? $soldQuantity) : $soldQuantity,
            'slot_size' => $summary['slot_size'] ?? ($buyQty + $giftQty),
            'buy_stock_quantity' => $summary['buy_stock_quantity'] ?? 0,
            'gift_stock_quantity' => $summary['gift_stock_quantity'] ?? 0,
            'buy_slots' => $summary['buy_slots'] ?? 0,
            'gift_slots' => $summary['gift_slots'] ?? 0,
            'max_slots_by_stock_limit' => $summary['max_slots_by_stock_limit'] ?? null,
            'available_slots' => $summary['available_slots'] ?? 0,
            'usable_stock' => $summary['usable_stock'] ?? 0,
            'wasted_stock' => $summary['wasted_stock'] ?? null,
            'is_sold_out' => $summary['is_sold_out'] ?? false,
            'max_gift_slots' => $summary['max_gift_slots'] ?? null,
            'max_gift_shortage' => $summary['max_gift_shortage'] ?? null,
            'starts_at' => optional($this->starts_at)->format('Y-m-d\\TH:i'),
            'ends_at' => optional($this->ends_at)->format('Y-m-d\\TH:i'),
            'priority' => (int) ($this->priority ?? 100),
            'is_active' => (bool) $this->is_active,
            'promotion_status' => $this->resolvePromotionStatus((bool) $this->is_active, $this->starts_at, $this->ends_at),
            'stackable' => (bool) $this->stackable,
            'buy_product_ids' => $buyProducts->pluck('id')->values(),
            'gift_product_ids' => $giftProducts->pluck('id')->values(),
            'gift_variant_product_ids' => $giftVariantOptions->pluck('product_id')->unique()->values(),
            'buy_items' => $buyProducts->map(fn ($product): array => [
                'product_id' => (int) $product->id,
                'variant_id' => $product->pivot?->variant_id !== null ? (int) $product->pivot?->variant_id : null,
                'buy_qty' => (int) ($product->pivot?->buy_qty ?? 1),
            ])->values(),
            'gift_items' => $giftProducts->map(fn ($product): array => [
                'product_id' => (int) $product->id,
                'variant_id' => $product->pivot?->variant_id !== null ? (int) $product->pivot?->variant_id : null,
                'gift_qty' => (int) ($product->pivot?->gift_qty ?? 1),
            ])->values(),
            'gift_variant_options' => $giftVariantOptions->map(fn ($option): array => [
                'product_id' => (int) $option->product_id,
                'variant_id' => (int) $option->variant_id,
                'reserve_qty' => (int) ($option->reserve_qty ?? 0),
                'product_name' => $option->relationLoaded('product')
                    ? ($option->product?->name ?? $option->product?->sku ?? ('#'.$option->product_id))
                    : ('#'.$option->product_id),
                'variant_name' => $option->relationLoaded('variant')
                    ? ($option->variant?->name ?? $option->variant?->sku ?? ('#'.$option->variant_id))
                    : ('#'.$option->variant_id),
                'variant_sku' => $option->relationLoaded('variant') ? ($option->variant?->sku ?? null) : null,
                'stock' => $option->relationLoaded('variant') ? (int) ($option->variant?->stock ?? 0) : 0,
            ])->values(),
            'gift_variant_options_map' => $giftVariantOptions->mapWithKeys(fn ($option): array => [
                (int) $option->product_id.':'.(int) $option->variant_id => [
                    'product_id' => (int) $option->product_id,
                    'variant_id' => (int) $option->variant_id,
                    'reserve_qty' => (int) ($option->reserve_qty ?? 0),
                ],
            ])->toArray(),
            'allocations_total_map' => $allocationsTotalMap,
            'buy_qty' => $buyQty,
            'gift_qty' => $giftQty,
            'rules_count' => $rules->count(),
            'rules' => $rules->map(function ($item) use ($availabilityService) {
                $buyProducts = $item->relationLoaded('buyProducts') ? $item->buyProducts : collect();
                $giftProducts = $item->relationLoaded('giftProducts') ? $item->giftProducts : collect();
                $giftVariantOptions = $item->relationLoaded('giftVariantOptions') ? $item->giftVariantOptions : collect();
                $stockAllocations = $item->relationLoaded('stockAllocations') ? $item->stockAllocations : collect();
                $allocationsTotalMap = $this->buildAllocationTotalMap($stockAllocations);
                $summary = $availabilityService->summarizeRule($item);

                return [
                    'id' => (int) $item->id,
                    'condition_type' => $item->condition_type ?? 'order_amount',
                    'min_order_amount' => $item->min_order_amount !== null ? (float) $item->min_order_amount : null,
                    'max_sets_per_order' => $item->max_sets_per_order !== null ? (int) $item->max_sets_per_order : null,
                    'max_gift_qty' => $item->max_gift_qty !== null ? (int) $item->max_gift_qty : null,
                    'stock_scope' => $item->stock_scope ?? 'all',
                    'stock_limit' => $item->stock_limit !== null ? (int) $item->stock_limit : null,
                    'allocated_stock' => (int) $stockAllocations->sum('allocated_quantity'),
                    'reserved_quantity' => $summary['reserved_quantity'],
                    'sold_quantity' => $summary['sold_quantity'],
                    'slot_size' => $summary['slot_size'],
                    'buy_stock_quantity' => $summary['buy_stock_quantity'],
                    'gift_stock_quantity' => $summary['gift_stock_quantity'],
                    'buy_slots' => $summary['buy_slots'],
                    'gift_slots' => $summary['gift_slots'],
                    'max_slots_by_stock_limit' => $summary['max_slots_by_stock_limit'],
                    'available_slots' => $summary['available_slots'],
                    'usable_stock' => $summary['usable_stock'],
                    'wasted_stock' => $summary['wasted_stock'],
                    'is_sold_out' => $summary['is_sold_out'],
                    'max_gift_slots' => $summary['max_gift_slots'],
                    'max_gift_shortage' => $summary['max_gift_shortage'],
                    'priority' => (int) ($item->priority ?? 100),
                    'is_active' => (bool) $item->is_active,
                    'stackable' => (bool) $item->stackable,
                    'buy_product_ids' => $buyProducts->pluck('id')->values(),
                    'gift_product_ids' => $giftProducts->pluck('id')->values(),
                    'gift_variant_product_ids' => $giftVariantOptions->pluck('product_id')->unique()->values(),
                    'buy_items' => $buyProducts->map(fn ($product): array => [
                        'product_id' => (int) $product->id,
                        'variant_id' => $product->pivot?->variant_id !== null ? (int) $product->pivot?->variant_id : null,
                        'buy_qty' => (int) ($product->pivot?->buy_qty ?? 1),
                    ])->values(),
                    'gift_items' => $giftProducts->map(fn ($product): array => [
                        'product_id' => (int) $product->id,
                        'variant_id' => $product->pivot?->variant_id !== null ? (int) $product->pivot?->variant_id : null,
                        'gift_qty' => (int) ($product->pivot?->gift_qty ?? 1),
                    ])->values(),
                    'gift_variant_options' => $giftVariantOptions->map(fn ($option): array => [
                        'product_id' => (int) $option->product_id,
                        'variant_id' => (int) $option->variant_id,
                        'reserve_qty' => (int) ($option->reserve_qty ?? 0),
                        'product_name' => $option->relationLoaded('product')
                            ? ($option->product?->name ?? $option->product?->sku ?? ('#'.$option->product_id))
                            : ('#'.$option->product_id),
                        'variant_name' => $option->relationLoaded('variant')
                            ? ($option->variant?->name ?? $option->variant?->sku ?? ('#'.$option->variant_id))
                            : ('#'.$option->variant_id),
                        'variant_sku' => $option->relationLoaded('variant') ? ($option->variant?->sku ?? null) : null,
                        'stock' => $option->relationLoaded('variant') ? (int) ($option->variant?->stock ?? 0) : 0,
                    ])->values(),
                    'gift_variant_options_map' => $giftVariantOptions->mapWithKeys(fn ($option): array => [
                        (int) $option->product_id.':'.(int) $option->variant_id => [
                            'product_id' => (int) $option->product_id,
                            'variant_id' => (int) $option->variant_id,
                            'reserve_qty' => (int) ($option->reserve_qty ?? 0),
                        ],
                    ])->toArray(),
                    'allocations_total_map' => $allocationsTotalMap,
                    'buy_qty' => (int) ($buyProducts->first()?->pivot?->buy_qty ?? 1),
                    'gift_qty' => (int) ($giftProducts->first()?->pivot?->gift_qty ?? 1),
                    'allocations_map' => $stockAllocations->mapWithKeys(fn ($allocation): array => [
                        (int) $allocation->product_id.':'.((int) ($allocation->variant_id ?? 0)) => (int) $allocation->allocated_quantity,
                    ])->toArray(),
                ];
            })->values(),
            'created_at' => optional($this->created_at)->format('Y-m-d H:i:s'),
        ];
    }

    private function buildAllocationTotalMap(Collection $stockAllocations): array
    {
        return $stockAllocations
            ->groupBy(fn ($allocation): int => (int) $allocation->product_id)
            ->map(fn (Collection $allocations): int => (int) $allocations->sum('allocated_quantity'))
            ->toArray();
    }
}
