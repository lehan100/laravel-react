<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $configPath = config('image.path.category');
        $baseUrl = url('/');
        $path = $configPath['path'] ?? 'uploads';
        return [
            'id'     => $this->id,
            'parent_id' => $this->parent_id ?? null,
            'status' => $this->status,
            'order'  => $this->order,
            'photo'       => $this->photo ?? '',
            'photo_url'   => $this->photo ? rtrim($baseUrl, '/') . '/' . trim($path, '/') . '/' . $this->photo : null,
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
        ];
    }
}
