<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LanguageUpdateRequest extends FormRequest
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
            'name' => ['required'],
            'code' => ['required', Rule::unique('languages', 'code')->ignore($this->id, 'id')],
            'currency' => ['nullable', Rule::in(['VND', 'USD', 'JPY'])],
            'photo' => ['nullable'],
            'status' => ['required'],
        ];
    }
}
