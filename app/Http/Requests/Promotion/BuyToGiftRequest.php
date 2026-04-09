<?php

namespace App\Http\Requests\Promotion;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BuyToGiftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $numericFields = [
            'min_order_amount',
        ];

        $normalized = [];
        foreach ($numericFields as $field) {
            if ($this->exists($field)) {
                $normalized[$field] = $this->normalizeDecimalInput($this->input($field));
            }
        }

        $this->merge([
            'is_active' => filter_var($this->input('is_active', false), FILTER_VALIDATE_BOOLEAN),
            'stackable' => filter_var($this->input('stackable', false), FILTER_VALIDATE_BOOLEAN),
        ] + $normalized);
    }

    public function rules(): array
    {
        $offerId = $this->route('buytogift');
        if (is_object($offerId)) {
            $offerId = $offerId->id ?? null;
        }

        return [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('promotion_buytogift_offers', 'code')->ignore($offerId),
            ],
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'condition_type' => ['required', Rule::in(['order_amount', 'buy_product'])],
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_sets_per_order' => ['nullable', 'integer', 'min:1'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'priority' => ['nullable', 'integer', 'min:0'],
            'buy_product_ids' => ['nullable', 'array'],
            'buy_product_ids.*' => ['integer', 'exists:products,id'],
            'buy_qty' => ['nullable', 'integer', 'min:1'],
            'gift_product_ids' => ['required', 'array', 'min:1'],
            'gift_product_ids.*' => ['integer', 'exists:products,id'],
            'gift_qty' => ['nullable', 'integer', 'min:1'],
            'is_active' => ['boolean'],
            'stackable' => ['boolean'],
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
