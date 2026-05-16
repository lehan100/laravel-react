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
        $currentLocale = $this->resolveLocale($request);

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
            'attribute_name' => $this->whenLoaded('attribute', fn () => $this->resolveLocalizedAttributeName($currentLocale)),
            'name' => $this->resolveLocalizedValue($currentLocale),
            'value' => $this->resolveLocalizedValue($currentLocale),
            'translations' => $translations,
            'image' => $this->image ?? null,
            'image_url' => $this->image ? $this->buildImageUrl($baseUrl, $path, $this->image) : null,
            'color' => $this->color ?? null,
            'order' => (int) ($this->order ?? 0),
        ];
    }

    private function buildImageUrl(string $baseUrl, string $path, string $image): string
    {
        if (str_starts_with($image, 'http://') || str_starts_with($image, 'https://') || str_starts_with($image, '/')) {
            return $image;
        }

        $parsedPath = parse_url($image, PHP_URL_PATH);
        $parsedPath = is_string($parsedPath) && $parsedPath !== '' ? $parsedPath : $image;

        if (str_contains($parsedPath, '/')) {
            return '/'.ltrim($parsedPath, '/');
        }

        return rtrim($baseUrl, '/').'/'.trim($path, '/').'/'.$image;
    }

    private function resolveLocalizedValue(string $currentLocale): string
    {
        $translation = $this->relationLoaded('translations')
            ? $this->translations->firstWhere('locale', $currentLocale)
            : null;

        return $translation?->value
            ?? $this->value
            ?? '';
    }

    private function resolveLocalizedAttributeName(string $currentLocale): string
    {
        if (! $this->relationLoaded('attribute') || ! $this->attribute) {
            return '';
        }

        $attribute = $this->attribute;
        $translation = $attribute->relationLoaded('translations')
            ? $attribute->translations->firstWhere('locale', $currentLocale)
            : null;

        return $translation?->name
            ?? $attribute->name
            ?? '';
    }

    private function resolveLocale(Request $request): string
    {
        $locale = app()->getLocale();

        if (method_exists($request, 'hasSession') && $request->hasSession()) {
            $locale = (string) ($request->session()->get('locale') ?: $locale);
        }

        $normalized = strtolower(trim($locale));

        if ($normalized === '') {
            return 'vi';
        }

        $normalized = str_replace('_', '-', $normalized);

        return explode('-', $normalized)[0];
    }
}
