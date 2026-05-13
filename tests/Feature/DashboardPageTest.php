<?php

namespace Tests\Feature;

use App\Models\Catalog\Product;
use App\Models\Catalog\ProductVariant;
use App\Models\Sales\Order;
use App\Models\Sales\OrderItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class DashboardPageTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_renders_dashboard_operational_metrics_and_charts(): void
    {
        $this->withoutMiddleware();

        $product = Product::query()->create([
            'sku' => 'DASH-001',
            'quantity' => 3,
            'price' => 100000,
            'status' => 1,
        ]);

        $product->translations()->create([
            'locale' => 'vi',
            'name' => 'Dashboard Product',
        ]);

        $variantProduct = Product::query()->create([
            'sku' => 'DASH-VAR-001',
            'quantity' => 0,
            'price' => 180000,
            'status' => 1,
        ]);

        $variantProduct->translations()->create([
            'locale' => 'vi',
            'name' => 'Dashboard Variant Product',
        ]);

        ProductVariant::query()->create([
            'product_id' => $variantProduct->id,
            'sku' => 'DASH-VAR-001-RED',
            'price' => 180000,
            'stock' => 1,
            'image' => null,
            'images' => null,
        ]);

        $order = Order::query()->create([
            'order_number' => 'ORD-DASH-001',
            'customer_name' => 'Dashboard Customer',
            'order_status' => 'completed',
            'payment_status' => 'paid',
            'shipping_status' => 'delivered',
            'total_quantity' => 2,
            'subtotal' => 200000,
            'discount_total' => 0,
            'shipping_total' => 0,
            'grand_total' => 200000,
            'placed_at' => now(),
        ]);

        OrderItem::query()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => 'Dashboard Product',
            'product_sku' => 'DASH-001',
            'quantity' => 2,
            'unit_price' => 100000,
            'line_total' => 200000,
        ]);

        $response = $this->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard/Index')
            ->has('dashboard.metrics', 4)
            ->has('dashboard.revenueChart', 14)
            ->has('dashboard.orderStatusChart', 1)
            ->where('dashboard.orderStatusChart.0.status', 'completed')
            ->where('dashboard.orderStatusChart.0.label', 'Hoàn thành')
            ->where('dashboard.orderStatusChart.0.value', 1)
            ->has('dashboard.topProducts', 1)
            ->has('dashboard.stockAlerts', 2)
            ->where('dashboard.stockAlerts.0.sku', 'DASH-VAR-001')
            ->where('dashboard.stockAlerts.0.quantity', 1)
            ->where('dashboard.summary.out_of_stock', 0)
            ->where('dashboard.summary.products', 2)
            ->where('dashboard.recentOrders.0.order_number', 'ORD-DASH-001')
            ->where('dashboard.recentOrders.0.order_status_label', 'Hoàn thành')
            ->where('dashboard.recentOrders.0.payment_status_label', 'Đã thanh toán')
        );
    }
}
