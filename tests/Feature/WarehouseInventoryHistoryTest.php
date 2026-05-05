<?php

namespace Tests\Feature;

use App\Models\Catalog\Product;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class WarehouseInventoryHistoryTest extends TestCase
{
    use DatabaseMigrations;

    #[Test]
    public function it_toggles_stock_status_from_the_warehouse_index_action(): void
    {
        $this->withoutMiddleware();

        $product = Product::query()->create([
            'sku' => 'WAREHOUSE-TOGGLE-001',
            'quantity' => 4,
            'weight' => 1,
            'price' => 100000,
            'is_coupon' => false,
            'is_stock' => true,
            'status' => 1,
            'order' => 1,
            'hit_viewer' => 0,
            'hit_order' => 0,
        ]);

        $response = $this->put(route('warehouse.toggle-stock', $product->id));

        $response->assertRedirect(route('warehouse.index'));
        $this->assertFalse($product->fresh()->is_stock);
    }

    #[Test]
    public function it_writes_inventory_history_when_warehouse_updates_quantity(): void
    {
        $product = Product::query()->create([
            'sku' => 'WAREHOUSE-HISTORY-001',
            'quantity' => 4,
            'weight' => 1,
            'price' => 100000,
            'is_coupon' => false,
            'is_stock' => true,
            'status' => 1,
            'order' => 1,
            'hit_viewer' => 0,
            'hit_order' => 0,
        ]);

        request()->attributes->set('inventory_log_context', [
            'action' => 'set',
            'reason' => 'Manual warehouse update',
            'meta' => ['channel' => 'website'],
        ]);

        $product->quantity = 9;
        $product->is_stock = true;
        $product->save();

        $this->assertDatabaseHas('inventory_adjustment_histories', [
            'product_id' => $product->id,
            'action' => 'set',
            'old_quantity' => 4,
            'new_quantity' => 9,
            'delta' => 5,
            'reason' => 'Manual warehouse update',
        ]);
    }
}
