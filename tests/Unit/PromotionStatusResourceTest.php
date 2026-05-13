<?php

namespace Tests\Unit;

use App\Http\Resources\Promotion\BuyToGiftResource;
use App\Http\Resources\Promotion\CouponResource;
use App\Http\Resources\Promotion\PromotionCampaignResource;
use App\Http\Resources\Promotion\SaleOfferResource;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionCampaign;
use App\Models\Promotion\PromotionCoupon;
use App\Models\Promotion\PromotionSaleOffer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PromotionStatusResourceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_resolves_campaign_statuses_from_dates_and_activity(): void
    {
        $upcoming = PromotionCampaign::query()->create([
            'starts_at' => now()->addDay(),
            'ends_at' => now()->addDays(2),
            'is_active' => true,
        ]);

        $expired = PromotionCampaign::query()->create([
            'starts_at' => now()->subDays(3),
            'ends_at' => now()->subDay(),
            'is_active' => true,
        ]);

        $this->assertSame('upcoming', PromotionCampaignResource::make($upcoming)->resolve()['promotion_status']);
        $this->assertSame('expired', PromotionCampaignResource::make($expired)->resolve()['promotion_status']);
    }

    #[Test]
    public function it_does_not_lazy_load_campaign_translations_or_slugs_when_resolving(): void
    {
        $campaign = PromotionCampaign::query()->create([
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
        ]);

        DB::flushQueryLog();
        DB::enableQueryLog();

        $resolved = PromotionCampaignResource::make($campaign)->resolve();

        $this->assertSame(0, count(DB::getQueryLog()));
        $this->assertSame('', $resolved['slug']);
        $this->assertSame('', $resolved['name']);
    }

    #[Test]
    public function it_resolves_coupon_statuses_from_dates_and_activity(): void
    {
        $active = PromotionCoupon::query()->create([
            'code' => 'COUPON-STATUS-001',
            'name' => 'Coupon active',
            'discount_type' => 'fixed',
            'discount_value' => 10000,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'is_public' => true,
            'stackable' => false,
        ]);

        $this->assertSame('active', CouponResource::make($active)->resolve()['promotion_status']);
    }

    #[Test]
    public function it_resolves_sale_offer_statuses_from_dates_and_activity(): void
    {
        $expired = PromotionSaleOffer::query()->create([
            'code' => 'SALE-STATUS-001',
            'name' => 'Sale expired',
            'discount_type' => 'percent',
            'discount_value' => 15,
            'priority' => 1,
            'starts_at' => now()->subDays(3),
            'ends_at' => now()->subDay(),
            'is_active' => true,
            'stackable' => true,
        ]);

        $this->assertSame('expired', SaleOfferResource::make($expired)->resolve()['promotion_status']);
    }

    #[Test]
    public function it_resolves_buy_to_gift_statuses_from_dates_and_activity(): void
    {
        $inactive = PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-STATUS-001',
            'name' => 'Gift paused',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => false,
            'stackable' => false,
        ]);

        $this->assertSame('inactive', BuyToGiftResource::make($inactive)->resolve()['promotion_status']);
    }

    #[Test]
    public function it_treats_naive_promotion_dates_as_admin_local_time_when_resolving_status(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 5, 8, 9, 0, 0, 'UTC'));

        try {
            $item = PromotionBuyToGiftOffer::query()->create([
                'code' => 'GIFT-STATUS-LOCAL-001',
                'name' => 'Gift local time',
                'priority' => 1,
                'starts_at' => '2026-05-08 15:00:00',
                'ends_at' => '2026-05-08 23:00:00',
                'is_active' => true,
                'stackable' => false,
            ]);

            $this->assertSame('active', BuyToGiftResource::make($item)->resolve()['promotion_status']);
        } finally {
            Carbon::setTestNow();
        }
    }
}
