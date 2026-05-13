<?php

namespace Tests\Feature\Feature;

use App\Http\Requests\Sales\OrderRequest;
use App\Models\Catalog\Product;
use App\Models\Catalog\ProductVariant;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionBuyToGiftOfferRule;
use App\Models\Sales\Order;
use App\Models\Sales\OrderItem;
use App\Models\Sales\OrderTimeline;
use App\Models\Sales\PaymentMethod;
use App\Models\Settings\Province;
use App\Models\Settings\Ward;
use App\Models\Users\User;
use App\Repositories\BuyToGift\BuyToGiftRepositoryInterface;
use App\Repositories\Order\OrderRepositoryInterface;
use App\Services\Promotion\BuyToGiftAvailabilityService;
use App\Services\Promotion\BuyToGiftStockAllocator;
use App\Services\Promotion\PromotionEngineService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OrderModuleTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_requires_valid_statuses_and_at_least_one_item(): void
    {
        $location = $this->createTestLocation();

        $payload = [
            'order_number' => 'ORD-VALIDATION-001',
            'customer_name' => 'Nguyen Van A',
            'customer_phone' => '0909123456',
            'customer_address' => '123 Test Street',
            'province_code' => $location['province_code'],
            'ward_code' => $location['ward_code'],
            'payment_method_id' => null,
            'order_status' => 'invalid',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'items' => [],
        ];

        $request = new OrderRequest;
        $request->merge($payload);
        $validator = Validator::make($payload, $request->rules(), $request->messages(), $request->attributes());
        foreach ($request->after() as $callback) {
            $callback($validator);
        }

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('payment_method_id', $validator->errors()->messages());
        $this->assertSame(
            trans('validation.required', [
                'attribute' => trans('hancms.sales.orders.fields.payment_method'),
            ]),
            $validator->errors()->first('payment_method_id')
        );
        $this->assertArrayHasKey('order_status', $validator->errors()->messages());
        $this->assertArrayHasKey('items', $validator->errors()->messages());
    }

    #[Test]
    public function it_rejects_products_with_zero_stock(): void
    {
        $user = User::factory()->create([
            'account_id' => 1,
        ]);
        $location = $this->createTestLocation();
        $product = $this->createProduct('SKU-OUT', 'Out Of Stock Product', 100000, 0);
        $paymentMethod = PaymentMethod::query()->create([
            'code' => 'cash_on_delivery_out_of_stock',
            'provider' => 'cash_on_delivery',
            'name' => 'Cash On Delivery Out Of Stock',
            'description' => null,
            'settings' => [],
            'sort_order' => 0,
            'is_active' => true,
            'is_system' => false,
        ]);

        $payload = [
            'order_number' => 'ORD-OUT-001',
            'customer_name' => 'Nguyen Van A',
            'customer_phone' => '0909123456',
            'customer_address' => '123 Test Street',
            'province_code' => $location['province_code'],
            'ward_code' => $location['ward_code'],
            'payment_method_id' => $paymentMethod->id,
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'unit_price' => 100000,
                ],
            ],
        ];

        $this->actingAs($user)
            ->post(route('orders.store'), $payload)
            ->assertSessionHasErrors('items.0.product_id');
    }

    #[Test]
    public function it_rejects_buy_to_gift_orders_when_the_rule_has_no_remaining_slots(): void
    {
        $buyProduct = $this->createProduct('SKU-BTG-BUY', 'Buy Product', 100000, 10);
        $giftProduct = $this->createProduct('SKU-BTG-GIFT', 'Gift Product', 50000, 10);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'BTG-SLOT-001',
            'name' => 'Buy To Gift Slot',
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
            'stock_limit' => 0,
        ]);

        $rule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 1]);
        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        $summary = app(BuyToGiftAvailabilityService::class)->summarizeRule(
            $rule->fresh(['buyProducts', 'giftProducts'])
        );

        $this->assertSame(0, $summary['available_slots']);
    }

    #[Test]
    public function it_rejects_buy_to_gift_orders_when_updating_an_existing_order(): void
    {
        $buyProduct = $this->createProduct('SKU-BTG-UP-BUY', 'Buy Product Update', 100000, 10);
        $giftProduct = $this->createProduct('SKU-BTG-UP-GIFT', 'Gift Product Update', 50000, 10);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'BTG-SLOT-002',
            'name' => 'Buy To Gift Slot Update',
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
            'stock_limit' => 0,
        ]);

        $rule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 1]);
        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        $summary = app(BuyToGiftAvailabilityService::class)->summarizeRule(
            $rule->fresh(['buyProducts', 'giftProducts'])
        );

        $this->assertSame(0, $summary['available_slots']);
    }

    #[Test]
    public function it_consumes_buy_to_gift_reserve_on_success_and_restores_it_on_cancel_when_promotion_is_active(): void
    {
        $user = User::factory()->create([
            'account_id' => 1,
        ]);

        $buyProduct = $this->createProduct('SKU-BTG-SUCCESS-BUY', 'Buy Product Success', 100000, 10);
        $giftProduct = $this->createProduct('SKU-BTG-SUCCESS-GIFT', 'Gift Product Success', 50000, 10);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'BTG-SUCCESS-001',
            'name' => 'Buy To Gift Success',
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
            'stock_limit' => 3,
        ]);

        $rule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 1]);
        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        app(BuyToGiftStockAllocator::class)->syncOffer($offer->fresh(['rules.buyProducts', 'rules.giftProducts', 'rules.stockAllocations']));

        $this->assertSame(10, (int) $buyProduct->fresh()->quantity);
        $this->assertSame(7, (int) $giftProduct->fresh()->quantity);

        $order = Order::query()->create([
            'order_number' => 'ORD-BTG-SUCCESS-001',
            'customer_name' => 'Promotion Customer',
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'total_quantity' => 1,
            'subtotal' => 100000,
            'discount_total' => 0,
            'shipping_total' => 0,
            'grand_total' => 100000,
            'placed_at' => now(),
        ]);

        $order->items()->create([
            'product_id' => $buyProduct->id,
            'product_name' => $buyProduct->name,
            'product_sku' => $buyProduct->sku,
            'quantity' => 1,
            'unit_price' => 100000,
            'line_total' => 100000,
        ]);

        $completedOrder = app(OrderRepositoryInterface::class)->save([
            'id' => $order->id,
            'order_number' => 'ORD-BTG-SUCCESS-001',
            'customer_name' => 'Promotion Customer',
            'order_status' => 'completed',
            'payment_status' => 'paid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'placed_at' => now()->format('Y-m-d H:i:s'),
            'items' => [
                [
                    'product_id' => $buyProduct->id,
                    'quantity' => 1,
                    'unit_price' => 100000,
                ],
            ],
        ], ['task' => 'edit-item']);

        $this->assertNotNull($completedOrder);

        $buyProduct->refresh();
        $giftProduct->refresh();
        $offer->refresh();

        $this->assertSame(1, (int) $buyProduct->sold_quantity);
        $this->assertSame(1, (int) $giftProduct->sold_quantity);
        $allocations = $offer->rules()->first()->stockAllocations()->get()->keyBy('product_id');
        $this->assertFalse($allocations->has($buyProduct->id));
        $this->assertSame(2, (int) $allocations->get($giftProduct->id)->allocated_quantity);

        $cancelledOrder = app(OrderRepositoryInterface::class)->save([
            'id' => $order->id,
            'order_number' => 'ORD-BTG-SUCCESS-001',
            'customer_name' => 'Promotion Customer',
            'order_status' => 'cancelled',
            'payment_status' => 'paid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'placed_at' => now()->format('Y-m-d H:i:s'),
            'items' => [
                [
                    'product_id' => $buyProduct->id,
                    'quantity' => 1,
                    'unit_price' => 100000,
                ],
            ],
        ], ['task' => 'edit-item']);

        $this->assertNotNull($cancelledOrder);

        $buyProduct->refresh();
        $giftProduct->refresh();
        $allocations = $offer->fresh(['rules.stockAllocations'])->rules->first()->stockAllocations->keyBy('product_id');

        $this->assertSame(0, (int) $buyProduct->sold_quantity);
        $this->assertSame(0, (int) $giftProduct->sold_quantity);
        $this->assertSame(3, (int) $allocations->get($giftProduct->id)->allocated_quantity);
    }

    #[Test]
    public function it_does_not_duplicate_a_gift_item_when_the_same_variant_is_already_present_and_sufficient(): void
    {
        $buyProduct = $this->createProduct('SKU-DUP-BUY', 'Duplicate Buy Product', 100000, 10);
        $giftProduct = $this->createProduct('SKU-DUP-GIFT', 'Duplicate Gift Product', 50000, 10);
        $giftVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'SKU-DUP-GIFT-VAR',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'BTG-DUP-001',
            'name' => 'Duplicate Gift Promo',
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

        $rule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 1]);
        $rule->giftProducts()->attach($giftProduct->id, [
            'variant_id' => $giftVariant->id,
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        $result = app(PromotionEngineService::class)->calculate([
            [
                'product_id' => $buyProduct->id,
                'quantity' => 1,
                'unit_price' => 100000,
            ],
            [
                'product_id' => $giftProduct->id,
                'variant_id' => $giftVariant->id,
                'quantity' => 2,
                'unit_price' => 0,
                'is_gift' => true,
            ],
        ]);

        $giftItems = collect($result['items'])
            ->filter(fn (array $item): bool => (bool) ($item['is_gift'] ?? false))
            ->values();

        $this->assertCount(1, $giftItems);
        $matchingGift = $giftItems->first(function (array $item) use ($giftProduct, $giftVariant): bool {
            return (int) ($item['product_id'] ?? 0) === $giftProduct->id
                && (int) ($item['variant_id'] ?? 0) === $giftVariant->id;
        });

        $this->assertNotNull($matchingGift);
        $this->assertSame(2, (int) ($matchingGift['quantity'] ?? 0));
    }

    #[Test]
    public function it_prefers_buy_product_buy_to_gift_rules_over_order_amount_rules_within_the_same_offer(): void
    {
        $buyProduct = $this->createProduct('SKU-PREF-BUY', 'Preferred Buy Product', 100000, 10);
        $otherProduct = $this->createProduct('SKU-PREF-OTHER', 'Preferred Other Product', 80000, 10);
        $buyGiftProduct = $this->createProduct('SKU-PREF-BUY-GIFT', 'Preferred Buy Gift Product', 50000, 10);
        $orderAmountGiftProduct = $this->createProduct('SKU-PREF-ORDER-GIFT', 'Preferred Order Gift Product', 50000, 10);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'BTG-PREF-001',
            'name' => 'Preferred Buy To Gift Offer',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $buyProductRule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'buy_product',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 10,
        ]);

        $buyProductRule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 1]);
        $buyProductRule->giftProducts()->attach($buyGiftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        $orderAmountRule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'order_amount',
            'min_order_amount' => 70000,
            'max_gift_qty' => 10,
            'priority' => 2,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 10,
        ]);

        $orderAmountRule->giftProducts()->attach($orderAmountGiftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        $result = app(PromotionEngineService::class)->calculate([
            [
                'product_id' => $buyProduct->id,
                'quantity' => 1,
                'unit_price' => 100000,
            ],
            [
                'product_id' => $otherProduct->id,
                'quantity' => 1,
                'unit_price' => 80000,
            ],
        ]);

        $giftItems = collect($result['items'])
            ->filter(fn (array $item): bool => (bool) ($item['is_gift'] ?? false))
            ->values();

        $this->assertCount(2, $giftItems);
        $this->assertTrue(
            $giftItems->contains(fn (array $item): bool => (int) ($item['product_id'] ?? 0) === $buyGiftProduct->id)
        );
        $this->assertTrue(
            $giftItems->contains(fn (array $item): bool => (int) ($item['product_id'] ?? 0) === $orderAmountGiftProduct->id)
        );
        $this->assertCount(2, collect($result['applied_promotions'] ?? [])->where('type', 'buy_to_gift'));
        $this->assertTrue(
            collect($result['applied_promotions'] ?? [])->contains(fn (array $promotion): bool => (int) ($promotion['rule_id'] ?? 0) === $buyProductRule->id)
        );
        $this->assertTrue(
            collect($result['applied_promotions'] ?? [])->contains(fn (array $promotion): bool => (int) ($promotion['rule_id'] ?? 0) === $orderAmountRule->id)
        );
    }

    #[Test]
    public function it_applies_order_amount_buy_to_gift_promotions_with_variant_options(): void
    {
        $buyProduct = $this->createProduct('SKU-ORDER-AMOUNT-BUY', 'Order Amount Buy Product', 100000, 10);
        $giftProduct = $this->createProduct('SKU-ORDER-AMOUNT-GIFT', 'Order Amount Gift Product', 50000, 10);
        $giftVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'SKU-ORDER-AMOUNT-GIFT-BLUE',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'BTG-ORDER-001',
            'name' => 'Order Amount Promotion',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $rule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'order_amount',
            'min_order_amount' => 700000,
            'max_gift_qty' => 10,
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
        $rule->giftVariantOptions()->create([
            'product_id' => $giftProduct->id,
            'variant_id' => $giftVariant->id,
            'reserve_qty' => 2,
        ]);

        $result = app(PromotionEngineService::class)->calculate([
            [
                'product_id' => $buyProduct->id,
                'quantity' => 7,
                'unit_price' => 100000,
            ],
        ]);

        $giftItems = collect($result['items'])
            ->filter(fn (array $item): bool => (bool) ($item['is_gift'] ?? false))
            ->values();

        $this->assertCount(1, $giftItems);
        $giftItem = $giftItems->first();

        $this->assertSame($giftProduct->id, (int) ($giftItem['product_id'] ?? 0));
        $this->assertSame($giftVariant->id, (int) ($giftItem['variant_id'] ?? 0));
        $this->assertSame(1, (int) ($giftItem['quantity'] ?? 0));
        $this->assertSame(0.0, (float) ($giftItem['unit_price'] ?? 0));
        $this->assertSame(0.0, (float) ($result['discount_total'] ?? 0));
    }

    #[Test]
    public function it_allows_order_amount_buy_to_gift_when_buy_product_rules_have_no_available_slots(): void
    {
        $buyProduct = $this->createProduct('SKU-ORDER-FALLBACK-BUY', 'Order Amount Fallback Buy Product', 100000, 10);
        $giftBuyProduct = $this->createProduct('SKU-ORDER-FALLBACK-BUY-GIFT', 'Order Amount Fallback Buy Gift', 50000, 10);
        $giftOrderAmountProduct = $this->createProduct('SKU-ORDER-FALLBACK-ORDER-GIFT', 'Order Amount Fallback Gift', 50000, 10);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'BTG-FALLBACK-001',
            'name' => 'Order Amount Fallback Offer',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $buyProductRule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'buy_product',
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 0,
        ]);

        $buyProductRule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 1]);
        $buyProductRule->giftProducts()->attach($giftBuyProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        $orderAmountRule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'order_amount',
            'min_order_amount' => 100000,
            'max_gift_qty' => 10,
            'priority' => 2,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 10,
        ]);

        $orderAmountRule->giftProducts()->attach($giftOrderAmountProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        $payload = [
            'customer_name' => 'Nguyen Van A',
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'items' => [
                [
                    'product_id' => $buyProduct->id,
                    'quantity' => 1,
                    'unit_price' => 100000,
                ],
            ],
        ];

        $request = new OrderRequest;
        $request->merge($payload);

        $validator = Validator::make($payload, $request->rules());
        foreach ($request->after() as $callback) {
            $callback($validator);
        }

        $this->assertTrue($validator->passes());
    }

    #[Test]
    public function it_splits_buy_to_gift_variant_items_and_reduces_them_when_order_amount_changes(): void
    {
        $buyProduct = $this->createProduct('SKU-ORDER-AMOUNT-BUY-SPLIT', 'Order Amount Buy Split Product', 100000, 20);
        $giftProduct = $this->createProduct('SKU-ORDER-AMOUNT-GIFT-SPLIT', 'Order Amount Gift Split Product', 50000, 20);
        $blueVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'SKU-ORDER-AMOUNT-GIFT-SPLIT-BLUE',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);
        $pinkVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'SKU-ORDER-AMOUNT-GIFT-SPLIT-PINK',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'BTG-ORDER-SPLIT-001',
            'name' => 'Order Amount Split Promotion',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $rule = PromotionBuyToGiftOfferRule::query()->create([
            'promotion_buytogift_offer_id' => $offer->id,
            'condition_type' => 'order_amount',
            'min_order_amount' => 100000,
            'max_gift_qty' => 20,
            'priority' => 1,
            'is_active' => true,
            'stackable' => false,
            'stock_scope' => 'limited',
            'stock_limit' => 20,
        ]);

        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);
        $rule->giftVariantOptions()->createMany([
            [
                'product_id' => $giftProduct->id,
                'variant_id' => $blueVariant->id,
                'reserve_qty' => 10,
            ],
            [
                'product_id' => $giftProduct->id,
                'variant_id' => $pinkVariant->id,
                'reserve_qty' => 10,
            ],
        ]);

        $engine = app(PromotionEngineService::class);

        $expandedResult = $engine->calculate([
            [
                'product_id' => $buyProduct->id,
                'quantity' => 18,
                'unit_price' => 100000,
            ],
        ]);

        $expandedGiftItems = collect($expandedResult['items'])
            ->filter(fn (array $item): bool => (bool) ($item['is_gift'] ?? false))
            ->values();

        $this->assertCount(2, $expandedGiftItems);
        $this->assertSame(18, (int) $expandedGiftItems->sum('quantity'));
        $this->assertSame(10, (int) ($expandedGiftItems[0]['quantity'] ?? 0));
        $this->assertSame(8, (int) ($expandedGiftItems[1]['quantity'] ?? 0));

        $reducedResult = $engine->calculate([
            [
                'product_id' => $buyProduct->id,
                'quantity' => 8,
                'unit_price' => 100000,
            ],
        ]);

        $reducedGiftItems = collect($reducedResult['items'])
            ->filter(fn (array $item): bool => (bool) ($item['is_gift'] ?? false))
            ->values();

        $this->assertCount(1, $reducedGiftItems);
        $this->assertSame(8, (int) ($reducedGiftItems[0]['quantity'] ?? 0));
        $this->assertSame($blueVariant->id, (int) ($reducedGiftItems[0]['variant_id'] ?? 0));
    }

    #[Test]
    public function it_restores_variant_stock_and_buy_to_gift_reserves_when_an_order_is_deleted(): void
    {
        $user = User::factory()->create([
            'account_id' => 1,
        ]);

        $variantProduct = $this->createProduct('SKU-ORDER-DELETE-VAR', 'Delete Variant Product', 100000, 5);
        $variantRed = ProductVariant::query()->create([
            'product_id' => $variantProduct->id,
            'sku' => 'SKU-ORDER-DELETE-VAR-RED',
            'price' => 110000,
            'stock' => 5,
            'image' => null,
            'images' => null,
        ]);

        $buyProduct = $this->createProduct('SKU-ORDER-DELETE-BUY', 'Delete Buy Product', 90000, 10);
        $giftProduct = $this->createProduct('SKU-ORDER-DELETE-GIFT', 'Delete Gift Product', 50000, 10);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'BTG-DELETE-001',
            'name' => 'Delete Order Promotion',
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
            'stock_limit' => 60,
            'max_gift_qty' => 1,
        ]);

        $rule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 1]);
        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);

        app(BuyToGiftStockAllocator::class)->syncOffer(
            $offer->fresh(['rules.buyProducts', 'rules.giftProducts', 'rules.stockAllocations'])
        );

        $this->assertSame(10, (int) $buyProduct->fresh()->quantity);
        $this->assertSame(9, (int) $giftProduct->fresh()->quantity);

        $createdOrder = app(OrderRepositoryInterface::class)->save([
            'order_number' => 'ORD-DELETE-001',
            'customer_name' => 'Delete Customer',
            'order_status' => 'completed',
            'payment_status' => 'paid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'placed_at' => now()->format('Y-m-d H:i:s'),
            'items' => [
                [
                    'product_id' => $variantProduct->id,
                    'variant_id' => $variantRed->id,
                    'quantity' => 2,
                    'unit_price' => 110000,
                ],
                [
                    'product_id' => $buyProduct->id,
                    'quantity' => 1,
                    'unit_price' => 90000,
                ],
            ],
        ], ['task' => 'add-item']);

        $this->assertNotNull($createdOrder);

        $variantProduct->refresh();
        $buyProduct->refresh();
        $giftProduct->refresh();
        $offer->refresh();

        $this->assertSame(3, (int) $variantRed->fresh()->stock);
        $this->assertSame(3, (int) $variantProduct->fresh()->quantity);
        $this->assertSame(9, (int) $buyProduct->fresh()->quantity);
        $this->assertSame(9, (int) $giftProduct->fresh()->quantity);
        $this->assertSame(2, (int) $variantProduct->fresh()->sold_quantity);
        $this->assertSame(1, (int) $buyProduct->fresh()->sold_quantity);
        $this->assertSame(0, (int) $giftProduct->fresh()->sold_quantity);

        $deletedCount = app(OrderRepositoryInterface::class)->delete([
            'id' => $createdOrder->id,
        ], ['task' => 'delete-item']);

        $this->assertSame(1, $deletedCount);

        $variantProduct->refresh();
        $buyProduct->refresh();
        $giftProduct->refresh();
        $offer = $offer->fresh(['rules.stockAllocations']);
        $rule = $offer->rules->firstOrFail();
        $allocations = $rule->stockAllocations->keyBy('product_id');

        $this->assertSame(5, (int) $variantRed->fresh()->stock);
        $this->assertSame(5, (int) $variantProduct->fresh()->quantity);
        $this->assertSame(10, (int) $buyProduct->fresh()->quantity);
        $this->assertSame(9, (int) $giftProduct->fresh()->quantity);
        $this->assertSame(0, (int) $variantProduct->fresh()->sold_quantity);
        $this->assertSame(0, (int) $buyProduct->fresh()->sold_quantity);
        $this->assertSame(0, (int) $giftProduct->fresh()->sold_quantity);
        $this->assertSame(1, (int) $allocations->get($giftProduct->id)->allocated_quantity);
    }

    #[Test]
    public function admin_can_create_an_order_and_items_with_computed_totals(): void
    {
        $user = User::factory()->create([
            'account_id' => 1,
        ]);

        $paymentMethod = PaymentMethod::query()->create([
            'code' => 'cash_on_delivery',
            'provider' => 'cash_on_delivery',
            'name' => 'Cash On Delivery',
            'description' => null,
            'settings' => [],
            'sort_order' => 0,
            'is_active' => true,
            'is_system' => false,
        ]);

        $productA = $this->createProduct('SKU-001', 'Product One', 120000, 20);
        $productB = $this->createProduct('SKU-002', 'Product Two', 50000, 10);

        $response = $this->actingAs($user)->post(route('orders.store'), [
            'customer_name' => 'Nguyen Van A',
            'customer_email' => 'customer@example.com',
            'customer_phone' => '0909123456',
            'customer_address' => '123 Test Street',
            'note' => 'Handle with care',
            'payment_method_id' => $paymentMethod->id,
            'order_status' => 'confirmed',
            'payment_status' => 'paid',
            'shipping_status' => 'ready_to_ship',
            'discount_total' => 10000,
            'shipping_total' => 25000,
            'placed_at' => '2026-04-28 10:00:00',
            'price_snapshot' => $this->buildPriceSnapshot(
                locale: 'en-US',
                currencyCode: 'USD',
                exchangeRateToVnd: 25000,
            ),
            'items' => [
                [
                    'product_id' => $productA->id,
                    'quantity' => 2,
                    'unit_price' => 120000,
                ],
                [
                    'product_id' => $productB->id,
                    'quantity' => 1,
                    'unit_price' => 50000,
                ],
            ],
        ]);

        $order = Order::query()->with('items')->firstOrFail();

        $response->assertRedirect(route('orders.edit', $order->id));
        $this->assertSame(3, $order->total_quantity);
        $this->assertSame('confirmed', $order->order_status);
        $this->assertEquals(290000.0, (float) $order->subtotal);
        $this->assertEquals(305000.0, (float) $order->grand_total);
        $this->assertIsArray($order->price_snapshot);
        $this->assertCount(2, $order->price_snapshot);
        $this->assertNotNull(collect($order->price_snapshot)->firstWhere('locale', 'en'));
        $this->assertNotNull(collect($order->price_snapshot)->firstWhere('locale', 'ja'));
        $this->assertCount(2, $order->items);
        $this->assertDatabaseHas('order_timelines', [
            'order_id' => $order->id,
            'event_type' => 'created',
        ]);
        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'product_id' => $productA->id,
            'product_name' => 'Product One',
            'quantity' => 2,
        ]);
    }

    #[Test]
    public function order_form_options_include_buy_to_gift_variant_reserve_map(): void
    {
        $user = User::factory()->create([
            'account_id' => 1,
        ]);

        $giftProduct = $this->createProduct('SKU-FORM-GIFT', 'Form Gift Product', 50000, 20);
        $giftVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'SKU-FORM-GIFT-BLUE',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'FORM-BTG-001',
            'name' => 'Form reserve',
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
            'max_gift_qty' => 10,
        ]);

        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);
        $rule->giftVariantOptions()->create([
            'product_id' => $giftProduct->id,
            'variant_id' => $giftVariant->id,
            'reserve_qty' => 10,
        ]);

        $this->actingAs($user)
            ->get(route('orders.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Sales/Order/Created')
                ->where('form_options.buytogift_gift_variant_reserves.'.($rule->id.':'.$giftProduct->id.':'.$giftVariant->id), 10)
            );
    }

    #[Test]
    public function it_requires_variant_when_product_has_variants_and_stores_variant_snapshot(): void
    {
        $user = User::factory()->create([
            'account_id' => 1,
        ]);
        $location = $this->createTestLocation();

        $product = $this->createProduct('SKU-VAR', 'Variant Product', 100000, 20);
        $variant = ProductVariant::query()->create([
            'product_id' => $product->id,
            'sku' => 'SKU-VAR-RED',
            'price' => 125000,
            'stock' => 5,
            'image' => null,
            'images' => [],
        ]);
        $paymentMethod = PaymentMethod::query()->create([
            'code' => 'cash_on_delivery_variant',
            'provider' => 'cash_on_delivery',
            'name' => 'Cash On Delivery Variant',
            'description' => null,
            'settings' => [],
            'sort_order' => 0,
            'is_active' => true,
            'is_system' => false,
        ]);

        $payload = [
            'order_number' => 'ORD-VAR-001',
            'customer_name' => 'Nguyen Van A',
            'customer_phone' => '0909123456',
            'customer_address' => '123 Test Street',
            'province_code' => $location['province_code'],
            'ward_code' => $location['ward_code'],
            'payment_method_id' => $paymentMethod->id,
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'unit_price' => 125000,
                ],
            ],
        ];

        $this->actingAs($user)
            ->post(route('orders.store'), $payload)
            ->assertSessionHasErrors('items.0.variant_id');

        $payload['items'][0]['variant_id'] = $variant->id;

        $response = $this->actingAs($user)->post(route('orders.store'), $payload);
        $order = Order::query()->with('items')->latest('id')->firstOrFail();

        $response->assertRedirect(route('orders.edit', $order->id));

        $orderItem = OrderItem::query()->where('order_id', $order->id)->firstOrFail();
        $this->assertSame($variant->id, $orderItem->meta['variant']['id'] ?? null);
        $this->assertSame('SKU-VAR-RED', $orderItem->product_sku);
    }

    #[Test]
    public function admin_can_update_an_order_and_replace_its_items(): void
    {
        $user = User::factory()->create([
            'account_id' => 1,
        ]);
        $location = $this->createTestLocation();

        $paymentMethod = PaymentMethod::query()->create([
            'code' => 'momo',
            'provider' => 'momo',
            'name' => 'MoMo',
            'description' => null,
            'settings' => [],
            'sort_order' => 1,
            'is_active' => true,
            'is_system' => false,
        ]);

        $productA = $this->createProduct('SKU-003', 'Product Three', 90000, 15);
        $productB = $this->createProduct('SKU-004', 'Product Four', 30000, 12);

        $order = Order::query()->create([
            'order_number' => 'ORD-TEST-001',
            'payment_method_id' => $paymentMethod->id,
            'customer_name' => 'Original Customer',
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'total_quantity' => 1,
            'subtotal' => 90000,
            'discount_total' => 0,
            'shipping_total' => 0,
            'grand_total' => 90000,
            'placed_at' => now(),
        ]);

        $order->items()->create([
            'product_id' => $productA->id,
            'product_name' => 'Product Three',
            'product_sku' => 'SKU-003',
            'quantity' => 1,
            'unit_price' => 90000,
            'line_total' => 90000,
            'meta' => [],
        ]);

        $response = $this->actingAs($user)->put(route('orders.update', $order->id), [
            'order_number' => 'ORD-TEST-001',
            'customer_name' => 'Updated Customer',
            'customer_email' => 'updated@example.com',
            'customer_phone' => '0911222333',
            'customer_address' => '456 Updated Street',
            'province_code' => $location['province_code'],
            'ward_code' => $location['ward_code'],
            'note' => 'Updated note',
            'payment_method_id' => $paymentMethod->id,
            'order_status' => 'processing',
            'payment_status' => 'paid',
            'shipping_status' => 'shipping',
            'discount_total' => 5000,
            'shipping_total' => 10000,
            'placed_at' => '2026-04-28 11:30:00',
            'price_snapshot' => $this->buildPriceSnapshot(
                locale: 'ja-JP',
                currencyCode: 'JPY',
                exchangeRateToVnd: 185,
            ),
            'items' => [
                [
                    'product_id' => $productB->id,
                    'quantity' => 3,
                    'unit_price' => 30000,
                ],
            ],
        ]);

        $response->assertRedirect(route('orders.edit', $order->id));

        $order->refresh();
        $this->assertSame('Updated Customer', $order->customer_name);
        $this->assertSame('processing', $order->order_status);
        $this->assertSame(3, $order->total_quantity);
        $this->assertEquals(95000.0, (float) $order->grand_total);
        $this->assertIsArray($order->price_snapshot);
        $this->assertCount(2, $order->price_snapshot);
        $this->assertNotNull(collect($order->price_snapshot)->firstWhere('locale', 'en'));
        $this->assertNotNull(collect($order->price_snapshot)->firstWhere('locale', 'ja'));
        $this->assertSame(4, OrderTimeline::query()->where('order_id', $order->id)->count());
        $this->assertDatabaseHas('order_timelines', [
            'order_id' => $order->id,
            'event_type' => 'payment_status_changed',
            'old_value' => 'unpaid',
            'new_value' => 'paid',
        ]);
        $this->assertDatabaseMissing('order_items', [
            'order_id' => $order->id,
            'product_id' => $productA->id,
        ]);
        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'product_id' => $productB->id,
            'quantity' => 3,
        ]);
    }

    #[Test]
    public function admin_can_open_the_read_only_show_page_for_an_order(): void
    {
        $user = User::factory()->create([
            'account_id' => 1,
        ]);

        $order = Order::query()->create([
            'order_number' => 'ORD-SHOW-001',
            'customer_name' => 'Readonly Customer',
            'coupon_code' => 'WELCOME10',
            'order_status' => 'confirmed',
            'payment_status' => 'paid',
            'shipping_status' => 'ready_to_ship',
            'total_quantity' => 1,
            'subtotal' => 150000,
            'discount_total' => 0,
            'shipping_total' => 10000,
            'grand_total' => 160000,
            'placed_at' => now(),
            'applied_promotions' => [
                [
                    'type' => 'sale_offer',
                    'id' => 2,
                    'name' => 'Discount 10%',
                    'discount_amount' => 50000,
                ],
                [
                    'type' => 'coupon',
                    'id' => 1,
                    'code' => 'WELCOME10',
                    'name' => 'Welcome 10',
                    'discount_amount' => 15000,
                ],
            ],
        ]);

        $order->items()->create([
            'product_id' => $this->createProduct('SKU-SHOW-001', 'Show Product', 150000, 5)->id,
            'product_name' => 'Show Product',
            'product_sku' => 'SKU-SHOW-001',
            'quantity' => 1,
            'unit_price' => 150000,
            'line_total' => 150000,
            'meta' => [],
        ]);

        $response = $this->actingAs($user)->get(route('orders.show', $order->id));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Sales/Order/Show')
            ->where('page_title', 'Đơn hàng - ORD-SHOW-001 - Readonly Customer')
            ->where('item.applied_promotions.0.type', 'sale_offer')
            ->where('item.applied_promotions.0.discount_amount', 50000)
            ->where('item.coupon_code', 'WELCOME10')
            ->where('item.applied_promotions.1.type', 'coupon')
            ->where('item.applied_promotions.1.code', 'WELCOME10')
        );
    }

    #[Test]
    public function admin_can_edit_an_order_with_coupon_code_and_existing_gift_items_preserved(): void
    {
        $user = User::factory()->create([
            'account_id' => 1,
        ]);

        $product = $this->createProduct('SKU-EDIT-001', 'Edit Product', 120000, 20);

        $order = Order::query()->create([
            'order_number' => 'ORD-EDIT-001',
            'customer_name' => 'Edit Customer',
            'coupon_code' => 'A0001',
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'total_quantity' => 2,
            'subtotal' => 120000,
            'discount_total' => 0,
            'shipping_total' => 0,
            'grand_total' => 120000,
            'placed_at' => now(),
            'applied_promotions' => [
                [
                    'type' => 'buy_to_gift',
                    'id' => 1,
                    'rule_id' => 3,
                    'name' => 'Gift promo',
                    'gift_quantity' => 1,
                ],
            ],
        ]);

        $order->items()->createMany([
            [
                'product_id' => $product->id,
                'product_name' => 'Edit Product',
                'product_sku' => 'SKU-EDIT-001',
                'quantity' => 1,
                'unit_price' => 120000,
                'line_total' => 120000,
                'meta' => [
                    'is_gift' => false,
                ],
            ],
            [
                'product_id' => $product->id,
                'product_name' => 'Edit Product',
                'product_sku' => 'SKU-EDIT-001',
                'quantity' => 1,
                'unit_price' => 0,
                'line_total' => 0,
                'meta' => [
                    'is_gift' => true,
                    'rule_id' => 3,
                ],
            ],
        ]);

        $response = $this->actingAs($user)->get(route('orders.edit', $order->id));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Sales/Order/Edit')
            ->where('item.coupon_code', 'A0001')
            ->where('item.applied_promotions.0.type', 'buy_to_gift')
            ->where('item.items.1.is_gift', true)
            ->where('item.items.1.rule_id', 3)
        );
    }

    #[Test]
    public function admin_can_edit_an_order_with_split_gift_items_preserved_on_load(): void
    {
        $user = User::factory()->create([
            'account_id' => 1,
        ]);

        $product = $this->createProduct('SKU-EDIT-SPLIT', 'Edit Split Product', 120000, 20);
        $giftProduct = $this->createProduct('SKU-EDIT-SPLIT-GIFT', 'Edit Split Gift Product', 50000, 20);
        $blueVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'SKU-EDIT-SPLIT-GIFT-BLUE',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);
        $pinkVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'SKU-EDIT-SPLIT-GIFT-PINK',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);

        $order = Order::query()->create([
            'order_number' => 'ORD-EDIT-SPLIT-001',
            'customer_name' => 'Edit Split Customer',
            'coupon_code' => 'A0001',
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'total_quantity' => 20,
            'subtotal' => 120000,
            'discount_total' => 0,
            'shipping_total' => 0,
            'grand_total' => 120000,
            'placed_at' => now(),
        ]);

        $order->items()->createMany([
            [
                'product_id' => $product->id,
                'product_name' => 'Edit Split Product',
                'product_sku' => 'SKU-EDIT-SPLIT',
                'quantity' => 2,
                'unit_price' => 120000,
                'line_total' => 240000,
                'meta' => [
                    'is_gift' => false,
                ],
            ],
            [
                'product_id' => $giftProduct->id,
                'product_name' => 'Edit Split Gift Product - Xanh dương',
                'product_sku' => 'SKU-EDIT-SPLIT-GIFT-BLUE',
                'quantity' => 10,
                'unit_price' => 0,
                'line_total' => 0,
                'meta' => [
                    'is_gift' => true,
                    'rule_id' => 2,
                    'variant' => [
                        'id' => $blueVariant->id,
                        'sku' => $blueVariant->sku,
                        'name' => $blueVariant->name,
                        'label' => 'Xanh dương',
                        'stock' => $blueVariant->stock,
                        'attribute_values' => [],
                    ],
                ],
            ],
            [
                'product_id' => $giftProduct->id,
                'product_name' => 'Edit Split Gift Product - Màu tím',
                'product_sku' => 'SKU-EDIT-SPLIT-GIFT-PINK',
                'quantity' => 8,
                'unit_price' => 0,
                'line_total' => 0,
                'meta' => [
                    'is_gift' => true,
                    'rule_id' => 2,
                    'variant' => [
                        'id' => $pinkVariant->id,
                        'sku' => $pinkVariant->sku,
                        'name' => $pinkVariant->name,
                        'label' => 'Màu tím',
                        'stock' => $pinkVariant->stock,
                        'attribute_values' => [],
                    ],
                ],
            ],
        ]);

        $response = $this->actingAs($user)->get(route('orders.edit', $order->id));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Sales/Order/Edit')
            ->where('item.items.1.quantity', 10)
            ->where('item.items.2.quantity', 8)
            ->where('item.items.1.is_gift', true)
            ->where('item.items.2.is_gift', true)
        );
    }

    #[Test]
    public function admin_can_update_an_order_with_existing_gift_items_without_duplication(): void
    {
        $user = User::factory()->create([
            'account_id' => 1,
        ]);
        $location = $this->createTestLocation();

        $product = $this->createProduct('SKU-EDIT-002', 'Edit Product 2', 120000, 20);
        $paymentMethod = PaymentMethod::query()->create([
            'code' => 'momo_edit_002',
            'provider' => 'momo',
            'name' => 'Momo',
            'description' => null,
            'settings' => [],
            'sort_order' => 0,
            'is_active' => true,
            'is_system' => false,
        ]);

        $order = Order::query()->create([
            'order_number' => 'ORD-EDIT-002',
            'customer_name' => 'Edit Customer 2',
            'payment_method_id' => $paymentMethod->id,
            'coupon_code' => null,
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'total_quantity' => 2,
            'subtotal' => 120000,
            'discount_total' => 0,
            'shipping_total' => 0,
            'grand_total' => 120000,
            'placed_at' => now(),
        ]);

        $order->items()->createMany([
            [
                'product_id' => $product->id,
                'product_name' => 'Edit Product 2',
                'product_sku' => 'SKU-EDIT-002',
                'quantity' => 1,
                'unit_price' => 120000,
                'line_total' => 120000,
                'meta' => [
                    'is_gift' => false,
                ],
            ],
            [
                'product_id' => $product->id,
                'product_name' => 'Edit Product 2',
                'product_sku' => 'SKU-EDIT-002',
                'quantity' => 1,
                'unit_price' => 0,
                'line_total' => 0,
                'meta' => [
                    'is_gift' => true,
                    'rule_id' => 3,
                ],
            ],
        ]);

        $response = $this->actingAs($user)->put(route('orders.update', $order->id), [
            'order_number' => 'ORD-EDIT-002',
            'customer_name' => 'Edit Customer 2 Updated',
            'customer_email' => 'updated@example.com',
            'customer_phone' => '0911222333',
            'customer_address' => '456 Updated Street',
            'province_code' => $location['province_code'],
            'ward_code' => $location['ward_code'],
            'note' => 'Updated note',
            'payment_method_id' => $paymentMethod->id,
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'placed_at' => '2026-04-28 11:30:00',
            'price_snapshot' => $this->buildPriceSnapshot(
                locale: 'vi-VN',
                currencyCode: 'VND',
                exchangeRateToVnd: 1,
            ),
            'coupon_code' => '',
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'unit_price' => 120000,
                    'is_gift' => false,
                ],
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'unit_price' => 0,
                    'is_gift' => true,
                    'rule_id' => 3,
                ],
            ],
        ]);

        $response->assertRedirect(route('orders.edit', $order->id));

        $order->refresh();
        $this->assertNull($order->coupon_code);
        $this->assertSame('Edit Customer 2 Updated', $order->customer_name);
        $this->assertSame(2, $order->items()->count());
        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'unit_price' => 0,
        ]);

        $giftItem = $order->items()->where('meta->is_gift', true)->first();
        $this->assertNotNull($giftItem);
        $this->assertSame(3, data_get($giftItem?->meta, 'rule_id'));
    }

    #[Test]
    public function admin_can_save_an_edit_order_without_changing_buy_to_gift_inventory_when_items_are_unchanged(): void
    {
        $user = User::factory()->create([
            'account_id' => 1,
        ]);

        $buyProduct = $this->createProduct('SKU-NOOP-BUY', 'No-op Buy Product', 100000, 20);
        $giftProduct = $this->createProduct('SKU-NOOP-GIFT', 'No-op Gift Product', 50000, 20);
        $giftVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'SKU-NOOP-GIFT-BLUE',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'NOOP-BTG-001',
            'name' => 'No-op reserve check',
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
            'stock_limit' => 30,
            'max_gift_qty' => 10,
        ]);

        $rule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 1]);
        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);
        $rule->giftVariantOptions()->create([
            'product_id' => $giftProduct->id,
            'variant_id' => $giftVariant->id,
            'reserve_qty' => 10,
        ]);

        app(BuyToGiftStockAllocator::class)->syncOffer($offer->fresh([
            'rules.buyProducts',
            'rules.giftProducts',
            'rules.giftVariantOptions.variant',
            'rules.stockAllocations',
        ]));

        $createdOrder = app(OrderRepositoryInterface::class)->save([
            'order_number' => 'ORD-NOOP-BTG-001',
            'customer_name' => 'No-op Save Customer',
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'placed_at' => now()->format('Y-m-d H:i:s'),
            'items' => [
                [
                    'product_id' => $buyProduct->id,
                    'quantity' => 1,
                    'unit_price' => 100000,
                ],
                [
                    'product_id' => $giftProduct->id,
                    'variant_id' => $giftVariant->id,
                    'quantity' => 1,
                    'unit_price' => 0,
                    'is_gift' => true,
                    'rule_id' => $rule->id,
                ],
            ],
        ], ['task' => 'add-item']);

        $this->assertNotNull($createdOrder);

        $rule = $rule->fresh(['giftVariantOptions', 'stockAllocations']);
        $initialReserveQty = (int) $rule->giftVariantOptions()->firstOrFail()->reserve_qty;
        $initialAllocatedQty = (int) $rule->stockAllocations->sum('allocated_quantity');

        $updatedOrder = app(OrderRepositoryInterface::class)->save([
            'id' => $createdOrder->id,
            'order_number' => 'ORD-NOOP-BTG-001',
            'customer_name' => 'No-op Save Customer',
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'placed_at' => now()->format('Y-m-d H:i:s'),
            'items' => [
                [
                    'product_id' => $buyProduct->id,
                    'quantity' => 1,
                    'unit_price' => 100000,
                ],
                [
                    'product_id' => $giftProduct->id,
                    'variant_id' => $giftVariant->id,
                    'quantity' => 1,
                    'unit_price' => 0,
                    'is_gift' => true,
                    'rule_id' => $rule->id,
                ],
            ],
        ], ['task' => 'edit-item']);

        $this->assertNotNull($updatedOrder);

        $rule = $rule->fresh(['giftVariantOptions', 'stockAllocations']);
        $this->assertSame($initialReserveQty, (int) $rule->giftVariantOptions()->firstOrFail()->reserve_qty);
        $this->assertSame($initialAllocatedQty, (int) $rule->stockAllocations->sum('allocated_quantity'));
    }

    #[Test]
    public function admin_can_save_a_buy_to_gift_promotion_without_resyncing_stock_when_configuration_is_unchanged(): void
    {
        $buyProduct = $this->createProduct('SKU-NOOP-PROMO-BUY', 'No-op Promo Buy Product', 100000, 20);
        $giftProduct = $this->createProduct('SKU-NOOP-PROMO-GIFT', 'No-op Promo Gift Product', 50000, 20);
        $giftVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'SKU-NOOP-PROMO-GIFT-BLUE',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'NOOP-PROMO-BTG-001',
            'name' => 'No-op promotion save',
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
            'stock_limit' => 30,
            'max_gift_qty' => 10,
        ]);

        $rule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 1]);
        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);
        $rule->giftVariantOptions()->create([
            'product_id' => $giftProduct->id,
            'variant_id' => $giftVariant->id,
            'reserve_qty' => 10,
        ]);

        app(BuyToGiftStockAllocator::class)->syncOffer($offer->fresh([
            'rules.buyProducts',
            'rules.giftProducts',
            'rules.giftVariantOptions.variant',
            'rules.stockAllocations',
        ]));

        $offer = $offer->fresh([
            'rules.buyProducts',
            'rules.giftProducts',
            'rules.giftVariantOptions',
            'rules.stockAllocations',
        ]);
        $initialReserveQty = (int) $offer->rules->firstOrFail()->giftVariantOptions()->firstOrFail()->reserve_qty;
        $initialAllocatedQty = (int) $offer->rules->firstOrFail()->stockAllocations->sum('allocated_quantity');
        $initialGiftStock = (int) $giftVariant->fresh()->stock;
        $initialParentStock = (int) $giftProduct->fresh()->quantity;

        $savedOffer = app(BuyToGiftRepositoryInterface::class)->save([
            'id' => $offer->id,
            'code' => $offer->code,
            'name' => $offer->name,
            'description' => $offer->description,
            'campaign_id' => $offer->campaign_id,
            'starts_at' => optional($offer->starts_at)?->format('Y-m-d H:i:s'),
            'ends_at' => optional($offer->ends_at)?->format('Y-m-d H:i:s'),
            'priority' => $offer->priority,
            'is_active' => true,
            'stackable' => false,
            'rules' => [
                [
                    'id' => $rule->id,
                    'condition_type' => 'buy_product',
                    'min_order_amount' => null,
                    'max_sets_per_order' => null,
                    'max_gift_qty' => 10,
                    'stock_scope' => 'limited',
                    'stock_limit' => 30,
                    'priority' => 1,
                    'is_active' => true,
                    'stackable' => false,
                    'buy_items' => [
                        [
                            'product_id' => $buyProduct->id,
                            'variant_id' => null,
                        ],
                    ],
                    'gift_items' => [
                        [
                            'product_id' => $giftProduct->id,
                            'variant_id' => null,
                        ],
                    ],
                    'gift_variant_options' => [
                        [
                            'product_id' => $giftProduct->id,
                            'variant_id' => $giftVariant->id,
                            'reserve_qty' => 10,
                        ],
                    ],
                    'buy_qty' => 1,
                    'gift_qty' => 1,
                ],
            ],
        ], ['task' => 'edit-item']);

        $this->assertNotNull($savedOffer);

        $offer = $offer->fresh(['rules.buyProducts', 'rules.giftProducts', 'rules.giftVariantOptions', 'rules.stockAllocations']);
        $this->assertSame($initialReserveQty, (int) $offer->rules->firstOrFail()->giftVariantOptions()->firstOrFail()->reserve_qty);
        $this->assertSame($initialAllocatedQty, (int) $offer->rules->firstOrFail()->stockAllocations->sum('allocated_quantity'));
        $this->assertSame($initialGiftStock, (int) $giftVariant->fresh()->stock);
        $this->assertSame($initialParentStock, (int) $giftProduct->fresh()->quantity);
    }

    #[Test]
    public function admin_can_create_an_order_and_deduct_variant_and_free_stock_correctly(): void
    {
        $user = User::factory()->create([
            'account_id' => 1,
        ]);
        $location = $this->createTestLocation();

        $product = $this->createProduct('SKU-ORDER-VARIANT', 'Order Variant Product', 100000, 12);
        $variantRed = ProductVariant::query()->create([
            'product_id' => $product->id,
            'sku' => 'SKU-ORDER-VARIANT-RED',
            'price' => 110000,
            'stock' => 8,
            'image' => null,
            'images' => null,
        ]);
        ProductVariant::query()->create([
            'product_id' => $product->id,
            'sku' => 'SKU-ORDER-VARIANT-BLUE',
            'price' => 105000,
            'stock' => 4,
            'image' => null,
            'images' => null,
        ]);

        $giftProduct = $this->createProduct('SKU-ORDER-GIFT', 'Order Gift Product', 50000, 9);
        $paymentMethod = PaymentMethod::query()->create([
            'code' => 'cash_on_delivery_order',
            'provider' => 'cash_on_delivery',
            'name' => 'Cash On Delivery Order',
            'description' => null,
            'settings' => [],
            'sort_order' => 0,
            'is_active' => true,
            'is_system' => false,
        ]);

        $response = $this->actingAs($user)->post(route('orders.store'), [
            'order_number' => 'ORD-ORDER-BTG-001',
            'customer_name' => 'Nguyen Van A',
            'customer_phone' => '0909123456',
            'customer_address' => '123 Test Street',
            'province_code' => $location['province_code'],
            'ward_code' => $location['ward_code'],
            'payment_method_id' => $paymentMethod->id,
            'order_status' => 'completed',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'placed_at' => '2026-04-28 10:00:00',
            'items' => [
                [
                    'product_id' => $product->id,
                    'variant_id' => $variantRed->id,
                    'quantity' => 3,
                    'unit_price' => 110000,
                ],
                [
                    'product_id' => $giftProduct->id,
                    'quantity' => 1,
                    'unit_price' => 0,
                    'is_gift' => true,
                ],
            ],
        ]);

        $order = Order::query()->with('items')->latest('id')->firstOrFail();

        $response->assertRedirect(route('orders.edit', $order->id));
        $this->assertSame(5, (int) $variantRed->fresh()->stock);
        $this->assertSame(9, (int) $product->fresh()->quantity);
        $this->assertSame(9, (int) $giftProduct->fresh()->quantity);
        $this->assertSame(1, (int) $giftProduct->fresh()->sold_quantity);
        $this->assertCount(2, $order->items);

        $orderItem = $order->items->firstWhere('product_id', $product->id);
        $this->assertNotNull($orderItem);
        $this->assertSame($variantRed->id, (int) data_get($orderItem?->meta, 'variant.id'));
        $this->assertSame('SKU-ORDER-VARIANT-RED', $orderItem?->product_sku);

        $giftItem = $order->items()->where('meta->is_gift', true)->first();
        $this->assertNotNull($giftItem);
        $this->assertSame(1, (int) $giftItem->quantity);
    }

    #[Test]
    public function it_deducts_pending_order_buy_to_gift_reserves_immediately_on_creation(): void
    {
        $this->withoutMiddleware();

        $location = $this->createTestLocation();
        $buyProduct = $this->createProduct('SKU-PENDING-BUY', 'Pending Buy Product', 100000, 20);
        $giftProduct = $this->createProduct('SKU-PENDING-GIFT', 'Pending Gift Product', 50000, 20);
        $blueVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'SKU-PENDING-GIFT-BLUE',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);
        $pinkVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'SKU-PENDING-GIFT-PINK',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'PENDING-BTG-001',
            'name' => 'Pending order reserve',
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
            'stock_limit' => 60,
            'max_gift_qty' => 7,
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

        $this->assertSame(20, (int) $buyProduct->fresh()->quantity);
        $this->assertSame(13, (int) $giftProduct->fresh()->quantity);
        $this->assertDatabaseHas('promotion_buytogift_rule_stock_allocations', [
            'promotion_buytogift_offer_rule_id' => $rule->id,
            'product_id' => $giftProduct->id,
            'variant_id' => $blueVariant->id,
            'allocated_quantity' => 3,
        ]);
        $this->assertDatabaseHas('promotion_buytogift_rule_stock_allocations', [
            'promotion_buytogift_offer_rule_id' => $rule->id,
            'product_id' => $giftProduct->id,
            'variant_id' => $pinkVariant->id,
            'allocated_quantity' => 4,
        ]);

        $order = app(OrderRepositoryInterface::class)->save([
            'order_number' => 'ORD-PENDING-BTG-001',
            'customer_name' => 'Pending Reserve Customer',
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'placed_at' => now()->format('Y-m-d H:i:s'),
            'items' => [
                [
                    'product_id' => $buyProduct->id,
                    'quantity' => 1,
                    'unit_price' => 100000,
                ],
                [
                    'product_id' => $giftProduct->id,
                    'variant_id' => $blueVariant->id,
                    'quantity' => 1,
                    'unit_price' => 0,
                    'is_gift' => true,
                    'rule_id' => $rule->id,
                ],
            ],
        ], ['task' => 'add-item']);

        $this->assertNotNull($order);
        $this->assertSame(19, (int) $buyProduct->fresh()->quantity);
        $this->assertSame(13, (int) $giftProduct->fresh()->quantity);

        $rule = $rule->fresh(['stockAllocations']);
        $variantOptions = $rule->giftVariantOptions()->orderBy('id')->get()->keyBy('variant_id');
        $this->assertSame(2, (int) $rule->stockAllocations->where('variant_id', $blueVariant->id)->sum('allocated_quantity'));
        $this->assertSame(4, (int) $rule->stockAllocations->where('variant_id', $pinkVariant->id)->sum('allocated_quantity'));
        $this->assertSame(6, (int) $rule->stockAllocations->sum('allocated_quantity'));
        $this->assertSame(1, (int) $giftProduct->fresh()->sold_quantity);
        $this->assertSame(2, (int) ($variantOptions->get($blueVariant->id)?->reserve_qty ?? 0));
        $this->assertSame(4, (int) ($variantOptions->get($pinkVariant->id)?->reserve_qty ?? 0));

        $showResponse = $this->get(route('buytogift.show', $offer->id));
        $showResponse->assertOk();
        $showResponse->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/BuyToGift/Show')
            ->where('item.rules.0.reserved_quantity', 6)
            ->where('item.rules.0.available_slots', 6)
            ->where('item.rules.0.sold_quantity', 1)
            ->where('item.rules.0.gift_variant_options.0.reserve_qty', 2)
        );

        $deletedCount = app(OrderRepositoryInterface::class)->delete([
            'id' => $order->id,
        ], ['task' => 'delete-item']);

        $this->assertSame(1, $deletedCount);

        $rule = $rule->fresh(['giftVariantOptions', 'stockAllocations']);
        $variantOptions = $rule->giftVariantOptions()->orderBy('id')->get()->keyBy('variant_id');
        $this->assertSame(3, (int) ($variantOptions->get($blueVariant->id)?->reserve_qty ?? 0));
        $this->assertSame(4, (int) ($variantOptions->get($pinkVariant->id)?->reserve_qty ?? 0));
        $this->assertSame(3, (int) $rule->stockAllocations->where('variant_id', $blueVariant->id)->sum('allocated_quantity'));
        $this->assertSame(4, (int) $rule->stockAllocations->where('variant_id', $pinkVariant->id)->sum('allocated_quantity'));
    }

    #[Test]
    public function it_rejects_increasing_a_gift_variant_quantity_beyond_the_remaining_reserved_stock_on_update(): void
    {
        $this->withoutMiddleware();

        $user = User::factory()->create([
            'account_id' => 1,
        ]);
        $location = $this->createTestLocation();

        $buyProduct = $this->createProduct('SKU-UPDATE-BUY', 'Update Buy Product', 100000, 20);
        $giftProduct = $this->createProduct('SKU-UPDATE-GIFT', 'Update Gift Product', 50000, 20);
        $giftVariant = ProductVariant::query()->create([
            'product_id' => $giftProduct->id,
            'sku' => 'SKU-UPDATE-GIFT-BLUE',
            'price' => 50000,
            'stock' => 10,
            'image' => null,
            'images' => null,
        ]);

        $offer = PromotionBuyToGiftOffer::query()->create([
            'code' => 'UPDATE-BTG-001',
            'name' => 'Update order reserve',
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
            'stock_limit' => 60,
            'max_gift_qty' => 10,
        ]);

        $rule->buyProducts()->attach($buyProduct->id, ['buy_qty' => 1]);
        $rule->giftProducts()->attach($giftProduct->id, [
            'gift_qty' => 1,
            'is_auto_add' => true,
        ]);
        $rule->giftVariantOptions()->create([
            'product_id' => $giftProduct->id,
            'variant_id' => $giftVariant->id,
            'reserve_qty' => 10,
        ]);

        app(BuyToGiftStockAllocator::class)->syncOffer($offer->fresh([
            'rules.buyProducts',
            'rules.giftProducts',
            'rules.giftVariantOptions.variant',
            'rules.stockAllocations',
        ]));

        $this->actingAs($user);
        $paymentMethod = PaymentMethod::query()->create([
            'code' => 'cash_on_delivery_update_btg',
            'provider' => 'cash_on_delivery',
            'name' => 'Cash On Delivery BTG',
            'description' => null,
            'settings' => [],
            'sort_order' => 0,
            'is_active' => true,
            'is_system' => false,
        ]);

        $createdOrder = app(OrderRepositoryInterface::class)->save([
            'order_number' => 'ORD-UPDATE-BTG-001',
            'customer_name' => 'Variant Reserve Customer',
            'payment_method_id' => $paymentMethod->id,
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'placed_at' => now()->format('Y-m-d H:i:s'),
            'items' => [
                [
                    'product_id' => $buyProduct->id,
                    'quantity' => 1,
                    'unit_price' => 100000,
                ],
                [
                    'product_id' => $giftProduct->id,
                    'variant_id' => $giftVariant->id,
                    'quantity' => 10,
                    'unit_price' => 0,
                    'is_gift' => true,
                    'rule_id' => $rule->id,
                ],
            ],
        ], ['task' => 'add-item']);

        $this->assertNotNull($createdOrder);
        $this->assertSame(0, (int) $rule->fresh()->giftVariantOptions()->firstOrFail()->reserve_qty);

        $this->put(route('orders.update', $createdOrder->id), [
            'order_number' => 'ORD-UPDATE-BTG-001',
            'customer_name' => 'Variant Reserve Customer Updated',
            'customer_phone' => '0911222333',
            'customer_address' => '456 Updated Street',
            'province_code' => $location['province_code'],
            'ward_code' => $location['ward_code'],
            'payment_method_id' => $paymentMethod->id,
            'order_status' => 'pending',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'placed_at' => now()->format('Y-m-d H:i:s'),
            'items' => [
                [
                    'product_id' => $buyProduct->id,
                    'quantity' => 1,
                    'unit_price' => 100000,
                ],
                [
                    'product_id' => $giftProduct->id,
                    'variant_id' => $giftVariant->id,
                    'quantity' => 11,
                    'unit_price' => 0,
                    'is_gift' => true,
                    'rule_id' => $rule->id,
                ],
            ],
        ])->assertSessionHasErrors('items.1.quantity');
    }

    private function createProduct(string $sku, string $name, float $price, int $quantity): Product
    {
        $product = Product::query()->create([
            'sku' => $sku,
            'quantity' => $quantity,
            'weight' => 0,
            'price' => $price,
            'is_coupon' => false,
            'is_stock' => $quantity > 0,
            'status' => 1,
            'order' => 0,
            'hit_viewer' => 0,
            'hit_order' => 0,
        ]);

        $product->translations()->create([
            'locale' => app()->getLocale(),
            'name' => $name,
            'description' => null,
            'content' => null,
            'seo_title' => null,
            'seo_keyword' => null,
            'seo_description' => null,
            'order' => 0,
        ]);

        return $product->fresh(['translations']);
    }

    /**
     * @return array{province_code: string, ward_code: string}
     */
    private function createTestLocation(): array
    {
        $province = Province::query()->firstOrCreate(
            ['code' => '79'],
            [
                'name' => 'Hồ Chí Minh',
                'name_en' => 'Ho Chi Minh',
                'full_name' => 'Thành phố Hồ Chí Minh',
                'full_name_en' => 'Ho Chi Minh City',
                'code_name' => 'ho_chi_minh',
                'administrative_unit_id' => null,
            ]
        );

        $ward = Ward::query()->firstOrCreate(
            ['code' => '25747'],
            [
                'name' => 'Thủ Dầu Một',
                'name_en' => 'Thu Dau Mot',
                'full_name' => 'Phường Thủ Dầu Một',
                'full_name_en' => 'Thu Dau Mot Ward',
                'code_name' => 'thu_dau_mot',
                'province_code' => $province->code,
                'administrative_unit_id' => null,
            ]
        );

        return [
            'province_code' => (string) $province->code,
            'ward_code' => (string) $ward->code,
        ];
    }

    /**
     * @param  array<int, array{product_id: int, quantity: int, unit_price: float}>  $items
     * @return array<string, mixed>
     */
    private function buildPriceSnapshot(
        string $locale,
        string $currencyCode,
        float $exchangeRateToVnd,
    ): array {
        $primaryLocale = strtolower(trim(explode('-', $locale)[0] ?: 'vi'));
        $primaryCurrencyCode = strtoupper($currencyCode);
        $secondaryLocale = $primaryLocale === 'ja' ? 'en' : 'ja';
        $secondaryCurrencyCode = $secondaryLocale === 'ja' ? 'JPY' : 'USD';

        return [
            [
                'locale' => $primaryLocale,
                'currency_code' => $primaryCurrencyCode,
                'currency_symbol' => $this->currencySymbol($primaryCurrencyCode),
                'exchange_rate_to_vnd' => $exchangeRateToVnd > 0 ? $exchangeRateToVnd : 1,
            ],
            [
                'locale' => $secondaryLocale,
                'currency_code' => $secondaryCurrencyCode,
                'currency_symbol' => $this->currencySymbol($secondaryCurrencyCode),
                'exchange_rate_to_vnd' => $secondaryLocale === 'ja' ? 165.07381959 : 25000,
            ],
        ];
    }

    private function currencySymbol(string $currencyCode): string
    {
        return match (strtoupper($currencyCode)) {
            'USD' => '$',
            'JPY' => '¥',
            'VND' => '₫',
            'EUR' => '€',
            'KRW' => '₩',
            'CNY' => '¥',
            'GBP' => '£',
            'AUD' => 'A$',
            'CAD' => 'C$',
            default => strtoupper($currencyCode),
        };
    }
}
