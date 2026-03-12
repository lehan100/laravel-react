<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;
use App\Http\Resources\MediaBannerResource;
class MediaBannerCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
         return [
            'data' => $this->collection->mapInto(MediaBannerResource::class)->all(),
            'meta' => [
                'total' => $this->collection->count(),
            ]
        ];
    }
}
