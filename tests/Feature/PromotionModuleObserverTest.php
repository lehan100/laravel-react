<?php

namespace Tests\Feature;

use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionCampaign;
use App\Models\Promotion\PromotionCoupon;
use App\Models\Promotion\PromotionSaleOffer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PromotionModuleObserverTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_detaches_campaign_from_coupon_when_coupon_is_deleted(): void
    {
        $campaign = $this->createCampaign('coupon-campaign', 'Coupon Campaign');
        $coupon = PromotionCoupon::query()->create([
            'code' => 'COUPON-OBSERVER-001',
            'name' => 'Coupon Observer',
            'campaign_id' => $campaign->id,
            'discount_type' => 'fixed',
            'discount_value' => 10000,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'is_public' => true,
            'stackable' => false,
        ]);

        $coupon->delete();

        $this->assertSoftDeleted('promotion_coupons', ['id' => $coupon->id]);
        $this->assertDatabaseHas('promotion_coupons', [
            'id' => $coupon->id,
            'campaign_id' => null,
        ]);
    }

    #[Test]
    public function it_detaches_campaign_from_sale_offer_when_sale_offer_is_deleted(): void
    {
        $campaign = $this->createCampaign('sale-campaign', 'Sale Campaign');
        $saleOffer = PromotionSaleOffer::query()->create([
            'code' => 'SALE-OBSERVER-001',
            'name' => 'Sale Observer',
            'campaign_id' => $campaign->id,
            'discount_type' => 'percent',
            'discount_value' => 15,
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => true,
        ]);

        $saleOffer->delete();

        $this->assertSoftDeleted('promotion_saleoffers', ['id' => $saleOffer->id]);
        $this->assertDatabaseHas('promotion_saleoffers', [
            'id' => $saleOffer->id,
            'campaign_id' => null,
        ]);
    }

    #[Test]
    public function it_detaches_campaign_from_buy_to_gift_when_offer_is_deleted(): void
    {
        $campaign = $this->createCampaign('gift-campaign', 'Gift Campaign');
        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-OBSERVER-001',
            'name' => 'Gift Observer',
            'description' => 'Gift observer description',
            'campaign_id' => $campaign->id,
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $offer->delete();

        $this->assertSoftDeleted('promotion_buytogift_offers', ['id' => $offer->id]);
        $this->assertDatabaseHas('promotion_buytogift_offers', [
            'id' => $offer->id,
            'campaign_id' => null,
        ]);
    }

    private function createCampaign(string $slug, string $name): PromotionCampaign
    {
        $campaign = PromotionCampaign::query()->create([
            'description' => null,
            'starts_at' => now()->subHour(),
            'ends_at' => now()->addDay(),
            'priority' => 100,
            'is_active' => true,
        ]);

        $campaign->translateOrNew('vi')->fill([
            'name' => $name,
            'description' => null,
        ])->save();

        if (Schema::hasTable('slugs')) {
            $campaign->slugs()->create([
                'slug' => $slug,
                'locale' => 'vi',
                'status' => 1,
                'is_default' => true,
                'redirect_to' => null,
            ]);
        }

        return $campaign;
    }
}
