<?php

namespace App\Http\Requests\Catalog;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|integer|exists:categories,id',
            'photo' => 'nullable|string|max:255',
            'type' => ['required', 'string', Rule::in(['primary', 'footer', 'sidebar'])],
            'status' => 'required|integer|in:0,1',
            'order' => 'nullable|integer|min:0',
            'hit_viewer' => 'nullable|integer|min:0',
            'undo' => 'nullable|integer',

            'translations' => 'required|array',
            'translations.*.name' => 'required|string|max:255',
            'translations.*.slug' => 'nullable|string|max:255',
            'translations.*.description' => 'nullable|string|max:1000',
            'translations.*.content' => 'nullable|string',
            'translations.*.seo_title' => 'nullable|string|max:70',
            'translations.*.seo_keyword' => 'nullable|string|max:255',
            'translations.*.seo_description' => 'nullable|string|max:160',
        ];
    }

    public function attributes(): array
    {
        return [
            'category_id' => mb_strtolower(__('hancms.catalog.category.name')),
            'translations.*.name' => mb_strtolower(__('hancms.column.name')),
            'translations.*.slug' => mb_strtolower(__('hancms.column.slug')),
        ];
    }
}
