<?php

namespace App\Http\Resources\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

trait LoadsRelationCollections
{
    protected function loadedCollection(string $relation): Collection
    {
        if (! $this->resource instanceof Model) {
            return collect();
        }

        if (! $this->resource->relationLoaded($relation)) {
            return collect();
        }

        $relationValue = $this->resource->getRelation($relation);

        return $relationValue instanceof Collection ? $relationValue : collect($relationValue);
    }

    protected function loadedModel(string $relation): ?Model
    {
        if (! $this->resource instanceof Model) {
            return null;
        }

        if (! $this->resource->relationLoaded($relation)) {
            return null;
        }

        $relationValue = $this->resource->getRelation($relation);

        return $relationValue instanceof Model ? $relationValue : null;
    }
}
