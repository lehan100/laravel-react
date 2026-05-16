<?php

namespace App\Http\Resources\Media;

use App\Http\Resources\Concerns\LoadsRelationCollections;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaBannerResource extends JsonResource
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
        $configPath = config('image.path.photo');
        $baseUrl = url('/');
        $positions = $this->loadedCollection('positions');
        $translations = $this->loadedCollection('translations');

        return [
            'id' => $this->id,
            'status' => $this->status,
            'order' => $this->order,
            'positions' => $positions->map(function ($pos) {
                return [
                    'id' => $pos->id,
                    'name' => $pos->name,
                    'code' => $pos->code,
                ];
            }),
            'translations' => $translations->mapWithKeys(function ($item) use ($configPath, $baseUrl) {
                $path = $configPath['path'] ?? 'uploads';

                return [$item->locale => [
                    'name' => $item->name ?? '',
                    'alias_link' => $item->alias_link ?? '',
                    'description' => $item->description ?? '',
                    'content' => $item->content ?? '',
                    'photo' => $item->photo ?? '',
                    'photo_url' => $item->photo ? rtrim($baseUrl, '/').'/'.trim($path, '/').'/'.$item->photo : null,
                ]];
            }),
        ];
    }
}
