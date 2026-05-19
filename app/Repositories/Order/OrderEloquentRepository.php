<?php

namespace App\Repositories\Order;

use App\Models\Catalog\Product;
use App\Models\Catalog\ProductVariant;
use App\Models\Promotion\PromotionBuyToGiftOfferRule;
use App\Models\Sales\Order;
use App\Models\Sales\OrderItem;
use App\Models\Sales\PaymentMethod;
use App\Models\Settings\Province;
use App\Models\Settings\Ward;
use App\Repositories\BuyToGift\BuyToGiftRepositoryInterface;
use App\Repositories\EloquentRepository;
use App\Services\Promotion\BuyToGiftOrderInventorySynchronizer;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderEloquentRepository extends EloquentRepository implements OrderRepositoryInterface
{
    public function getModel()
    {
        return Order::class;
    }

    public function lists($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if ($task !== 'admin-list-items') {
            return null;
        }

        $search = trim((string) ($params['search'] ?? ''));
        $orderStatus = (string) ($params['order_status'] ?? 'all');
        $paymentStatus = (string) ($params['payment_status'] ?? 'all');
        $perPage = max(10, min(100, (int) ($params['per_page'] ?? 20)));

        $query = Order::query()
            ->with(['paymentMethod:id,name,code'])
            ->withCount('items');

        if ($search !== '') {
            $query->where(function (Builder $builder) use ($search) {
                $builder
                    ->where('order_number', 'like', "%{$search}%")
                    ->orWhere('customer_name', 'like', "%{$search}%")
                    ->orWhere('customer_email', 'like', "%{$search}%")
                    ->orWhere('customer_phone', 'like', "%{$search}%");
            });
        }

        if ($orderStatus !== 'all') {
            $query->where('order_status', $orderStatus);
        }

        if ($paymentStatus !== 'all') {
            $query->where('payment_status', $paymentStatus);
        }

        return $query
            ->orderByDesc('placed_at')
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    public function get($params = null, $options = null)
    {
        $task = $options['task'] ?? null;

        if ($task === 'get-item') {
            return Order::query()
                ->with([
                    'paymentMethod:id,name,code',
                    'province:code,name,full_name,name_en,full_name_en',
                    'ward:code,name,full_name,name_en,full_name_en,province_code',
                    'items' => function ($query) {
                        $query->orderBy('id')->with(['product.translations', 'product.variants.translations']);
                    },
                    'timelines' => function ($query) {
                        $query->with('user:id,first_name,last_name,email')->limit(50);
                    },
                ])
                ->find((int) ($params['id'] ?? 0));
        }

        if ($task === 'get-form-options') {
            return [
                'products' => $this->productOptions(),
                'payment_methods' => $this->paymentMethodOptions(),
                'provinces' => $this->provinceOptions(),
                'wards' => $this->wardOptions(),
                'buytogift_gift_variant_reserves' => $this->giftVariantReserveMap(),
            ];
        }

        return null;
    }

    public function save($params = null, $options = null)
    {
        $task = $options['task'] ?? null;

        if ($task === 'add-item') {
            return DB::transaction(function () use ($params) {
                $totals = $this->buildOrderItemsPayload($params['items'] ?? []);
                $discountTotal = $this->normalizeMoney($params['discount_total'] ?? 0);
                $shippingTotal = $this->normalizeMoney($params['shipping_total'] ?? 0);
                $priceSnapshot = $this->normalizePriceSnapshot($params['price_snapshot'] ?? null) ?? $this->buildPriceSnapshot(
                    strtoupper(trim((string) ($params['currency_code'] ?? 'VND'))) ?: 'VND',
                    $this->normalizeExchangeRate($params['exchange_rate_to_vnd'] ?? 1)
                );
                $this->setTimelineContext([
                    'action' => 'created',
                ]);

                $order = Order::query()->create([
                    'order_number' => $this->generateOrderNumber($params['order_number'] ?? null),
                    'user_id' => $params['user_id'] ?? null,
                    'payment_method_id' => $params['payment_method_id'] ?? null,
                    'price_snapshot' => $priceSnapshot,
                    'customer_name' => trim((string) ($params['customer_name'] ?? '')),
                    'customer_email' => $this->nullableTrim($params['customer_email'] ?? null),
                    'customer_phone' => $this->nullableTrim($params['customer_phone'] ?? null),
                    'customer_address' => $this->nullableTrim($params['customer_address'] ?? null),
                    'province_code' => $this->nullableTrim($params['province_code'] ?? null),
                    'ward_code' => $this->nullableTrim($params['ward_code'] ?? null),
                    'note' => $this->nullableTrim($params['note'] ?? null),
                    'order_status' => (string) ($params['order_status'] ?? 'pending'),
                    'payment_status' => (string) ($params['payment_status'] ?? 'unpaid'),
                    'shipping_status' => (string) ($params['shipping_status'] ?? 'pending'),
                    'total_quantity' => $totals['total_quantity'],
                    'subtotal' => $totals['subtotal'],
                    'discount_total' => $discountTotal,
                    'shipping_total' => $shippingTotal,
                    'grand_total' => $totals['subtotal'] - $discountTotal + $shippingTotal,
                    'placed_at' => $params['placed_at'] ?? now(),
                    'coupon_code' => $this->nullableTrim($params['coupon_code'] ?? null),
                    'applied_promotions' => $params['applied_promotions'] ?? null,
                ]);

                $order->items()->createMany($totals['items']);

                if ($this->isInventoryConsumingStatus(
                    (string) ($params['order_status'] ?? 'pending'),
                    (string) ($params['shipping_status'] ?? 'pending')
                )) {
                    [$productAdjustments, $variantAdjustments] = $this->buildPhysicalInventoryMaps($totals['items'], -1);
                    $this->applyInventoryAdjustments(
                        $productAdjustments,
                        $variantAdjustments,
                        'Order created (initial stock deduction)',
                        [
                            'type' => 'order_delivery',
                            'order_id' => $order->id,
                            'order_number' => $order->order_number,
                        ]
                    );

                    app(BuyToGiftOrderInventorySynchronizer::class)->syncForTransition(
                        $order,
                        'cancelled',
                        'returned',
                        [],
                        $totals['items']
                    );
                }

                return $order->fresh(['paymentMethod', 'province', 'ward', 'items', 'timelines.user']);
            });
        }

        if ($task === 'edit-item') {
            return DB::transaction(function () use ($params) {
                $order = Order::query()
                    ->with([
                        'paymentMethod:id,name,code',
                        'items' => function ($query) {
                            $query->orderBy('id');
                        },
                    ])
                    ->find((int) ($params['id'] ?? 0));
                if (! $order) {
                    return null;
                }

                $original = $this->captureOrderState($order);
                $totals = $this->buildOrderItemsPayload($params['items'] ?? []);
                $discountTotal = $this->normalizeMoney($params['discount_total'] ?? 0);
                $shippingTotal = $this->normalizeMoney($params['shipping_total'] ?? 0);
                $snapshot = is_array($order->price_snapshot ?? null) ? $order->price_snapshot : [];
                $priceSnapshot = $this->normalizePriceSnapshot($params['price_snapshot'] ?? null) ?? $this->buildPriceSnapshot(
                    strtoupper(trim((string) ($params['currency_code'] ?? data_get($snapshot, '0.currency_code', 'VND')))) ?: 'VND',
                    $this->normalizeExchangeRate($params['exchange_rate_to_vnd'] ?? data_get($snapshot, '0.exchange_rate_to_vnd', 1)),
                    is_array($snapshot) ? $snapshot : null
                );
                $this->setTimelineContext([
                    'action' => 'updated',
                    'original' => $original,
                    'next_items_signature' => $this->makeItemsSignature($totals['items']),
                ]);

                $order->update([
                    'order_number' => $this->generateOrderNumber($params['order_number'] ?? $order->order_number, $order->id),
                    'user_id' => $params['user_id'] ?? null,
                    'payment_method_id' => $params['payment_method_id'] ?? null,
                    'price_snapshot' => $priceSnapshot,
                    'customer_name' => trim((string) ($params['customer_name'] ?? '')),
                    'customer_email' => $this->nullableTrim($params['customer_email'] ?? null),
                    'customer_phone' => $this->nullableTrim($params['customer_phone'] ?? null),
                    'customer_address' => $this->nullableTrim($params['customer_address'] ?? null),
                    'province_code' => $this->nullableTrim($params['province_code'] ?? null),
                    'ward_code' => $this->nullableTrim($params['ward_code'] ?? null),
                    'note' => $this->nullableTrim($params['note'] ?? null),
                    'order_status' => (string) ($params['order_status'] ?? 'pending'),
                    'payment_status' => (string) ($params['payment_status'] ?? 'unpaid'),
                    'shipping_status' => (string) ($params['shipping_status'] ?? 'pending'),
                    'total_quantity' => $totals['total_quantity'],
                    'subtotal' => $totals['subtotal'],
                    'discount_total' => $discountTotal,
                    'shipping_total' => $shippingTotal,
                    'grand_total' => $totals['subtotal'] - $discountTotal + $shippingTotal,
                    'placed_at' => $params['placed_at'] ?? $order->placed_at,
                    'coupon_code' => array_key_exists('coupon_code', $params) ? $this->nullableTrim($params['coupon_code']) : $order->coupon_code,
                    'applied_promotions' => array_key_exists('applied_promotions', $params) ? $params['applied_promotions'] : $order->applied_promotions,
                ]);

                $order->items()->delete();
                $order->items()->createMany($totals['items']);

                $previousOrderStatus = (string) ($original['order_status'] ?? $order->getOriginal('order_status') ?? 'pending');
                $previousShippingStatus = (string) ($original['shipping_status'] ?? $order->getOriginal('shipping_status') ?? 'pending');
                $nextOrderStatus = (string) ($order->order_status ?? $previousOrderStatus);
                $nextShippingStatus = (string) ($order->shipping_status ?? $previousShippingStatus);
                $previousItems = is_array($original['items'] ?? null) ? $original['items'] : [];
                $nextItems = $totals['items'];
                $previousItemsSignature = (string) ($original['items_signature'] ?? $this->makeItemsSignature($previousItems));
                $nextItemsSignature = $this->makeItemsSignature($nextItems);
                $wasConsuming = $this->isInventoryConsumingStatus($previousOrderStatus, $previousShippingStatus);
                $isConsuming = $this->isInventoryConsumingStatus($nextOrderStatus, $nextShippingStatus);

                if ($previousItemsSignature !== $nextItemsSignature || $wasConsuming !== $isConsuming) {
                    $this->syncInventoryForDeliveryTransition(
                        $order,
                        $previousOrderStatus,
                        $previousShippingStatus,
                        $previousItems,
                        $nextItems
                    );

                    app(BuyToGiftOrderInventorySynchronizer::class)->syncForTransition(
                        $order,
                        $previousOrderStatus,
                        $previousShippingStatus,
                        $previousItems,
                        $nextItems
                    );
                }

                $order->load([
                    'paymentMethod:id,name,code',
                    'items' => function ($query) {
                        $query->orderBy('id');
                    },
                ]);

                return $order->fresh(['paymentMethod', 'province', 'ward', 'items', 'timelines.user']);
            });
        }

        return null;
    }

    public function delete($params = null, $options = null)
    {
        $task = $options['task'] ?? null;

        if ($task === 'delete-item') {
            return DB::transaction(function () use ($params) {
                $order = Order::query()
                    ->with(['items' => function ($query) {
                        $query->orderBy('id');
                    }])
                    ->find((int) ($params['id'] ?? 0));
                if (! $order) {
                    return 0;
                }

                $original = $this->captureOrderState($order);
                $this->rollbackInventoryForDeletedOrder(
                    $order,
                    is_array($original['items'] ?? null) ? $original['items'] : []
                );

                $this->setTimelineContext([
                    'action' => 'deleted',
                ]);

                return $order->delete() ? 1 : 0;
            });
        }

        if ($task === 'delete-items') {
            $ids = collect(explode(',', (string) ($params['ids'] ?? '')))
                ->filter()
                ->map(fn ($id) => (int) $id)
                ->filter()
                ->values()
                ->all();

            if ($ids === []) {
                return 0;
            }

            return DB::transaction(function () use ($ids) {
                $deletedCount = 0;

                Order::query()
                    ->with(['items' => function ($query) {
                        $query->orderBy('id');
                    }])
                    ->whereIn('id', $ids)
                    ->chunkById(100, function ($orders) use (&$deletedCount) {
                        foreach ($orders as $order) {
                            $original = $this->captureOrderState($order);
                            $this->rollbackInventoryForDeletedOrder(
                                $order,
                                is_array($original['items'] ?? null) ? $original['items'] : []
                            );

                            $this->setTimelineContext([
                                'action' => 'deleted',
                            ]);

                            if ($order->delete()) {
                                $deletedCount++;
                            }
                        }
                    });

                return $deletedCount;
            });
        }

        return 0;
    }

    /**
     * @param  array<int, array<string, mixed>>  $rawItems
     * @return array{items: array<int, array<string, mixed>>, subtotal: float, total_quantity: int}
     */
    private function buildOrderItemsPayload(array $rawItems): array
    {
        $locale = app()->getLocale();
        $items = [];
        $subtotal = 0.0;
        $totalQuantity = 0;

        $products = Product::query()
            ->with(['translations' => function ($query) use ($locale) {
                $query->select(['id', 'product_id', 'locale', 'name'])->where('locale', $locale);
            }, 'variants.translations', 'variants.attributeValues.translations', 'variants.attributeValues.attribute.translations'])
            ->whereIn('id', collect($rawItems)->pluck('product_id')->filter()->all())
            ->get()
            ->keyBy('id');

        foreach ($rawItems as $rawItem) {
            $product = $products->get((int) ($rawItem['product_id'] ?? 0));
            if (! $product) {
                continue;
            }

            $quantity = max(1, (int) ($rawItem['quantity'] ?? 1));
            $unitPrice = $rawItem['unit_price'] !== null && $rawItem['unit_price'] !== ''
                ? $this->normalizeMoney($rawItem['unit_price'])
                : $this->normalizeMoney($product->price);
            $variant = ! empty($rawItem['variant_id'])
                ? $product->variants->firstWhere('id', (int) $rawItem['variant_id'])
                : null;
            $lineTotal = round($quantity * $unitPrice, 2);
            $productName = $product->translations->first()?->name ?? $product->sku ?? 'Product #'.$product->id;
            $variantLabel = $variant ? $this->variantLabel($variant) : null;

            $items[] = [
                'product_id' => $product->id,
                'product_name' => $variantLabel ? $productName.' - '.$variantLabel : $productName,
                'product_sku' => $variant?->sku ?: $product->sku,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'line_total' => $lineTotal,
                'meta' => [
                    'available_quantity' => $variant
                        ? (int) ($variant->stock ?? 0)
                        : (int) ($product->quantity ?? 0),
                    'price_source' => $rawItem['unit_price'] !== null && $rawItem['unit_price'] !== '' ? 'manual' : 'product',
                    'is_gift' => (bool) ($rawItem['is_gift'] ?? false),
                    'rule_id' => $rawItem['rule_id'] ?? null,
                    'variant' => $variant ? [
                        'id' => $variant->id,
                        'sku' => $variant->sku,
                        'name' => $variant->name,
                        'label' => $variantLabel,
                        'stock' => (int) ($variant->stock ?? 0),
                        'attribute_values' => $variant->attributeValues->map(fn ($value): array => [
                            'id' => $value->id,
                            'attribute' => $value->attribute?->name,
                            'value' => $value->value,
                        ])->values()->all(),
                    ] : null,
                ],
            ];

            $subtotal += $lineTotal;
            $totalQuantity += $quantity;
        }

        return [
            'items' => $items,
            'subtotal' => round($subtotal, 2),
            'total_quantity' => $totalQuantity,
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function productOptions(): array
    {
        $locale = app()->getLocale();

        return Product::query()
            ->select(['id', 'sku', 'price', 'quantity', 'is_stock'])
            ->with(['translations' => function ($query) use ($locale) {
                $query->select(['id', 'product_id', 'locale', 'name'])->where('locale', $locale);
            }, 'variants.translations', 'variants.attributeValues.translations', 'variants.attributeValues.attribute.translations'])
            ->orderByDesc('id')
            ->limit(200)
            ->get()
            ->map(function (Product $product) {
                $variants = $product->variants
                    ->sortBy('id')
                    ->map(fn (ProductVariant $variant): array => [
                        'id' => $variant->id,
                        'sku' => $variant->sku,
                        'label' => $this->variantLabel($variant),
                        'price' => (float) $variant->price,
                        'stock' => (int) ($variant->stock ?? 0),
                    ])
                    ->values()
                    ->all();

                return [
                    'id' => $product->id,
                    'sku' => $product->sku,
                    'name' => $product->translations->first()?->name ?? $product->sku ?? 'Product #'.$product->id,
                    'price' => (float) $product->price,
                    'quantity' => (int) ($product->quantity ?? 0),
                    'is_stock' => (bool) $product->is_stock,
                    'variants' => $variants,
                    'has_variants' => $variants !== [],
                    'available_quantity' => $variants !== []
                        ? collect($variants)->sum('stock')
                        : (int) ($product->quantity ?? 0),
                ];
            })
            ->all();
    }

    /**
     * @return array<string, int>
     */
    private function giftVariantReserveMap(): array
    {
        $offers = app(BuyToGiftRepositoryInterface::class)->getActiveOffersForCalculation(now());

        return $offers
            ->flatMap(function ($offer): Collection {
                return $offer->rules->flatMap(function ($rule): Collection {
                    return $rule->giftVariantOptions->mapWithKeys(function ($option) use ($rule): array {
                        return [
                            $this->giftVariantReserveKey((int) $rule->id, (int) $option->product_id, (int) $option->variant_id) => max(0, (int) ($option->reserve_qty ?? 0)),
                        ];
                    });
                });
            })
            ->toArray();
    }

    private function giftVariantReserveKey(int $ruleId, int $productId, int $variantId): string
    {
        return $ruleId.':'.$productId.':'.$variantId;
    }

    private function variantLabel(ProductVariant $variant): string
    {
        $parts = [];

        if (is_string($variant->name) && trim($variant->name) !== '') {
            $parts[] = trim($variant->name);
        }

        $attributeValues = $variant->relationLoaded('attributeValues')
            ? $variant->attributeValues
            : collect();

        $attributeLabel = $attributeValues
            ->map(function ($value): string {
                $attributeName = $value->attribute?->name;
                $valueName = $value->value;

                return trim(($attributeName ? $attributeName.': ' : '').(string) $valueName);
            })
            ->filter()
            ->implode(' / ');

        if ($attributeLabel !== '') {
            $parts[] = $attributeLabel;
        }

        if ($parts === [] && is_string($variant->sku) && trim($variant->sku) !== '') {
            $parts[] = trim($variant->sku);
        }

        return implode(' - ', array_unique($parts)) ?: 'Variant #'.$variant->id;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function paymentMethodOptions(): array
    {
        return PaymentMethod::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'code', 'name'])
            ->map(function (PaymentMethod $paymentMethod) {
                return [
                    'id' => $paymentMethod->id,
                    'code' => $paymentMethod->code,
                    'name' => $paymentMethod->name,
                    'label' => $this->paymentMethodLabel($paymentMethod),
                ];
            })
            ->all();
    }

    private function paymentMethodLabel(PaymentMethod $paymentMethod): string
    {
        if ($paymentMethod->code === 'cash_on_delivery') {
            return __('hancms.sales.payment_methods.providers.cash_on_delivery');
        }

        return (string) $paymentMethod->name;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function provinceOptions(): array
    {
        $locale = app()->getLocale();

        return Province::query()
            ->orderBy('code')
            ->get(['code', 'name', 'name_en', 'full_name', 'full_name_en', 'administrative_unit_id'])
            ->map(fn (Province $province): array => [
                'code' => $province->code,
                'name' => $province->name,
                'name_en' => $province->name_en,
                'full_name' => $province->full_name,
                'full_name_en' => $province->full_name_en,
                'label' => $this->localizedLocationLabel($province->full_name, $province->full_name_en, $locale),
                'administrative_unit_id' => $province->administrative_unit_id,
            ])
            ->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function wardOptions(): array
    {
        $locale = app()->getLocale();

        return Ward::query()
            ->orderBy('province_code')
            ->orderBy('code')
            ->get(['code', 'name', 'name_en', 'full_name', 'full_name_en', 'province_code', 'administrative_unit_id'])
            ->map(fn (Ward $ward): array => [
                'code' => $ward->code,
                'name' => $ward->name,
                'name_en' => $ward->name_en,
                'full_name' => $ward->full_name,
                'full_name_en' => $ward->full_name_en,
                'label' => $this->localizedLocationLabel($ward->full_name, $ward->full_name_en, $locale),
                'province_code' => $ward->province_code,
                'administrative_unit_id' => $ward->administrative_unit_id,
            ])
            ->all();
    }

    private function localizedLocationLabel(?string $value, ?string $fallback, string $locale): ?string
    {
        if ($locale === '' || str_starts_with($locale, 'vi')) {
            return $value;
        }

        return filled($fallback) ? $fallback : $value;
    }

    private function captureOrderState(Order $order): array
    {
        return [
            'customer_name' => (string) $order->customer_name,
            'customer_email' => $this->nullableTrim($order->customer_email),
            'customer_phone' => $this->nullableTrim($order->customer_phone),
            'customer_address' => $this->nullableTrim($order->customer_address),
            'province_code' => $this->nullableTrim($order->province_code),
            'ward_code' => $this->nullableTrim($order->ward_code),
            'province_name' => $order->province?->full_name ?? $order->province?->name,
            'ward_name' => $order->ward?->full_name ?? $order->ward?->name,
            'note' => $this->nullableTrim($order->note),
            'order_status' => (string) $order->order_status,
            'payment_status' => (string) $order->payment_status,
            'shipping_status' => (string) $order->shipping_status,
            'payment_method_id' => $order->payment_method_id ? (int) $order->payment_method_id : null,
            'payment_method_name' => $order->paymentMethod?->name ?? '-',
            'price_snapshot' => is_array($order->price_snapshot ?? null) ? $order->price_snapshot : [],
            'total_quantity' => (int) $order->total_quantity,
            'subtotal' => (float) $order->subtotal,
            'discount_total' => (float) $order->discount_total,
            'shipping_total' => (float) $order->shipping_total,
            'grand_total' => (float) $order->grand_total,
            'coupon_code' => $order->coupon_code,
            'applied_promotions' => is_array($order->applied_promotions) ? $order->applied_promotions : [],
            'placed_at' => optional($order->placed_at)?->format('Y-m-d H:i:s'),
            'items_signature' => $this->makeItemsSignature($order->items),
            'items' => $order->items
                ->map(fn (OrderItem $item) => [
                    'product_id' => (int) $item->product_id,
                    'quantity' => (int) $item->quantity,
                    'variant_id' => data_get($item->meta, 'variant.id') ? (int) data_get($item->meta, 'variant.id') : null,
                    'is_gift' => (bool) data_get($item->meta, 'is_gift', false),
                    'rule_id' => data_get($item->meta, 'rule_id') ? (int) data_get($item->meta, 'rule_id') : null,
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>|Collection<int, OrderItem>  $items
     */
    private function makeItemsSignature(array|Collection $items): string
    {
        $normalized = collect($items)
            ->map(function (array|OrderItem $item): array {
                if ($item instanceof OrderItem) {
                    return [
                        'product_id' => (int) $item->product_id,
                        'quantity' => (int) $item->quantity,
                        'unit_price' => round((float) $item->unit_price, 2),
                        'variant_id' => (int) data_get($item->meta, 'variant.id', 0) ?: null,
                        'is_gift' => (bool) data_get($item->meta, 'is_gift', false),
                    ];
                }

                return [
                    'product_id' => (int) ($item['product_id'] ?? 0),
                    'quantity' => (int) ($item['quantity'] ?? 0),
                    'unit_price' => round((float) ($item['unit_price'] ?? 0), 2),
                    'variant_id' => $this->extractVariantId($item),
                    'is_gift' => (bool) (($item['meta'] ?? [])['is_gift'] ?? false),
                ];
            })
            ->all();

        usort($normalized, function (array $left, array $right): int {
            $leftKey = [
                (int) ($left['is_gift'] ?? false),
                (int) ($left['rule_id'] ?? 0),
                (int) ($left['product_id'] ?? 0),
                (int) ($left['variant_id'] ?? 0),
                (int) ($left['quantity'] ?? 0),
                (float) ($left['unit_price'] ?? 0),
            ];
            $rightKey = [
                (int) ($right['is_gift'] ?? false),
                (int) ($right['rule_id'] ?? 0),
                (int) ($right['product_id'] ?? 0),
                (int) ($right['variant_id'] ?? 0),
                (int) ($right['quantity'] ?? 0),
                (float) ($right['unit_price'] ?? 0),
            ];

            return $leftKey <=> $rightKey;
        });

        return md5(json_encode($normalized) ?: '[]');
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function setTimelineContext(array $context): void
    {
        request()->attributes->set('order_timeline_context', $context);
    }

    private function generateOrderNumber(?string $requestedNumber = null, ?int $ignoreId = null): string
    {
        $requestedNumber = $this->nullableTrim($requestedNumber);
        if ($requestedNumber !== null) {
            return $requestedNumber;
        }

        do {
            $candidate = 'ORD-'.now()->format('YmdHis').'-'.Str::upper(Str::random(4));
        } while (Order::query()
            ->when($ignoreId !== null, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->where('order_number', $candidate)
            ->exists());

        return $candidate;
    }

    private function normalizeMoney(mixed $value): float
    {
        return round((float) $value, 2);
    }

    private function normalizeExchangeRate(mixed $value): float
    {
        $rate = round((float) $value, 8);

        return $rate > 0 ? $rate : 1;
    }

    /**
     * @return array<int, array{locale: string, currency_code: string, currency_symbol: string, exchange_rate_to_vnd: float}>
     */
    private function buildPriceSnapshot(
        string $currencyCode,
        float $exchangeRateToVnd,
        ?array $existingSnapshot = null
    ): array {
        $currencySymbol = $this->currencySymbol($currencyCode);
        if (is_array($existingSnapshot) && $existingSnapshot !== []) {
            return $this->normalizePriceSnapshot($existingSnapshot) ?? [[
                'locale' => $this->resolveLocaleKey(app()->getLocale()),
                'currency_code' => $currencyCode,
                'currency_symbol' => $currencySymbol,
                'exchange_rate_to_vnd' => $exchangeRateToVnd,
            ]];
        }

        return [[
            'locale' => $this->resolveLocaleKey(app()->getLocale()),
            'currency_code' => $currencyCode,
            'currency_symbol' => $currencySymbol,
            'exchange_rate_to_vnd' => $exchangeRateToVnd,
        ]];
    }

    private function normalizePriceSnapshot(mixed $snapshot): ?array
    {
        $entries = [];

        if (is_array($snapshot)) {
            $entries = array_is_list($snapshot) ? $snapshot : ($snapshot['currencies'] ?? []);
        }

        if (! is_array($entries) || $entries === []) {
            return null;
        }

        return collect($entries)
            ->map(function ($entry) {
                if (! is_array($entry)) {
                    return null;
                }

                $locale = strtolower(trim((string) ($entry['locale'] ?? '')));
                $locale = $locale === '' ? '' : explode('-', $locale)[0];
                $currencyCode = strtoupper(trim((string) ($entry['currency_code'] ?? '')));
                $exchangeRateToVnd = $this->normalizeExchangeRate($entry['exchange_rate_to_vnd'] ?? 0);

                if ($locale === '' || $currencyCode === '' || $exchangeRateToVnd <= 0) {
                    return null;
                }

                return [
                    'locale' => $locale,
                    'currency_code' => $currencyCode,
                    'currency_symbol' => trim((string) ($entry['currency_symbol'] ?? $this->currencySymbol($currencyCode))),
                    'exchange_rate_to_vnd' => $exchangeRateToVnd,
                ];
            })
            ->filter()
            ->values()
            ->all() ?: null;
    }

    /**
     * @param  array<int, array<string, mixed>>  $originalItems
     */
    private function rollbackInventoryForDeletedOrder(Order $order, array $originalItems): void
    {
        if (! $this->isInventoryConsumingStatus((string) $order->order_status, (string) $order->shipping_status)) {
            return;
        }

        [$productAdjustments, $variantAdjustments] = $this->buildPhysicalInventoryMaps($originalItems, 1);
        $this->applyInventoryAdjustments(
            $productAdjustments,
            $variantAdjustments,
            'Order deleted (stock rollback)',
            [
                'type' => 'order_delete_rollback',
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ]
        );

        $transitionOrder = (object) [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'order_status' => 'cancelled',
            'shipping_status' => 'returned',
        ];

        app(BuyToGiftOrderInventorySynchronizer::class)->syncForTransition(
            $transitionOrder,
            (string) $order->order_status,
            (string) $order->shipping_status,
            $originalItems,
            []
        );
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

    private function resolveLocaleKey(string $locale): string
    {
        $normalized = strtolower(trim($locale));

        return $normalized === '' ? 'vi' : explode('-', $normalized)[0];
    }

    private function nullableTrim(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $trimmed = trim((string) $value);

        return $trimmed === '' ? null : $trimmed;
    }

    private function isInventoryConsumingStatus(string $orderStatus, string $shippingStatus): bool
    {
        return $orderStatus !== 'cancelled'
            && $shippingStatus !== 'returned';
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     * @return array{0: array<int, int>, 1: array<int, int>}
     */
    private function buildPhysicalInventoryMaps(array $items, int $multiplier = 1): array
    {
        $productMap = [];
        $variantMap = [];

        foreach ($items as $item) {
            $productId = (int) ($item['product_id'] ?? 0);
            $quantity = (int) ($item['quantity'] ?? 0);

            if ($productId <= 0 || $quantity <= 0 || $this->isGiftItem($item)) {
                continue;
            }

            $variantId = $this->extractVariantId($item);
            if ($variantId !== null) {
                $variantMap[$variantId] = ($variantMap[$variantId] ?? 0) + ($quantity * $multiplier);

                continue;
            }

            $productMap[$productId] = ($productMap[$productId] ?? 0) + ($quantity * $multiplier);
        }

        return [$productMap, $variantMap];
    }

    /**
     * @param  array<int, array<string, mixed>>  $originalItems
     * @param  array<int, array<string, mixed>>  $nextItems
     */
    private function syncInventoryForDeliveryTransition(
        Order $order,
        string $oldOrderStatus,
        string $oldShippingStatus,
        array $originalItems,
        array $nextItems
    ): void {
        $wasConsuming = $this->isInventoryConsumingStatus($oldOrderStatus, $oldShippingStatus);
        $isConsuming = $this->isInventoryConsumingStatus((string) $order->order_status, (string) $order->shipping_status);

        [$oldProductMap, $oldVariantMap] = $this->buildPhysicalInventoryMaps($originalItems);
        [$newProductMap, $newVariantMap] = $this->buildPhysicalInventoryMaps($nextItems);

        if (! $wasConsuming && $isConsuming) {
            [$productAdjustments, $variantAdjustments] = $this->buildPhysicalInventoryMaps($nextItems, -1);
            $this->applyInventoryAdjustments(
                $productAdjustments,
                $variantAdjustments,
                'Order active/created (stock deduction)',
                [
                    'type' => 'order_delivery',
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ]
            );

            return;
        }

        if ($wasConsuming && ! $isConsuming) {
            $this->applyInventoryAdjustments(
                $oldProductMap,
                $oldVariantMap,
                'Order cancelled/returned (stock rollback)',
                [
                    'type' => 'order_delivery_rollback',
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ]
            );

            return;
        }

        if ($wasConsuming && $isConsuming) {
            $allProductIds = collect(array_keys($oldProductMap))
                ->merge(array_keys($newProductMap))
                ->unique()
                ->values();

            $allVariantIds = collect(array_keys($oldVariantMap))
                ->merge(array_keys($newVariantMap))
                ->unique()
                ->values();

            $productDeltaMap = [];
            foreach ($allProductIds as $productId) {
                $oldQty = (int) ($oldProductMap[(int) $productId] ?? 0);
                $newQty = (int) ($newProductMap[(int) $productId] ?? 0);
                $delta = $oldQty - $newQty;

                if ($delta !== 0) {
                    $productDeltaMap[(int) $productId] = $delta;
                }
            }

            $variantDeltaMap = [];
            foreach ($allVariantIds as $variantId) {
                $oldQty = (int) ($oldVariantMap[(int) $variantId] ?? 0);
                $newQty = (int) ($newVariantMap[(int) $variantId] ?? 0);
                $delta = $oldQty - $newQty;

                if ($delta !== 0) {
                    $variantDeltaMap[(int) $variantId] = $delta;
                }
            }

            $this->applyInventoryAdjustments(
                $productDeltaMap,
                $variantDeltaMap,
                'Order items changed while delivered/completed (stock sync)',
                [
                    'type' => 'order_delivery_sync',
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                ]
            );
        }
    }

    /**
     * @param  array<int, int>  $productAdjustments
     * @param  array<int, int>  $variantAdjustments
     *                                               delta > 0: increase stock, delta < 0: decrease stock.
     * @param  array<string, mixed>  $meta
     */
    private function applyInventoryAdjustments(array $productAdjustments, array $variantAdjustments, string $reason, array $meta = []): void
    {
        if ($productAdjustments === [] && $variantAdjustments === []) {
            return;
        }

        if ($productAdjustments !== []) {
            $productIds = array_keys($productAdjustments);

            Product::query()
                ->whereIn('id', $productIds)
                ->lockForUpdate()
                ->get()
                ->each(function (Product $product) use ($productAdjustments, $reason, $meta): void {
                    $delta = (int) ($productAdjustments[$product->id] ?? 0);
                    if ($delta === 0) {
                        return;
                    }

                    $currentQuantity = (int) ($product->quantity ?? 0);
                    $nextQuantity = max(0, $currentQuantity + $delta);

                    request()->attributes->set('inventory_log_context', [
                        'action' => $delta < 0 ? 'order_deduct' : 'order_rollback',
                        'reason' => $reason,
                        'meta' => array_merge($meta, [
                            'channel' => 'order',
                            'delta' => $delta,
                            'old_quantity' => $currentQuantity,
                            'new_quantity' => $nextQuantity,
                        ]),
                    ]);

                    $product->quantity = $nextQuantity;
                    $product->is_stock = $nextQuantity > 0;
                    $product->save();
                });
        }

        if ($variantAdjustments === []) {
            return;
        }

        $touchedProductIds = [];

        ProductVariant::query()
            ->whereIn('id', array_keys($variantAdjustments))
            ->lockForUpdate()
            ->get()
            ->each(function (ProductVariant $variant) use ($variantAdjustments, $reason, $meta, &$touchedProductIds): void {
                $delta = (int) ($variantAdjustments[$variant->id] ?? 0);
                if ($delta === 0) {
                    return;
                }

                $currentQuantity = (int) ($variant->stock ?? 0);
                $nextQuantity = max(0, $currentQuantity + $delta);

                request()->attributes->set('inventory_log_context', [
                    'action' => $delta < 0 ? 'order_deduct' : 'order_rollback',
                    'reason' => $reason,
                    'meta' => array_merge($meta, [
                        'channel' => 'order',
                        'type' => 'variant_stock',
                        'variant_id' => (int) $variant->id,
                        'product_id' => (int) $variant->product_id,
                        'delta' => $delta,
                        'old_quantity' => $currentQuantity,
                        'new_quantity' => $nextQuantity,
                    ]),
                ]);

                $variant->stock = $nextQuantity;
                $variant->save();
                $touchedProductIds[(int) $variant->product_id] = (int) $variant->product_id;
            });

        foreach (array_values($touchedProductIds) as $productId) {
            $this->syncProductQuantityFromVariantsById($productId);
        }
    }

    private function syncProductQuantityFromVariantsById(int $productId): void
    {
        $product = Product::query()->lockForUpdate()->find($productId);
        if (! $product) {
            return;
        }

        $this->syncProductQuantityFromVariants($product);
    }

    private function syncProductQuantityFromVariants(Product $product): void
    {
        $product->loadMissing('variants');
        if ($product->variants->isEmpty()) {
            return;
        }

        $totalStock = (int) $product->variants->sum('stock');
        $product->quantity = $totalStock;
        $product->is_stock = $totalStock > 0;
        $product->saveQuietly();
    }

    /**
     * @param  array<string, mixed>|array<int, mixed>  $item
     */
    private function isGiftItem(array $item): bool
    {
        return (bool) data_get($item, 'meta.is_gift', false);
    }

    /**
     * @param  array<string, mixed>|array<int, mixed>  $item
     */
    private function extractVariantId(array $item): ?int
    {
        $variantId = data_get($item, 'variant_id');
        if ($variantId === null || $variantId === '') {
            $variantId = data_get($item, 'meta.variant.id');
        }

        $variantId = (int) $variantId;

        return $variantId > 0 ? $variantId : null;
    }

    public function calculateSoldQuantityForRule(PromotionBuyToGiftOfferRule $rule, ?int $excludeOrderId = null): int
    {
        return (int) OrderItem::query()
            ->select(['id', 'order_id', 'quantity', 'meta'])
            ->with(['order:id,order_status,shipping_status,deleted_at'])
            ->whereHas('order', function ($query): void {
                $query->whereNull('deleted_at');
            })
            ->when($excludeOrderId !== null, function ($query) use ($excludeOrderId): void {
                $query->where('order_id', '!=', $excludeOrderId);
            })
            ->get()
            ->filter(function (OrderItem $item) use ($rule): bool {
                if (! (bool) data_get($item->meta, 'is_gift')) {
                    return false;
                }

                $orderStatus = (string) ($item->order?->order_status ?? '');
                $shippingStatus = (string) ($item->order?->shipping_status ?? '');

                if ($orderStatus === 'cancelled' || $shippingStatus === 'returned') {
                    return false;
                }

                return (int) data_get($item->meta, 'rule_id') === (int) $rule->id;
            })
            ->sum('quantity');
    }

    public function getOrdersByDateRange(Carbon $startDate, Carbon $endDate): Collection
    {
        return $this->_model->query()
            ->whereBetween('placed_at', [$startDate, $endDate])
            ->get();
    }

    public function getTopSellingProducts(Carbon $startDate, Carbon $endDate, int $limit = 15): Collection
    {
        return OrderItem::query()
            ->selectRaw('product_id, product_sku, product_name, SUM(quantity) as sold_quantity, SUM(line_total) as revenue')
            ->whereHas('order', fn (Builder $query) => $query
                ->whereBetween('placed_at', [$startDate, $endDate])
                ->where('order_status', '!=', 'cancelled'))
            ->groupBy('product_id', 'product_sku', 'product_name')
            ->orderByDesc('revenue')
            ->limit($limit)
            ->get();
    }

    public function getDiscountTotalByDateRange(Carbon $startDate, Carbon $endDate): float
    {
        return (float) $this->_model->query()
            ->whereBetween('placed_at', [$startDate, $endDate])
            ->where('order_status', '!=', 'cancelled')
            ->sum('discount_total');
    }
}
