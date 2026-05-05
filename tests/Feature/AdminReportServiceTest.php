<?php

namespace Tests\Feature;

use App\Models\Catalog\Product;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionCoupon;
use App\Models\Promotion\PromotionSaleOffer;
use App\Models\Sales\Order;
use App\Models\Sales\OrderItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AdminReportServiceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_renders_the_product_report_page(): void
    {
        $this->withoutMiddleware();

        $product = Product::query()->create([
            'sku' => 'REPORT-PRODUCT-001',
            'quantity' => 7,
            'price' => 150000,
            'status' => 1,
        ]);

        $product->translations()->create([
            'locale' => 'vi',
            'name' => 'Report Product',
        ]);

        $order = Order::query()->create([
            'order_number' => 'ORD-REPORT-PRODUCT-001',
            'customer_name' => 'Report Customer',
            'order_status' => 'completed',
            'payment_status' => 'paid',
            'shipping_status' => 'delivered',
            'total_quantity' => 2,
            'subtotal' => 300000,
            'discount_total' => 0,
            'shipping_total' => 0,
            'grand_total' => 300000,
            'placed_at' => now(),
        ]);

        OrderItem::query()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => 'Report Product',
            'product_sku' => 'REPORT-PRODUCT-001',
            'quantity' => 2,
            'unit_price' => 150000,
            'line_total' => 300000,
        ]);

        $response = $this->get(route('report-product.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Report/Index')
            ->has('report.metrics', 4)
            ->has('report.charts.top', 1)
            ->has('report.rows', 1)
            ->where('report.type', 'product')
            ->where('report.columns.0.key', 'product_name')
            ->where('analyzeRoute', route('report-product.analyze'))
        );
    }

    #[Test]
    public function it_renders_the_promotion_report_page(): void
    {
        $this->withoutMiddleware();

        PromotionCoupon::query()->create([
            'code' => 'COUPON-REPORT-001',
            'name' => 'Coupon Report',
            'discount_type' => 'fixed',
            'discount_value' => 25000,
            'used_count' => 4,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'is_public' => true,
            'stackable' => false,
        ]);

        PromotionSaleOffer::query()->create([
            'code' => 'SALE-REPORT-001',
            'name' => 'Sale Report',
            'discount_type' => 'percent',
            'discount_value' => 10,
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => true,
        ]);

        PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-REPORT-001',
            'name' => 'Gift Report',
            'description' => 'Gift report campaign',
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $response = $this->get(route('report-promotion.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Report/Index')
            ->has('report.metrics', 4)
            ->has('report.charts.campaigns', 3)
            ->has('report.rows', 3)
            ->where('report.type', 'promotion')
            ->where('report.metrics.0.value', 3)
            ->where('analyzeRoute', route('report-promotion.analyze'))
        );
    }
}
