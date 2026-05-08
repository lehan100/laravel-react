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
        $currentLocale = $this->resolveLocale($request);

        $translations = $this->whenLoaded('translations', function () {
            return $this->translations->mapWithKeys(function ($translation) {
                return [$translation->locale => [
                    'locale' => $translation->locale,
                    'name' => $translation->name,
                ]];
            });
        }, []);
        $localizedName = $this->resolveLocalizedName($currentLocale);

        return [
            'id' => $this->id,
            'name' => $localizedName,
            'code' => $this->code,
            'translations' => $translations,
            'type' => $this->type ?? 'text',
            'status' => (bool) ($this->status ?? 0),
            'order' => (int) ($this->order ?? 0),
            'values' => AttributeValueResource::collection(
                $this->whenLoaded('values')
            )->resolve($request),
            'values_count' => $this->whenLoaded('values', fn () => $this->values->count()),
            'values_preview' => $this->whenLoaded('values', function () use ($baseUrl, $path, $currentLocale) {
                return $this->values->map(function ($value) use ($baseUrl, $path, $currentLocale) {
                    $image = $value->image ?: null;

                    return [
                        'id' => $value->id,
                        'value' => $this->resolveLocalizedValue($value, $currentLocale),
                        'color' => $value->color,
                        'image' => $image,
                        'image_url' => $image
                            ? $this->buildImageUrl($baseUrl, $path, $image)
                            : null,
                    ];
                })->values();
            }, []),
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

    private function resolveLocalizedName(string $currentLocale): string
    {
        $translation = $this->relationLoaded('translations')
            ? $this->translations->firstWhere('locale', $currentLocale)
            : null;

        return $translation?->name
            ?? $this->name
            ?? '';
    }

    private function resolveLocalizedValue(mixed $value, string $currentLocale): string
    {
        if (! is_object($value)) {
            return '';
        }

        $translation = $value->relationLoaded('translations')
            ? $value->translations->firstWhere('locale', $currentLocale)
            : null;

        return $translation?->value
            ?? $value->value
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
