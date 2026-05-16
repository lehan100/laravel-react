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
            'translations' => 'required|array',
            'translations.*.name' => 'required|string|max:255',
            'translations.*.description' => 'nullable|string',
            'translations.*.content' => 'nullable|string',
            'translations.*.seo_title' => 'nullable|string|max:255',
            'translations.*.seo_keyword' => 'nullable|string|max:255',
            'translations.*.seo_description' => 'nullable|string',
            'translations.*.slug' => 'nullable|string|max:255',
            'translations.*.is_default' => 'nullable|boolean',
            'quantity' => 'nullable|integer|min:0',
            'weight' => 'nullable|integer|min:0',
            'price' => 'nullable|numeric|min:0',
            'status' => 'required|integer|in:0,1',
            'is_stock' => 'nullable|integer|in:0,1',
            'is_coupon' => 'nullable|integer|in:0,1',
            'order' => 'nullable|integer|min:0',
            'brand' => 'nullable|string|max:255',
            'undo' => 'nullable|integer',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',
            'attribute_value_ids' => 'nullable|array',
            'attribute_value_ids.*' => 'integer|exists:attribute_values,id',
            'default_photo_id' => 'nullable',
            'photo_orders' => 'nullable|array',
            'photo_orders.*' => 'integer|exists:product_photos,id',
            'delete_photo_ids' => 'nullable|array',
            'delete_photo_ids.*' => 'integer|exists:product_photos,id',
            'photos' => 'nullable|array',
            'photos.*' => 'nullable|string',
            'variants' => 'nullable|array',
            'variants.*.id' => 'nullable|integer',
            'variants.*.sku' => [
                'required',
                'string',
                'max:255',
            ],
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.stock' => 'required|integer|min:0',
            'variants.*.image' => 'nullable|string',
            'variants.*.images' => 'nullable|array',
            'variants.*.images.*' => 'nullable|string',
            'variants.*.attribute_value_ids' => 'nullable|array',
            'variants.*.attribute_value_ids.*' => 'integer|distinct|exists:attribute_values,id',
            'variants.*.translations' => 'nullable|array',
            'variants.*.translations.*.name' => 'required|string|max:255',
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $variants = $this->input('variants', []);

                if (empty($variants)) {
                    return;
                }

                $attributeValues = AttributeValue::query()
                    ->whereIn('id', collect($variants)->pluck('attribute_value_ids')->flatten()->unique())
                    ->get()
                    ->keyBy('id');

                foreach ($variants as $variantIndex => $variant) {
                    $attributeIds = collect($variant['attribute_value_ids'] ?? [])
                        ->map(fn (int $id) => $attributeValues->get($id)?->attribute_id)
                        ->filter();

                    if ($attributeIds->count() !== $attributeIds->unique()->count()) {
                        $validator->errors()->add(
                            "variants.$variantIndex.attribute_value_ids",
                            __('validation.custom.variants.duplicate_attribute_type')
                        );
                    }
                }

                $combinations = collect($variants)
                    ->map(function (array $variant, int $variantIndex) {
                        $valueIds = collect($variant['attribute_value_ids'] ?? [])
                            ->sort()
                            ->values()
                            ->all();

                        return [
                            'index' => $variantIndex,
                            'key' => implode('-', $valueIds),
                        ];
                    });

                $duplicates = $combinations->filter(fn ($c) => $c['key'] !== '')
                    ->groupBy('key')
                    ->filter(fn ($group) => $group->count() > 1);

                foreach ($duplicates as $group) {
                    foreach ($group as $duplicate) {
                        $variantIndex = $duplicate['index'];
                        $validator->errors()->add(
                            "variants.$variantIndex.attribute_value_ids",
                            __('validation.custom.variants.duplicate_combination')
                        );
                    }
                }
            },
        ];
    }
}
