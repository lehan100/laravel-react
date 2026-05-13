<?php

namespace App\Services\Reports;

use App\Models\Catalog\Product;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionCoupon;
use App\Models\Promotion\PromotionSaleOffer;
use App\Models\Sales\Order;
use App\Models\Sales\OrderItem;
use App\Repositories\BuyToGift\BuyToGiftRepositoryInterface;
use App\Repositories\Coupon\CouponRepositoryInterface;
use App\Repositories\Order\OrderRepositoryInterface;
use App\Repositories\Product\ProductRepositoryInterface;
use App\Repositories\SaleOffer\SaleOfferRepositoryInterface;
use App\Services\ExchangeRateService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Laravel\Ai\Exceptions\RateLimitedException;

use function Laravel\Ai\agent;

class AdminReportService
{
    public function __construct(
        private readonly OrderRepositoryInterface $orderRepository,
        private readonly ProductRepositoryInterface $productRepository,
        private readonly CouponRepositoryInterface $couponRepository,
        private readonly SaleOfferRepositoryInterface $saleOfferRepository,
        private readonly BuyToGiftRepositoryInterface $buyToGiftRepository,
        private readonly ?ExchangeRateService $exchangeRateService = null
    ) {}

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
        $locale = $this->normalizeLocale(app()->currentLocale());

