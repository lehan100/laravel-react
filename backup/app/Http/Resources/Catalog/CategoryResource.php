<?php

namespace App\Http\Resources\Catalog;

use App\Http\Resources\Concerns\LoadsRelationCollections;
use App\Models\Catalog\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
        $configPath = config('image.path.category');
        $baseUrl = url('/');
        $path = $configPath['path'] ?? 'uploads';
        $translations = $this->loadedCollection('translations');
        $slugs = $this->loadedCollection('slugs');

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
            'tree_posts_count' => $this->tree_posts_count ?? $this->whenCounted('posts'),
            'product_ids' => $this->whenLoaded('products', function () {
                return $this->products->pluck('id')->values()->all();
            }),
            'posts_count' => $this->whenCounted('posts'),
            'posts' => $this->whenLoaded('posts', function () {
                return $this->posts->map(function (Post $post): array {
                    $translation = $post->relationLoaded('translations')
                        ? ($post->translations->firstWhere('locale', app()->getLocale()) ?? $post->translations->first())
                        : null;

                    return [
                        'id' => $post->id,
                        'name' => $translation?->name ?? ('#'.$post->id),
                        'status' => $post->status,
                        'order' => $post->order,
                    ];
                })->values()->all();
            }),
            'photo' => $this->photo ?? '',
            'photo_url' => $this->photo ? $this->buildImageUrl($baseUrl, $path, $this->photo) : null,
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
}
