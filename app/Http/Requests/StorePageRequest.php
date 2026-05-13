<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePageRequest extends FormRequest
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
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('pages', 'slug')],
            'status' => ['sometimes', 'boolean'],
            'field_group_id' => [
                'required',
                'integer',
                Rule::exists('field_groups', 'id'),
            ],
            'translations' => ['nullable', 'array', 'required_without:title'],
            'translations.*.title' => ['required_with:translations', 'string', 'max:255'],
            'translations.*.slug' => ['nullable', 'string', 'max:255'],
            'content' => ['sometimes', 'array'],
            'content.*' => ['sometimes', 'array'],
        ];
    }

    public function attributes(): array
    {
        return [
            'title' => mb_strtolower(__('hancms.column.name')),
            'field_group_id' => mb_strtolower(__('hancms.content.field_design')),
            'translations.*.title' => mb_strtolower(__('hancms.column.name')),
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
