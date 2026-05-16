<?php

namespace App\Http\Resources\Settings;

use Illuminate\Http\Resources\Json\ResourceCollection;

class MailTemplateCollection extends ResourceCollection
{
    public function toArray($request): array
    {
        return $this->collection->map->toArray($request)->all();
    }
}
