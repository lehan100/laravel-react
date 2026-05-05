<?php

namespace App\Http\Resources\Settings;

use Illuminate\Http\Resources\Json\JsonResource;

class ProvinceResource extends JsonResource
{
    private function isEnglishLocale(): bool
    {
        return in_array(app()->getLocale(), ['en', 'ja'], true);
    }

    private function localizedValue(?string $value, ?string $englishValue): ?string
    {
        if ($this->isEnglishLocale()) {
            return $englishValue ?? $value;
        }

        return $value ?? $englishValue;
    }

    public function toArray($request): array
    {
        return [
            'code' => $this->code,
            'name' => $this->localizedValue($this->name, $this->name_en),
            'name_en' => $this->name_en,
            'full_name' => $this->localizedValue($this->full_name, $this->full_name_en),
            'full_name_en' => $this->full_name_en,
            'code_name' => $this->code_name,
            'administrative_unit_id' => $this->administrative_unit_id,
            'administrative_unit_name' => $this->localizedValue(
                $this->administrativeUnit?->full_name ?? $this->administrativeUnit?->short_name,
                $this->administrativeUnit?->full_name_en ?? $this->administrativeUnit?->short_name_en,
            ),
            'ward_count' => $this->whenCounted('wards'),
        ];
    }
}
