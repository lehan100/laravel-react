<?php

namespace App\Http\Resources\Catalog;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class AttributeCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public $collects = AttributeResource::class;

    public function toArray(Request $request): array
    {
        return $this->collection->toArray();
    }
}
