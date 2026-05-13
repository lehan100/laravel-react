<?php

namespace Tests\Feature;

use App\Models\Catalog\Product;
use App\Models\Catalog\ProductVariant;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionBuyToGiftOfferRule;
use App\Models\Promotion\PromotionCampaign;
use App\Models\Sales\Order;
use App\Models\Sales\OrderItem;
use App\Services\Promotion\BuyToGiftStockAllocator;
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
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
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
            ->has('items.data.0.ends_at')
            ->where('items.data.0.is_active', true)
            ->where('items.data.0.promotion_status', 'active')
            ->where('items.data.0.rules.0.buy_product_ids.0', $buyProduct->id)
            ->where('items.data.0.rules.0.gift_product_ids.0', $giftProduct->id)
            ->where('items.data.0.rules.0.buy_qty', 2)
            ->where('items.data.0.rules.0.gift_qty', 1)
            ->where('items.data.0.rules.0.reserved_quantity', 0)
            ->where('items.data.0.rules.0.sold_quantity', 0)
        );
    }

    #[Test]
    public function it_exposes_variant_ids_on_the_edit_page_payload(): void
    {
        $this->withoutMiddleware();

        $buyProduct = Product::query()->create([
            'sku' => 'BUY-EDIT-VAR-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 20,
            'price' => 100000,
        ]);

        $buyVariant = ProductVariant::query()->create([
            'product_id' => $buyProduct->id,
            'sku' => 'BUY-EDIT-VAR-RED',
            'price' => 100000,
            'stock' => 12,
            'image' => null,
            'images' => null,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-EDIT-VAR-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 10,
            'price' => 50000,
        ]);

        $giftVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'GIFT-EDIT-VAR-BLUE',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'EDIT-VAR-001',
            'name' => 'Variant edit payload',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $rule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'buy_product',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 4,
        ]);

        $rule->buyProducts()->attach($buyProduct->id, [
            'variant_id' => $buyVariant->id,
            'buy_qty' => 1,
        ]);
        $rule->giftProducts()->attach($giftProduct->id, [
            'variant_id' => $giftVariant->id,
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        $response = $this->get(route('buytogift.edit', $offer->id));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/BuyToGift/Edit')
            ->where('item.rules.0.buy_items.0.variant_id', $buyVariant->id)
            ->where('item.rules.0.gift_items.0.variant_id', $giftVariant->id)
            ->where('item.rules.0.buy_items.0.product_id', $buyProduct->id)
            ->where('item.rules.0.gift_items.0.product_id', $giftProduct->id)
        );
    }

    #[Test]
    public function it_exposes_gift_variant_options_on_the_edit_page_payload(): void
    {
        $this->withoutMiddleware();

        $buyProduct = Product::query()->create([
            'sku' => 'BUY-OPTION-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 20,
            'price' => 100000,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-OPTION-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 20,
            'price' => 50000,
        ]);

        $giftVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'GIFT-OPTION-BLUE',
            'price' => 50000,
            'stock' => 20,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'OPTION-001',
            'name' => 'Gift option payload',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $rule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'buy_product',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 2,
        ]);

        $rule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 1]);
        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);
        $rule->giftVariantOptions()->create([
            'product_id' => $giftProduct->id,
            'variant_id' => $giftVariant->id,
            'reserve_qty' => 5,
        ]);

        $response = $this->get(route('buytogift.edit', $offer->id));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/BuyToGift/Edit')
            ->where('item.rules.0.gift_variant_options.0.product_id', $giftProduct->id)
            ->where('item.rules.0.gift_variant_options.0.variant_id', $giftVariant->id)
            ->where('item.rules.0.gift_variant_options.0.reserve_qty', 5)
        );
    }

    #[Test]
    public function it_exposes_gift_variant_options_on_the_index_page_payload(): void
    {
        $this->withoutMiddleware();

        $buyProduct = Product::query()->create([
            'sku' => 'BUY-INDEX-OPTION-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 10,
            'price' => 100000,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-INDEX-OPTION-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 12,
            'price' => 50000,
        ]);

        $giftVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'GIFT-INDEX-OPTION-BLUE',
            'price' => 50000,
            'stock' => 12,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'INDEX-OPTION-001',
            'name' => 'Index gift option payload',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $rule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'buy_product',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 4,
        ]);

        $rule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 1]);
        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);
        $rule->giftVariantOptions()->create([
            'product_id' => $giftProduct->id,
            'variant_id' => $giftVariant->id,
            'reserve_qty' => 7,
        ]);

        $response = $this->get(route('buytogift.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/BuyToGift/Index')
            ->where('items.data.0.rules.0.gift_variant_options.0.product_id', $giftProduct->id)
            ->where('items.data.0.rules.0.gift_variant_options.0.variant_id', $giftVariant->id)
            ->where('items.data.0.rules.0.gift_variant_options.0.reserve_qty', 7)
        );
    }

    #[Test]
    public function it_exposes_gift_variant_options_on_the_show_page_payload(): void
    {
        $this->withoutMiddleware();

        $buyProduct = Product::query()->create([
            'sku' => 'BUY-SHOW-OPTION-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 10,
            'price' => 100000,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-SHOW-OPTION-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 12,
            'price' => 50000,
        ]);

        $giftVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'GIFT-SHOW-OPTION-BLUE',
            'price' => 50000,
            'stock' => 12,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'SHOW-OPTION-001',
            'name' => 'Show gift option payload',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $rule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'buy_product',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 4,
        ]);

        $rule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 1]);
        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);
        $rule->giftVariantOptions()->create([
            'product_id' => $giftProduct->id,
            'variant_id' => $giftVariant->id,
            'reserve_qty' => 9,
        ]);

        $response = $this->get(route('buytogift.show', $offer->id));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/BuyToGift/Show')
            ->where('item.rules.0.gift_variant_options.0.product_id', $giftProduct->id)
            ->where('item.rules.0.gift_variant_options.0.variant_id', $giftVariant->id)
            ->where('item.rules.0.gift_variant_options.0.reserve_qty', 9)
        );
    }

    #[Test]
    public function it_sums_allocations_by_product_for_variant_based_gifts_on_the_show_page_payload(): void
    {
        $this->withoutMiddleware();

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-SHOW-SUM-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 20,
            'price' => 50000,
        ]);

        $blueVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'GIFT-SHOW-SUM-BLUE',
            'price' => 50000,
            'stock' => 12,
            'image' => null,
            'images' => null,
        ]);

        $pinkVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'GIFT-SHOW-SUM-PINK',
            'price' => 50000,
            'stock' => 8,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'SHOW-SUM-001',
            'name' => 'Show allocation sum payload',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $rule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'buy_product',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 10,
        ]);

        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);
        $rule->giftVariantOptions()->createMany([
            [
                'product_id' => $giftProduct->id,
                'variant_id' => $blueVariant->id,
                'reserve_qty' => 3,
            ],
            [
                'product_id' => $giftProduct->id,
                'variant_id' => $pinkVariant->id,
                'reserve_qty' => 4,
            ],
        ]);

        app(BuyToGiftStockAllocator::class)->syncOffer($offer->fresh([
            'rules.giftProducts',
            'rules.giftVariantOptions.variant',
            'rules.stockAllocations',
        ]));

        $response = $this->get(route('buytogift.show', $offer->id));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/BuyToGift/Show')
            ->where('item.rules.0.allocations_total_map.'.(string) $giftProduct->id, 7)
            ->where('item.rules.0.allocations_map.'.$giftProduct->id.':'.$blueVariant->id, 3)
            ->where('item.rules.0.allocations_map.'.$giftProduct->id.':'.$pinkVariant->id, 4)
        );
    }

    #[Test]
    public function it_shows_sold_quantity_per_rule_instead_of_aggregating_across_all_rules(): void
    {
        $this->withoutMiddleware();

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-SHOW-SOLD-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 20,
            'price' => 50000,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'SHOW-SOLD-001',
            'name' => 'Show sold quantity payload',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $ruleOne = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'buy_product',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
            'max_gift_qty' => 20,
        ]);

        $ruleTwo = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'buy_product',
            'priority' => 2,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 10,
        ]);

        $ruleOne->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);
        $ruleTwo->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        $order = Order::query()->create([
            'order_number' => 'BTG-SOLD-001',
            'customer_name' => 'Sold Rule Customer',
            'order_status' => 'completed',
            'payment_status' => 'paid',
            'shipping_status' => 'delivered',
            'total_quantity' => 2,
            'subtotal' => 0,
            'discount_total' => 0,
            'shipping_total' => 0,
            'grand_total' => 0,
            'placed_at' => now(),
        ]);

        OrderItem::query()->create([
            'order_id' => $order->id,
            'product_id' => $giftProduct->id,
            'product_name' => 'Gift item',
            'product_sku' => $giftProduct->sku,
            'quantity' => 2,
            'unit_price' => 0,
            'line_total' => 0,
            'meta' => [
                'is_gift' => true,
                'rule_id' => $ruleOne->id,
            ],
        ]);

        $response = $this->get(route('buytogift.show', $offer->id));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/BuyToGift/Show')
            ->where('item.rules.0.sold_quantity', 2)
            ->where('item.rules.0.available_slots', 18)
            ->where('item.rules.0.max_gift_slots', 18)
            ->where('item.rules.1.sold_quantity', 0)
        );
    }

    #[Test]
    public function it_allows_gift_items_without_variant_when_variant_options_are_used_for_selection(): void
    {
        $this->withoutMiddleware();

        $buyProduct = Product::query()->create([
            'sku' => 'BUY-NO-VAR-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 10,
            'price' => 100000,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-NO-VAR-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 12,
            'price' => 50000,
        ]);

        $giftVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'GIFT-NO-VAR-BLUE',
            'price' => 50000,
            'stock' => 12,
            'image' => null,
            'images' => null,
        ]);

        $offerPayload = [
            'code' => 'NO-VAR-GIFT-001',
            'name' => 'No variant gift validation',
            'condition_type' => 'buy_product',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
            'buy_qty' => 1,
            'gift_qty' => 1,
            'buy_items' => [
                [
                    'product_id' => $buyProduct->id,
                ],
            ],
            'gift_product_ids' => [$giftProduct->id],
            'gift_items' => [
                [
                    'product_id' => $giftProduct->id,
                ],
            ],
            'gift_variant_options' => [
                [
                    'product_id' => $giftProduct->id,
                    'variant_id' => $giftVariant->id,
                    'reserve_qty' => 3,
                ],
            ],
        ];

        $response = $this->post(route('buytogift.store'), $offerPayload);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        $this->assertDatabaseHas('promotion_buytogift_offers', [
            'code' => 'NO-VAR-GIFT-001',
        ]);

        $this->assertDatabaseHas('promotion_buytogift_rule_gift_items', [
            'product_id' => $giftProduct->id,
            'variant_id' => null,
        ]);

        $this->assertDatabaseHas('promotion_buytogift_rule_gift_variant_options', [
            'product_id' => $giftProduct->id,
            'variant_id' => $giftVariant->id,
            'reserve_qty' => 3,
        ]);
    }

    #[Test]
    public function it_calculates_available_slots_from_the_stock_limit(): void
    {
        $this->withoutMiddleware();

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-SLOT-001',
            'name' => 'Gift slot summary',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $rule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'buy_product',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 61,
        ]);

        $buyProduct = Product::query()->create([
            'sku' => 'BUY-SLOT-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 61,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-SLOT-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 61,
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
            ->where('items.data.0.rules.0.buy_slots', 30)
            ->where('items.data.0.rules.0.gift_slots', 61)
            ->where('items.data.0.rules.0.max_slots_by_stock_limit', 20)
            ->where('items.data.0.rules.0.available_slots', 20)
            ->where('items.data.0.rules.0.wasted_stock', 1)
            ->where('items.data.0.rules.0.is_sold_out', false)
        );
    }

    #[Test]
    public function it_exposes_a_warning_when_max_gift_qty_only_covers_part_of_the_available_slots(): void
    {
        $this->withoutMiddleware();

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-CAP-WARN-001',
            'name' => 'Gift cap warning',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $rule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'buy_product',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 61,
            'max_gift_qty' => 15,
        ]);

        $buyProduct = Product::query()->create([
            'sku' => 'BUY-CAP-WARN-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 61,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-CAP-WARN-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 61,
        ]);

        $rule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 3]);
        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        $response = $this->get(route('buytogift.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/BuyToGift/Index')
            ->where('items.data.0.rules.0.buy_slots', 20)
            ->where('items.data.0.rules.0.available_slots', 15)
            ->where('items.data.0.rules.0.max_gift_slots', 15)
            ->where('items.data.0.rules.0.max_gift_shortage', 5)
            ->where('items.data.0.rules.0.is_sold_out', false)
        );
    }

    #[Test]
    public function it_calculates_available_slots_for_order_amount_rules_using_gift_stock_only(): void
    {
        $this->withoutMiddleware();

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-SLOT-ORDER-001',
            'name' => 'Gift order amount summary',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $rule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'order_amount',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 100,
            'min_order_amount' => 700000,
            'max_gift_qty' => 30,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-ORDER-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 1000,
        ]);

        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        $response = $this->get(route('buytogift.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/BuyToGift/Index')
            ->where('items.data.0.rules.0.slot_size', 1)
            ->where('items.data.0.rules.0.max_slots_by_stock_limit', 100)
            ->where('items.data.0.rules.0.available_slots', 30)
            ->where('items.data.0.rules.0.wasted_stock', 70)
            ->where('items.data.0.rules.0.is_sold_out', false)
        );
    }

    #[Test]
    public function it_caps_order_amount_available_slots_by_max_gift_qty(): void
    {
        $this->withoutMiddleware();

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-SLOT-ORDER-CAP-001',
            'name' => 'Gift order amount cap summary',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $rule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'order_amount',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 100,
            'min_order_amount' => 700000,
            'max_gift_qty' => 15,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-ORDER-CAP-001',
            'status' => 1,
            'is_stock' => true,
            'quantity' => 1000,
        ]);

        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        $response = $this->get(route('buytogift.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/BuyToGift/Index')
            ->where('items.data.0.rules.0.available_slots', 15)
            ->where('items.data.0.rules.0.max_gift_slots', 15)
            ->where('items.data.0.rules.0.max_gift_shortage', 985)
        );
    }

    #[Test]
    public function it_loads_buy_to_gift_create_page_with_product_campaigns(): void
    {
        $this->withoutMiddleware();

        $campaign = PromotionCampaign::query()->create([
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'priority' => 1,
            'is_active' => true,
        ]);

        $product = Product::query()->create([
            'sku' => 'PROD-CAMPAIGN-001',
            'status' => 1,
            'is_stock' => true,
        ]);

        $product->promotionCampaigns()->attach($campaign->id);

        $response = $this->get(route('buytogift.create'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/BuyToGift/Created')
            ->has('itemsProductActive')
            ->has('itemsCampaignActive')
        );
    }
}
