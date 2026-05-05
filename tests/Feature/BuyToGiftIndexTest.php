<?php

namespace Tests\Feature;

use App\Models\Catalog\Product;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionBuyToGiftOfferRule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class BuyToGiftIndexTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_includes_gift_products_for_index_summary(): void
    {
        $this->withoutMiddleware();

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-INDEX-001',
            'name' => 'Gift index summary',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
        ]);

        $rule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'buy_product',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
        ]);

        $buyProduct = Product::query()->create([
            'sku' => 'BUY-INDEX-001',
            'status' => 1,
            'is_stock' => true,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-INDEX-001',
            'status' => 1,
            'is_stock' => true,
        ]);

        $rule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 2]);
        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        $response = $this->get(route('buytogift.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/BuyToGift/Index')
            ->where('items.data.0.rules.0.buy_product_ids.0', $buyProduct->id)
            ->where('items.data.0.rules.0.gift_product_ids.0', $giftProduct->id)
            ->where('items.data.0.rules.0.buy_qty', 2)
            ->where('items.data.0.rules.0.gift_qty', 1)
        );
    }
}
