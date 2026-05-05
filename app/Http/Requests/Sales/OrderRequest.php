<?php

namespace App\Http\Requests\Sales;

use App\Models\Sales\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
                        'quantity' => (int) ($item['quantity'] ?? 0),
                        'unit_price' => $this->normalizeMoney($item['unit_price'] ?? 0),
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
                'nullable',
                'string',
                'max:50',
                Rule::unique('orders', 'order_number')->ignore($id),
            ],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:50'],
            'customer_address' => ['nullable', 'string', 'max:1000'],
            'province_code' => ['nullable', 'string', 'max:20', 'exists:provinces,code'],
            'ward_code' => ['nullable', 'string', 'max:20', 'exists:wards,code'],
            'note' => ['nullable', 'string', 'max:2000'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'payment_method_id' => ['nullable', 'integer', 'exists:payment_methods,id'],
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
                Rule::exists('products', 'id')->where(function ($query) {
                    $query->where('quantity', '>', 0);
                }),
            ],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['nullable', 'numeric', 'min:0'],
            'undo' => ['nullable', 'integer', Rule::in([0, 1])],
        ];
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
