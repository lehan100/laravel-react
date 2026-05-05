<?php

namespace Tests\Feature\Feature;

use App\Http\Requests\Sales\OrderRequest;
use App\Models\Catalog\Product;
use App\Models\Sales\Order;
use App\Models\Sales\OrderTimeline;
use App\Models\Sales\PaymentMethod;
use App\Models\Users\User;
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
        $payload = [
            'customer_name' => 'Nguyen Van A',
            'order_status' => 'invalid',
            'payment_status' => 'unpaid',
            'shipping_status' => 'pending',
            'discount_total' => 0,
            'shipping_total' => 0,
            'items' => [],
        ];

        $validator = Validator::make($payload, (new OrderRequest)->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('order_status', $validator->errors()->messages());
        $this->assertArrayHasKey('items', $validator->errors()->messages());
    }

    #[Test]
    public function it_rejects_products_with_zero_stock(): void
    {
        $product = $this->createProduct('SKU-OUT', 'Out Of Stock Product', 100000, 0);

        $payload = [
            'customer_name' => 'Nguyen Van A',
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

        $validator = Validator::make($payload, (new OrderRequest)->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('items.0.product_id', $validator->errors()->messages());
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
    public function admin_can_update_an_order_and_replace_its_items(): void
    {
        $user = User::factory()->create([
            'account_id' => 1,
        ]);

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
            'order_status' => 'confirmed',
            'payment_status' => 'paid',
            'shipping_status' => 'ready_to_ship',
            'total_quantity' => 1,
            'subtotal' => 150000,
            'discount_total' => 0,
            'shipping_total' => 10000,
            'grand_total' => 160000,
            'placed_at' => now(),
        ]);

        $response = $this->actingAs($user)->get(route('orders.show', $order->id));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Sales/Order/Show')
            ->where('page_title', 'Đơn hàng - ORD-SHOW-001 - Readonly Customer')
        );
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
