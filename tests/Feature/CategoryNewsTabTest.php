<?php

namespace Tests\Feature;

use App\Http\Middleware\PermissionMiddleware;
use App\Models\Account;
use App\Models\Users\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CategoryNewsTabTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_edit_exposes_news_items_and_post_create_prefills_category(): void
    {
        $account = Account::forceCreate(['name' => 'Test Account']);
        $user = User::factory()->create(['account_id' => $account->id]);

        $categoryId = DB::table('categories')->insertGetId([
            'status' => 1,
            'order' => 1,
            'parent_id' => null,
            'type' => 'news',
            'photo' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('category_translations')->insert([
            'category_id' => $categoryId,
            'locale' => 'vi',
            'name' => 'Tin tức',
            'description' => null,
            'content' => null,
            'seo_title' => null,
            'seo_keyword' => null,
            'seo_description' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('category_translations')->insert([
            'category_id' => $categoryId,
            'locale' => 'ja',
            'name' => 'ニュース',
            'description' => null,
            'content' => null,
            'seo_title' => null,
            'seo_keyword' => null,
            'seo_description' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $postId = DB::table('posts')->insertGetId([
            'category_id' => $categoryId,
            'photo' => null,
            'type' => 'primary',
            'status' => 1,
            'order' => 3,
            'hit_viewer' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('post_translations')->insert([
            'post_id' => $postId,
            'locale' => 'vi',
            'name' => 'Bài viết tin tức',
            'description' => null,
            'content' => null,
            'seo_title' => null,
            'seo_keyword' => null,
            'seo_description' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('post_translations')->insert([
            'post_id' => $postId,
            'locale' => 'ja',
            'name' => 'ニュース記事',
            'description' => null,
            'content' => null,
            'seo_title' => null,
            'seo_keyword' => null,
            'seo_description' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $productId = DB::table('products')->insertGetId([
            'sku' => 'PRD-EDIT-001',
            'quantity' => 5,
            'weight' => 1,
            'price' => 150000,
            'is_coupon' => 0,
            'is_stock' => 1,
            'status' => 1,
            'order' => 1,
            'hit_viewer' => 0,
            'hit_order' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('product_translations')->insert([
            'product_id' => $productId,
            'locale' => 'vi',
            'name' => 'Sản phẩm có nút sửa',
            'description' => null,
            'content' => null,
            'seo_title' => null,
            'seo_keyword' => null,
            'seo_description' => null,
            'order' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        app()->setLocale('ja');

        $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->get(route('category.edit', $categoryId))
            ->assertInertia(fn (Assert $page) => $page
                ->where('item.type', 'news')
                ->where('item.posts_count', 1)
                ->has('item.posts', 1, fn (Assert $posts) => $posts
                    ->where('id', $postId)
                    ->where('name', 'ニュース記事')
                    ->where('order', 3)
                    ->where('status', 1)
                    ->etc()
                )
            );

        app()->setLocale('vi');

        $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->get(route('post.create', ['category_id' => $categoryId]))
            ->assertInertia(fn (Assert $page) => $page
                ->where('item.category_id', $categoryId)
                ->etc()
            );

        $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->get(route('product.edit', $productId))
            ->assertInertia(fn (Assert $page) => $page
                ->where('item.id', $productId)
                ->etc()
            );
    }
}
