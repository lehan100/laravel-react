<?php

namespace App\Http\Resources\Sales;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $meta = is_array($this->meta) ? $this->meta : [];

        $product = $this->relationLoaded('product') ? $this->product : null;
        $productName = $this->product_name;

        if ($product) {
            $locale = strtolower((string) app()->getLocale());
            $translation = $product->translations->firstWhere('locale', $locale);
            if ($translation && ! empty($translation->name)) {
                $productName = $translation->name;

                // Append localized variant name if this item is a variant
                $variantId = $meta['variant']['id'] ?? null;
                if ($variantId) {
                    $variant = $product->variants->firstWhere('id', $variantId);
                    if ($variant) {
                        $variantName = $variant->getLocalizedName($locale);
                        if (! empty($variantName)) {
                            $productName .= ' - '.$variantName;
                        }
                    }
                }
            }
        }

        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'product_id' => $this->product_id,
            'variant_id' => $meta['variant']['id'] ?? null,
            'product_name' => $productName,
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
