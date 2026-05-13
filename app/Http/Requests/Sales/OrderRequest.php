<?php

namespace App\Http\Requests\Sales;

use App\Models\Catalog\Product;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionBuyToGiftOfferRule;
use App\Models\Sales\Order;
use App\Services\Promotion\BuyToGiftAvailabilityService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class OrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'discount_total' => $this->normalizeMoney($this->input('discount_total', 0)),
            'shipping_total' => $this->normalizeMoney($this->input('shipping_total', 0)),
            'payment_method_id' => $this->normalizeNullableInteger($this->input('payment_method_id')),
            'user_id' => $this->normalizeNullableInteger($this->input('user_id')),
            'province_code' => $this->normalizeNullableString($this->input('province_code')),
            'ward_code' => $this->normalizeNullableString($this->input('ward_code')),
            'price_snapshot' => $this->normalizePriceSnapshot($this->input('price_snapshot')),
            'undo' => (int) $this->input('undo', 0),
            'items' => collect($this->input('items', []))
                ->map(function ($item) {
                    return [
                        'product_id' => $this->normalizeNullableInteger($item['product_id'] ?? null),
                        'variant_id' => $this->normalizeNullableInteger($item['variant_id'] ?? null),
                        'quantity' => (int) ($item['quantity'] ?? 0),
                        'unit_price' => $this->normalizeMoney($item['unit_price'] ?? 0),
                        'is_gift' => (bool) ($item['is_gift'] ?? false),
                        'rule_id' => $this->normalizeNullableInteger($item['rule_id'] ?? null),
                        'meta' => is_array($item['meta'] ?? null) ? $item['meta'] : null,
                    ];
                })
                ->values()
                ->all(),
        ]);
    }

    public function rules(): array
    {
        $id = $this->route('order') ?? $this->route('id');

        return [
            'order_number' => [
                'required',
                'string',
                'max:50',
                Rule::unique('orders', 'order_number')->ignore($id),
            ],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:50'],
            'customer_address' => ['required', 'string', 'max:1000'],
            'province_code' => ['required', 'string', 'max:20', 'exists:provinces,code'],
            'ward_code' => ['required', 'string', 'max:20', 'exists:wards,code'],
            'note' => ['nullable', 'string', 'max:2000'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'payment_method_id' => ['required', 'integer', 'exists:payment_methods,id'],
            'price_snapshot' => ['nullable', 'array'],
            'price_snapshot.*.locale' => ['required_with:price_snapshot', 'string', 'max:20'],
            'price_snapshot.*.currency_code' => ['required_with:price_snapshot', 'string', 'max:10'],
            'price_snapshot.*.currency_symbol' => ['nullable', 'string', 'max:10'],
            'price_snapshot.*.exchange_rate_to_vnd' => ['required_with:price_snapshot', 'numeric', 'min:0.000001'],
            'order_status' => ['required', 'string', Rule::in(Order::ORDER_STATUSES)],
            'payment_status' => ['required', 'string', Rule::in(Order::PAYMENT_STATUSES)],
            'shipping_status' => ['required', 'string', Rule::in(Order::SHIPPING_STATUSES)],
            'discount_total' => ['nullable', 'numeric', 'min:0'],
            'shipping_total' => ['nullable', 'numeric', 'min:0'],
            'placed_at' => ['nullable', 'date'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => [
                'required',
                'integer',
                Rule::exists('products', 'id'),
            ],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'items.*.unit_price' => ['nullable', 'numeric', 'min:0'],
            'items.*.is_gift' => ['nullable', 'boolean'],
            'items.*.rule_id' => ['nullable', 'integer'],
            'coupon_code' => ['nullable', 'string', 'max:255'],
            'applied_promotions' => ['nullable', 'array'],
            'undo' => ['nullable', 'integer', Rule::in([0, 1])],
        ];
    }

    public function attributes(): array
    {
        return [
            'order_number' => trans('hancms.sales.orders.fields.order_number'),
            'customer_name' => trans('hancms.sales.orders.fields.customer_name'),
            'customer_email' => trans('hancms.sales.orders.fields.customer_email'),
            'customer_phone' => trans('hancms.sales.orders.fields.customer_phone'),
            'customer_address' => trans('hancms.sales.orders.fields.customer_address'),
            'province_code' => trans('hancms.sales.orders.fields.province'),
            'ward_code' => trans('hancms.sales.orders.fields.ward'),
            'payment_method_id' => trans('hancms.sales.orders.fields.payment_method'),
            'order_status' => trans('hancms.sales.orders.fields.order_status'),
            'payment_status' => trans('hancms.sales.orders.fields.payment_status'),
            'shipping_status' => trans('hancms.sales.orders.fields.shipping_status'),
            'discount_total' => trans('hancms.sales.orders.fields.discount_total'),
            'shipping_total' => trans('hancms.sales.orders.fields.shipping_total'),
            'placed_at' => trans('hancms.sales.orders.fields.placed_at'),
            'coupon_code' => trans('hancms.sales.orders.fields.coupon_code'),
        ];
    }

    public function messages(): array
    {
        return [
            'order_number.required' => trans('validation.required', [
                'attribute' => trans('hancms.sales.orders.fields.order_number'),
            ]),
            'customer_name.required' => trans('validation.required', [
                'attribute' => trans('hancms.sales.orders.fields.customer_name'),
            ]),
            'customer_phone.required' => trans('validation.required', [
                'attribute' => trans('hancms.sales.orders.fields.customer_phone'),
            ]),
            'customer_address.required' => trans('validation.required', [
                'attribute' => trans('hancms.sales.orders.fields.customer_address'),
            ]),
            'province_code.required' => trans('validation.required', [
                'attribute' => trans('hancms.sales.orders.fields.province'),
            ]),
            'ward_code.required' => trans('validation.required', [
                'attribute' => trans('hancms.sales.orders.fields.ward'),
            ]),
            'payment_method_id.required' => trans('validation.required', [
                'attribute' => trans('hancms.sales.orders.fields.payment_method'),
            ]),
            'order_status.required' => trans('validation.required', [
                'attribute' => trans('hancms.sales.orders.fields.order_status'),
            ]),
            'payment_status.required' => trans('validation.required', [
                'attribute' => trans('hancms.sales.orders.fields.payment_status'),
            ]),
            'shipping_status.required' => trans('validation.required', [
                'attribute' => trans('hancms.sales.orders.fields.shipping_status'),
            ]),
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $items = collect($this->input('items', []));
                $productIds = $items->pluck('product_id')->filter()->unique()->values();

                if ($productIds->isEmpty()) {
                    return;
                }

                $products = Product::query()
                    ->with(['variants:id,product_id,stock'])
                    ->whereIn('id', $productIds)
                    ->get()
                    ->keyBy('id');

                foreach ($items as $index => $item) {
                    $product = $products->get((int) ($item['product_id'] ?? 0));
                    if (! $product) {
                        continue;
                    }

                    $quantity = (int) ($item['quantity'] ?? 0);

                    if ($product->variants->isEmpty()) {
                        if ((int) ($product->quantity ?? 0) <= 0) {
                            $validator->errors()->add(
                                "items.$index.product_id",
                                __('validation.exists', ['attribute' => __('hancms.sales.orders.fields.product')])
                            );
                        }

                        if ($quantity > (int) ($product->quantity ?? 0)) {
                            $validator->errors()->add(
                                "items.$index.quantity",
                                __('validation.max.numeric', [
                                    'attribute' => __('hancms.sales.orders.fields.quantity'),
                                    'max' => (int) ($product->quantity ?? 0),
                                ])
                            );
                        }

                        continue;
                    }

                    $variantId = $item['variant_id'] ?? null;
                    if (empty($variantId)) {
                        $validator->errors()->add(
                            "items.$index.variant_id",
                            __('validation.required', ['attribute' => __('hancms.sales.orders.fields.variant')])
                        );

                        continue;
                    }

                    $variant = $product->variants->firstWhere('id', (int) $variantId);
                    if (! $variant) {
                        $validator->errors()->add(
                            "items.$index.variant_id",
                            __('validation.exists', ['attribute' => __('hancms.sales.orders.fields.variant')])
                        );

                        continue;
                    }

                    if ((int) ($variant->stock ?? 0) <= 0) {
                        $validator->errors()->add(
                            "items.$index.variant_id",
                            __('validation.exists', ['attribute' => __('hancms.sales.orders.fields.variant')])
                        );
                    }

                    if ($quantity > (int) ($variant->stock ?? 0)) {
                        $validator->errors()->add(
                            "items.$index.quantity",
                            __('validation.max.numeric', [
                                'attribute' => __('hancms.sales.orders.fields.quantity'),
                                'max' => (int) ($variant->stock ?? 0),
                            ])
                        );
                    }
                }
            },
            function (Validator $validator): void {
                $this->validateBuyToGiftSlots($validator);
                $this->validateBuyToGiftGiftVariantReserves($validator);
            },
        ];
    }

    private function validateBuyToGiftSlots(Validator $validator): void
    {
        $items = collect($this->input('items', []));
        if ($items->isEmpty()) {
            return;
        }

        $offers = PromotionBuyToGiftOffer::query()
            ->where('is_active', true)
            ->with([
                'rules' => function ($query): void {
                    $query->where('is_active', true)
                        ->orderBy('priority')
                        ->orderBy('id')
                        ->with([
                            'buyProducts:id,quantity,is_stock,status',
                            'giftProducts:id,quantity,is_stock,status',
                        ]);
                },
            ])
            ->get();

        if ($offers->isEmpty()) {
            return;
        }

        $availabilityService = app(BuyToGiftAvailabilityService::class);

        foreach ($offers as $offer) {
            $buyProductRules = $offer->rules->filter(function ($rule): bool {
                return (string) ($rule->condition_type ?? 'order_amount') === 'buy_product';
            });

            $orderAmountRules = $offer->rules->filter(function ($rule): bool {
                return (string) ($rule->condition_type ?? 'order_amount') === 'order_amount';
            });

            $appliedBuyProductProductIds = [];

            foreach ($buyProductRules as $rule) {
                $requestedSets = $availabilityService->calculateRequestedSets($rule, $items->all());
                if ($requestedSets <= 0) {
                    continue;
                }

                $summary = $availabilityService->summarizeRule($rule);
                $availableSlots = (int) ($summary['available_slots'] ?? 0);

                if ($availableSlots <= 0) {
                    continue;
                }

                $appliedBuyProductProductIds = array_values(array_unique(array_merge(
                    $appliedBuyProductProductIds,
                    $rule->buyProducts->pluck('id')->map(fn (mixed $value): int => (int) $value)->all()
                )));

                if ($requestedSets > $availableSlots) {
                    $validator->errors()->add(
                        'items',
                        'The selected Buy X Get Y promotion does not have enough remaining slots.'
                    );
                }
            }

            $orderAmountSubtotal = $this->calculateBuyToGiftOrderAmountSubtotal($items, $appliedBuyProductProductIds);

            foreach ($orderAmountRules as $rule) {
                $requestedSets = $this->calculateBuyToGiftOrderAmountRequestedSets($rule, $orderAmountSubtotal);
                if ($requestedSets <= 0) {
                    continue;
                }

                $summary = $availabilityService->summarizeRule($rule);
                $availableSlots = (int) ($summary['available_slots'] ?? 0);
                if ($availableSlots <= 0) {
                    $validator->errors()->add(
                        'items',
                        'The selected Buy X Get Y promotion has no remaining slots.'
                    );

                    continue;
                }

                if ($requestedSets > $availableSlots) {
                    $validator->errors()->add(
                        'items',
                        'The selected Buy X Get Y promotion does not have enough remaining slots.'
                    );
                }
            }
        }
    }

    /**
     * @param  Collection<int, array<string, mixed>>  $items
     * @param  array<int, int>  $excludedProductIds
     */
    private function calculateBuyToGiftOrderAmountSubtotal(Collection $items, array $excludedProductIds): float
    {
        $excludedLookup = array_fill_keys($excludedProductIds, true);

        return (float) $items
            ->filter(function (array $item) use ($excludedLookup): bool {
                if ((bool) ($item['is_gift'] ?? false) === true) {
                    return false;
                }

                $productId = (int) ($item['product_id'] ?? 0);

                return ! isset($excludedLookup[$productId]);
            })
            ->sum(fn (array $item): float => (float) ($item['line_total'] ?? ((float) ($item['quantity'] ?? 0) * (float) ($item['unit_price'] ?? 0))));
    }

    private function calculateBuyToGiftOrderAmountRequestedSets(PromotionBuyToGiftOfferRule $rule, float $subtotal): int
    {
        $minOrderAmount = (float) ($rule->min_order_amount ?? 0);
        if ($minOrderAmount <= 0) {
            return 0;
        }

        $requestedSets = (int) floor($subtotal / $minOrderAmount);
        $maxSetsPerOrder = (int) ($rule->max_sets_per_order ?? 0);
        if ($maxSetsPerOrder > 0) {
            $requestedSets = min($requestedSets, $maxSetsPerOrder);
        }

        return max(0, $requestedSets);
    }

    private function validateBuyToGiftGiftVariantReserves(Validator $validator): void
    {
        $items = collect($this->input('items', []));
        if ($items->isEmpty()) {
            return;
        }

        $giftItems = $items
            ->filter(fn (array $item): bool => (bool) ($item['is_gift'] ?? false))
            ->values();

        if ($giftItems->isEmpty()) {
            return;
        }

        $order = $this->resolveExistingOrder();
        $originalGiftQuantityMap = $order
            ? $this->buildOriginalGiftQuantityMap($order->items ?? collect())
            : [];

        $activeOffers = PromotionBuyToGiftOffer::query()
            ->where('is_active', true)
            ->with([
                'rules' => function ($query): void {
                    $query->where('is_active', true)
                        ->orderBy('priority')
                        ->orderBy('id')
                        ->with(['giftVariantOptions']);
                },
            ])
            ->get()
            ->flatMap(fn (PromotionBuyToGiftOffer $offer) => $offer->rules);

        if ($activeOffers->isEmpty()) {
            return;
        }

        /** @var array<string, int> $reserveMap */
        $reserveMap = [];
        foreach ($activeOffers as $rule) {
            foreach ($rule->giftVariantOptions as $option) {
                $key = $this->giftVariantKey(
                    (int) $rule->id,
                    (int) $option->product_id,
                    $option->variant_id !== null ? (int) $option->variant_id : null
                );

                $reserveMap[$key] = max(0, (int) ($option->reserve_qty ?? 0));
            }
        }

        foreach ($giftItems as $index => $item) {
            $ruleId = (int) ($item['rule_id'] ?? 0);
            $productId = (int) ($item['product_id'] ?? 0);
            $variantId = $this->normalizeNullableInteger($item['variant_id'] ?? null);
            $quantity = max(0, (int) ($item['quantity'] ?? 0));

            if ($ruleId <= 0 || $productId <= 0 || $variantId === null || $quantity <= 0) {
                continue;
            }

            $key = $this->giftVariantKey($ruleId, $productId, $variantId);
            if (! array_key_exists($key, $reserveMap)) {
                continue;
            }

            $originalQuantity = (int) ($originalGiftQuantityMap[$key] ?? 0);
            $delta = $quantity - $originalQuantity;

            if ($delta <= 0) {
                continue;
            }

            if ($delta > (int) $reserveMap[$key]) {
                $validator->errors()->add(
                    "items.$index.quantity",
                    __('validation.max.numeric', [
                        'attribute' => __('hancms.sales.orders.fields.quantity'),
                        'max' => (int) $reserveMap[$key] + $originalQuantity,
                    ])
                );
            }
        }
    }

    /**
     * @param  Collection<int, mixed>  $items
     * @return array<string, int>
     */
    private function buildOriginalGiftQuantityMap(Collection $items): array
    {
        $map = [];

        foreach ($items as $item) {
            if (! (bool) data_get($item, 'meta.is_gift', false)) {
                continue;
            }

            $ruleId = (int) data_get($item, 'meta.rule_id', 0);
            $productId = (int) ($item->product_id ?? 0);
            $variantId = $this->normalizeNullableInteger(data_get($item, 'meta.variant.id'));
            $quantity = max(0, (int) ($item->quantity ?? 0));

            if ($ruleId <= 0 || $productId <= 0 || $variantId === null || $quantity <= 0) {
                continue;
            }

            $key = $this->giftVariantKey($ruleId, $productId, $variantId);
            $map[$key] = ($map[$key] ?? 0) + $quantity;
        }

        return $map;
    }

    private function giftVariantKey(int $ruleId, int $productId, ?int $variantId): string
    {
        return $ruleId.':'.$productId.':'.($variantId ?? 0);
    }

    private function resolveExistingOrder(): ?Order
    {
        $orderId = $this->route('order') ?? $this->route('id');
        if (! $orderId) {
            return null;
        }

        return Order::query()
            ->with(['items:id,order_id,product_id,quantity,meta'])
            ->find((int) $orderId);
    }

    private function normalizeMoney(mixed $value): float
    {
        return round((float) $value, 2);
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

        $normalized = collect($entries)
            ->map(function ($entry) {
                if (! is_array($entry)) {
                    return null;
                }

                $locale = strtolower(trim((string) ($entry['locale'] ?? '')));
                $locale = $locale === '' ? '' : explode('-', $locale)[0];
                $currencyCode = strtoupper(trim((string) ($entry['currency_code'] ?? '')));
                $exchangeRateToVnd = round((float) ($entry['exchange_rate_to_vnd'] ?? 0), 8);

                if ($locale === '' || $currencyCode === '' || $exchangeRateToVnd <= 0) {
                    return null;
                }

                return [
                    'locale' => $locale,
                    'currency_code' => $currencyCode,
                    'currency_symbol' => trim((string) ($entry['currency_symbol'] ?? $this->defaultCurrencySymbol($currencyCode))),
                    'exchange_rate_to_vnd' => $exchangeRateToVnd,
                ];
            })
            ->filter()
            ->values()
            ->all();

        return $normalized === [] ? null : $normalized;
    }

    private function normalizeNullableInteger(mixed $value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) $value;
    }

    private function normalizeNullableString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $normalized = trim((string) $value);

        return $normalized === '' ? null : $normalized;
    }

    private function defaultCurrencySymbol(string $currencyCode): string
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
