<?php

namespace Tests\Unit;

use App\Repositories\Category\CategoryEloquentRepository;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CategoryProductPickerDataTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        app()->setLocale('ja');
        config(['translatable.locales' => ['vi', 'en', 'ja']]);
    }

    #[Test]
    public function it_returns_zero_quantity_for_products_without_stock_management(): void
    {
        $now = now();

        $productId = DB::table('products')->insertGetId([
            'sku' => 'A001',
            'quantity' => 900,
            'weight' => 1,
            'price' => 590000,
            'is_coupon' => 0,
            'is_stock' => 0,
            'status' => 1,
            'order' => 1,
            'hit_viewer' => 0,
            'hit_order' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('product_translations')->insert([
            'product_id' => $productId,
            'locale' => 'ja',
            'name' => 'JP Nước hoa Charme Cool Water',
            'description' => null,
            'content' => null,
            'seo_title' => null,
            'seo_keyword' => null,
            'seo_description' => null,
            'order' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        /** @var CategoryEloquentRepository $repository */
        $repository = app(CategoryEloquentRepository::class);
        $picker = $repository->getProductPickerData(12, 'Charme');

        $this->assertNotEmpty($picker['data']);
        $row = collect($picker['data'])->firstWhere('id', $productId);

        $this->assertNotNull($row);
        $this->assertSame(0, (int) ($row['quantity'] ?? -1));
        $this->assertSame(0, (int) ($row['is_stock'] ?? -1));
    }
}
