<?php

namespace App\Http\Resources\Catalog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttributeResource extends JsonResource
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
                    'name' => $translation->name,
                ]];
            });
        }, []);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'translations' => $translations,
            'type' => $this->type ?? 'text',
            'status' => (bool) ($this->status ?? 0),
            'order' => (int) ($this->order ?? 0),
            'values' => AttributeValueResource::collection(
                $this->whenLoaded('values')
            )->resolve($request),
            'values_count' => $this->whenLoaded('values', fn () => $this->values->count()),
            'values_preview' => $this->whenLoaded('values', function () use ($baseUrl, $path) {
                return $this->values->map(function ($value) use ($baseUrl, $path) {
                    $image = $value->image ?: null;

                    return [
                        'id' => $value->id,
                        'value' => $value->value,
                        'color' => $value->color,
                        'image' => $image,
                        'image_url' => $image
                            ? rtrim($baseUrl, '/').'/'.trim($path, '/').'/'.$image
                            : null,
                    ];
                })->values();
            }, []),
        ];
    }
}
