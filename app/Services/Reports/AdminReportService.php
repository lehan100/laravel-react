<?php

namespace App\Services\Reports;

use App\Models\Catalog\Product;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionCoupon;
use App\Models\Promotion\PromotionSaleOffer;
use App\Models\Sales\InventoryAdjustmentHistory;
use App\Models\Sales\Order;
use App\Models\Sales\OrderItem;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Laravel\Ai\Exceptions\RateLimitedException;

use function Laravel\Ai\agent;

class AdminReportService
{
    /**
     * @return array<string, mixed>
     */
    public function build(string $type, Request $request): array
    {
        [$startDate, $endDate] = $this->dateRange($request);

        return match ($type) {
            'revenue' => $this->revenue($startDate, $endDate),
            'product' => $this->product($startDate, $endDate),
            'inventory' => $this->inventory($startDate, $endDate),
            'promotion' => $this->promotion($startDate, $endDate),
            default => throw new \InvalidArgumentException("Unsupported report type [{$type}]."),
        };
    }

    /**
     * @return array<string, string>
     */
    public function analyze(string $type, Request $request): array
    {
        $report = $this->build($type, $request);

        try {
            $response = agent(
                instructions: $this->analysisInstructions()
            )->prompt($this->analysisPrompt($report));

            return [
                'analysis' => trim((string) $response),
            ];
        } catch (\Throwable $exception) {
            report($exception);

            return [
                'analysis' => '',
                'message' => $exception instanceof RateLimitedException
                    ? __('hancms.report.ai_rate_limited')
                    : __('hancms.report.ai_failed'),
            ];
        }
    }

    /**
     * @return array{0: Carbon, 1: Carbon}
     */
    private function dateRange(Request $request): array
    {
        $start = $request->date('start_date')?->startOfDay() ?? now()->subDays(29)->startOfDay();
        $end = $request->date('end_date')?->endOfDay() ?? now()->endOfDay();

        if ($start->greaterThan($end)) {
            return [$end->copy()->startOfDay(), $start->copy()->endOfDay()];
        }

        return [$start, $end];
    }

