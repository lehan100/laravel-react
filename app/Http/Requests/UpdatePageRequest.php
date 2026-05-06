<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string|Rule>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255', 'required_without:translations'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('pages', 'slug')->ignore($this->route('page')),
            ],
            'status' => ['sometimes', 'boolean'],
            'translations' => ['nullable', 'array', 'required_without:title'],
            'translations.*.title' => ['required_with:translations', 'string', 'max:255'],
            'translations.*.slug' => ['nullable', 'string', 'max:255'],
            'content' => ['sometimes', 'array'],
            'content.*' => ['sometimes', 'array'],
        ];
    }

    private function normalizeSlug(string $value): string
    {
        $slug = strtolower(trim($value));

        if (class_exists(\Normalizer::class)) {
            $slug = \Normalizer::normalize($slug, \Normalizer::FORM_D) ?: $slug;
            $slug = preg_replace('/[\x{0300}-\x{036f}]/u', '', $slug);
        }

        $slug = str_replace(['đ', 'Đ'], ['d', 'd'], $slug);
        $slug = preg_replace('/[^\p{L}\p{N}\s-]/u', '', $slug);
        $slug = preg_replace('/(\s+)/u', '-', $slug);
        $slug = mb_strtolower((string) $slug, 'UTF-8');

        return trim((string) preg_replace('/-+/', '-', $slug), '-');
    }
}
