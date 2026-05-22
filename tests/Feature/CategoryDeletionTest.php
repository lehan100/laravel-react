<?php

namespace Tests\Feature;

use App\Models\Catalog\Category;
use App\Models\Catalog\Post;
use App\Models\Catalog\Product;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CategoryDeletionTest extends TestCase
{
    use DatabaseMigrations;

    public function test_soft_delete_category_recursively_soft_deletes_children_and_posts(): void
    {
        // 1. Create a parent category
        $parent = Category::create([
            'status' => 1,
            'parent_id' => null,
            'order' => 1,
        ]);

        // 2. Create a child category
        $child = Category::create([
            'status' => 1,
            'parent_id' => $parent->id,
            'order' => 2,
        ]);

        // 3. Create a grandchild category
        $grandchild = Category::create([
            'status' => 1,
            'parent_id' => $child->id,
            'order' => 3,
        ]);

        // 4. Create a post related to parent
        $post = Post::create([
            'category_id' => $parent->id,
            'status' => 1,
            'order' => 1,
        ]);

        // 5. Create a product related to parent
        $product = Product::create([
            'sku' => 'PROD-1',
            'price' => 100,
            'status' => 1,
        ]);
        $parent->products()->attach($product->id);

        // Delete parent category
        $parent->delete();

        // Assert parent is soft deleted
        $this->assertSoftDeleted('categories', ['id' => $parent->id]);

        // Assert child is soft deleted recursively
        $this->assertSoftDeleted('categories', ['id' => $child->id]);

        // Assert grandchild is soft deleted recursively
        $this->assertSoftDeleted('categories', ['id' => $grandchild->id]);

        // Assert post is soft deleted
        $this->assertSoftDeleted('posts', ['id' => $post->id]);

        // Assert product is NOT deleted
        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }

    public function test_force_delete_category_recursively_force_deletes_children_and_posts_and_detaches_products(): void
    {
        // 1. Create parent category
        $parent = Category::create([
            'status' => 1,
            'parent_id' => null,
            'order' => 1,
        ]);

        // 2. Create child category
        $child = Category::create([
            'status' => 1,
            'parent_id' => $parent->id,
            'order' => 2,
        ]);

        // 3. Create related post
        $post = Post::create([
            'category_id' => $parent->id,
            'status' => 1,
            'order' => 1,
        ]);

        // 4. Create related product
        $product = Product::create([
            'sku' => 'PROD-2',
            'price' => 200,
            'status' => 1,
        ]);
        $parent->products()->attach($product->id);

        // Force delete parent category
        $parent->forceDelete();

        // Assert parent is permanently deleted
        $this->assertDatabaseMissing('categories', ['id' => $parent->id]);

        // Assert child is permanently deleted recursively
        $this->assertDatabaseMissing('categories', ['id' => $child->id]);

        // Assert post is permanently deleted
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);

        // Assert pivot record is deleted
        $this->assertDatabaseMissing('category_product', [
            'category_id' => $parent->id,
            'product_id' => $product->id,
        ]);

        // Assert product itself is NOT deleted
        $this->assertDatabaseHas('products', ['id' => $product->id]);
    }
}
