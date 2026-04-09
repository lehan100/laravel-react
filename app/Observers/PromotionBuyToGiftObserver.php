<?php

namespace App\Observers;

use App\Models\Promotion\PromotionBuyToGiftOffer;
use Illuminate\Support\Facades\Log;

class PromotionBuyToGiftObserver
{
    public function creating(PromotionBuyToGiftOffer $offer): void
    {
        if (!empty($offer->code)) {
            $offer->code = mb_strtoupper(trim((string) $offer->code));
        }
    }

    public function updating(PromotionBuyToGiftOffer $offer): void
    {
        if (!empty($offer->code)) {
            $offer->code = mb_strtoupper(trim((string) $offer->code));
        }
    }

    public function created(PromotionBuyToGiftOffer $offer): void
    {
        Log::info('--- NEW BUY TO GIFT CREATED ---', [
            'id' => $offer->id,
            'code' => $offer->code,
            'condition_type' => $offer->condition_type,
            'min_order_amount' => $offer->min_order_amount,
        ]);
    }
}

