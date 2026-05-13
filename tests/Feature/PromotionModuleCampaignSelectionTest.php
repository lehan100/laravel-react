<?php

namespace Tests\Feature;

use App\Models\Catalog\Product;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionCampaign;
use App\Models\Promotion\PromotionCoupon;
use App\Models\Promotion\PromotionSaleOffer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PromotionModuleCampaignSelectionTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_exposes_campaign_options_on_promotion_module_create_pages(): void
    {
        $this->withoutMiddleware();

        $this->createCampaign(
            now()->addDays(3)->startOfMinute(),
            [
                'vi' => [
                    'name' => 'Flash Sale',
                    'slug' => 'flash-sale',
                    'description' => 'Campaign description',
                ],
            ],
        );

        $this->get(route('coupon.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Promotion/Coupon/Created')
                ->has('itemsCampaignActive.0')
            );

        $this->get(route('saleoffer.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Promotion/SaleOffer/Created')
                ->has('itemsCampaignActive.0')
            );

        $this->get(route('buytogift.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Promotion/BuyToGift/Created')
                ->has('itemsCampaignActive.0')
            );
    }

    #[Test]
    public function it_exposes_promotion_module_options_on_campaign_create_page(): void
    {
        $this->withoutMiddleware();

        $campaign = $this->createCampaign(
            now()->addDays(3)->startOfMinute(),
            [
                'vi' => [
                    'name' => 'Flash Sale',
                    'slug' => 'flash-sale',
                    'description' => 'Campaign description',
                ],
            ],
        );

        PromotionCoupon::query()->create([
            'code' => 'COUPON-OPTION-001',
            'name' => 'Coupon Option Low',
            'discount_type' => 'fixed',
            'discount_value' => 25000,
            'priority' => 20,
            'starts_at' => now()->subDay(),
            'ends_at' => $campaign->ends_at,
            'is_active' => true,
            'is_public' => true,
            'stackable' => false,
        ]);

        PromotionCoupon::query()->create([
            'code' => 'COUPON-OPTION-002',
            'name' => 'Coupon Option High',
            'discount_type' => 'fixed',
            'discount_value' => 25000,
            'priority' => 5,
            'starts_at' => now()->subDay(),
            'ends_at' => $campaign->ends_at,
            'is_active' => true,
            'is_public' => true,
            'stackable' => false,
        ]);

        PromotionSaleOffer::query()->create([
            'code' => 'SALE-OPTION-001',
            'name' => 'Sale Option Low',
            'discount_type' => 'percent',
            'discount_value' => 10,
            'priority' => 20,
            'starts_at' => now()->subDay(),
            'ends_at' => $campaign->ends_at,
            'is_active' => true,
            'stackable' => true,
        ]);

        PromotionSaleOffer::query()->create([
            'code' => 'SALE-OPTION-002',
            'name' => 'Sale Option High',
            'discount_type' => 'percent',
            'discount_value' => 20,
            'priority' => 5,
            'starts_at' => now()->subDay(),
            'ends_at' => $campaign->ends_at,
            'is_active' => true,
            'stackable' => true,
        ]);

        PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-OPTION-001',
            'name' => 'Gift Option Low',
            'description' => 'Gift option description',
            'priority' => 20,
            'starts_at' => now()->subDay(),
            'ends_at' => $campaign->ends_at,
            'is_active' => true,
            'stackable' => false,
        ]);

        PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-OPTION-002',
            'name' => 'Gift Option High',
            'description' => 'Gift option description',
            'priority' => 5,
            'starts_at' => now()->subDay(),
            'ends_at' => $campaign->ends_at,
            'is_active' => true,
            'stackable' => false,
        ]);

        $response = $this->get(route('promotion-campaign.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/PromotionCampaign/Created')
            ->has('itemsCouponActive.0')
            ->has('itemsSaleOfferActive.0')
            ->has('itemsBuyToGiftActive.0')
            ->where('itemsCouponActive.0.name', 'Coupon Option High')
            ->where('itemsSaleOfferActive.0.name', 'Sale Option High')
            ->where('itemsBuyToGiftActive.0.name', 'Gift Option High')
        );
    }

    #[Test]
    public function it_auto_sets_coupon_end_date_from_campaign(): void
    {
        $this->withoutMiddleware();

        $campaign = $this->createCampaign(
            now()->addDays(5)->startOfMinute(),
            [
                'vi' => [
                    'name' => 'Coupon Campaign',
                    'slug' => 'coupon-campaign',
                    'description' => 'Coupon campaign description',
                ],
            ],
        );

        $response = $this->post(route('coupon.store'), [
            'code' => 'COUPON-001',
            'name' => 'Coupon One',
            'description' => 'Coupon description',
            'campaign_id' => $campaign->id,
            'discount_type' => 'fixed',
            'discount_value' => 25000,
            'max_discount_amount' => '',
            'min_order_amount' => '',
            'max_order_amount' => '',
            'first_order_only' => false,
            'usage_limit_total' => '',
            'usage_limit_per_user' => '',
            'starts_at' => '',
            'ends_at' => '',
            'category_ids' => [],
            'product_ids' => [],
            'is_active' => true,
            'is_public' => true,
            'stackable' => false,
            'undo' => 0,
        ]);

        $response->assertRedirect();

        $coupon = PromotionCoupon::query()->firstOrFail();

        $this->assertDatabaseHas('promotion_coupons', [
            'id' => $coupon->id,
            'campaign_id' => $campaign->id,
            'starts_at' => $campaign->starts_at->format('Y-m-d H:i:s'),
            'ends_at' => $campaign->ends_at->format('Y-m-d H:i:s'),
        ]);
    }

    #[Test]
    public function it_auto_sets_sale_offer_end_date_from_campaign(): void
    {
        $this->withoutMiddleware();

        $campaign = $this->createCampaign(
            now()->addDays(7)->startOfMinute(),
            [
                'vi' => [
                    'name' => 'Sale Campaign',
                    'slug' => 'sale-campaign',
                    'description' => 'Sale campaign description',
                ],
            ],
        );

        $response = $this->post(route('saleoffer.store'), [
            'code' => 'SALE-001',
            'name' => 'Sale One',
            'description' => 'Sale description',
            'campaign_id' => $campaign->id,
            'discount_type' => 'percent',
            'discount_value' => 10,
            'max_discount_amount' => '',
            'starts_at' => '',
            'ends_at' => '',
            'priority' => 1,
            'product_ids' => [],
            'is_active' => true,
            'stackable' => false,
            'undo' => 0,
        ]);

        $response->assertRedirect();

        $saleOffer = PromotionSaleOffer::query()->firstOrFail();

        $this->assertDatabaseHas('promotion_saleoffers', [
            'id' => $saleOffer->id,
            'campaign_id' => $campaign->id,
            'starts_at' => $campaign->starts_at->format('Y-m-d H:i:s'),
            'ends_at' => $campaign->ends_at->format('Y-m-d H:i:s'),
        ]);
    }

    #[Test]
    public function it_auto_sets_buy_to_gift_end_date_from_campaign(): void
    {
        $this->withoutMiddleware();

        $campaign = $this->createCampaign(
            now()->addDays(9)->startOfMinute(),
            [
                'vi' => [
                    'name' => 'Gift Campaign',
                    'slug' => 'gift-campaign',
                    'description' => 'Gift campaign description',
                ],
            ],
        );

        $buyProduct = Product::query()->create([
            'sku' => 'BUY-001',
            'price' => 100000,
            'status' => 1,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-001',
            'price' => 50000,
            'status' => 1,
        ]);

        $response = $this->post(route('buytogift.store'), [
            'code' => 'GIFT-001',
            'name' => 'Gift One',
            'description' => 'Gift description',
            'campaign_id' => $campaign->id,
            'condition_type' => 'buy_product',
            'min_order_amount' => '',
            'max_sets_per_order' => '',
            'starts_at' => '',
            'ends_at' => '',
            'priority' => 100,
            'buy_product_ids' => [$buyProduct->id],
            'buy_qty' => 1,
            'gift_product_ids' => [$giftProduct->id],
            'gift_qty' => 1,
            'rules' => [
                [
                    'id' => null,
                    'condition_type' => 'buy_product',
                    'min_order_amount' => '',
                    'max_sets_per_order' => '',
                    'buy_product_ids' => [$buyProduct->id],
                    'buy_qty' => 1,
                    'gift_product_ids' => [$giftProduct->id],
                    'gift_qty' => 1,
                    'is_active' => true,
                    'stackable' => false,
                ],
            ],
            'is_active' => true,
            'stackable' => false,
            'undo' => 0,
        ]);

        $response->assertRedirect();

        $offer = PromotionBuyToGiftOffer::query()->firstOrFail();

        $this->assertDatabaseHas('promotion_buytogift_offers', [
            'id' => $offer->id,
            'campaign_id' => $campaign->id,
            'starts_at' => $campaign->starts_at->format('Y-m-d H:i:s'),
            'ends_at' => $campaign->ends_at->format('Y-m-d H:i:s'),
        ]);
    }

    #[Test]
    public function it_assigns_selected_modules_to_campaign_when_saving(): void
    {
        $this->withoutMiddleware();

        $coupon = PromotionCoupon::query()->create([
            'code' => 'COUPON-ASSIGN-001',
            'name' => 'Coupon Assign',
            'discount_type' => 'fixed',
            'discount_value' => 25000,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'is_public' => true,
            'stackable' => false,
        ]);

        $saleOffer = PromotionSaleOffer::query()->create([
            'code' => 'SALE-ASSIGN-001',
            'name' => 'Sale Assign',
            'discount_type' => 'percent',
            'discount_value' => 10,
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => true,
        ]);

        $buyToGift = PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-ASSIGN-001',
            'name' => 'Gift Assign',
            'description' => 'Gift assign description',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $response = $this->post(route('promotion-campaign.store'), [
            'translations' => [
                'vi' => [
                    'name' => 'Campaign Assign',
                    'slug' => 'campaign-assign',
                    'description' => 'Campaign assign description',
                ],
            ],
            'starts_at' => now()->subHour()->format('Y-m-d H:i:s'),
            'ends_at' => now()->addDay()->format('Y-m-d H:i:s'),
            'priority' => 10,
            'coupon_ids' => [$coupon->id],
            'saleoffer_ids' => [$saleOffer->id],
            'buytogift_ids' => [$buyToGift->id],
            'sync_module_ends_at' => true,
            'is_active' => true,
            'undo' => 0,
        ]);

        $response->assertRedirect();

        $campaign = PromotionCampaign::query()->firstOrFail();

        $this->assertDatabaseHas('promotion_coupons', [
            'id' => $coupon->id,
            'campaign_id' => $campaign->id,
            'starts_at' => $campaign->starts_at->format('Y-m-d H:i:s'),
            'ends_at' => $campaign->ends_at->format('Y-m-d H:i:s'),
        ]);

        $this->assertDatabaseHas('promotion_saleoffers', [
            'id' => $saleOffer->id,
            'campaign_id' => $campaign->id,
            'starts_at' => $campaign->starts_at->format('Y-m-d H:i:s'),
            'ends_at' => $campaign->ends_at->format('Y-m-d H:i:s'),
        ]);

        $this->assertDatabaseHas('promotion_buytogift_offers', [
            'id' => $buyToGift->id,
            'campaign_id' => $campaign->id,
            'starts_at' => $campaign->starts_at->format('Y-m-d H:i:s'),
            'ends_at' => $campaign->ends_at->format('Y-m-d H:i:s'),
        ]);
    }

    private function createCampaign(\DateTimeInterface $endsAt, array $translations): PromotionCampaign
    {
        $campaign = PromotionCampaign::query()->create([
            'description' => null,
            'starts_at' => now()->subDay(),
            'ends_at' => $endsAt,
            'priority' => 100,
            'is_active' => true,
        ]);

        foreach ($translations as $locale => $translation) {
            $campaignTranslation = $campaign->translateOrNew($locale);
            $campaignTranslation->fill([
                'name' => $translation['name'] ?? '',
                'description' => $translation['description'] ?? null,
            ]);
            $campaignTranslation->save();

            if (! empty($translation['slug'])) {
                $campaign->slugs()->create([
                    'slug' => $translation['slug'],
                    'locale' => $locale,
                    'status' => 1,
                    'is_default' => true,
                    'redirect_to' => null,
                ]);
            }
        }

        return $campaign->fresh(['translations', 'slugs']) ?? $campaign;
    }
}
