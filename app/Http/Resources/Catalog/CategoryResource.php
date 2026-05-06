<?php

namespace App\Http\Resources\Catalog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $configPath = config('image.path.category');
        $baseUrl = url('/');
        $path = $configPath['path'] ?? 'uploads';

        return [
            'id' => $this->id,
            'parent_id' => $this->parent_id ?? null,
            'type' => $this->type ?? 'product',
            'status' => $this->status,
            'order' => $this->order,
            'page_id' => $this->page_id ?? null,
            'page' => $this->whenLoaded('page', function () {
                return [
                    'id' => $this->page?->id,
                    'title' => $this->page?->title,
                ];
            }),
            'products_count' => $this->whenCounted('products'),
            'tree_products_count' => $this->tree_products_count ?? $this->whenCounted('products'),
            'product_ids' => $this->whenLoaded('products', function () {
                return $this->products->pluck('id')->values()->all();
            }),
            'photo' => $this->photo ?? '',
            'photo_url' => $this->photo ? rtrim($baseUrl, '/').'/'.trim($path, '/').'/'.$this->photo : null,
            'translations' => $this->translations->mapWithKeys(function ($item) {
                $slugLocale = $this->slugs->where('locale', $item->locale)->whereNull('redirect_to')->where('is_default', true)->first();

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
        ];
    }
}
