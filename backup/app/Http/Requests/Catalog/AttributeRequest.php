<?php

namespace App\Http\Requests\Catalog;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class AttributeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $attributeId = $this->route('attribute') ?? $this->input('id');

        $codeRule = Rule::unique('attributes', 'code');

        if (filled($attributeId)) {
            $codeRule->ignore($attributeId);
        }

        return [
            'id' => 'nullable|integer|exists:attributes,id',
            'status' => 'required|integer|in:0,1',
            'code' => [
                'required',
                'string',
                'max:150',
                $codeRule,
            ],
            'type' => ['required', 'string', Rule::in(['text', 'image', 'color'])],
            'translations' => 'required|array',
            'translations.*.name' => 'required|string|max:255',
            'values' => 'required|array|min:1',
            'values.*.id' => 'nullable|integer|exists:attribute_values,id',
            'values.*.translations' => 'required|array',
            'values.*.translations.*.value' => 'nullable|string|max:255',
            'values.*.image' => 'nullable|string|max:255',
            'values.*.color' => 'nullable|string|max:20',
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $values = $this->input('values', []);
                $type = (string) $this->input('type', 'text');

                if (! is_array($values) || $values === []) {
                    return;
                }

                foreach ($values as $index => $value) {
                    $translations = collect($value['translations'] ?? [])
                        ->filter(fn ($translation): bool => is_array($translation) && filled($translation['value'] ?? null));

                    if ($translations->isEmpty()) {
                        $validator->errors()->add(
                            "values.$index.translations",
                            __('hancms.catalog.attribute.errors.value_translation_required')
                        );
                    }

                    if ($type === 'image' && empty($value['image'])) {
                        $validator->errors()->add(
                            "values.$index.image",
                            __('hancms.catalog.attribute.errors.value_image_required')
                        );
                    }

                    if ($type === 'color' && empty($value['color'])) {
                        $validator->errors()->add(
                            "values.$index.color",
                            __('hancms.catalog.attribute.errors.value_color_required')
                        );
                    }
                }
            },
        ];
    }

    public function attributes(): array
    {
        return [
            'code' => __('hancms.column.code'),
            'translations.*.name' => mb_strtolower(__('hancms.catalog.attribute.fields.name')),
            'values.*.translations.*.value' => mb_strtolower(__('hancms.column.value') ?: 'value'),
        ];
    }
}
