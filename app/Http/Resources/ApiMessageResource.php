<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property array{message:string} $resource
 */
class ApiMessageResource extends JsonResource
{
    /**
     * @return array{message:string}
     */
    public function toArray(Request $request): array
    {
        return [
            'message' => (string) ($this->resource['message'] ?? ''),
        ];
    }
}
