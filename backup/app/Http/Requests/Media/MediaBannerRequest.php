<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;

class MediaBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|integer|in:0,1',
            'position_ids' => 'required|array|min:1',
            'position_ids.*' => 'integer|exists:media_positions,id',
            'undo' => 'nullable|integer',

            // Validate mảng đa ngôn ngữ
            'translations' => 'required|array',
            'translations.*.name' => 'required|string|max:255',
            'translations.*.content' => 'nullable|string',
            'translations.*.photo' => 'nullable|string',
            'translations.*.description' => 'nullable|string|max:500',
            'translations.*.alias_link' => 'nullable|string|max:255',
        ];
    }

    public function attributes(): array
    {
        return [
            'status' => mb_strtolower(__('hancms.column.status')),
            'position_ids' => mb_strtolower(__('hancms.media.position.name')),
            'translations' => mb_strtolower(__('hancms.attribute.sections.translations')),
            'translations.*.name' => mb_strtolower(__('hancms.column.name')),
        ];
    }
}
