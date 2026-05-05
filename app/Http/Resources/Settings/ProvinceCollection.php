<?php

namespace App\Http\Resources\Settings;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ProvinceCollection extends ResourceCollection
{
    public $collects = ProvinceResource::class;
}
