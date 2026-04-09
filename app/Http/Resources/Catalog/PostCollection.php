<?php

namespace App\Http\Resources\Catalog;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PostCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public $collects = PostResource::class;

    public function toArray($request)
    {
        return $this->collection->toArray();
    }
}
