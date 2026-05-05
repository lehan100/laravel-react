<?php

namespace App\Http\Resources\Sales;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WarehouseHistoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $this->relationLoaded('user') ? $this->user : null;

        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'user_id' => $this->user_id,
            'action' => $this->action,
            'old_quantity' => (int) ($this->old_quantity ?? 0),
            'new_quantity' => (int) ($this->new_quantity ?? 0),
            'delta' => (int) ($this->delta ?? 0),
            'reason' => $this->reason,
            'meta' => $this->meta ?? [],
            'created_at' => optional($this->created_at)?->format('Y-m-d H:i:s'),
            'user_name' => $user?->name ?: __('hancms.sales.warehouse.system_user'),
            'user_email' => $user?->email,
        ];
    }
}
