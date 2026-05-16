<?php

namespace App\Http\Resources\Catalog;

use App\Http\Resources\Concerns\LoadsRelationCollections;
use App\Models\Catalog\ProductVariant;
use App\Models\Promotion\PromotionCampaign;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductPickerResource extends JsonResource
{
    use LoadsRelationCollections;

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $translations = $this->loadedCollection('translations');
        $categories = $this->loadedCollection('categories');
        $campaigns = $this->loadedCollection('promotionCampaigns');
        $stockAllocations = $this->loadedCollection('buyToGiftStockAllocations');
        $variants = $this->loadedCollection('variants');
        $name = optional($translations->first())->name ?: ($this->sku ?: ('#'.$this->id));

        return [
            'id' => (int) $this->id,
            'sku' => $this->sku,
            'price' => (float) ($this->price ?? 0),
            'quantity' => (int) ($this->is_stock ?? 0) === 1 ? (int) ($this->quantity ?? 0) : 0,
            'sold_quantity' => (int) ($this->sold_quantity ?? 0),
            'reserved_quantity' => (int) $stockAllocations->sum('allocated_quantity'),
            'is_stock' => (int) ($this->is_stock ?? 0),
            'status' => (int) ($this->status ?? 0),
            'name' => $name,
            'category_ids' => $categories->pluck('id')->map(fn ($id) => (int) $id)->values()->all(),
            'has_variants' => $variants->isNotEmpty(),
            'variants' => $variants->map(function (ProductVariant $variant): array {
                $variantTranslations = $variant->relationLoaded('translations') ? $variant->translations : collect();
                $variantName = optional($variantTranslations->first())->name ?: ($variant->sku ?: ('Variant #'.$variant->id));

                return [
                    'id' => (int) $variant->id,
                    'sku' => $variant->sku,
                    'name' => $variantName,
                    'label' => $variantName,
                    'price' => (float) ($variant->price ?? 0),
                    'stock' => (int) ($variant->stock ?? 0),
                ];
            })->values()->all(),
            'campaigns' => $campaigns->map(function (PromotionCampaign $campaign): array {
                $translations = $campaign->relationLoaded('translations') ? $campaign->translations : collect();
                $slugs = $campaign->relationLoaded('slugs') ? $campaign->slugs : collect();
                $translation = $translations->first();
                $currentSlug = $slugs->firstWhere('is_default', true) ?? $slugs->first();

                return [
                    'id' => (int) $campaign->id,
                    'name' => $translation?->name ?? ('#'.$campaign->id),
                    'slug' => $currentSlug?->slug ?? '',
                    'ends_at' => optional($campaign->ends_at)->format('Y-m-d H:i:s'),
                    'is_active' => (bool) $campaign->is_active,
                ];
            })->values()->all(),
        ];
    }
}
