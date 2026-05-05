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
        $configPath = config('image.path.attribute');
        $baseUrl = url('/');
        $path = $configPath['path'] ?? 'media/attribute';

        $translations = $this->whenLoaded('translations', function () {
            return $this->translations->mapWithKeys(function ($translation) {
                return [$translation->locale => [
                    'locale' => $translation->locale,
                    'value' => $translation->value,
                ]];
            });
        }, []);

        return [
            'id' => $this->id,
            'attribute_id' => $this->attribute_id,
            'attribute_name' => $this->whenLoaded('attribute', fn () => $this->attribute?->name),
            'name' => $this->value,
            'value' => $this->value,
            'translations' => $translations,
            'image' => $this->image ?? null,
            'image_url' => $this->image
                ? rtrim($baseUrl, '/').'/'.trim($path, '/').'/'.$this->image
                : null,
            'color' => $this->color ?? null,
            'order' => (int) ($this->order ?? 0),
        ];
    }
}
