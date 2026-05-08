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

class PromotionCampaignModuleTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_renders_the_campaign_index_page(): void
    {
        $this->withoutMiddleware();

        $this->createCampaign([
            'ends_at' => now()->addDay(),
            'priority' => 10,
            'is_active' => true,
        ], [
            'vi' => [
                'name' => 'Flash Sale 01',
                'slug' => 'flash-sale-01',
                'description' => 'Campaign description vi',
            ],
        ]);

        $response = $this->get(route('promotion-campaign.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/PromotionCampaign/Index')
            ->has('items.data')
            ->where('items.data.0.name', 'Flash Sale 01')
            ->has('items.data.0.ends_at')
            ->where('items.data.0.is_active', true)
            ->where('items.data.0.promotion_status', 'active')
        );
    }

    #[Test]
    public function it_renders_the_campaign_edit_page_even_without_selected_modules(): void
    {
        $this->withoutMiddleware();

        $campaign = $this->createCampaign([
            'ends_at' => now()->addDay(),
            'priority' => 10,
            'is_active' => true,
        ], [
            'vi' => [
                'name' => 'Flash Sale Empty',
                'slug' => 'flash-sale-empty',
                'description' => 'Campaign description vi',
            ],
        ]);

        $response = $this->get(route('promotion-campaign.edit', $campaign->id));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/PromotionCampaign/Edit')
            ->has('item')
        );
    }

    #[Test]
    public function it_creates_a_campaign_with_translations_and_syncs_products(): void
    {
        $this->withoutMiddleware();

        $product = Product::query()->create([
            'sku' => 'PROMO-001',
            'price' => 125000,
            'status' => 1,
        ]);

        $response = $this->post(route('promotion-campaign.store'), [
            'translations' => [
                'vi' => [
                    'name' => 'Flash Sale 02',
                    'slug' => 'flash-sale-02',
                    'description' => 'Campaign description vi',
                ],
                'en' => [
                    'name' => 'Flash Sale 02 EN',
                    'slug' => 'flash-sale-02-en',
                    'description' => 'Campaign description en',
                ],
            ],
            'description' => 'Campaign description',
            'starts_at' => null,
            'ends_at' => now()->addDay()->format('Y-m-d H:i:s'),
            'priority' => 10,
            'product_ids' => [$product->id],
            'is_active' => true,
            'undo' => 0,
        ]);

        $response->assertRedirect();

        $campaign = PromotionCampaign::query()->with(['translations', 'slugs'])->firstOrFail();

        $this->assertDatabaseHas('promotion_campaign_translations', [
            'promotion_campaign_id' => $campaign->id,
            'locale' => 'vi',
            'name' => 'Flash Sale 02',
            'description' => 'Campaign description vi',
        ]);

        $this->assertDatabaseHas('promotion_campaign_translations', [
            'promotion_campaign_id' => $campaign->id,
            'locale' => 'en',
            'name' => 'Flash Sale 02 EN',
            'description' => 'Campaign description en',
        ]);

        $this->assertDatabaseHas('slugs', [
            'sluggable_id' => $campaign->id,
            'sluggable_type' => PromotionCampaign::class,
            'locale' => 'vi',
            'slug' => 'flash-sale-02',
        ]);

        $this->assertDatabaseHas('slugs', [
            'sluggable_id' => $campaign->id,
            'sluggable_type' => PromotionCampaign::class,
            'locale' => 'en',
            'slug' => 'flash-sale-02-en',
        ]);

        $this->assertDatabaseHas('promotion_campaign_products', [
            'product_id' => $product->id,
            'promotion_campaign_id' => $campaign->id,
        ]);
    }

    #[Test]
    public function it_renders_the_public_campaign_page_by_translated_slug(): void
    {
        $this->withoutMiddleware();

        $product = Product::query()->create([
            'sku' => 'PROMO-002',
            'price' => 99000,
            'status' => 1,
        ]);

        $campaign = $this->createCampaign([
            'ends_at' => now()->addDay(),
            'is_active' => true,
        ], [
            'vi' => [
                'name' => 'Flash Sale Public',
                'slug' => 'flash-sale-public',
                'description' => 'Public campaign vi',
            ],
        ]);

        $campaign->products()->attach($product->id);

        $response = $this->get(route('promotion-campaign.public', ['slug' => 'flash-sale-public']));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Promotion/Campaign/Show')
            ->where('item.slug', 'flash-sale-public')
            ->where('item.name', 'Flash Sale Public')
        );
    }

    #[Test]
    public function it_exposes_coupon_sale_offer_and_buy_to_gift_options_on_campaign_create_page(): void
    {
        $this->withoutMiddleware();

        PromotionCoupon::query()->create([
            'code' => 'COUPON-OPTION-001',
            'name' => 'Coupon Option',
            'discount_type' => 'fixed',
            'discount_value' => 25000,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'is_public' => true,
            'stackable' => false,
        ]);

        PromotionSaleOffer::query()->create([
            'code' => 'SALE-OPTION-001',
            'name' => 'Sale Option',
            'discount_type' => 'percent',
            'discount_value' => 10,
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => true,
        ]);

        PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-OPTION-001',
            'name' => 'Gift Option',
            'description' => 'Gift option description',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $this->get(route('promotion-campaign.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Promotion/PromotionCampaign/Created')
                ->has('itemsCouponActive.0')
                ->has('itemsSaleOfferActive.0')
                ->has('itemsBuyToGiftActive.0')
            );
    }

    private function createCampaign(array $attributes, array $translations): PromotionCampaign
    {
        $campaign = PromotionCampaign::query()->create(array_merge([
            'description' => null,
            'starts_at' => null,
            'ends_at' => now()->addDay(),
            'priority' => 100,
            'is_active' => true,
        ], $attributes));

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

        return $campaign->fresh(['translations', 'slugs', 'products']) ?? $campaign;
    }
}
