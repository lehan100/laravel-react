<?php

namespace App\Http\Resources\Promotion;

use Illuminate\Http\Resources\Json\JsonResource;

class SaleOfferResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'discount_type' => $this->discount_type,
            'discount_value' => (float) $this->discount_value,
            'max_discount_amount' => $this->max_discount_amount !== null ? (float) $this->max_discount_amount : null,
            'starts_at' => optional($this->starts_at)->format('Y-m-d\\TH:i'),
            'ends_at' => optional($this->ends_at)->format('Y-m-d\\TH:i'),
            'priority' => (int) ($this->priority ?? 100),
            'is_active' => (bool) $this->is_active,
            'stackable' => (bool) $this->stackable,
            'product_ids' => $this->whenLoaded('products', fn() => $this->products->pluck('id')->values(), []),
            'created_at' => optional($this->created_at)->format('Y-m-d H:i:s'),
        ];
    }
}
