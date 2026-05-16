<?php

namespace App\Http\Requests\Promotion;

use App\Models\Catalog\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class BuyToGiftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $numericFields = ['min_order_amount'];

        $normalized = [];
        foreach ($numericFields as $field) {
            if ($this->exists($field)) {
                $normalized[$field] = $this->normalizeDecimalInput($this->input($field));
            }
        }

        if ($this->filled('stock_limit')) {
            $normalized['stock_limit'] = $this->input('stock_limit') === '' ? null : (int) $this->input('stock_limit');
        }

        if ($this->filled('max_gift_qty')) {
            $normalized['max_gift_qty'] = $this->input('max_gift_qty') === '' ? null : (int) $this->input('max_gift_qty');
        }

        $rules = $this->input('rules');
        if (is_array($rules)) {
            $normalizedRules = [];
            foreach ($rules as $index => $rule) {
                if (! is_array($rule)) {
                    continue;
                }

                $normalizedRules[$index] = $rule;
                if (array_key_exists('min_order_amount', $rule)) {
                    $normalizedRules[$index]['min_order_amount'] = $this->normalizeDecimalInput($rule['min_order_amount']);
                }
                if (array_key_exists('stock_limit', $rule) && $rule['stock_limit'] !== null && $rule['stock_limit'] !== '') {
                    $normalizedRules[$index]['stock_limit'] = $rule['stock_limit'] === '' ? null : (int) $rule['stock_limit'];
                }
                if (array_key_exists('max_gift_qty', $rule) && $rule['max_gift_qty'] !== null && $rule['max_gift_qty'] !== '') {
                    $normalizedRules[$index]['max_gift_qty'] = (int) $rule['max_gift_qty'];
                }
                if (array_key_exists('buy_items', $rule) && is_array($rule['buy_items'])) {
                    $normalizedRules[$index]['buy_items'] = $this->normalizePromotionItems($rule['buy_items']);
                }
                if (array_key_exists('gift_items', $rule) && is_array($rule['gift_items'])) {
                    $normalizedRules[$index]['gift_items'] = $this->normalizePromotionItems($rule['gift_items']);
                }
                if (array_key_exists('gift_variant_options', $rule) && is_array($rule['gift_variant_options'])) {
                    $normalizedRules[$index]['gift_variant_options'] = $this->normalizeGiftVariantOptions($rule['gift_variant_options']);
                }
            }
            $normalized['rules'] = $normalizedRules;
        }

        if (is_array($this->input('buy_items'))) {
            $normalized['buy_items'] = $this->normalizePromotionItems($this->input('buy_items'));
        }

        if (is_array($this->input('gift_items'))) {
            $normalized['gift_items'] = $this->normalizePromotionItems($this->input('gift_items'));
        }

        if (is_array($this->input('gift_variant_options'))) {
            $normalized['gift_variant_options'] = $this->normalizeGiftVariantOptions($this->input('gift_variant_options'));
        }

        $this->merge([
            'is_active' => filter_var($this->input('is_active', false), FILTER_VALIDATE_BOOLEAN),
            'stackable' => filter_var($this->input('stackable', false), FILTER_VALIDATE_BOOLEAN),
        ] + $normalized);
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $this->validateGiftCap(
                $validator,
                $this->input('gift_qty'),
                $this->input('max_gift_qty'),
                'gift_qty'
            );

            $this->validateVariantItems($validator, $this->input('buy_items'), 'buy_items');
            $this->validateVariantItems($validator, $this->input('gift_items'), 'gift_items', false);
            $this->validateGiftVariantOptions($validator, $this->input('gift_variant_options'), 'gift_variant_options');

            $rules = $this->input('rules');
            if (! is_array($rules)) {
                return;
            }

            foreach ($rules as $index => $rule) {
                if (! is_array($rule)) {
                    continue;
                }

                $this->validateGiftCap(
                    $validator,
                    $rule['gift_qty'] ?? null,
                    $rule['max_gift_qty'] ?? null,
                    "rules.{$index}.gift_qty"
                );

                $this->validateVariantItems($validator, $rule['buy_items'] ?? null, "rules.{$index}.buy_items");
                $this->validateVariantItems($validator, $rule['gift_items'] ?? null, "rules.{$index}.gift_items", false);
                $this->validateGiftVariantOptions($validator, $rule['gift_variant_options'] ?? null, "rules.{$index}.gift_variant_options");
            }
        });
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
            'max_gift_qty' => ['nullable', 'integer', 'min:1'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'campaign_id' => ['nullable', 'integer', 'exists:promotion_campaigns,id'],
            'priority' => ['nullable', 'integer', 'min:0'],
            'buy_product_ids' => ['nullable', 'array'],
            'buy_product_ids.*' => ['integer', 'exists:products,id'],
            'buy_qty' => ['nullable', 'integer', 'min:1'],
            'buy_items' => ['nullable', 'array'],
            'buy_items.*.product_id' => ['required_with:buy_items', 'integer', 'exists:products,id'],
            'buy_items.*.variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'gift_product_ids' => ['required', 'array', 'min:1'],
            'gift_product_ids.*' => ['integer', 'exists:products,id'],
            'gift_qty' => ['nullable', 'integer', 'min:1'],
            'gift_items' => ['nullable', 'array'],
            'gift_items.*.product_id' => ['required_with:gift_items', 'integer', 'exists:products,id'],
            'gift_items.*.variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'gift_variant_options' => ['nullable', 'array'],
            'gift_variant_options.*.product_id' => ['required_with:gift_variant_options', 'integer', 'exists:products,id'],
            'gift_variant_options.*.variant_id' => ['required_with:gift_variant_options', 'integer', 'exists:product_variants,id'],
            'gift_variant_options.*.reserve_qty' => ['nullable', 'integer', 'min:0'],
            'rules' => ['nullable', 'array', 'min:1'],
            'rules.*.condition_type' => ['required_with:rules', Rule::in(['order_amount', 'buy_product'])],
            'rules.*.min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'rules.*.max_sets_per_order' => ['nullable', 'integer', 'min:1'],
            'rules.*.max_gift_qty' => ['nullable', 'integer', 'min:1'],
            'rules.*.stock_scope' => ['nullable', Rule::in(['all', 'limited'])],
            'rules.*.stock_limit' => ['nullable', 'integer', 'min:1', 'required_if:rules.*.stock_scope,limited'],
            'rules.*.buy_product_ids' => ['nullable', 'array'],
            'rules.*.buy_product_ids.*' => ['integer', 'exists:products,id'],
            'rules.*.buy_items' => ['nullable', 'array'],
            'rules.*.buy_items.*.product_id' => ['required_with:rules.*.buy_items', 'integer', 'exists:products,id'],
            'rules.*.buy_items.*.variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'rules.*.buy_qty' => ['nullable', 'integer', 'min:1'],
            'rules.*.gift_product_ids' => ['required_with:rules', 'array', 'min:1'],
            'rules.*.gift_product_ids.*' => ['integer', 'exists:products,id'],
            'rules.*.gift_items' => ['nullable', 'array'],
            'rules.*.gift_items.*.product_id' => ['required_with:rules.*.gift_items', 'integer', 'exists:products,id'],
            'rules.*.gift_items.*.variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'rules.*.gift_variant_options' => ['nullable', 'array'],
            'rules.*.gift_variant_options.*.product_id' => ['required_with:rules.*.gift_variant_options', 'integer', 'exists:products,id'],
            'rules.*.gift_variant_options.*.variant_id' => ['required_with:rules.*.gift_variant_options', 'integer', 'exists:product_variants,id'],
            'rules.*.gift_variant_options.*.reserve_qty' => ['nullable', 'integer', 'min:0'],
            'rules.*.gift_qty' => ['nullable', 'integer', 'min:1'],
            'rules.*.is_active' => ['nullable', 'boolean'],
            'rules.*.stackable' => ['nullable', 'boolean'],
            'rules.*.priority' => ['nullable', 'integer', 'min:0'],
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

    private function validateGiftCap(Validator $validator, mixed $giftQty, mixed $maxGiftQty, string $attribute): void
    {
        if ($giftQty === null || $maxGiftQty === null || $giftQty === '' || $maxGiftQty === '') {
            return;
        }

        if ((int) $giftQty <= (int) $maxGiftQty) {
            return;
        }

        $validator->errors()->add($attribute, 'Gift quantity must not exceed '.(int) $maxGiftQty.'.');
    }

    private function validateVariantItems(Validator $validator, mixed $items, string $attribute, bool $requireVariant = true): void
    {
        if (! is_array($items) || $items === []) {
            return;
        }

        $productIds = collect($items)
            ->map(fn ($item): int => (int) ($item['product_id'] ?? 0))
            ->filter()
            ->unique()
            ->values()
            ->all();

        if ($productIds === []) {
            return;
        }

        $products = Product::query()
            ->with(['variants:id,product_id'])
            ->whereIn('id', $productIds)
            ->get()
            ->keyBy('id');

        foreach ($items as $index => $item) {
            if (! is_array($item)) {
                continue;
            }

            $productId = (int) ($item['product_id'] ?? 0);
            if ($productId <= 0) {
                continue;
            }

            $product = $products->get($productId);
            if (! $product) {
                continue;
            }

            $variantId = $this->nullableInteger($item['variant_id'] ?? null);
            if ($product->variants->isEmpty()) {
                continue;
            }

            if (! $requireVariant) {
                continue;
            }

            if ($variantId === null) {
                $validator->errors()->add("{$attribute}.{$index}.variant_id", 'Please select a variant for this product.');

                continue;
            }

            if (! $product->variants->contains('id', $variantId)) {
                $validator->errors()->add("{$attribute}.{$index}.variant_id", 'The selected variant does not belong to the selected product.');
            }
        }
    }

    private function validateGiftVariantOptions(Validator $validator, mixed $items, string $attribute): void
    {
        if (! is_array($items) || $items === []) {
            return;
        }

        $variantsByProduct = collect($items)
            ->filter(fn ($item): bool => is_array($item))
            ->groupBy(fn ($item): int => (int) ($item['product_id'] ?? 0));

        if ($variantsByProduct->isEmpty()) {
            return;
        }

        $products = Product::query()
            ->with(['variants:id,product_id'])
            ->whereIn('id', $variantsByProduct->keys()->filter()->values())
            ->get()
            ->keyBy('id');

        foreach ($items as $index => $item) {
            if (! is_array($item)) {
                continue;
            }

            $productId = (int) ($item['product_id'] ?? 0);
            $variantId = (int) ($item['variant_id'] ?? 0);
            if ($productId <= 0 || $variantId <= 0) {
                continue;
            }

            $product = $products->get($productId);
            if (! $product) {
                continue;
            }

            if ($product->variants->firstWhere('id', $variantId) === null) {
                $validator->errors()->add(
                    "{$attribute}.{$index}.variant_id",
                    'The selected variant does not belong to the selected product.'
                );
            }
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     * @return array<int, array{product_id: int, variant_id: int, reserve_qty: int}>
     */
    private function normalizeGiftVariantOptions(array $items): array
    {
        return collect($items)
            ->map(fn ($row): array => [
                'product_id' => (int) ($row['product_id'] ?? 0),
                'variant_id' => (int) ($row['variant_id'] ?? 0),
                'reserve_qty' => max(0, (int) ($row['reserve_qty'] ?? 0)),
            ])
            ->filter(fn (array $row): bool => $row['product_id'] > 0 && $row['variant_id'] > 0)
            ->values()
            ->all();
    }

    private function normalizePromotionItems(array $items): array
    {
        return collect($items)
            ->map(function ($item): array {
                return [
                    'product_id' => $this->nullableInteger($item['product_id'] ?? null),
                    'variant_id' => $this->nullableInteger($item['variant_id'] ?? null),
                ];
            })
            ->filter(fn (array $item): bool => (int) ($item['product_id'] ?? 0) > 0)
            ->values()
            ->all();
    }

    private function nullableInteger(mixed $value): ?int
    {
        if ($value === null || $value === '' || $value === false) {
            return null;
        }

        return (int) $value;
    }
}
