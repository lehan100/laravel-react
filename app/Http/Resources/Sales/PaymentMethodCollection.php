<?php

namespace App\Http\Resources\Sales;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PaymentMethodCollection extends ResourceCollection
{
    public $collects = PaymentMethodResource::class;

    public function toArray(Request $request): array
    {
        return $this->collection->toArray();
    }
}
