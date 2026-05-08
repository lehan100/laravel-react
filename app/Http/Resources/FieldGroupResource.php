<?php

namespace App\Http\Resources;

use App\Models\FieldGroup;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin FieldGroup
 */
class FieldGroupResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'status' => (bool) $this->status,
            'fields_schema' => $this->fields_schema ?? [],
            'pages_count' => $this->whenCounted('pages'),
            'created_at' => optional($this->created_at)->toISOString(),
            'updated_at' => optional($this->updated_at)->toISOString(),
        ];
    }
}
