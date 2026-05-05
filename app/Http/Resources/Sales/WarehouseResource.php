<?php

namespace App\Http\Resources\Sales;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WarehouseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sku' => $this->sku,
            'name' => $this->localizedName(),
            'quantity' => (int) ($this->quantity ?? 0),
            'price' => $this->price,
            'is_stock' => (bool) $this->is_stock,
            'status' => $this->status,
            'updated_at' => optional($this->updated_at)?->format('Y-m-d H:i:s'),
        ];
    }

    private function localizedName(): ?string
    {
        if ($this->relationLoaded('translations')) {
            $translation = $this->translations->first();

            if ($translation?->name) {
                return $translation->name;
            }
        }

        return $this->name ?? null;
    }
}
