<?php

namespace Tests\Feature;

use App\Models\Catalog\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PromotionProductPickerCategoryFilterTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_returns_products_from_child_categories_when_filtering_by_parent_category(): void
    {
        $this->withoutMiddleware();

        $now = now();

        $parentCategoryId = DB::table('categories')->insertGetId([
            'parent_id' => null,
            'type' => 'product',
            'status' => 1,
            'order' => 1,
            'photo' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $childCategoryId = DB::table('categories')->insertGetId([
            'parent_id' => $parentCategoryId,
            'type' => 'product',
            'status' => 1,
            'order' => 1,
            'photo' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('category_translations')->insert([
            [
                'category_id' => $parentCategoryId,
                'locale' => 'vi',
                'name' => 'Đồ chơi xe',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => $childCategoryId,
                'locale' => 'vi',
                'name' => 'Tay thắng',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        $product = Product::query()->create([
            'sku' => 'PARENT-FILTER-001',
            'quantity' => 12,
            'weight' => 1,
            'price' => 990000,
            'status' => 1,
            'is_coupon' => 0,
            'is_stock' => 1,
            'order' => 1,
            'hit_viewer' => 0,
            'hit_order' => 0,
        ]);

        $product->translations()->create([
            'locale' => 'vi',
            'name' => 'Sản phẩm lọc danh mục cha',
        ]);

        DB::table('category_product')->insert([
            'category_id' => $childCategoryId,
            'product_id' => $product->id,
        ]);

        $response = $this->get(route('saleoffer.products-picker', [
            'category_id' => $parentCategoryId,
            'per_page' => 12,
        ]));

        $response->assertOk();
        $response->assertJsonFragment([
            'id' => $product->id,
            'sku' => 'PARENT-FILTER-001',
            'name' => 'Sản phẩm lọc danh mục cha',
        ]);
    }

    #[Test]
    public function it_returns_products_from_child_categories_in_coupon_picker_too(): void
    {
        $this->withoutMiddleware();

        $now = now();

        $parentCategoryId = DB::table('categories')->insertGetId([
            'parent_id' => null,
            'type' => 'product',
            'status' => 1,
            'order' => 1,
            'photo' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $childCategoryId = DB::table('categories')->insertGetId([
            'parent_id' => $parentCategoryId,
            'type' => 'product',
            'status' => 1,
            'order' => 1,
            'photo' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('category_translations')->insert([
            [
                'category_id' => $parentCategoryId,
                'locale' => 'vi',
                'name' => 'Đồ chơi xe',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => $childCategoryId,
                'locale' => 'vi',
                'name' => 'Tay thắng',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        $product = Product::query()->create([
            'sku' => 'COUPON-FILTER-001',
            'quantity' => 8,
            'weight' => 1,
            'price' => 1990000,
            'status' => 1,
            'is_coupon' => 0,
            'is_stock' => 1,
            'order' => 1,
            'hit_viewer' => 0,
            'hit_order' => 0,
        ]);

        $product->translations()->create([
            'locale' => 'vi',
            'name' => 'Sản phẩm coupon lọc cha',
        ]);

        DB::table('category_product')->insert([
            'category_id' => $childCategoryId,
            'product_id' => $product->id,
        ]);

        $response = $this->get(route('coupon.products-picker', [
            'category_id' => $parentCategoryId,
            'per_page' => 12,
        ]));

        $response->assertOk();
        $response->assertJsonFragment([
            'id' => $product->id,
            'sku' => 'COUPON-FILTER-001',
            'name' => 'Sản phẩm coupon lọc cha',
        ]);
    }
}
