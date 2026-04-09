<?php

namespace App\Http\Resources\Promotion;

use Illuminate\Http\Resources\Json\ResourceCollection;

class SaleOfferCollection extends ResourceCollection
{
    public $collects = SaleOfferResource::class;

    public function toArray($request): array
    {
        return $this->collection->toArray();
    }
}
