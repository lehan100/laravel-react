<?php

namespace App\Http\Resources;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Page
 */
class PageResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'status' => (bool) $this->status,
            'acf_data' => $this->acf_data,
            'field_group_id' => $this->field_group_id,
            'fieldGroup' => FieldGroupResource::make($this->whenLoaded('fieldGroup')),
            'translations' => $this->whenLoaded('translations', function (): array {
                return $this->translations
                    ->map(fn ($t): array => [
                        'locale' => $t->locale ?? null,
                        'title' => $t->title ?? null,
                    ])
                    ->values()
                    ->all();
            }),
            'created_at' => optional($this->created_at)->toISOString(),
            'updated_at' => optional($this->updated_at)->toISOString(),
        ];
    }
}
