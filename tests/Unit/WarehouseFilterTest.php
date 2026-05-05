<?php

namespace Tests\Unit;

use App\Repositories\Warehouse\WarehouseEloquentRepository;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class WarehouseFilterTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        app()->setLocale('vi');
        config(['translatable.locales' => ['vi', 'en', 'ja']]);
    }

    #[Test]
    public function it_filters_stock_status_by_is_stock_instead_of_quantity(): void
    {
        $now = now();

        $inStockId = DB::table('products')->insertGetId([
            'sku' => 'IN-STOCK',
            'quantity' => 0,
            'weight' => 1,
            'price' => 100000,
            'is_coupon' => 0,
            'is_stock' => 1,
            'status' => 1,
            'order' => 1,
            'hit_viewer' => 0,
            'hit_order' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $outOfStockId = DB::table('products')->insertGetId([
            'sku' => 'OUT-STOCK',
            'quantity' => 999,
            'weight' => 1,
            'price' => 100000,
            'is_coupon' => 0,
            'is_stock' => 0,
            'status' => 1,
            'order' => 2,
            'hit_viewer' => 0,
            'hit_order' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $this->seedTranslation($inStockId, 'Đang bán');
        $this->seedTranslation($outOfStockId, 'Hết hàng');

        /** @var WarehouseEloquentRepository $repository */
        $repository = app(WarehouseEloquentRepository::class);

        $inStock = $repository->lists(['stock_status' => 'in_stock', 'per_page' => 20], ['task' => 'admin-list-items']);
        $outStock = $repository->lists(['stock_status' => 'out_stock', 'per_page' => 20], ['task' => 'admin-list-items']);

        $this->assertTrue($inStock->getCollection()->contains(fn ($item) => (int) $item->id === $inStockId));
        $this->assertFalse($inStock->getCollection()->contains(fn ($item) => (int) $item->id === $outOfStockId));

        $this->assertTrue($outStock->getCollection()->contains(fn ($item) => (int) $item->id === $outOfStockId));
        $this->assertFalse($outStock->getCollection()->contains(fn ($item) => (int) $item->id === $inStockId));
    }

    private function seedTranslation(int $productId, string $name): void
    {
        $now = now();

        DB::table('product_translations')->insert([
            'product_id' => $productId,
            'locale' => 'vi',
            'name' => $name,
            'description' => null,
            'content' => null,
            'seo_title' => null,
            'seo_keyword' => null,
            'seo_description' => null,
            'order' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }
}
