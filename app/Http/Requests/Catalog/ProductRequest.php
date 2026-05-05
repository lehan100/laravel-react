<?php

namespace App\Http\Requests\Catalog;

use App\Models\Catalog\AttributeValue;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sku' => 'nullable|string|max:255',
            'quantity' => 'nullable|integer|min:0',
            'weight' => 'nullable|integer|min:0',
            'brand' => 'nullable|string|max:255',
            'base_price' => 'nullable|numeric|min:0',
            'price' => 'nullable|numeric|min:0',
            'status' => 'required|integer|in:0,1',
            'is_stock' => 'nullable|integer|in:0,1',
            'is_coupon' => 'nullable|integer|in:0,1',
            'order' => 'nullable|integer|min:0',
            'undo' => 'nullable|integer',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
            'default_photo_id' => 'nullable',
            'photo_orders' => 'nullable|array',
            'photo_orders.*' => 'integer|exists:product_photos,id',
            'delete_photo_ids' => 'nullable|array',
            'delete_photo_ids.*' => 'integer|exists:product_photos,id',
            'photos' => 'nullable|array',
            'photos.*' => 'nullable|string|max:255',
            'translations' => 'required|array',
            'translations.*.name' => 'required|string|max:255',
            'translations.*.slug' => 'nullable|string|max:255',
            'translations.*.description' => 'nullable|string',
            'translations.*.content' => 'nullable|string',
            'translations.*.seo_title' => 'nullable|string|max:70',
            'translations.*.seo_keyword' => 'nullable|string|max:255',
            'translations.*.seo_description' => 'nullable|string|max:160',
            'variants' => 'nullable|array',
            'variants.*.id' => 'nullable|integer|exists:product_variants,id',
            'variants.*.sku' => [
                'required_with:variants',
                'string',
                'max:255',
                'distinct',
                $this->isMethod('post') ? 'unique:product_variants,sku' : 'nullable',
            ],
            'variants.*.price' => 'required_with:variants|numeric|min:0',
            'variants.*.stock' => 'required_with:variants|integer|min:0',
            'variants.*.image' => 'nullable|string|max:255',
            'variants.*.images' => 'nullable|array',
            'variants.*.images.*' => 'string|max:255',
            'variants.*.attribute_value_ids' => 'required_with:variants|array|min:1',
            'variants.*.attribute_value_ids.*' => 'integer|distinct|exists:attribute_values,id',
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $variants = $this->input('variants', []);
                if (! is_array($variants) || $variants === []) {
                    return;
                }

                $attributeValueIds = collect($variants)
                    ->pluck('attribute_value_ids')
                    ->flatten()
                    ->filter()
                    ->unique()
                    ->values();

                $attributeValues = AttributeValue::query()
                    ->whereIn('id', $attributeValueIds)
                    ->get(['id', 'attribute_id'])
                    ->keyBy('id');

                $seenCombinations = [];

                foreach ($variants as $variantIndex => $variant) {
                    $valueIds = collect($variant['attribute_value_ids'] ?? [])
                        ->map(fn ($id) => (int) $id)
                        ->sort()
                        ->values();

                    $attributeIds = $valueIds
                        ->map(fn (int $id) => $attributeValues->get($id)?->attribute_id)
                        ->filter()
                        ->values();

                    if ($attributeIds->duplicates()->isNotEmpty()) {
                        $validator->errors()->add(
                            "variants.$variantIndex.attribute_value_ids",
                            'Each variant can only use one value from each attribute.'
                        );
                    }

                    $combinationKey = $valueIds->implode('-');
                    if (isset($seenCombinations[$combinationKey])) {
                        $validator->errors()->add(
                            "variants.$variantIndex.attribute_value_ids",
                            'Variant attribute combinations must be unique.'
                        );
                    }

                    $seenCombinations[$combinationKey] = true;
                }
            },
        ];
    }

    public function attributes(): array
    {
        return [
            'translations.*.name' => mb_strtolower(__('hancms.column.name')),
            'translations.*.slug' => mb_strtolower(__('hancms.column.slug')),
        ];
    }
}
