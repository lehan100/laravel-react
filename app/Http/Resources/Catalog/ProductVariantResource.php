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
            ->filter()
            ->values();

        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'sku' => $this->sku,
            'price' => (float) $this->price,
            'stock' => $this->stock,
            'image' => $this->image,
            'images' => $images,
            'image_url' => $this->image
                ? rtrim($baseUrl, '/').'/'.trim($path, '/').'/'.$this->image
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
}
