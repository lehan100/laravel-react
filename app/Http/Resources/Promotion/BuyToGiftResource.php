<?php

namespace App\Http\Resources\Promotion;

use Illuminate\Http\Resources\Json\JsonResource;

class BuyToGiftResource extends JsonResource
{
    public function toArray($request): array
    {
        $rule = null;
        $rules = collect();
        if ($this->relationLoaded('rules') && $this->rules->isNotEmpty()) {
            $rules = $this->rules
                ->sortBy(fn($item) => sprintf('%010d-%010d', (int) ($item->priority ?? 100), (int) $item->id))
                ->values();
            $rule = $rules->first();
        }

        $buyProducts = $rule?->relationLoaded('buyProducts') ? $rule->buyProducts : collect();
        $giftProducts = $rule?->relationLoaded('giftProducts') ? $rule->giftProducts : collect();

        $buyQty = 1;
        $giftQty = 1;

        if ($buyProducts->isNotEmpty()) {
            $buyQty = (int) ($buyProducts->first()?->pivot?->buy_qty ?? 1);
        }
        if ($giftProducts->isNotEmpty()) {
            $giftQty = (int) ($giftProducts->first()?->pivot?->gift_qty ?? 1);
        }

        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'condition_type' => $rule?->condition_type ?? 'order_amount',
            'min_order_amount' => $rule?->min_order_amount !== null ? (float) $rule->min_order_amount : null,
            'max_sets_per_order' => $rule?->max_sets_per_order !== null ? (int) $rule->max_sets_per_order : null,
            'starts_at' => optional($this->starts_at)->format('Y-m-d\\TH:i'),
            'ends_at' => optional($this->ends_at)->format('Y-m-d\\TH:i'),
            'priority' => (int) ($this->priority ?? 100),
            'is_active' => (bool) $this->is_active,
            'stackable' => (bool) $this->stackable,
            'buy_product_ids' => $buyProducts->pluck('id')->values(),
            'gift_product_ids' => $giftProducts->pluck('id')->values(),
            'buy_qty' => $buyQty,
            'gift_qty' => $giftQty,
            'rules_count' => $rules->count(),
            'rules' => $rules->map(function ($item) {
                $buyProducts = $item->relationLoaded('buyProducts') ? $item->buyProducts : collect();
                $giftProducts = $item->relationLoaded('giftProducts') ? $item->giftProducts : collect();

                return [
                    'id' => (int) $item->id,
                    'condition_type' => $item->condition_type ?? 'order_amount',
                    'min_order_amount' => $item->min_order_amount !== null ? (float) $item->min_order_amount : null,
                    'max_sets_per_order' => $item->max_sets_per_order !== null ? (int) $item->max_sets_per_order : null,
                    'priority' => (int) ($item->priority ?? 100),
                    'is_active' => (bool) $item->is_active,
                    'stackable' => (bool) $item->stackable,
                    'buy_product_ids' => $buyProducts->pluck('id')->values(),
                    'gift_product_ids' => $giftProducts->pluck('id')->values(),
                    'buy_qty' => (int) ($buyProducts->first()?->pivot?->buy_qty ?? 1),
                    'gift_qty' => (int) ($giftProducts->first()?->pivot?->gift_qty ?? 1),
                ];
            })->values(),
            'created_at' => optional($this->created_at)->format('Y-m-d H:i:s'),
        ];
    }
}
