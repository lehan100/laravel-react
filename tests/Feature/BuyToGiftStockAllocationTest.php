<?php

namespace Tests\Feature;

use App\Console\Commands\ReleaseExpiredBuyToGiftStock;
use App\Models\Catalog\Product;
use App\Models\Catalog\ProductVariant;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionBuyToGiftOfferRule;
use App\Services\Promotion\BuyToGiftStockAllocator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class BuyToGiftStockAllocationTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_reserves_and_releases_stock_for_limited_buy_to_gift_rules(): void
    {
        $this->withoutMiddleware();

        $buyProduct = Product::query()->create([
            'sku' => 'BUY-STOCK-001',
            'quantity' => 20,
            'is_stock' => true,
            'status' => 1,
            'price' => 100000,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-STOCK-001',
            'quantity' => 20,
            'is_stock' => true,
            'status' => 1,
            'price' => 50000,
        ]);

        $createResponse = $this->post(route('buytogift.store'), $this->payload(
            buyProductId: $buyProduct->id,
            giftProductId: $giftProduct->id,
            stockLimit: 3
        ));

        $createResponse->assertRedirect();

        $offer = PromotionBuyToGiftOffer::query()->with(['rules.stockAllocations'])->firstOrFail();
        $rule = $offer->rules->firstOrFail();

        $this->assertDatabaseHas('promotion_buytogift_offers', [
            'id' => $offer->id,
            'code' => 'GIFTS-001',
        ]);

        $this->assertDatabaseHas('promotion_buytogift_offer_rules', [
            'id' => $rule->id,
            'promotion_buytogift_offer_id' => $offer->id,
            'stock_scope' => 'limited',
            'stock_limit' => 3,
        ]);

        $this->assertDatabaseHas('promotion_buytogift_rule_stock_allocations', [
            'promotion_buytogift_offer_rule_id' => $rule->id,
            'product_id' => $giftProduct->id,
            'allocated_quantity' => 2,
        ]);

        $this->assertSame(20, (int) Product::query()->findOrFail($buyProduct->id)->quantity);
        $this->assertSame(18, (int) Product::query()->findOrFail($giftProduct->id)->quantity);

        $this->assertDatabaseHas('inventory_adjustment_histories', [
            'product_id' => $giftProduct->id,
            'action' => 'promotion_buytogift_reserve',
            'delta' => -2,
        ]);

        Product::query()->whereKey($giftProduct->id)->update([
            'sold_quantity' => 7,
        ]);

        $editResponse = $this->get(route('buytogift.edit', $offer->id));

        $editResponse->assertOk();
        $editResponse->assertInertia(fn ($page) => $page
            ->component('Admin/Promotion/BuyToGift/Edit')
            ->where('item.rules.0.reserved_quantity', 2)
            ->where('item.rules.0.sold_quantity', 7)
            ->where('itemsSelectedGiftProducts.1.sku', 'GIFT-STOCK-001')
            ->where('itemsSelectedGiftProducts.1.reserved_quantity', 2)
            ->where('itemsSelectedGiftProducts.1.sold_quantity', 7)
        );

        $updateResponse = $this->put(route('buytogift.update', $offer->id), $this->payload(
            buyProductId: $buyProduct->id,
            giftProductId: $giftProduct->id,
            stockLimit: 1,
            ruleId: $rule->id
        ));

        $updateResponse->assertRedirect();

        $this->assertSame(20, (int) Product::query()->findOrFail($buyProduct->id)->quantity);
        $this->assertSame(20, (int) Product::query()->findOrFail($giftProduct->id)->quantity);

        $this->assertDatabaseMissing('promotion_buytogift_rule_stock_allocations', [
            'promotion_buytogift_offer_rule_id' => $rule->id,
            'product_id' => $giftProduct->id,
        ]);

        $this->assertDatabaseHas('inventory_adjustment_histories', [
            'product_id' => $giftProduct->id,
            'action' => 'promotion_buytogift_release',
            'delta' => 2,
        ]);
    }

    #[Test]
    public function it_reserves_and_restores_stock_for_variant_specific_gift_options(): void
    {
        $this->withoutMiddleware();

        $buyProduct = Product::query()->create([
            'sku' => 'BUY-VARIANT-001',
            'quantity' => 20,
            'is_stock' => true,
            'status' => 1,
            'price' => 100000,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-VARIANT-001',
            'quantity' => 20,
            'is_stock' => true,
            'status' => 1,
            'price' => 50000,
        ]);

        $blueVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'GIFT-VARIANT-BLUE',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);

        $pinkVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'GIFT-VARIANT-PINK',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFTS-VARIANT-001',
            'name' => 'Gift variant stock allocation',
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
            'stock_limit' => 20,
        ]);

        $rule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 1]);
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
            'rules.buyProducts',
            'rules.giftProducts',
            'rules.giftVariantOptions.variant',
            'rules.stockAllocations',
        ]));

        $blueVariant->refresh();
        $pinkVariant->refresh();
        $giftProduct->refresh();

        $this->assertSame(7, (int) $blueVariant->stock);
        $this->assertSame(6, (int) $pinkVariant->stock);
        $this->assertSame(13, (int) $giftProduct->quantity);

        $allocations = $offer->rules()->first()->stockAllocations()->get()->keyBy(fn ($allocation) => $allocation->product_id.':'.($allocation->variant_id ?? 0));
        $this->assertSame(3, (int) $allocations->get($giftProduct->id.':'.$blueVariant->id)->allocated_quantity);
        $this->assertSame(4, (int) $allocations->get($giftProduct->id.':'.$pinkVariant->id)->allocated_quantity);

        $offer->forceFill(['is_active' => false])->saveQuietly();
        app(BuyToGiftStockAllocator::class)->syncOffer($offer->fresh([
            'rules.buyProducts',
            'rules.giftProducts',
            'rules.giftVariantOptions.variant',
            'rules.stockAllocations',
        ]));

        $this->assertSame(10, (int) ProductVariant::query()->findOrFail($blueVariant->id)->stock);
        $this->assertSame(10, (int) ProductVariant::query()->findOrFail($pinkVariant->id)->stock);
    }

    #[Test]
    public function it_rejects_rules_when_gift_quantity_exceeds_the_maximum_cap(): void
    {
        $this->withoutMiddleware();

        $buyProduct = Product::query()->create([
            'sku' => 'BUY-CAP-001',
            'quantity' => 20,
            'is_stock' => true,
            'status' => 1,
            'price' => 100000,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-CAP-001',
            'quantity' => 20,
            'is_stock' => true,
            'status' => 1,
            'price' => 50000,
        ]);

        $response = $this->post(route('buytogift.store'), $this->payload(
            buyProductId: $buyProduct->id,
            giftProductId: $giftProduct->id,
            stockLimit: 3,
            maxGiftQty: 1
        ));

        $response->assertSessionHasErrors([
            'gift_qty',
            'rules.0.gift_qty',
        ]);
    }

    #[Test]
    public function it_redirects_back_with_error_when_updating_a_missing_buy_to_gift_offer(): void
    {
        $this->withoutMiddleware();

        $buyProduct = Product::query()->create([
            'sku' => 'BUY-MISSING-001',
            'quantity' => 20,
            'is_stock' => true,
            'status' => 1,
            'price' => 100000,
        ]);

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-MISSING-001',
            'quantity' => 20,
            'is_stock' => true,
            'status' => 1,
            'price' => 50000,
        ]);

        $response = $this->put(route('buytogift.update', 999999), $this->payload(
            buyProductId: $buyProduct->id,
            giftProductId: $giftProduct->id,
            stockLimit: 3,
            ruleId: null
        ));

        $response->assertRedirect();
        $response->assertSessionHas('error');
    }

    #[Test]
    public function it_releases_and_reserves_gift_stock_when_buy_to_gift_offer_is_disabled_and_reenabled(): void
    {
        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-TOGGLE-001',
            'quantity' => 100,
            'is_stock' => true,
            'status' => 1,
            'price' => 50000,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-TOGGLE-001',
            'name' => 'Toggle gift stock',
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
            'stock_limit' => 10,
            'min_order_amount' => 700000,
        ]);

        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        app(BuyToGiftStockAllocator::class)->syncOffer($offer->fresh(['rules.giftProducts', 'rules.stockAllocations']));

        $this->assertSame(90, (int) Product::query()->findOrFail($giftProduct->id)->quantity);
        $this->assertDatabaseHas('promotion_buytogift_rule_stock_allocations', [
            'promotion_buytogift_offer_rule_id' => $rule->id,
            'product_id' => $giftProduct->id,
            'allocated_quantity' => 10,
        ]);

        Product::query()->whereKey($giftProduct->id)->update([
            'sold_quantity' => 2,
        ]);

        $allocation = $rule->fresh(['stockAllocations'])->stockAllocations->firstOrFail();
        $allocation->update([
            'allocated_quantity' => 8,
        ]);

        $offer->update(['is_active' => false]);

        $this->assertSame(98, (int) Product::query()->findOrFail($giftProduct->id)->quantity);
        $this->assertDatabaseMissing('promotion_buytogift_rule_stock_allocations', [
            'promotion_buytogift_offer_rule_id' => $rule->id,
            'product_id' => $giftProduct->id,
        ]);

        $offer = $offer->fresh(['rules.giftProducts', 'rules.stockAllocations']);
        $offer->update(['is_active' => true]);

        $this->assertSame(90, (int) Product::query()->findOrFail($giftProduct->id)->quantity);
        $this->assertDatabaseHas('promotion_buytogift_rule_stock_allocations', [
            'promotion_buytogift_offer_rule_id' => $rule->id,
            'product_id' => $giftProduct->id,
            'allocated_quantity' => 8,
        ]);
    }

    #[Test]
    public function it_reserves_and_restores_stock_for_variant_specific_gift_items(): void
    {
        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-VARIANT-001',
            'quantity' => 12,
            'is_stock' => true,
            'status' => 1,
            'price' => 50000,
        ]);

        $variantRed = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'GIFT-VARIANT-RED',
            'price' => 50000,
            'stock' => 7,
            'image' => null,
            'images' => null,
        ]);

        ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'GIFT-VARIANT-BLUE',
            'price' => 50000,
            'stock' => 5,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-VARIANT-001',
            'name' => 'Variant gift stock',
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
            'stock_limit' => 3,
            'min_order_amount' => 700000,
        ]);

        $rule->giftProducts()->attach($giftProduct->id, [
            'variant_id' => $variantRed->id,
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        app(BuyToGiftStockAllocator::class)->syncOffer($offer->fresh(['rules.giftProducts', 'rules.stockAllocations']));

        $this->assertSame(4, (int) $variantRed->fresh()->stock);
        $this->assertSame(9, (int) $giftProduct->fresh()->quantity);
        $this->assertDatabaseHas('promotion_buytogift_rule_stock_allocations', [
            'promotion_buytogift_offer_rule_id' => $rule->id,
            'product_id' => $giftProduct->id,
            'variant_id' => $variantRed->id,
            'allocated_quantity' => 3,
        ]);

        $offer->update(['is_active' => false]);
        app(BuyToGiftStockAllocator::class)->syncOffer($offer->fresh(['rules.giftProducts', 'rules.stockAllocations']));

        $this->assertSame(7, (int) $variantRed->fresh()->stock);
        $this->assertSame(12, (int) $giftProduct->fresh()->quantity);
        $this->assertDatabaseMissing('promotion_buytogift_rule_stock_allocations', [
            'promotion_buytogift_offer_rule_id' => $rule->id,
            'product_id' => $giftProduct->id,
            'variant_id' => $variantRed->id,
        ]);
    }

    #[Test]
    public function it_releases_reserved_stock_when_buy_to_gift_offer_has_expired(): void
    {
        $this->withoutMiddleware();

        $giftProduct = Product::query()->create([
            'sku' => 'GIFT-EXPIRED-001',
            'quantity' => 100,
            'is_stock' => true,
            'status' => 1,
            'price' => 50000,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-EXPIRED-001',
            'name' => 'Expired gift stock release',
            'priority' => 1,
            'starts_at' => now()->subDays(3),
            'ends_at' => now()->subDay(),
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
            'stock_limit' => 10,
            'min_order_amount' => 700000,
        ]);

        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        app(BuyToGiftStockAllocator::class)->syncOffer($offer);

        $this->assertSame(90, (int) Product::query()->findOrFail($giftProduct->id)->quantity);
        $this->assertDatabaseHas('promotion_buytogift_rule_stock_allocations', [
            'promotion_buytogift_offer_rule_id' => $rule->id,
            'product_id' => $giftProduct->id,
            'allocated_quantity' => 10,
        ]);

        $this->assertSame(
            1,
            PromotionBuyToGiftOffer::query()
                ->whereNotNull('ends_at')
                ->where('ends_at', '<=', now()->format('Y-m-d H:i:s'))
                ->count()
        );

        $exitCode = app(ReleaseExpiredBuyToGiftStock::class)->handle(app(BuyToGiftStockAllocator::class));

        $this->assertSame(0, $exitCode);

        $this->assertSame(100, (int) Product::query()->findOrFail($giftProduct->id)->quantity);
        $this->assertDatabaseMissing('promotion_buytogift_rule_stock_allocations', [
            'promotion_buytogift_offer_rule_id' => $rule->id,
            'product_id' => $giftProduct->id,
        ]);
        $this->assertDatabaseHas('inventory_adjustment_histories', [
            'product_id' => $giftProduct->id,
            'action' => 'promotion_buytogift_release',
            'delta' => 10,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(
        int $buyProductId,
        int $giftProductId,
        int $stockLimit,
        ?int $ruleId = null,
        ?int $maxGiftQty = null,
    ): array {
        return [
            'code' => 'GIFTS-001',
            'name' => 'Gift Stock Allocation',
            'description' => 'Limited gift stock allocation',
            'condition_type' => 'buy_product',
            'min_order_amount' => '',
            'max_sets_per_order' => '',
            'max_gift_qty' => $maxGiftQty,
            'stock_scope' => 'limited',
            'stock_limit' => $stockLimit,
            'starts_at' => now()->subDay()->format('Y-m-d H:i:s'),
            'ends_at' => now()->addDay()->format('Y-m-d H:i:s'),
            'campaign_id' => '',
            'priority' => 1,
            'buy_product_ids' => [$buyProductId],
            'buy_qty' => 1,
            'gift_product_ids' => [$giftProductId],
            'gift_qty' => 2,
            'rules' => [
                [
                    'id' => $ruleId,
                    'condition_type' => 'buy_product',
                    'min_order_amount' => '',
                    'max_sets_per_order' => '',
                    'max_gift_qty' => $maxGiftQty,
                    'stock_scope' => 'limited',
                    'stock_limit' => $stockLimit,
                    'buy_product_ids' => [$buyProductId],
                    'buy_qty' => 1,
                    'gift_product_ids' => [$giftProductId],
                    'gift_qty' => 2,
                    'is_active' => true,
                    'stackable' => false,
                    'priority' => 1,
                ],
            ],
            'is_active' => true,
            'stackable' => false,
            'undo' => 0,
        ];
    }
}
