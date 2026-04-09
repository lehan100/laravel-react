<?php

namespace App\Http\Resources\Promotion;

use Illuminate\Http\Resources\Json\ResourceCollection;

class BuyToGiftCollection extends ResourceCollection
{
    public $collects = BuyToGiftResource::class;

    public function toArray($request): array
    {
        return $this->collection->toArray();
    }
}

