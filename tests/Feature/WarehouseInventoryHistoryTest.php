<?php

namespace Tests\Feature;

use App\Models\Catalog\Product;
use App\Models\Catalog\ProductVariant;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Inertia\Testing\AssertableInertia as Assert;
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

        ProductVariant::query()->create([
            'product_id' => $product->id,
            'sku' => 'WAREHOUSE-VARIANT-BLUE-L',
            'price' => 118000,
            'stock' => 4,
            'image' => null,
            'images' => null,
        ]);

        $variant = ProductVariant::query()->create([
            'product_id' => $product->id,
            'sku' => 'WAREHOUSE-VARIANT-RED-XL',
            'price' => 120000,
            'stock' => 3,
            'image' => null,
            'images' => null,
        ]);

        $product->update([
            'quantity' => 7,
            'is_stock' => true,
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
        $this->assertSame(15, (int) $product->fresh()->quantity);

        $history = $product->adjustmentHistories()->latest('id')->first();

        $this->assertNotNull($history);
        $this->assertSame('set', $history->action);
        $this->assertSame(3, (int) $history->old_quantity);
        $this->assertSame(11, (int) $history->new_quantity);
        $this->assertSame($variant->id, (int) data_get($history->meta, 'variant_id'));
    }

    #[Test]
    public function it_blocks_manual_parent_stock_updates_when_the_product_has_variants(): void
    {
        $this->withoutMiddleware();

        $product = Product::query()->create([
            'sku' => 'WAREHOUSE-PARENT-BLOCKED',
            'quantity' => 7,
            'weight' => 1,
            'price' => 100000,
            'is_coupon' => false,
            'is_stock' => true,
            'status' => 1,
            'order' => 1,
            'hit_viewer' => 0,
            'hit_order' => 0,
        ]);

        ProductVariant::query()->create([
            'product_id' => $product->id,
            'sku' => 'WAREHOUSE-PARENT-BLOCKED-RED',
            'price' => 120000,
            'stock' => 3,
            'image' => null,
            'images' => null,
        ]);

        $response = $this->put(route('warehouse.update', $product->id), [
            'action' => 'set',
            'set_quantity' => 20,
            'adjust_delta' => 0,
            'reason' => 'Should be blocked',
            'undo' => 0,
        ]);

        $response->assertRedirect(route('warehouse.edit', $product->id));
        $response->assertSessionHas('error', __('hancms.sales.warehouse.messages.parent_stock_managed_by_variants'));
        $this->assertSame(7, (int) $product->fresh()->quantity);
    }

    #[Test]
    public function it_exposes_variants_on_the_parent_warehouse_edit_page(): void
    {
        $this->withoutMiddleware();

        $product = Product::query()->create([
            'sku' => 'WAREHOUSE-PARENT-EDIT',
            'quantity' => 9,
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
            'sku' => 'WAREHOUSE-PARENT-EDIT-RED',
            'price' => 120000,
            'stock' => 5,
            'image' => null,
            'images' => null,
        ]);

        $response = $this->get(route('warehouse.edit', $product->id));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Sales/Warehouse/Edit')
            ->where('item.id', $product->id)
            ->where('item.variants.0.id', $variant->id)
            ->where('item.variants.0.quantity', 5)
        );
    }
}
