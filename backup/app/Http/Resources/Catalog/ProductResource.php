<?php

namespace App\Http\Resources\Catalog;

use App\Http\Resources\Concerns\LoadsRelationCollections;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    use LoadsRelationCollections;

    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $configPath = config('image.path.product');
        $baseUrl = url('/');
        $path = $configPath['path'] ?? 'uploads';
        $fullPath = public_path(trim($path, '/'));
        $photos = $this->loadedCollection('photos');
        $categories = $this->loadedCollection('categories');
        $translations = $this->loadedCollection('translations');
        $slugs = $this->loadedCollection('slugs');
        $defaultPhoto = $photos->where('is_default', true)->first() ?? $photos->first();

        return [
            'id' => $this->id,
            'sku' => $this->sku ?? null,
            'quantity' => $this->quantity ?? 0,
            'weight' => $this->weight ?? 0,
            'price' => $this->price ?? 0,
            'is_stock' => $this->is_stock ?? null,
            'is_coupon' => $this->is_coupon ?? null,
            'status' => $this->status,
            'order' => $this->order,
            'photo' => $defaultPhoto ? $defaultPhoto->filename : null,
            'photo_url' => $defaultPhoto
                ? rtrim($baseUrl, '/').'/'.trim($path, '/').'/'.$defaultPhoto->filename
                : null,
            'category_ids' => $categories->pluck('id')->values(),
            'categories' => $categories->map(function ($category) {
                $translationName = $category->relationLoaded('translations')
                    ? ($category->translations->first()?->name ?? null)
                    : null;

                return [
                    'id' => $category->id,
                    'name' => $translationName ?? ('#'.$category->id),
                    'name_with_depth' => $category->name_with_depth ?? ($translationName ?? ('#'.$category->id)),
                ];
            })->values(),
            'translations' => $translations->mapWithKeys(function ($item) use ($slugs) {
                $slugLocale = $slugs->where('locale', $item->locale)->whereNull('redirect_to')->where('is_default', true)->first();

                return [$item->locale => [
                    'name' => $item->name ?? '',
                    'slug' => $slugLocale ? $slugLocale->slug : '',
                    'description' => $item->description ?? '',
                    'content' => $item->content ?? '',
                    'seo_title' => $item->seo_title ?? '',
                    'seo_keyword' => $item->seo_keyword ?? '',
                    'seo_description' => $item->seo_description ?? '',
                ]];
            }),
            'photos' => $photos->map(function ($p) use ($baseUrl, $path, $fullPath) {
                $filePath = rtrim($fullPath, '/').'/'.ltrim($p->filename, '/');
                $dimensions = is_file($filePath) ? @getimagesize($filePath) : false;
                $fileSize = is_file($filePath) ? @filesize($filePath) : false;

                return [
                    'id' => $p->id,
                    'url' => rtrim($baseUrl, '/').'/'.trim($path, '/').'/'.$p->filename,
                    'filename' => $p->filename,
                    'alt' => $p->alt,
                    'is_default' => (bool) $p->is_default,
                    'order' => $p->order ?? 0,
                    'width' => $dimensions[0] ?? null,
                    'height' => $dimensions[1] ?? null,
                    'size' => $fileSize ?: null,
                    'size_label' => $this->formatFileSize($fileSize),
                ];
            }),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
            'attributeValues' => AttributeValueResource::collection($this->whenLoaded('attributeValues')),
        ];
    }

    private function formatFileSize($bytes): ?string
    {
        if (! is_numeric($bytes) || $bytes <= 0) {
            return null;
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $size = (float) $bytes;
        $index = 0;

        while ($size >= 1024 && $index < count($units) - 1) {
            $size /= 1024;
            $index++;
        }

        return rtrim(rtrim(number_format($size, $index === 0 ? 0 : 1, '.', ''), '0'), '.').' '.$units[$index];
    }
}
