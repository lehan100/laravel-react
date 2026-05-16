<?php

namespace App\Http\Resources\Sales;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentMethodResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'provider' => $this->provider,
            'name' => $this->name,
            'description' => $this->description,
            'settings' => $this->settings ?? [],
            'is_active' => (bool) $this->is_active,
            'is_system' => (bool) $this->is_system,
            'sort_order' => (int) ($this->sort_order ?? 0),
            'created_at' => optional($this->created_at)?->format('Y-m-d H:i:s'),
            'updated_at' => optional($this->updated_at)?->format('Y-m-d H:i:s'),
        ];
    }
}
