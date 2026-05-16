<?php

namespace App\Http\Requests\Sales;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentMethodRequest extends FormRequest
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
            'code' => ['required', 'string', 'max:100', Rule::in(['cash_on_delivery', 'momo', 'zalopay', 'vnpay', 'paypal'])],
            'provider' => ['required', 'string', 'max:100', Rule::in(['cash_on_delivery', 'momo', 'zalopay', 'vnpay', 'paypal'])],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'settings' => ['nullable', 'array'],
            'settings.instructions' => ['required_if:provider,cash_on_delivery', 'nullable', 'string', 'max:255'],
            'settings.cod_fee' => ['required_if:provider,cash_on_delivery', 'nullable', 'string', 'max:255'],
            'settings.partner_code' => ['required_if:provider,momo', 'nullable', 'string', 'max:255'],
            'settings.access_key' => ['required_if:provider,momo', 'nullable', 'string', 'max:255'],
            'settings.secret_key' => ['required_if:provider,momo', 'nullable', 'string', 'max:255'],
            'settings.app_id' => ['required_if:provider,zalopay', 'nullable', 'string', 'max:255'],
            'settings.key1' => ['required_if:provider,zalopay', 'nullable', 'string', 'max:255'],
            'settings.key2' => ['required_if:provider,zalopay', 'nullable', 'string', 'max:255'],
            'settings.tmn_code' => ['required_if:provider,vnpay', 'nullable', 'string', 'max:255'],
            'settings.hash_secret' => ['required_if:provider,vnpay', 'nullable', 'string', 'max:255'],
            'settings.client_id' => ['required_if:provider,paypal', 'nullable', 'string', 'max:255'],
            'settings.client_secret' => ['required_if:provider,paypal', 'nullable', 'string', 'max:255'],
            'settings.mode' => ['required_if:provider,paypal', 'nullable', 'string', 'max:255'],
            'settings.endpoint' => [Rule::requiredIf(in_array($provider, ['momo', 'zalopay', 'vnpay', 'paypal'], true)), 'nullable', 'url'],
            'settings.return_url' => [Rule::requiredIf(in_array($provider, ['momo', 'vnpay'], true)), 'nullable', 'url'],
            'settings.ipn_url' => ['nullable', 'url'],
            'settings.callback_url' => ['nullable', 'url'],
            'settings.webhook_id' => ['nullable', 'string', 'max:255'],
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
            'provider' => mb_strtolower(__('hancms.sales.payment_methods.name')),
            'name' => mb_strtolower(__('hancms.column.name')),
            'description' => mb_strtolower(__('hancms.column.description')),
            'sort_order' => mb_strtolower(__('hancms.column.order')),
            'settings.instructions' => mb_strtolower(__('hancms.sales.payment_methods.fields.instructions')),
            'settings.cod_fee' => mb_strtolower(__('hancms.sales.payment_methods.fields.cod_fee')),
            'settings.partner_code' => mb_strtolower(__('hancms.sales.payment_methods.fields.partner_code')),
            'settings.access_key' => mb_strtolower(__('hancms.sales.payment_methods.fields.access_key')),
            'settings.secret_key' => mb_strtolower(__('hancms.sales.payment_methods.fields.secret_key')),
            'settings.app_id' => mb_strtolower(__('hancms.sales.payment_methods.fields.app_id')),
            'settings.key1' => mb_strtolower(__('hancms.sales.payment_methods.fields.key1')),
            'settings.key2' => mb_strtolower(__('hancms.sales.payment_methods.fields.key2')),
            'settings.tmn_code' => mb_strtolower(__('hancms.sales.payment_methods.fields.tmn_code')),
            'settings.hash_secret' => mb_strtolower(__('hancms.sales.payment_methods.fields.hash_secret')),
            'settings.client_id' => mb_strtolower(__('hancms.sales.payment_methods.fields.client_id')),
            'settings.client_secret' => mb_strtolower(__('hancms.sales.payment_methods.fields.client_secret')),
            'settings.mode' => mb_strtolower(__('hancms.sales.payment_methods.fields.mode')),
            'settings.endpoint' => mb_strtolower(__('hancms.sales.payment_methods.fields.endpoint')),
            'settings.return_url' => mb_strtolower(__('hancms.sales.payment_methods.fields.return_url')),
            'settings.ipn_url' => mb_strtolower(__('hancms.sales.payment_methods.fields.ipn_url')),
            'settings.callback_url' => mb_strtolower(__('hancms.sales.payment_methods.fields.callback_url')),
            'settings.webhook_id' => mb_strtolower(__('hancms.sales.payment_methods.fields.webhook_id')),
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
