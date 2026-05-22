<?php

namespace App\Http\Resources\Catalog;

use App\Http\Resources\Concerns\LoadsRelationCollections;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
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
        $configPath = config('image.path.post');
        $baseUrl = url('/');
        $path = $configPath['path'] ?? 'uploads';
        $translations = $this->loadedCollection('translations');
        $slugs = $this->loadedCollection('slugs');
        $category = $this->loadedModel('category');

        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'type' => $this->type ?? 'primary',
            'status' => $this->status,
            'order' => $this->order,
            'hit_viewer' => $this->hit_viewer ?? 0,
            'photo' => $this->photo ?? '',
            'photo_url' => $this->photo
                ? rtrim($baseUrl, '/').'/'.trim($path, '/').'/'.$this->photo
                : null,
            'category' => $category ? [
                'id' => $category->id,
                'type' => $category->type ?? null,
                'name' => $category->relationLoaded('translations')
                    ? ($category->translations->first()?->name ?? ('#'.$category->id))
                    : ('#'.$category->id),
            ] : null,
            'translations' => $translations->mapWithKeys(function ($item) use ($slugs) {
                $slugLocale = $slugs
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
