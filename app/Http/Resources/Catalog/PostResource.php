<?php

namespace App\Http\Resources\Catalog;

use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $configPath = config('image.path.photo');
        $baseUrl = url('/');
        $path = $configPath['path'] ?? 'uploads';

        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'type' => $this->type ?? 'primary',
            'status' => $this->status,
            'order' => $this->order,
            'hit_viewer' => $this->hit_viewer ?? 0,
            'photo' => $this->photo ?? '',
            'photo_url' => $this->photo
                ? rtrim($baseUrl, '/') . '/' . trim($path, '/') . '/' . $this->photo
                : null,
            'category' => $this->category ? [
                'id' => $this->category->id,
                'type' => $this->category->type ?? null,
                'name' => $this->category->translations->first()->name ?? ('#' . $this->category->id),
            ] : null,
            'translations' => $this->translations->mapWithKeys(function ($item) {
                $slugLocale = $this->slugs
                    ->where('locale', $item->locale)
                    ->whereNull('redirect_to')
                    ->where('is_default', true)
                    ->first();

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
