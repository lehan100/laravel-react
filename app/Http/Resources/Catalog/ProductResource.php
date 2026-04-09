<?php

namespace App\Http\Resources\Catalog;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $configPath = config('image.path.product');
        $baseUrl = url('/');
        $path = $configPath['path'] ?? 'uploads';
        $fullPath = public_path(trim($path, '/'));
        $defaultPhoto = $this->photos->where('is_default', true)->first() ?? $this->photos->first();
        return [
            'id'     => $this->id,
            'sku' => $this->sku ?? null,
            'quantity' => $this->quantity ?? 0,
            'weight' => $this->weight ?? 0,
            'price' => $this->price ?? 0,
            'is_stock' => $this->is_stock ?? null,
            'is_coupon' => $this->is_coupon ?? null,
            'status' => $this->status,
            'order'  => $this->order,
            'photo'     => $defaultPhoto ? $defaultPhoto->filename : null,
            'photo_url' => $defaultPhoto
                ? rtrim($baseUrl, '/') . '/' . trim($path, '/') . '/' . $defaultPhoto->filename
                : null,
            'category_ids' => $this->categories->pluck('id')->values(),
            'categories' => $this->categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->translations->first()->name ?? ('#' . $category->id),
                    'name_with_depth' => $category->name_with_depth ?? ($category->translations->first()->name ?? ('#' . $category->id)),
                ];
            })->values(),
            'translations' => $this->translations->mapWithKeys(function ($item) use ($configPath, $baseUrl) {
                $slugLocale = $this->slugs->where('locale', $item->locale)->whereNull('redirect_to')->where('is_default', true)->first();
                return [$item->locale => [
                    'name'        => $item->name ?? '',
                    'slug'        => $slugLocale ? $slugLocale->slug : '',
                    'description' => $item->description ?? '',
                    'content'     => $item->content ?? '',
                    'seo_title'       => $item->seo_title ?? '',
                    'seo_keyword'     => $item->seo_keyword ?? '',
                    'seo_description' => $item->seo_description ?? '',
                ]];
            }),
            'photos' => $this->photos->map(function ($p) use ($baseUrl, $path, $fullPath) {
                $filePath = rtrim($fullPath, '/') . '/' . ltrim($p->filename, '/');
                $dimensions = is_file($filePath) ? @getimagesize($filePath) : false;
                $fileSize = is_file($filePath) ? @filesize($filePath) : false;

                return [
                    'id' => $p->id,
                    'url' => rtrim($baseUrl, '/') . '/' . trim($path, '/') . '/' . $p->filename,
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
        ];
    }

    private function formatFileSize($bytes): ?string
    {
        if (!is_numeric($bytes) || $bytes <= 0) {
            return null;
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $size = (float) $bytes;
        $index = 0;

        while ($size >= 1024 && $index < count($units) - 1) {
            $size /= 1024;
            $index++;
        }

        return rtrim(rtrim(number_format($size, $index === 0 ? 0 : 1, '.', ''), '0'), '.') . ' ' . $units[$index];
    }
}
