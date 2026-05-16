<?php

namespace App\Http\Resources\Sales;

use App\Models\Catalog\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WarehouseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        if ($this->resource instanceof ProductVariant) {
            return $this->variantToArray();
        }

        return [
            'id' => $this->id,
            'type' => 'product',
            'sku' => $this->sku,
            'name' => $this->localizedName(),
            'quantity' => (int) ($this->quantity ?? 0),
            'price' => $this->price,
            'is_stock' => (bool) $this->is_stock,
            'status' => $this->status,
            'variants_count' => $this->whenLoaded('variants', fn () => $this->variants->count(), 0),
            'variants' => $this->whenLoaded('variants', fn () => $this->variants->map(fn (ProductVariant $variant): array => $this->variantToArray($variant))->values()),
            'updated_at' => optional($this->updated_at)?->format('Y-m-d H:i:s'),
        ];
    }

    private function variantToArray(?ProductVariant $variant = null): array
    {
        $variant ??= $this->resource;
        $product = $variant->relationLoaded('product') ? $variant->product : null;

        return [
            'id' => $variant->id,
            'type' => 'variant',
            'product_id' => $variant->product_id,
            'product_sku' => $product?->sku,
            'product_name' => $this->localizedProductName($product),
            'sku' => $variant->sku,
            'name' => $this->localizedVariantName($variant),
            'quantity' => (int) ($variant->stock ?? 0),
            'price' => $variant->price,
            'is_stock' => (int) ($variant->stock ?? 0) > 0,
            'status' => $product?->status,
            'updated_at' => optional($variant->updated_at)?->format('Y-m-d H:i:s'),
        ];
    }

    private function localizedName(): ?string
    {
        if ($this->relationLoaded('translations')) {
            $translation = $this->translations->first();

            if ($translation?->name) {
                return $translation->name;
            }
        }

        return $this->name ?? null;
    }

    private function localizedVariantName(ProductVariant $variant): ?string
    {
        if ($variant->relationLoaded('translations')) {
            $translation = $variant->translations->first();

            if ($translation?->name) {
                return $translation->name;
            }
        }

        if ($variant->relationLoaded('attributeValues')) {
            $attributes = $variant->attributeValues
                ->map(function ($value): ?string {
                    $label = $value->relationLoaded('translations') && $value->translations->first()?->value
                        ? $value->translations->first()->value
                        : ($value->value ?? null);

                    return is_string($label) && trim($label) !== '' ? trim($label) : null;
                })
                ->filter()
                ->values();

            if ($attributes->isNotEmpty()) {
                return $attributes->implode(' / ');
            }
        }

        return $variant->sku;
    }

    private function localizedProductName(mixed $product): ?string
    {
        if (! $product) {
            return null;
        }

        if ($product->relationLoaded('translations')) {
            $translation = $product->translations->first();

            if ($translation?->name) {
                return $translation->name;
            }
        }

        return $product->name ?? null;
    }
}
