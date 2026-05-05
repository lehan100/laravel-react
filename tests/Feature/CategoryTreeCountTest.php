<?php

namespace Tests\Feature;

use App\Repositories\Category\CategoryEloquentRepository;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CategoryTreeCountTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        app()->setLocale('vi');
        config(['translatable.locales' => ['vi', 'en', 'ja']]);
    }

    #[Test]
    public function it_aggregates_product_count_for_parent_categories(): void
    {
        $now = now();

        $parentId = DB::table('categories')->insertGetId([
            'status' => 1,
            'order' => 1,
            'parent_id' => null,
            'type' => 'product',
            'photo' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $childOneId = DB::table('categories')->insertGetId([
            'status' => 1,
            'order' => 1,
            'parent_id' => $parentId,
            'type' => 'product',
            'photo' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $childTwoId = DB::table('categories')->insertGetId([
            'status' => 1,
            'order' => 2,
            'parent_id' => $parentId,
            'type' => 'product',
            'photo' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $grandChildId = DB::table('categories')->insertGetId([
            'status' => 1,
            'order' => 1,
            'parent_id' => $childTwoId,
            'type' => 'product',
            'photo' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $this->seedCategoryTranslation($parentId, 'Đồ chơi xe');
        $this->seedCategoryTranslation($childOneId, 'Tay Thắng');
        $this->seedCategoryTranslation($childTwoId, 'Heo Thắng');
        $this->seedCategoryTranslation($grandChildId, 'Bố Thắng');

        $productIds = [];
        foreach (range(1, 9) as $index) {
            $productIds[] = DB::table('products')->insertGetId([
                'sku' => 'PRD-'.$index,
                'quantity' => 1,
                'weight' => 1,
                'price' => 100000,
                'is_coupon' => 0,
                'is_stock' => 1,
                'status' => 1,
                'order' => $index,
                'hit_viewer' => 0,
                'hit_order' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        DB::table('product_translations')->insert([
            [
                'product_id' => $productIds[0],
                'locale' => 'vi',
                'name' => 'Sản phẩm 1',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'order' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_id' => $productIds[1],
                'locale' => 'vi',
                'name' => 'Sản phẩm 2',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'order' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_id' => $productIds[2],
                'locale' => 'vi',
                'name' => 'Sản phẩm 3',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'order' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_id' => $productIds[3],
                'locale' => 'vi',
                'name' => 'Sản phẩm 4',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'order' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_id' => $productIds[4],
                'locale' => 'vi',
                'name' => 'Sản phẩm 5',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'order' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_id' => $productIds[5],
                'locale' => 'vi',
                'name' => 'Sản phẩm 6',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'order' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_id' => $productIds[6],
                'locale' => 'vi',
                'name' => 'Sản phẩm 7',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'order' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_id' => $productIds[7],
                'locale' => 'vi',
                'name' => 'Sản phẩm 8',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'order' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'product_id' => $productIds[8],
                'locale' => 'vi',
                'name' => 'Sản phẩm 9',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'order' => 0,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('category_product')->insert([
            ['category_id' => $childOneId, 'product_id' => $productIds[0]],
            ['category_id' => $childTwoId, 'product_id' => $productIds[1]],
            ['category_id' => $childTwoId, 'product_id' => $productIds[2]],
            ['category_id' => $grandChildId, 'product_id' => $productIds[3]],
            ['category_id' => $grandChildId, 'product_id' => $productIds[4]],
            ['category_id' => $grandChildId, 'product_id' => $productIds[5]],
            ['category_id' => $grandChildId, 'product_id' => $productIds[6]],
            ['category_id' => $grandChildId, 'product_id' => $productIds[7]],
            ['category_id' => $grandChildId, 'product_id' => $productIds[8]],
        ]);

        /** @var CategoryEloquentRepository $repository */
        $repository = app(CategoryEloquentRepository::class);
        $categories = $repository->lists(null, ['task' => 'admin-list-items']);

        $parent = $categories->firstWhere('id', $parentId);
        $childTwo = $categories->firstWhere('id', $childTwoId);

        $this->assertNotNull($parent);
        $this->assertSame(9, (int) ($parent->tree_products_count ?? 0));
        $this->assertSame(8, (int) ($childTwo->tree_products_count ?? 0));
    }

    private function seedCategoryTranslation(int $categoryId, string $name): void
    {
        $now = now();

        DB::table('category_translations')->insert([
            'category_id' => $categoryId,
            'locale' => 'vi',
            'name' => $name,
            'description' => null,
            'content' => null,
            'seo_title' => null,
            'seo_keyword' => null,
            'seo_description' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }
}
