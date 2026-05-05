<?php

namespace App\Http\Requests\Sales;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class WarehouseAdjustRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'action' => trim((string) $this->input('action', 'set')),
            'set_quantity' => (int) $this->input('set_quantity', 0),
            'adjust_delta' => (int) $this->input('adjust_delta', 0),
            'reason' => $this->normalizeNullableString($this->input('reason')),
            'undo' => (int) $this->input('undo', 0),
        ]);
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'string', Rule::in(['set', 'adjust'])],
            'set_quantity' => ['required_if:action,set', 'nullable', 'integer', 'min:0'],
            'adjust_delta' => ['required_if:action,adjust', 'nullable', 'integer'],
            'reason' => ['nullable', 'string', 'max:2000'],
            'undo' => ['nullable', 'integer', Rule::in([0, 1])],
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
