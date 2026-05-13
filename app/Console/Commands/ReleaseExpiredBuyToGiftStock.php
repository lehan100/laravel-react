<?php

namespace App\Console\Commands;

use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Services\Promotion\BuyToGiftStockAllocator;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('promotion:buytogift-release-expired-stock')]
#[Description('Release reserved BuyToGift stock for expired promotions')]
class ReleaseExpiredBuyToGiftStock extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(BuyToGiftStockAllocator $allocator): int
    {
        $releasedOffers = 0;

        PromotionBuyToGiftOffer::query()
            ->select(['id', 'ends_at', 'is_active'])
            ->whereNotNull('ends_at')
            ->where('ends_at', '<=', now()->format('Y-m-d H:i:s'))
            ->orderBy('id')
            ->get()
            ->each(function ($offer) use (&$releasedOffers, $allocator): void {
                $offer->load([
                    'rules.giftProducts',
                    'rules.stockAllocations',
                ]);

                $hasReservedStock = $offer->rules->contains(function ($rule): bool {
                    return $rule->stockAllocations->isNotEmpty();
                });

                DB::transaction(function () use ($allocator, $offer): void {
                    $allocator->releaseOffer($offer);
                });

                if ($hasReservedStock) {
                    $releasedOffers++;
                }
            });

        if ($this->output) {
            $this->info($releasedOffers > 0
                ? "Released reserved stock for {$releasedOffers} expired BuyToGift promotion(s)."
                : 'No expired BuyToGift promotions needed stock release.'
            );
        }

        return self::SUCCESS;
    }
}