    /**
     * @return array<string, mixed>
     */
    private function revenue(Carbon $startDate, Carbon $endDate): array
    {
        $orders = Order::query()
            ->whereBetween('placed_at', [$startDate, $endDate])
            ->get();
        $effectiveOrders = $orders->where('order_status', '!=', 'cancelled');
        $paidOrders = $effectiveOrders->where('payment_status', 'paid');
        $dailyOrders = $this->dailyOrders($effectiveOrders);

        return [
            'type' => 'revenue',
            'title' => __('hancms.report.revenue.name'),
            'description' => __('hancms.report.revenue.description'),
            'filters' => $this->filters($startDate, $endDate),
            'metrics' => [
                ['label' => __('hancms.report.revenue.metrics.revenue'), 'value' => $this->money($effectiveOrders->sum('grand_total')), 'tone' => 'cyan'],
                ['label' => __('hancms.report.revenue.metrics.paid'), 'value' => $this->money($paidOrders->sum('grand_total')), 'tone' => 'emerald'],
                ['label' => __('hancms.report.revenue.metrics.valid_orders'), 'value' => $effectiveOrders->count(), 'tone' => 'slate'],
                ['label' => __('hancms.report.revenue.metrics.average_order_value'), 'value' => $this->money($effectiveOrders->avg('grand_total') ?? 0), 'tone' => 'amber'],
            ],
            'charts' => [
                'daily' => $dailyOrders->values()->all(),
                'status' => $this->statusBreakdown($orders, 'order_status'),
            ],
            'columns' => [
                ['key' => 'label', 'label' => __('hancms.report.columns.date')],
                ['key' => 'orders', 'label' => __('hancms.report.columns.orders')],
                ['key' => 'quantity', 'label' => __('hancms.report.columns.quantity')],
                ['key' => 'revenue_label', 'label' => __('hancms.report.columns.revenue')],
            ],
            'rows' => $dailyOrders->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function product(Carbon $startDate, Carbon $endDate): array
    {
        $items = OrderItem::query()
            ->selectRaw('product_id, product_sku, product_name, SUM(quantity) as sold_quantity, SUM(line_total) as revenue')
            ->whereHas('order', fn (Builder $query) => $query
                ->whereBetween('placed_at', [$startDate, $endDate])
                ->where('order_status', '!=', 'cancelled'))
            ->groupBy('product_id', 'product_sku', 'product_name')
            ->orderByDesc('revenue')
            ->limit(15)
            ->get();

        $totalRevenue = (float) $items->sum('revenue');
        $totalQuantity = (int) $items->sum('sold_quantity');

        return [
            'type' => 'product',
            'title' => __('hancms.report.product.name'),
            'description' => __('hancms.report.product.description'),
            'filters' => $this->filters($startDate, $endDate),
            'metrics' => [
                ['label' => __('hancms.report.product.metrics.sold_products'), 'value' => $items->count(), 'tone' => 'cyan'],
                ['label' => __('hancms.report.product.metrics.sold_quantity'), 'value' => $totalQuantity, 'tone' => 'emerald'],
                ['label' => __('hancms.report.product.metrics.top_revenue'), 'value' => $this->money($totalRevenue), 'tone' => 'slate'],
                ['label' => __('hancms.report.product.metrics.active_catalog'), 'value' => Product::query()->where('status', 1)->count(), 'tone' => 'amber'],
            ],
            'charts' => [
                'top' => $items->map(fn (OrderItem $item) => [
                    'label' => $item->product_name ?: ($item->product_sku ?: '#'.$item->product_id),
                    'value' => (float) $item->revenue,
                    'value_label' => $this->money($item->revenue),
                    'quantity' => (int) $item->sold_quantity,
                ])->values()->all(),
            ],
            'columns' => [
                ['key' => 'product_name', 'label' => __('hancms.report.columns.product')],
                ['key' => 'product_sku', 'label' => __('hancms.report.columns.sku')],
                ['key' => 'sold_quantity', 'label' => __('hancms.report.columns.sold_quantity')],
                ['key' => 'revenue_label', 'label' => __('hancms.report.columns.revenue')],
            ],
            'rows' => $items->map(fn (OrderItem $item) => [
                'product_name' => $item->product_name ?: 'N/A',
                'product_sku' => $item->product_sku ?: 'N/A',
                'sold_quantity' => (int) $item->sold_quantity,
                'revenue_label' => $this->money($item->revenue),
            ])->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function inventory(Carbon $startDate, Carbon $endDate): array
    {
        $products = Product::query()
            ->with(['translations' => fn ($query) => $query->whereIn('locale', ['vi', app()->getLocale()])])
            ->orderBy('quantity')
            ->limit(20)
            ->get();
        $adjustments = InventoryAdjustmentHistory::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        return [
            'type' => 'inventory',
            'title' => __('hancms.report.inventory.name'),
            'description' => __('hancms.report.inventory.description'),
            'filters' => $this->filters($startDate, $endDate),
            'metrics' => [
                ['label' => __('hancms.report.inventory.metrics.total_stock'), 'value' => Product::query()->sum('quantity'), 'tone' => 'cyan'],
                ['label' => __('hancms.report.inventory.metrics.low_stock'), 'value' => Product::query()->where('quantity', '>', 0)->where('quantity', '<=', 5)->count(), 'tone' => 'amber'],
                ['label' => __('hancms.report.inventory.metrics.out_of_stock'), 'value' => Product::query()->where('quantity', '<=', 0)->count(), 'tone' => 'rose'],
                ['label' => __('hancms.report.inventory.metrics.adjustments'), 'value' => $adjustments->count(), 'tone' => 'slate'],
            ],
            'charts' => [
                'adjustments' => $adjustments
                    ->groupBy('action')
                    ->map(fn (Collection $items, string $action) => [
                        'label' => $action,
                        'value' => $items->sum('delta'),
                        'count' => $items->count(),
                    ])
                    ->values()
                    ->all(),
            ],
            'columns' => [
                ['key' => 'name', 'label' => __('hancms.report.columns.product')],
                ['key' => 'sku', 'label' => __('hancms.report.columns.sku')],
                ['key' => 'quantity', 'label' => __('hancms.report.columns.stock')],
                ['key' => 'status_label', 'label' => __('hancms.report.columns.status')],
            ],
            'rows' => $products->map(fn (Product $product) => [
                'name' => $this->productName($product),
                'sku' => $product->sku ?: 'N/A',
                'quantity' => (int) $product->quantity,
                'status_label' => $this->stockStatusLabel((int) $product->quantity),
            ])->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function promotion(Carbon $startDate, Carbon $endDate): array
    {
        $now = now();
        $coupons = PromotionCoupon::query()->get();
        $saleOffers = PromotionSaleOffer::query()->get();
        $giftOffers = PromotionBuyToGiftOffer::query()->withCount('rules')->get();
        $activeCount = $coupons->filter(fn ($item) => $this->isActiveCampaign($item, $now))->count()
            + $saleOffers->filter(fn ($item) => $this->isActiveCampaign($item, $now))->count()
            + $giftOffers->filter(fn ($item) => $this->isActiveCampaign($item, $now))->count();
        $discountTotal = Order::query()
            ->whereBetween('placed_at', [$startDate, $endDate])
            ->where('order_status', '!=', 'cancelled')
            ->sum('discount_total');

        return [
            'type' => 'promotion',
            'title' => __('hancms.report.promotion.name'),
            'description' => __('hancms.report.promotion.description'),
            'filters' => $this->filters($startDate, $endDate),
            'metrics' => [
                ['label' => __('hancms.report.promotion.metrics.active'), 'value' => $activeCount, 'tone' => 'emerald'],
                ['label' => __('hancms.report.promotion.metrics.coupon_used'), 'value' => $coupons->sum('used_count'), 'tone' => 'cyan'],
                ['label' => __('hancms.report.promotion.metrics.discount_total'), 'value' => $this->money($discountTotal), 'tone' => 'amber'],
                ['label' => __('hancms.report.promotion.metrics.campaign_total'), 'value' => $coupons->count() + $saleOffers->count() + $giftOffers->count(), 'tone' => 'slate'],
            ],
            'charts' => [
                'campaigns' => [
                    ['label' => __('hancms.report.campaigns.coupon'), 'value' => $coupons->count()],
                    ['label' => __('hancms.report.campaigns.sale_offer'), 'value' => $saleOffers->count()],
                    ['label' => __('hancms.report.campaigns.buy_to_gift'), 'value' => $giftOffers->count()],
                ],
            ],
            'columns' => [
                ['key' => 'type', 'label' => __('hancms.report.columns.type')],
                ['key' => 'code', 'label' => __('hancms.report.columns.code')],
                ['key' => 'name', 'label' => __('hancms.report.columns.name')],
                ['key' => 'status_label', 'label' => __('hancms.report.columns.status')],
            ],
            'rows' => collect()
                ->merge($coupons->map(fn (PromotionCoupon $item) => $this->campaignRow(__('hancms.report.campaigns.coupon'), $item, $now)))
                ->merge($saleOffers->map(fn (PromotionSaleOffer $item) => $this->campaignRow(__('hancms.report.campaigns.sale_offer'), $item, $now)))
                ->merge($giftOffers->map(fn (PromotionBuyToGiftOffer $item) => $this->campaignRow(__('hancms.report.campaigns.buy_to_gift'), $item, $now)))
                ->take(20)
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, string>
     */
    private function filters(Carbon $startDate, Carbon $endDate): array
    {
        return [
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
        ];
    }

    private function dailyOrders(Collection $orders): Collection
    {
        return $orders
            ->groupBy(fn (Order $order) => optional($order->placed_at)->toDateString() ?: $order->created_at->toDateString())
            ->sortKeys()
            ->map(fn (Collection $items, string $date) => [
                'label' => $date,
                'orders' => $items->count(),
                'quantity' => (int) $items->sum('total_quantity'),
                'revenue' => (float) $items->sum('grand_total'),
                'revenue_label' => $this->money($items->sum('grand_total')),
            ]);
    }

    private function statusBreakdown(Collection $orders, string $field): array
    {
        return $orders
            ->groupBy($field)
            ->map(fn (Collection $items, string $status) => [
                'label' => $status,
                'value' => $items->count(),
            ])
            ->values()
            ->all();
    }

    private function productName(Product $product): string
    {
        $translation = $product->translations->firstWhere('locale', app()->getLocale())
            ?? $product->translations->firstWhere('locale', 'vi')
            ?? $product->translations->first();

        return $translation?->name ?: ($product->sku ?: '#'.$product->id);
    }

    private function isActiveCampaign(object $campaign, Carbon $now): bool
    {
        if (! (bool) ($campaign->is_active ?? false)) {
            return false;
        }

        if ($campaign->starts_at && $campaign->starts_at->greaterThan($now)) {
            return false;
        }

        if ($campaign->ends_at && $campaign->ends_at->lessThan($now)) {
            return false;
        }

        return true;
    }

    /**
     * @return array<string, string>
     */
    private function campaignRow(string $type, object $campaign, Carbon $now): array
    {
        return [
            'type' => $type,
            'code' => (string) ($campaign->code ?? 'N/A'),
            'name' => (string) ($campaign->name ?? 'N/A'),
            'status_label' => $this->isActiveCampaign($campaign, $now)
                ? __('hancms.report.status_labels.active')
                : __('hancms.report.status_labels.inactive'),
        ];
    }

    private function stockStatusLabel(int $quantity): string
    {
        if ($quantity <= 0) {
            return __('hancms.report.status_labels.out_of_stock');
        }

        if ($quantity <= 5) {
            return __('hancms.report.status_labels.low_stock');
        }

        return __('hancms.report.status_labels.healthy');
    }

    private function money(mixed $value): string
    {
        return number_format((float) $value, 0, ',', '.').' đ';
    }

    private function analysisInstructions(): string
    {
        return 'Bạn là chuyên gia phân tích vận hành ecommerce. '
            .'Hãy đọc dữ liệu báo cáo và trả lời bằng tiếng Việt, ngắn gọn, thực tế. '
            .'Tập trung vào insight, rủi ro, cơ hội và hành động đề xuất. '
            .'Không bịa số liệu ngoài JSON được cung cấp.';
    }

    /**
     * @param  array<string, mixed>  $report
     */
    private function analysisPrompt(array $report): string
    {
        $payload = json_encode($report, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return <<<PROMPT
Phân tích báo cáo sau:

{$payload}

Yêu cầu định dạng:
- 3-5 nhận định chính.
- 2-4 hành động nên làm tiếp theo.
- Nếu dữ liệu ít hoặc bằng 0, hãy nói rõ hạn chế dữ liệu.
PROMPT;
    }
}
