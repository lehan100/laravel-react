<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
