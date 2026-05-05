<?php

namespace App\Repositories\Product;

use App\Models\Catalog\ProductAttribute;
use App\Repositories\EloquentRepositoryInterface;
use Illuminate\Support\Collection;

interface ProductRepositoryInterface extends EloquentRepositoryInterface
{
    /**
     * @return Collection<int, ProductAttribute>
     */
    public function getAttributeRows(): Collection;
}
