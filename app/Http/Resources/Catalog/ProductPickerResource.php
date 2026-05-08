<?php

namespace App\Http\Resources\Catalog;

use App\Http\Resources\Concerns\LoadsRelationCollections;
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
        $name = optional($translations->first())->name ?: ($this->sku ?: ('#'.$this->id));

        return [
            'id' => (int) $this->id,
            'sku' => $this->sku,
            'price' => (float) ($this->price ?? 0),
            'quantity' => (int) ($this->is_stock ?? 0) === 1 ? (int) ($this->quantity ?? 0) : 0,
            'is_stock' => (int) ($this->is_stock ?? 0),
            'status' => (int) ($this->status ?? 0),
            'name' => $name,
            'category_ids' => $categories->pluck('id')->map(fn ($id) => (int) $id)->values()->all(),
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
