<?php

namespace App\Http\Resources\Promotion;

use Illuminate\Http\Resources\Json\ResourceCollection;

class CouponCollection extends ResourceCollection
{
    public $collects = CouponResource::class;

    public function toArray($request): array
    {
        return $this->collection->toArray();
    }
}
