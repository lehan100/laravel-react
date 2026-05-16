<?php

namespace App\Http\Requests\Sales;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ShippingMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => trim((string) $this->input('code', '')),
            'provider' => trim((string) $this->input('provider', '')),
            'name' => trim((string) $this->input('name', '')),
            'description' => $this->normalizeNullableString($this->input('description')),
            'settings' => is_array($this->input('settings')) ? $this->input('settings') : [],
            'sort_order' => (int) $this->input('sort_order', 0),
            'is_active' => (bool) $this->input('is_active', true),
            'is_system' => (bool) $this->input('is_system', false),
            'undo' => (int) $this->input('undo', 0),
        ]);
    }

    public function rules(): array
    {
        $provider = (string) $this->input('provider', $this->input('code', ''));

        return [
            'code' => ['required', 'string', 'max:100', Rule::in(['ghn', 'ghtk', 'viettel_post', 'jnt', 'ninja_van'])],
            'provider' => ['required', 'string', 'max:100', Rule::in(['ghn', 'ghtk', 'viettel_post', 'jnt', 'ninja_van'])],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'settings' => ['nullable', 'array'],
            'settings.token' => ['required_if:provider,ghn', 'required_if:provider,ghtk', 'nullable', 'string', 'max:255'],
            'settings.shop_id' => ['required_if:provider,ghn', 'nullable', 'string', 'max:255'],
            'settings.username' => [Rule::requiredIf(in_array($provider, ['viettel_post', 'jnt'], true)), 'nullable', 'string', 'max:255'],
            'settings.password' => [Rule::requiredIf(in_array($provider, ['viettel_post', 'jnt'], true)), 'nullable', 'string', 'max:255'],
            'settings.client_id' => ['required_if:provider,ninja_van', 'nullable', 'string', 'max:255'],
            'settings.client_secret' => ['required_if:provider,ninja_van', 'nullable', 'string', 'max:255'],
            'settings.endpoint' => [Rule::requiredIf(in_array($provider, ['ghn', 'ghtk', 'viettel_post', 'jnt', 'ninja_van'], true)), 'nullable', 'url'],
            'settings.webhook_url' => ['nullable', 'url'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
            'is_system' => ['nullable', 'boolean'],
            'undo' => ['nullable', 'integer', Rule::in([0, 1])],
        ];
    }

    public function attributes(): array
    {
        return [
            'code' => mb_strtolower(__('hancms.column.code')),
            'provider' => mb_strtolower(__('hancms.sales.shipping_methods.name')),
            'name' => mb_strtolower(__('hancms.column.name')),
            'description' => mb_strtolower(__('hancms.column.description')),
            'sort_order' => mb_strtolower(__('hancms.column.order')),
            'settings.token' => mb_strtolower(__('hancms.sales.shipping_methods.fields.token')),
            'settings.shop_id' => mb_strtolower(__('hancms.sales.shipping_methods.fields.shop_id')),
            'settings.username' => mb_strtolower(__('hancms.sales.shipping_methods.fields.username')),
            'settings.password' => mb_strtolower(__('hancms.sales.shipping_methods.fields.password')),
            'settings.client_id' => mb_strtolower(__('hancms.sales.shipping_methods.fields.client_id')),
            'settings.client_secret' => mb_strtolower(__('hancms.sales.shipping_methods.fields.client_secret')),
            'settings.endpoint' => mb_strtolower(__('hancms.sales.shipping_methods.fields.endpoint')),
            'settings.webhook_url' => mb_strtolower(__('hancms.sales.shipping_methods.fields.webhook_url')),
        ];
    }

    private function normalizeNullableString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $normalized = trim((string) $value);

        return $normalized === '' ? null : $normalized;
    }
}
