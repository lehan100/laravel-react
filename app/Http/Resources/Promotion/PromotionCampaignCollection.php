<?php

namespace App\Http\Resources\Promotion;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PromotionCampaignCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray($request): array
    {
        return $this->collection->toArray();
    }
}
