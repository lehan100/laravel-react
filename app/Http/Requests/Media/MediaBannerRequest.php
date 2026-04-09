<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MediaBannerRequest extends FormRequest
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
            'position_ids' => mb_strtolower(__('hancms.media.position.name')),
            'translations.*.name' => mb_strtolower(__('hancms.column.name'))
        ];
    }
}
