<?php

namespace App\Http\Resources\Media;

use Illuminate\Http\Resources\Json\JsonResource;

class MediaBannerResource extends JsonResource
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

        return [
            'id'     => $this->id,
            'status' => $this->status,
            'order'  => $this->order,
            'positions' => $this->positions->map(function ($pos) {
                return [
                    'id'   => $pos->id,
                    'name' => $pos->name,
                    'code' => $pos->code,
                ];
            }),
            'translations' => $this->translations->mapWithKeys(function ($item) use ($configPath, $baseUrl) {
                $path = $configPath['path'] ?? 'uploads';

                return [$item->locale => [
                    'name'        => $item->name ?? '',
                    'alias_link'  => $item->alias_link ?? '',
                    'description' => $item->description ?? '',
                    'content'     => $item->content ?? '',
                    'photo'       => $item->photo ?? '',
                    'photo_url'   => $item->photo ? rtrim($baseUrl, '/') . '/' . trim($path, '/') . '/' . $item->photo : null,
                ]];
            }),
        ];
    }
}
