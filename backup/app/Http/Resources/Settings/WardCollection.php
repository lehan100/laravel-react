<?php

namespace App\Http\Resources\Settings;

use Illuminate\Http\Resources\Json\ResourceCollection;

class WardCollection extends ResourceCollection
{
    public $collects = WardResource::class;
}
