<?php

namespace App\Http\Resources\Promotion;

use Illuminate\Http\Resources\Json\JsonResource;

class BuyToGiftResource extends JsonResource
{
    public function toArray($request): array
    {
        $buyQty = 1;
        $giftQty = 1;

        if ($this->relationLoaded('buyProducts') && $this->buyProducts->isNotEmpty()) {
            $buyQty = (int) ($this->buyProducts->first()?->pivot?->buy_qty ?? 1);
        }
        if ($this->relationLoaded('giftProducts') && $this->giftProducts->isNotEmpty()) {
            $giftQty = (int) ($this->giftProducts->first()?->pivot?->gift_qty ?? 1);
        }

        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'condition_type' => $this->condition_type,
            'min_order_amount' => $this->min_order_amount !== null ? (float) $this->min_order_amount : null,
            'max_sets_per_order' => $this->max_sets_per_order !== null ? (int) $this->max_sets_per_order : null,
            'starts_at' => optional($this->starts_at)->format('Y-m-d\\TH:i'),
            'ends_at' => optional($this->ends_at)->format('Y-m-d\\TH:i'),
            'priority' => (int) ($this->priority ?? 100),
            'is_active' => (bool) $this->is_active,
            'stackable' => (bool) $this->stackable,
            'buy_product_ids' => $this->whenLoaded('buyProducts', fn() => $this->buyProducts->pluck('id')->values(), []),
            'gift_product_ids' => $this->whenLoaded('giftProducts', fn() => $this->giftProducts->pluck('id')->values(), []),
            'buy_qty' => $buyQty,
            'gift_qty' => $giftQty,
            'created_at' => optional($this->created_at)->format('Y-m-d H:i:s'),
        ];
    }
}
