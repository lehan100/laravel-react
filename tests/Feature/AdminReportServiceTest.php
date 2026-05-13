<?php

namespace Tests\Feature;

use App\Models\Catalog\Product;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionCoupon;
use App\Models\Promotion\PromotionSaleOffer;
use App\Models\Sales\InventoryAdjustmentHistory;
use App\Models\Sales\Order;
use App\Models\Sales\OrderItem;
use App\Services\ExchangeRateService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AdminReportServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        app()->setLocale('vi');
    }

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
    public function it_renders_the_revenue_report_page_with_daily_orders(): void
    {
        $this->withoutMiddleware();

        Order::query()->create([
            'order_number' => 'ORD-REPORT-REVENUE-001',
            'customer_name' => 'Revenue Customer',
            'order_status' => 'completed',
            'payment_status' => 'paid',
            'shipping_status' => 'delivered',
            'total_quantity' => 3,
            'subtotal' => 450000,
            'discount_total' => 0,
            'shipping_total' => 0,
            'grand_total' => 450000,
            'placed_at' => now()->startOfDay(),
        ]);

        $response = $this->get(route('report-revenue.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Report/Index')
            ->has('report.metrics', 4)
            ->has('report.rows', 1)
            ->where('report.type', 'revenue')
            ->where('report.rows.0.orders', 1)
            ->where('analyzeRoute', route('report-revenue.analyze'))
        );
    }

    #[Test]
    public function it_localizes_revenue_report_money_values_by_locale(): void
    {
        $this->withoutMiddleware();
        app()->setLocale('en');

        $exchangeRateService = $this->createMock(ExchangeRateService::class);
        $exchangeRateService->method('rateToVnd')->with('USD')->willReturn(25000.0);
        app()->instance(ExchangeRateService::class, $exchangeRateService);

        Order::query()->create([
            'order_number' => 'ORD-REPORT-REVENUE-002',
            'customer_name' => 'Revenue Customer',
            'order_status' => 'completed',
            'payment_status' => 'paid',
            'shipping_status' => 'delivered',
            'total_quantity' => 3,
            'subtotal' => 450000,
            'discount_total' => 0,
            'shipping_total' => 0,
            'grand_total' => 450000,
            'placed_at' => now()->startOfDay(),
        ]);

        $response = $this->get(route('report-revenue.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Report/Index')
            ->where('report.metrics.0.value', '18.000 $')
            ->where('report.rows.0.revenue_label', '18.000 $')
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

    #[Test]
    public function it_marks_promotion_report_rows_with_status_keys_and_labels(): void
    {
        $this->withoutMiddleware();

        PromotionCoupon::query()->create([
            'code' => 'COUPON-PROMO-ACTIVE',
            'name' => 'Coupon Active',
            'discount_type' => 'fixed',
            'discount_value' => 10000,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'used_count' => 0,
            'is_active' => true,
            'is_public' => true,
            'stackable' => false,
        ]);

        PromotionCoupon::query()->create([
            'code' => 'COUPON-PROMO-INACTIVE',
            'name' => 'Coupon Inactive',
            'discount_type' => 'fixed',
            'discount_value' => 15000,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'used_count' => 0,
            'is_active' => false,
            'is_public' => true,
            'stackable' => false,
        ]);

        PromotionSaleOffer::query()->create([
            'code' => 'SALE-PROMO-UPCOMING',
            'name' => 'Sale Upcoming',
            'discount_type' => 'percent',
            'discount_value' => 15,
            'priority' => 1,
            'starts_at' => now()->addDay(),
            'ends_at' => now()->addDays(2),
            'is_active' => true,
            'stackable' => true,
        ]);

        PromotionBuyToGiftOffer::query()->create([
            'code' => 'GIFT-PROMO-EXPIRED',
            'name' => 'Gift Expired',
            'priority' => 1,
            'starts_at' => now()->subDays(3),
            'ends_at' => now()->subDay(),
            'is_active' => true,
            'stackable' => false,
        ]);

        $response = $this->get(route('report-promotion.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Report/Index')
            ->has('report.rows', 4)
            ->where('report.rows.0.status_key', 'active')
            ->where('report.rows.0.status_label', trans('hancms.report.status_labels.active'))
            ->where('report.rows.1.status_key', 'inactive')
            ->where('report.rows.1.status_label', trans('hancms.report.status_labels.inactive'))
            ->where('report.rows.2.status_key', 'upcoming')
            ->where('report.rows.2.status_label', trans('hancms.report.status_labels.upcoming'))
            ->where('report.rows.3.status_key', 'expired')
            ->where('report.rows.3.status_label', trans('hancms.report.status_labels.expired'))
        );
    }

    #[Test]
    public function it_renders_the_inventory_report_page_with_translated_adjustment_actions(): void
    {
        $this->withoutMiddleware();

        $product = Product::query()->create([
            'sku' => 'INV-REPORT-001',
            'quantity' => 0,
            'price' => 150000,
            'status' => 1,
        ]);

        $product->translations()->create([
            'locale' => 'vi',
            'name' => 'Inventory Report Product',
        ]);

        InventoryAdjustmentHistory::query()->create([
            'product_id' => $product->id,
            'user_id' => null,
            'action' => 'set',
            'old_quantity' => 0,
            'new_quantity' => 12,
            'delta' => 12,
            'reason' => 'Initial stock',
        ]);

        InventoryAdjustmentHistory::query()->create([
            'product_id' => $product->id,
            'user_id' => null,
            'action' => 'adjust',
            'old_quantity' => 12,
            'new_quantity' => 9,
            'delta' => -3,
            'reason' => 'Manual adjustment',
        ]);

        InventoryAdjustmentHistory::query()->create([
            'product_id' => $product->id,
            'user_id' => null,
            'action' => 'order_deduct',
            'old_quantity' => 9,
            'new_quantity' => 6,
            'delta' => -3,
            'reason' => 'Order deduction',
        ]);

        $response = $this->get(route('report-inventory.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Report/Index')
            ->has('report.metrics', 4)
            ->has('report.charts.adjustments', 3)
            ->where('report.type', 'inventory')
            ->where('report.charts.adjustments.0.label', trans('hancms.report.inventory.actions.set'))
            ->where('report.charts.adjustments.1.label', trans('hancms.report.inventory.actions.adjust'))
            ->where('report.charts.adjustments.2.label', trans('hancms.report.inventory.actions.order_deduct'))
            ->where('report.rows.0.status_key', 'out_of_stock')
            ->where('report.rows.0.status_label', trans('hancms.report.status_labels.out_of_stock'))
            ->where('analyzeRoute', route('report-inventory.analyze'))
        );
    }
}
