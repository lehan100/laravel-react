<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MailTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $variables = $this->input('variables', []);
        if (is_string($variables)) {
            $variables = array_values(array_filter(array_map(
                static fn (string $value): string => trim($value),
                explode(',', $variables)
            )));
        }

        $this->merge([
            'key' => $this->normalizeNullableString($this->input('key')),
            'is_active' => filter_var($this->input('is_active', false), FILTER_VALIDATE_BOOLEAN),
            'module' => $this->normalizeNullableString($this->input('module')),
            'fallback_locale' => $this->normalizeNullableString($this->input('fallback_locale')),
            'variables' => is_array($variables) ? array_values(array_filter($variables, static fn ($value): bool => trim((string) $value) !== '')) : [],
        ]);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $mailTemplateId = $this->route('mail_template');
        if (is_object($mailTemplateId)) {
            $mailTemplateId = $mailTemplateId->id ?? null;
        }

        return [
            'key' => [
                'required',
                'string',
                'max:255',
                Rule::unique('mail_templates', 'key')->ignore($mailTemplateId),
            ],
            'module' => ['nullable', 'string', 'max:255'],
            'fallback_locale' => ['nullable', 'string', 'max:20'],
            'variables' => ['nullable', 'array'],
            'variables.*' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'undo' => ['nullable', 'integer', Rule::in([0, 1])],
            'translations' => ['required', 'array'],
            'translations.*' => ['required', 'array'],
            'translations.*.name' => ['required', 'string', 'max:255'],
            'translations.*.subject' => ['required', 'string', 'max:255'],
            'translations.*.body_html' => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'key' => mb_strtolower(__('hancms.settings.mail_template.fields.key')),
            'module' => mb_strtolower(__('hancms.settings.mail_template.fields.module')),
            'fallback_locale' => mb_strtolower(__('hancms.settings.mail_template.fields.fallback_locale')),
            'variables' => mb_strtolower(__('hancms.settings.mail_template.fields.variables')),
            'translations.*.name' => mb_strtolower(__('hancms.settings.mail_template.fields.name')),
            'translations.*.subject' => mb_strtolower(__('hancms.settings.mail_template.fields.subject')),
            'translations.*.body_html' => mb_strtolower(__('hancms.settings.mail_template.fields.body_html')),
        ];
    }

    private function normalizeNullableString(mixed $value): ?string
    {
        $value = is_string($value) ? trim($value) : $value;

        return is_string($value) && $value !== '' ? $value : null;
    }
}
