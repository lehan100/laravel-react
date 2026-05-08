<?php

namespace App\Http\Resources;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Page
 */
class PageQuickStoreResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $currentLocale = app()->getLocale();
        $pageTranslation = $this->relationLoaded('translations')
            ? ($this->translations->firstWhere('locale', $currentLocale) ?? $this->translations->first())
            : null;
        $fieldGroup = $this->relationLoaded('fieldGroup') ? $this->fieldGroup : null;
        $label = $pageTranslation?->title ?: "#{$this->id}";

        return [
            'id' => $this->id,
            'title' => $this->title,
            'label' => $label,
            'name' => $label,
            'schema_title' => $fieldGroup?->title ?? '',
            'has_content' => $this->hasContent(),
            'edit_url' => route('pages.edit', $this->resource),
        ];
    }
}
