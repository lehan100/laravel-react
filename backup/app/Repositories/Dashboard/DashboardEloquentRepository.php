<?php

namespace App\Repositories\Dashboard;

use App\Models\Catalog\Category;
use App\Models\Catalog\Product;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionCoupon;
use App\Models\Promotion\PromotionSaleOffer;
use App\Models\Sales\Order;
use App\Models\Sales\OrderItem;
use App\Models\Users\User;
use App\Traits\HasCurrencyFormatter;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class DashboardEloquentRepository implements DashboardRepositoryInterface
{
    use HasCurrencyFormatter;

    public function data(): array
    {
        $startDate = now()->subDays(13)->startOfDay();
        $endDate = now()->endOfDay();
        $orders = Order::query()
            ->with('paymentMethod')
            ->whereBetween('placed_at', [$startDate, $endDate])
            ->latest('placed_at')
            ->get();
        $validOrders = $orders->where('order_status', '!=', 'cancelled');
        $paidOrders = $validOrders->where('payment_status', 'paid');
        $inventoryProducts = Product::query()
            ->with(['translations' => fn ($query) => $query->whereIn('locale', [app()->getLocale(), 'vi'])])
            ->withCount('variants')
            ->withSum('variants', 'stock')
            ->get();

        return [
            'metrics' => [
                [
                    'label' => __('hancms.dashboard.metrics.revenue'),
                    'value' => $this->money($validOrders->sum('grand_total')),
                    'hint' => __('hancms.dashboard.metrics.revenue_hint'),
                    'tone' => 'cyan',
                ],
                [
                    'label' => __('hancms.dashboard.metrics.orders'),
                    'value' => $validOrders->count(),
                    'hint' => __('hancms.dashboard.metrics.orders_hint'),
                    'tone' => 'emerald',
                ],
                [
                    'label' => __('hancms.dashboard.metrics.paid'),
                    'value' => $this->money($paidOrders->sum('grand_total')),
                    'hint' => __('hancms.dashboard.metrics.paid_hint'),
                    'tone' => 'slate',
                ],
                [
                    'label' => __('hancms.dashboard.metrics.low_stock'),
                    'value' => $inventoryProducts->filter(fn (Product $product) => $this->effectiveStock($product) > 0 && $this->effectiveStock($product) <= 5)->count(),
                    'hint' => __('hancms.dashboard.metrics.low_stock_hint'),
                    'tone' => 'amber',
                ],
            ],
            'summary' => [
                'products' => Product::query()->count(),
                'active_products' => Product::query()->where('status', 1)->count(),
                'categories' => Category::query()->count(),
                'users' => User::query()->count(),
                'active_promotions' => $this->activePromotions(),
                'out_of_stock' => $inventoryProducts->filter(fn (Product $product) => $this->effectiveStock($product) <= 0)->count(),
            ],
            'revenueChart' => $this->dailyRevenue($validOrders, $startDate),
            'orderStatusChart' => $this->statusChart($orders),
            'topProducts' => $this->topProducts($startDate, $endDate),
            'stockAlerts' => $this->stockAlerts($inventoryProducts),
            'recentOrders' => $orders->take(6)->map(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer_name,
                'grand_total' => $this->money($order->grand_total),
                'order_status' => $order->order_status,
                'order_status_label' => __('hancms.sales.orders.statuses.order.'.$order->order_status),
                'payment_status' => $order->payment_status,
                'payment_status_label' => __('hancms.sales.orders.statuses.payment.'.$order->payment_status),
                'placed_at' => optional($order->placed_at)->format('Y-m-d H:i'),
            ])->values(),
        ];
    }

    private function dailyRevenue(Collection $orders, Carbon $startDate): array
    {
        return collect(range(0, 13))->map(function (int $offset) use ($orders, $startDate) {
            $date = $startDate->copy()->addDays($offset)->toDateString();
            $items = $orders->filter(fn (Order $order) => optional($order->placed_at)->toDateString() === $date);

            return [
                'label' => $startDate->copy()->addDays($offset)->format('d/m'),
                'date' => $date,
                'orders' => $items->count(),
                'revenue' => (float) $items->sum('grand_total'),
                'revenue_label' => $this->money($items->sum('grand_total')),
            ];
        })->values()->all();
    }

    private function statusChart(Collection $orders): array
    {
        return $orders
            ->groupBy('order_status')
            ->map(fn (Collection $items, string $status) => [
                'status' => $status,
                'label' => __('hancms.sales.orders.statuses.order.'.$status),
                'value' => $items->count(),
            ])
            ->values()
            ->all();
    }

    private function topProducts(Carbon $startDate, Carbon $endDate): array
    {
        return OrderItem::query()
            ->selectRaw('product_id, product_sku, product_name, SUM(quantity) as sold_quantity, SUM(line_total) as revenue')
            ->whereHas('order', fn ($query) => $query
                ->whereBetween('placed_at', [$startDate, $endDate])
                ->where('order_status', '!=', 'cancelled'))
            ->groupBy('product_id', 'product_sku', 'product_name')
            ->orderByDesc('revenue')
            ->limit(6)
            ->get()
            ->map(fn (OrderItem $item) => [
                'name' => $item->product_name ?: ($item->product_sku ?: '#'.$item->product_id),
                'sku' => $item->product_sku,
                'sold_quantity' => (int) $item->sold_quantity,
                'revenue' => $this->money($item->revenue),
            ])
            ->values()
            ->all();
    }

    private function stockAlerts(Collection $inventoryProducts): array
    {
        return $inventoryProducts
            ->sortBy(fn (Product $product) => $this->effectiveStock($product))
            ->take(6)
            ->map(fn (Product $product) => [
                'id' => $product->id,
                'name' => $this->productName($product),
                'sku' => $product->sku,
                'quantity' => $this->effectiveStock($product),
            ])
            ->values()
            ->all();
    }

    private function activePromotions(): int
    {
        $now = now();
        $activeQuery = fn ($query) => $query
            ->where('is_active', true)
            ->where(fn ($query) => $query->whereNull('starts_at')->orWhere('starts_at', '<=', $now))
            ->where(fn ($query) => $query->whereNull('ends_at')->orWhere('ends_at', '>=', $now));

        return PromotionCoupon::query()->where($activeQuery)->count()
            + PromotionSaleOffer::query()->where($activeQuery)->count()
            + PromotionBuyToGiftOffer::query()->where($activeQuery)->count();
    }

    private function productName(Product $product): string
    {
        $translation = $product->translations->firstWhere('locale', app()->getLocale())
            ?? $product->translations->firstWhere('locale', 'vi')
            ?? $product->translations->first();

        return $translation?->name ?: ($product->sku ?: '#'.$product->id);
    }

    private function effectiveStock(Product $product): int
    {
        $variantCount = (int) ($product->variants_count ?? 0);
        $variantStock = (int) ($product->variants_sum_stock ?? 0);

        return $variantCount > 0 ? $variantStock : (int) ($product->quantity ?? 0);
    }
}
