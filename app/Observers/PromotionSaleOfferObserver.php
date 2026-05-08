<?php

namespace App\Observers;

use App\Models\Promotion\PromotionSaleOffer;
use Illuminate\Support\Facades\Log;

class PromotionSaleOfferObserver
{
    public function creating(PromotionSaleOffer $saleOffer): void
    {
        if (! empty($saleOffer->code)) {
            $saleOffer->code = mb_strtoupper(trim((string) $saleOffer->code));
        }
    }

    public function updating(PromotionSaleOffer $saleOffer): void
    {
        if (! empty($saleOffer->code)) {
            $saleOffer->code = mb_strtoupper(trim((string) $saleOffer->code));
        }
    }

    public function deleting(PromotionSaleOffer $saleOffer): void
    {
        if ($saleOffer->campaign_id === null) {
            return;
        }

        $saleOffer->newQuery()
            ->whereKey($saleOffer->getKey())
            ->update(['campaign_id' => null]);
    }

    public function created(PromotionSaleOffer $saleOffer): void
    {
        Log::info('--- NEW SALE OFFER CREATED ---', [
            'id' => $saleOffer->id,
            'code' => $saleOffer->code,
            'discount_type' => $saleOffer->discount_type,
            'discount_value' => $saleOffer->discount_value,
        ]);
    }
}
