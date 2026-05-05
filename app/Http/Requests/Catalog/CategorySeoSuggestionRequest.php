<?php

namespace App\Http\Requests\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class CategorySeoSuggestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'locale' => ['nullable', 'string', 'max:10'],
            'name' => ['nullable', 'string', 'max:255'],
            'content' => ['nullable', 'string', 'max:100000'],
            'seo_keyword' => ['nullable', 'string', 'max:2000'],
            'current_seo_title' => ['nullable', 'string', 'max:255'],
            'current_seo_description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
