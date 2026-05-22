<?php

namespace App\Http\Requests\Ai;

use Illuminate\Foundation\Http\FormRequest;

class ScheduleAiPostDraftRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'batch_token' => ['required', 'string'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.draft_id' => ['required', 'string'],
            'items.*.title' => ['nullable', 'string', 'max:255'],
            'items.*.description' => ['nullable', 'string', 'max:5000'],
            'items.*.content' => ['nullable', 'string', 'max:100000'],
            'items.*.photo' => ['nullable', 'string', 'max:255'],
            'items.*.photo_url' => ['nullable', 'string', 'max:1000'],
            'items.*.translations' => ['nullable', 'array'],
            'items.*.translations.*.title' => ['nullable', 'string', 'max:255'],
            'items.*.translations.*.description' => ['nullable', 'string', 'max:5000'],
            'items.*.translations.*.content' => ['nullable', 'string', 'max:100000'],
            'items.*.translations.*.photo' => ['nullable', 'string', 'max:255'],
            'items.*.translations.*.photo_url' => ['nullable', 'string', 'max:1000'],
            'items.*.published_at' => ['required', 'date_format:Y-m-d\TH:i'],
        ];
    }
}
