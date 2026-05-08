<?php

namespace App\Http\Resources\Promotion;

use App\Http\Resources\Concerns\LoadsRelationCollections;
use App\Http\Resources\Concerns\ResolvesPromotionStatus;
use Illuminate\Http\Resources\Json\JsonResource;

class PromotionCampaignResource extends JsonResource
{
    use LoadsRelationCollections;
    use ResolvesPromotionStatus;

    public function toArray($request): array
    {
        $currentLocale = app()->getLocale();
        $translations = $this->relationLoaded('translations') ? $this->translations : collect();
        $slugs = $this->relationLoaded('slugs') ? $this->slugs : collect();
        $currentTranslation = $translations->firstWhere('locale', $currentLocale) ?? $translations->first();
        $currentSlug = $slugs->firstWhere('locale', $currentLocale);
        $currentDefaultSlug = $currentSlug && (bool) ($currentSlug->is_default ?? false)
            ? $currentSlug
            : ($slugs->firstWhere('is_default', true) ?? $slugs->first());

        return [
            'id' => $this->id,
            'slug' => $currentDefaultSlug?->slug ?? '',
            'name' => $currentTranslation?->name ?? '',
            'description' => $currentTranslation?->description ?? '',
            'starts_at' => optional($this->starts_at)->format('Y-m-d\\TH:i'),
            'ends_at' => optional($this->ends_at)->format('Y-m-d\\TH:i'),
            'priority' => (int) ($this->priority ?? 100),
            'is_active' => (bool) $this->is_active,
            'promotion_status' => $this->resolvePromotionStatus((bool) $this->is_active, $this->starts_at, $this->ends_at),
            'product_ids' => $this->whenLoaded('products', fn () => $this->products->pluck('id')->values(), []),
            'coupon_ids' => $this->whenLoaded('coupons', fn () => $this->coupons->pluck('id')->values(), []),
            'saleoffer_ids' => $this->whenLoaded('saleOffers', fn () => $this->saleOffers->pluck('id')->values(), []),
            'buytogift_ids' => $this->whenLoaded('buyToGiftOffers', fn () => $this->buyToGiftOffers->pluck('id')->values(), []),
            'translations' => $translations->mapWithKeys(function ($item) use ($slugs): array {
                $slugLocale = $slugs->where('locale', $item->locale)->whereNull('redirect_to')->where('is_default', true)->first();

                return [
                    $item->locale => [
                        'name' => $item->name ?? '',
                        'description' => $item->description ?? '',
                        'slug' => $slugLocale ? $slugLocale->slug : '',
                    ],
                ];
            }),
            'public_url' => url('/flash-sale/'.($currentDefaultSlug?->slug ?? '')),
            'created_at' => optional($this->created_at)->format('Y-m-d H:i:s'),
        ];
    }
}
