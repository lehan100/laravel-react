<?php

namespace App\Observers;

use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Services\Promotion\BuyToGiftStockAllocator;
use Illuminate\Support\Facades\Log;

class PromotionBuyToGiftObserver
{
    public function creating(PromotionBuyToGiftOffer $offer): void
    {
        if (! empty($offer->code)) {
            $offer->code = mb_strtoupper(trim((string) $offer->code));
        }
    }

    public function updating(PromotionBuyToGiftOffer $offer): void
    {
        if (! empty($offer->code)) {
            $offer->code = mb_strtoupper(trim((string) $offer->code));
        }

        if ((bool) $offer->getOriginal('is_active') === (bool) $offer->is_active) {
            return;
        }

        $allocator = app(BuyToGiftStockAllocator::class);

        if ((bool) $offer->is_active) {
            $allocator->syncOffer($offer);

            return;
        }

        $allocator->releaseOffer($offer);
    }

    public function deleting(PromotionBuyToGiftOffer $offer): void
    {
        if ($offer->campaign_id === null) {
            return;
        }

        $offer->newQuery()
            ->whereKey($offer->getKey())
            ->update(['campaign_id' => null]);
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
