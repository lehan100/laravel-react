<?php

namespace App\Repositories\Product;

use App\Models\Catalog\ProductAttribute;
use App\Models\Sales\InventoryAdjustmentHistory;
use App\Repositories\EloquentRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Collection;

interface ProductRepositoryInterface extends EloquentRepositoryInterface
{
    /**
     * @return Collection<int, ProductAttribute>
     */
    public function getAttributeRows(): Collection;

    public function getProductsForUpdate(array $productIds): Collection;

    public function getVariantsForUpdate(array $variantIds): Collection;

    public function getProductsForInventoryReport(): Collection;

    public function getInventoryAdjustmentsByDateRange(Carbon $startDate, Carbon $endDate): Collection;

    public function createInventoryAdjustment(array $payload): InventoryAdjustmentHistory;
}
