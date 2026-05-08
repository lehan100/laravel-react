<?php

namespace App\Http\Requests\Promotion;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $numericFields = [
            'discount_value',
            'max_discount_amount',
            'min_order_amount',
            'max_order_amount',
        ];

        $normalized = [];
        foreach ($numericFields as $field) {
            if ($this->exists($field)) {
                $normalized[$field] = $this->normalizeDecimalInput($this->input($field));
            }
        }

        $this->merge([
            'is_active' => filter_var($this->input('is_active', false), FILTER_VALIDATE_BOOLEAN),
            'is_public' => filter_var($this->input('is_public', false), FILTER_VALIDATE_BOOLEAN),
            'stackable' => filter_var($this->input('stackable', false), FILTER_VALIDATE_BOOLEAN),
            'first_order_only' => filter_var($this->input('first_order_only', false), FILTER_VALIDATE_BOOLEAN),
        ] + $normalized);
    }

    public function rules(): array
    {
        $couponId = $this->route('coupon');
        if (is_object($couponId)) {
            $couponId = $couponId->id ?? null;
        }

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('promotion_coupons', 'code')->ignore($couponId),
            ],
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'discount_type' => ['required', Rule::in(['percent', 'fixed'])],
            'discount_value' => [
                'required',
                'numeric',
                'min:0',
                Rule::when($this->input('discount_type') === 'percent', ['max:100']),
            ],
            'max_discount_amount' => ['nullable', 'numeric', 'min:0'],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_order_amount' => ['nullable', 'numeric', 'min:0'],
            'usage_limit_total' => ['nullable', 'integer', 'min:1'],
            'usage_limit_per_user' => ['nullable', 'integer', 'min:1'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'campaign_id' => ['nullable', 'integer', 'exists:promotion_campaigns,id'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
            'product_ids' => ['nullable', 'array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
            'is_active' => ['boolean'],
            'is_public' => ['boolean'],
            'stackable' => ['boolean'],
            'first_order_only' => ['boolean'],
            'undo' => ['nullable', 'integer', Rule::in([0, 1])],
        ];
    }

    private function normalizeDecimalInput(mixed $value): mixed
    {
        if ($value === null) {
            return null;
        }

        $stringValue = trim((string) $value);
        if ($stringValue === '') {
            return null;
        }

        $cleaned = preg_replace('/[^\d,.\-]/u', '', $stringValue);
        if ($cleaned === null || $cleaned === '') {
            return null;
        }

        $lastComma = strrpos($cleaned, ',');
        $lastDot = strrpos($cleaned, '.');
        $decimalIndex = max($lastComma === false ? -1 : $lastComma, $lastDot === false ? -1 : $lastDot);

        if ($decimalIndex === -1) {
            $numeric = preg_replace('/[^\d-]/u', '', $cleaned);

            return $numeric === null || $numeric === '' ? null : (float) $numeric;
        }

        $integerPart = preg_replace('/[^\d-]/u', '', substr($cleaned, 0, $decimalIndex));
        $decimalPart = preg_replace('/[^\d]/u', '', substr($cleaned, $decimalIndex + 1));

        if ($integerPart === null) {
            $integerPart = '';
        }

        if ($decimalPart === null || $decimalPart === '') {
            return $integerPart === '' ? 0.0 : (float) $integerPart;
        }

        return (float) sprintf('%s.%s', $integerPart === '' ? '0' : $integerPart, $decimalPart);
    }
}
