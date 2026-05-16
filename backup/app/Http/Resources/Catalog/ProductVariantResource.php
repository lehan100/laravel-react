<?php

namespace App\Http\Resources\Catalog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $configPath = config('image.path.product');
        $baseUrl = url('/');
        $path = $configPath['path'] ?? 'uploads';

        $images = collect($this->images ?: ($this->image ? [$this->image] : []))
            ->map(fn (mixed $image) => $this->normalizeVariantImageName($image))
            ->filter()
            ->values();
        $image = $this->normalizeVariantImageName($this->image);

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
            'product_id' => $this->product_id,
            'name' => $this->name,
            'translations' => $translations,
            'sku' => $this->sku,
            'price' => (float) $this->price,
            'stock' => $this->stock,
            'image' => $image,
            'images' => $images,
            'image_url' => $image
                ? rtrim($baseUrl, '/').'/'.trim($path, '/').'/'.$image
                : null,
            'image_urls' => $images
                ->map(fn (string $image) => rtrim($baseUrl, '/').'/'.trim($path, '/').'/'.$image)
                ->values(),
            'attribute_value_ids' => $this->whenLoaded(
                'attributeValues',
                fn () => $this->attributeValues->pluck('id')->values()
            ),
            'attribute_values' => AttributeValueResource::collection(
                $this->whenLoaded('attributeValues')
            ),
        ];
    }

    private function normalizeVariantImageName(mixed $image): ?string
    {
        if (! is_string($image)) {
            return null;
        }

        $image = trim($image);

        if ($image === '') {
            return null;
        }

        $path = parse_url($image, PHP_URL_PATH);
        $path = is_string($path) && $path !== '' ? $path : $image;

        $fileName = basename($path);

        return $fileName !== '' ? $fileName : null;
    }
}
