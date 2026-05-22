<?php

namespace App\Http\Requests\Ai;

use Illuminate\Foundation\Http\FormRequest;

class GenerateAiPostDraftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'topic' => ['required', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:1', 'max:10'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
        ];
    }
}
