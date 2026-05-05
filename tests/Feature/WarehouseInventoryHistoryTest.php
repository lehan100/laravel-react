<?php

namespace Tests\Feature;

use App\Models\Catalog\Product;
use App\Models\Catalog\ProductVariant;
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

    #[Test]
    public function it_updates_variant_stock_from_the_warehouse_variant_action(): void
    {
        $this->withoutMiddleware();

        $product = Product::query()->create([
            'sku' => 'WAREHOUSE-VARIANT-PARENT',
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

        $variant = ProductVariant::query()->create([
            'product_id' => $product->id,
            'sku' => 'WAREHOUSE-VARIANT-RED-XL',
            'price' => 120000,
            'stock' => 3,
            'image' => null,
            'images' => null,
        ]);

        $response = $this->put(route('warehouse.variants.update', $variant->id), [
            'action' => 'set',
            'set_quantity' => 11,
            'adjust_delta' => 0,
            'reason' => 'Variant warehouse sync',
            'undo' => 0,
        ]);

        $response->assertRedirect(route('warehouse.variants.edit', $variant->id));
        $this->assertSame(11, (int) $variant->fresh()->stock);

        $history = $product->adjustmentHistories()->latest('id')->first();

        $this->assertNotNull($history);
        $this->assertSame('set', $history->action);
        $this->assertSame(3, (int) $history->old_quantity);
        $this->assertSame(11, (int) $history->new_quantity);
        $this->assertSame($variant->id, (int) data_get($history->meta, 'variant_id'));
    }
}
