<?php

namespace App\Http\Resources;

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
        $defaultPhoto = $this->photos->where('is_default', true)->first() ?? $this->photos->first();
        return [
            'id'     => $this->id,
            'sku' => $this->sku ?? null,
            'quantity' => $this->quantity ?? 0,
            'weight' => $this->weight ?? 0,
            'price' => $this->price ?? 0,
            'is_stock' => $this->stock ?? null,
            'is_coupon' => $this->is_coupon ?? null,
            'status' => $this->status,
            'order'  => $this->order,
            'photo'     => $defaultPhoto ? $defaultPhoto->filename : null,
            'photo_url' => $defaultPhoto
                ? rtrim($baseUrl, '/') . '/' . trim($path, '/') . '/' . $defaultPhoto->filename
                : null,
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
            'all_photos' => $this->photos->map(function ($p) use ($baseUrl, $path) {
                return [
                    'url' => rtrim($baseUrl, '/') . '/' . trim($path, '/') . '/' . $p->filename,
                    'alt' => $p->alt
                ];
            }),
        ];
    }
}
