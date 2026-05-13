<?php

namespace App\Http\Resources\Sales;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $meta = is_array($this->meta) ? $this->meta : [];

        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'product_id' => $this->product_id,
            'variant_id' => $meta['variant']['id'] ?? null,
            'product_name' => $this->product_name,
            'product_sku' => $this->product_sku,
            'quantity' => (int) ($this->quantity ?? 0),
            'unit_price' => $this->unit_price,
            'line_total' => $this->line_total,
            'is_gift' => (bool) ($meta['is_gift'] ?? false),
            'rule_id' => $meta['rule_id'] ?? null,
            'meta' => $meta,
            'created_at' => optional($this->created_at)?->format('Y-m-d H:i:s'),
            'updated_at' => optional($this->updated_at)?->format('Y-m-d H:i:s'),
        ];
    }
}
