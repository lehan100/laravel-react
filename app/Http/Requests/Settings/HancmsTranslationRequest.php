<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class HancmsTranslationRequest extends FormRequest
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
            'translations' => ['required', 'array'],
            'translations.*' => ['required', 'array'],
            'translations.*.*' => ['nullable', 'string'],
        ];
    }
}
