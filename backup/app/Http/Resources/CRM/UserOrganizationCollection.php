<?php

namespace App\Http\Resources\CRM;

use Illuminate\Http\Resources\Json\ResourceCollection;

class UserOrganizationCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return $this->collection->map->only('id', 'name');
    }
}