        try {
            $response = agent(
                instructions: $this->analysisInstructions($locale)
            )->prompt($this->analysisPrompt($report, $locale));

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
        $orders = $this->orderRepository->getOrdersByDateRange($startDate, $endDate);
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
        $items = $this->orderRepository->getTopSellingProducts($startDate, $endDate, 15);

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
                ['label' => __('hancms.report.product.metrics.active_catalog'), 'value' => count($this->productRepository->getProductsForInventoryReport()->where('status', 1)), 'tone' => 'amber'],
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
        $products = $this->productRepository->getProductsForInventoryReport();
        $adjustments = $this->productRepository->getInventoryAdjustmentsByDateRange($startDate, $endDate);
        $sortedProducts = $products
            ->sortBy(fn (Product $product) => $this->effectiveStock($product))
            ->values();

        return [
            'type' => 'inventory',
            'title' => __('hancms.report.inventory.name'),
            'description' => __('hancms.report.inventory.description'),
            'filters' => $this->filters($startDate, $endDate),
            'metrics' => [
                ['label' => __('hancms.report.inventory.metrics.total_stock'), 'value' => $products->sum(fn (Product $product) => $this->effectiveStock($product)), 'tone' => 'cyan'],
                ['label' => __('hancms.report.inventory.metrics.low_stock'), 'value' => $products->filter(fn (Product $product) => $this->effectiveStock($product) > 0 && $this->effectiveStock($product) <= 5)->count(), 'tone' => 'amber'],
                ['label' => __('hancms.report.inventory.metrics.out_of_stock'), 'value' => $products->filter(fn (Product $product) => $this->effectiveStock($product) <= 0)->count(), 'tone' => 'rose'],
                ['label' => __('hancms.report.inventory.metrics.adjustments'), 'value' => $adjustments->count(), 'tone' => 'slate'],
            ],
            'charts' => [
                'adjustments' => $adjustments
                    ->groupBy('action')
                    ->map(fn (Collection $items, string $action) => [
                        'label' => $this->inventoryActionLabel($action),
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
            'rows' => $sortedProducts->map(fn (Product $product) => [
                'name' => $this->productName($product),
                'sku' => $product->sku ?: 'N/A',
                'quantity' => $this->effectiveStock($product),
                'status_key' => $this->stockStatusKey($this->effectiveStock($product)),
                'status_label' => $this->stockStatusLabel($this->effectiveStock($product)),
            ])->take(20)->values()->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function promotion(Carbon $startDate, Carbon $endDate): array
    {
        $now = now();
        $coupons = $this->couponRepository->getAllCoupons();
        $saleOffers = $this->saleOfferRepository->getAllOffers();
        $giftOffers = $this->buyToGiftRepository->getAllOffersWithRuleCount();
        $activeCount = $coupons->filter(fn ($item) => $this->campaignStatusKey($item, $now) === 'active')->count()
            + $saleOffers->filter(fn ($item) => $this->campaignStatusKey($item, $now) === 'active')->count()
            + $giftOffers->filter(fn ($item) => $this->campaignStatusKey($item, $now) === 'active')->count();
        $discountTotal = $this->orderRepository->getDiscountTotalByDateRange($startDate, $endDate);

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

    /**
     * @return array<string, string>
     */
    private function campaignRow(string $type, object $campaign, Carbon $now): array
    {
        $statusKey = $this->campaignStatusKey($campaign, $now);

        return [
            'type' => $type,
            'code' => (string) ($campaign->code ?? 'N/A'),
            'name' => (string) ($campaign->name ?? 'N/A'),
            'status_key' => $statusKey,
            'status_label' => __('hancms.report.status_labels.'.$statusKey),
        ];
    }

    private function campaignStatusKey(object $campaign, Carbon $now): string
    {
        if (! (bool) ($campaign->is_active ?? false)) {
            return 'inactive';
        }

        $startsAt = $this->normalizePromotionDate($campaign->starts_at ?? null);
        $endsAt = $this->normalizePromotionDate($campaign->ends_at ?? null);

        if ($startsAt && $startsAt->greaterThan($now)) {
            return 'upcoming';
        }

        if ($endsAt && $endsAt->lessThan($now)) {
            return 'expired';
        }

        return 'active';
    }

    private function normalizePromotionDate(Carbon|string|null $value): ?Carbon
    {
        if ($value === null) {
            return null;
        }

        $timezone = config('app.admin_timezone', 'Asia/Ho_Chi_Minh');
        $dateString = $value instanceof Carbon ? $value->format('Y-m-d H:i:s') : (string) $value;

        return Carbon::parse($dateString, $timezone);
    }

    private function stockStatusLabel(int $quantity): string
    {
        return __('hancms.report.status_labels.'.$this->stockStatusKey($quantity));
    }

    private function stockStatusKey(int $quantity): string
    {
        if ($quantity <= 0) {
            return 'out_of_stock';
        }

        if ($quantity <= 5) {
            return 'low_stock';
        }

        return 'healthy';
    }

    private function effectiveStock(Product $product): int
    {
        $variantCount = (int) ($product->variants_count ?? 0);
        $variantStock = (int) ($product->variants_sum_stock ?? 0);

        return $variantCount > 0 ? $variantStock : (int) ($product->quantity ?? 0);
    }

    private function inventoryActionLabel(string $action): string
    {
        return __('hancms.report.inventory.actions.'.$action);
    }

    private function money(mixed $value): string
    {
        $amount = (float) $value;
        $currencyCode = $this->reportCurrencyCode();
        $displayAmount = $this->convertToDisplayCurrency($amount, $currencyCode);
        $fractionDigits = $currencyCode === 'VND' ? 0 : 3;
        $numeric = number_format($displayAmount, $fractionDigits, '.', ',');
        $format = $this->currencyFormat($currencyCode);
        $symbol = $format['symbol'];

        if ($currencyCode === 'VND' || $currencyCode === 'USD') {
            return $numeric.' '.$symbol;
        }

        if ($format['prefix']) {
            return $symbol.$numeric;
        }

        return $numeric.' '.$symbol;
    }

    private function analysisInstructions(string $locale): string
    {
        return match ($locale) {
            'en' => 'You are an ecommerce operations analyst. '
                .'Read the report data and answer in English using a clean HTML fragment only. '
                .'Focus on insights, risks, opportunities, and recommended actions. '
                .'Do not invent any numbers outside the provided JSON.',
            'ja' => 'あなたはEコマース運用の専門アナリストです。 '
                .'レポートデータを読み、日本語のきれいなHTMLフラグメントのみで回答してください。 '
                .'インサイト、リスク、機会、推奨アクションに集中してください。 '
                .'提供されたJSON以外の数値は作らないでください。',
            default => 'Bạn là chuyên gia phân tích vận hành ecommerce. '
                .'Hãy đọc dữ liệu báo cáo và trả lời bằng một HTML fragment gọn, sạch. '
                .'Tập trung vào insight, rủi ro, cơ hội và hành động đề xuất. '
                .'Không bịa số liệu ngoài JSON được cung cấp.',
        };
    }

    /**
     * @param  array<string, mixed>  $report
     */
    private function analysisPrompt(array $report, string $locale): string
    {
        $payload = json_encode($report, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $intro = match ($locale) {
            'en' => 'Analyze the report below:',
            'ja' => '以下のレポートを分析してください:',
            default => 'Phân tích báo cáo sau:',
        };

        $formatRequirements = match ($locale) {
            'en' => <<<'PROMPT'
Output requirements:
- Return only valid HTML.
- Use <p>, <h3>, <ol>, <li>, and <strong>.
- Start with a short opening paragraph.
- Add a "Key insights" section with 3-5 concise points.
- Add a "Next actions" section with 2-4 actionable items.
- If the data is sparse or zero, clearly state the limitation.
PROMPT,
            'ja' => <<<'PROMPT'
出力要件:
- HTMLのみを返してください。
- <p>、<h3>、<ol>、<li>、<strong> を使ってください。
- 短い導入文から始めてください。
- 「主要な洞察」セクションに3〜5件の要点を入れてください。
- 「次のアクション」セクションに2〜4件の実行項目を入れてください。
- データが少ない、または0の場合は、その制約を明確に述べてください。
PROMPT,
            default => <<<'PROMPT'
Yêu cầu định dạng:
- Chỉ trả về HTML hợp lệ.
- Dùng các thẻ <p>, <h3>, <ol>, <li> và <strong>.
- Bắt đầu bằng một đoạn mở đầu ngắn.
- Thêm mục "Nhận định chính" với 3-5 ý ngắn gọn.
- Thêm mục "Hành động tiếp theo" với 2-4 việc nên làm.
- Nếu dữ liệu ít hoặc bằng 0, hãy nói rõ hạn chế dữ liệu.
PROMPT,
        };

        return <<<PROMPT
{$intro}

{$payload}

{$formatRequirements}
PROMPT;
    }

    private function normalizeLocale(?string $locale): string
    {
        $normalized = strtolower(trim((string) $locale));

        if ($normalized === 'vn') {
            return 'vi';
        }

        return explode('-', $normalized)[0] ?: 'vi';
    }

    private function reportCurrencyCode(): string
    {
        return match ($this->normalizeLocale(app()->getLocale())) {
            'en' => 'USD',
            'ja' => 'JPY',
            'ko' => 'KRW',
            'zh' => 'CNY',
            'th' => 'THB',
            'fr', 'de', 'es', 'it', 'nl', 'fi', 'el' => 'EUR',
            'pt' => 'BRL',
            'ru' => 'RUB',
            'ar' => 'SAR',
            'hi' => 'INR',
            'id' => 'IDR',
            'ms' => 'MYR',
            'tr' => 'TRY',
            'pl' => 'PLN',
            'sv' => 'SEK',
            'da' => 'DKK',
            'no' => 'NOK',
            'cs' => 'CZK',
            'hu' => 'HUF',
            'ro' => 'RON',
            'he' => 'ILS',
            'uk' => 'UAH',
            'bn' => 'BDT',
            'ta' => 'INR',
            'ur' => 'PKR',
            default => 'VND',
        };
    }

    /**
     * @return array{symbol: string, prefix: bool}
     */
    private function currencyFormat(string $currencyCode): array
    {
        return match (strtoupper($currencyCode)) {
            'VND' => ['symbol' => 'đ', 'prefix' => false],
            'USD' => ['symbol' => '$', 'prefix' => false],
            'JPY' => ['symbol' => '￥', 'prefix' => true],
            'KRW' => ['symbol' => '₩', 'prefix' => true],
            'CNY' => ['symbol' => '¥', 'prefix' => true],
            'THB' => ['symbol' => '฿', 'prefix' => true],
            'EUR' => ['symbol' => '€', 'prefix' => false],
            'BRL' => ['symbol' => 'R$', 'prefix' => true],
            'RUB' => ['symbol' => '₽', 'prefix' => true],
            'SAR' => ['symbol' => '﷼', 'prefix' => true],
            'INR' => ['symbol' => '₹', 'prefix' => true],
            'IDR' => ['symbol' => 'Rp', 'prefix' => true],
            'MYR' => ['symbol' => 'RM', 'prefix' => true],
            'TRY' => ['symbol' => '₺', 'prefix' => true],
            'PLN' => ['symbol' => 'zł', 'prefix' => true],
            'SEK' => ['symbol' => 'kr', 'prefix' => true],
            'DKK' => ['symbol' => 'kr', 'prefix' => true],
            'NOK' => ['symbol' => 'kr', 'prefix' => true],
            'CZK' => ['symbol' => 'Kč', 'prefix' => true],
            'HUF' => ['symbol' => 'Ft', 'prefix' => true],
            'RON' => ['symbol' => 'lei', 'prefix' => true],
            'ILS' => ['symbol' => '₪', 'prefix' => true],
            'UAH' => ['symbol' => '₴', 'prefix' => true],
            'BDT' => ['symbol' => '৳', 'prefix' => true],
            'PKR' => ['symbol' => 'Rs', 'prefix' => true],
            default => ['symbol' => strtoupper($currencyCode), 'prefix' => false],
        };
    }

    private function convertToDisplayCurrency(float $amount, string $currencyCode): float
    {
        if ($currencyCode === 'VND') {
            return $amount;
        }

        $rateToVnd = $this->exchangeRateService()->rateToVnd($currencyCode);

        if ($rateToVnd <= 0) {
            return $amount;
        }

        return round($amount / $rateToVnd, 3);
    }

    private function exchangeRateService(): ExchangeRateService
    {
        return $this->exchangeRateService ?? app(ExchangeRateService::class);
    }
}
