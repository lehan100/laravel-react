<?php

namespace App\Http\Requests\Catalog;

use Illuminate\Foundation\Http\FormRequest;

class CategoryReorderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'integer', 'exists:categories,id'],
            'items.*.parent_id' => ['nullable', 'integer', 'exists:categories,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ];
    }
}
