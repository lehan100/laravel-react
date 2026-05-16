<?php

namespace App\Observers;

use App\Models\Promotion\PromotionCampaign;

class PromotionCampaignObserver
{
    public function updated(PromotionCampaign $campaign): void
    {
        if (! $campaign->wasChanged('is_active')) {
            return;
        }

        $campaign->loadMissing([
            'coupons',
            'saleOffers',
            'buyToGiftOffers',
        ]);

        $isActive = (bool) $campaign->is_active;

        $campaign->coupons->each(function ($coupon) use ($isActive): void {
            if ((bool) $coupon->is_active === $isActive) {
                return;
            }

            $coupon->is_active = $isActive;
            $coupon->save();
        });

        $campaign->saleOffers->each(function ($saleOffer) use ($isActive): void {
            if ((bool) $saleOffer->is_active === $isActive) {
                return;
            }

            $saleOffer->is_active = $isActive;
            $saleOffer->save();
        });

        $campaign->buyToGiftOffers->each(function ($buyToGiftOffer) use ($isActive): void {
            if ((bool) $buyToGiftOffer->is_active === $isActive) {
                return;
            }

            $buyToGiftOffer->is_active = $isActive;
            $buyToGiftOffer->save();
        });
    }
}
