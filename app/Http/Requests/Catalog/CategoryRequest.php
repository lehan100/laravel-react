<?php

namespace App\Http\Requests\Catalog;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'status' => 'required|integer|in:0,1',
            'type' => ['required', 'string', Rule::in(['product', 'news', 'blog', 'page', 'contact'])],
            'photo' => 'nullable|string',
            'undo' => 'nullable|integer',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'integer|exists:products,id',

            // Validate mảng đa ngôn ngữ
            'translations' => 'required|array',
            'translations.*.name' => 'required|string|max:255',
            'translations.*.slug' => 'required|string|max:255',
            'translations.*.content' => 'nullable|string',
            'translations.*.description' => 'nullable|string|max:1000',

            // Bổ sung các trường SEO đã thêm vào Migration
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
