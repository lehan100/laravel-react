<?php

namespace App\Http\Resources\Settings;

use Illuminate\Http\Resources\Json\JsonResource;

class MailTemplateResource extends JsonResource
{
    public function toArray($request): array
    {
        $currentLocale = app()->getLocale();
        $translations = $this->relationLoaded('translations') ? $this->translations : collect();
        $currentTranslation = $translations->firstWhere('locale', $currentLocale) ?? $translations->first();

        return [
            'id' => $this->id,
            'key' => $this->key,
            'module' => $this->module,
            'fallback_locale' => $this->fallback_locale,
            'variables' => $this->variables ?? [],
            'is_active' => (bool) $this->is_active,
            'name' => $currentTranslation?->name ?? '',
            'subject' => $currentTranslation?->subject ?? '',
            'body_html' => $currentTranslation?->body_html ?? '',
            'translations' => $translations->mapWithKeys(function ($item): array {
                return [
                    $item->locale => [
                        'locale' => $item->locale,
                        'name' => $item->name ?? '',
                        'subject' => $item->subject ?? '',
                        'body_html' => $item->body_html ?? '',
                    ],
                ];
            }),
            'created_at' => optional($this->created_at)->format('Y-m-d H:i:s'),
        ];
    }
}
