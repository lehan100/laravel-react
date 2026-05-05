<?php

namespace App\Http\Resources\Catalog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttributeValueResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'attribute_id' => $this->attribute_id,
            'attribute_name' => $this->whenLoaded('attribute', fn () => $this->attribute?->name),
            'value' => $this->value,
        ];
    }
}
