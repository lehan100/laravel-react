<?php

namespace Tests\Feature;

use App\Models\Catalog\Category;
use App\Models\Slug;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class CategorySlugTest extends TestCase
{
    use DatabaseMigrations; // Tự động làm sạch DB sau mỗi lần test

    /** @test */
    public function it_can_create_category_with_japanese_slug()
    {
        // 1. Dữ liệu giả lập từ Admin Form
        $params = [
            'status' => 1,
            'parent_id' => null,
            'order'  => 1,
            'translations' => [
                'ja' => [
                    'name' => 'フライパン',
                    'slug' => 'フライパン-tokyo'
                ],
                'vi' => [
                    'name' => 'Chảo chống dính',
                    'slug' => 'chao-chong-dinh'
                ]
            ]
        ];

        // 2. Gọi trực tiếp Repository thay vì gọi qua Route
        $repo = app(\App\Repositories\Category\CategoryEloquentRepository::class);

        // Giả lập task 'add-item' để chạy qua luồng khởi tạo
        $repo->save($params, ['task' => 'add-item']);
        //dd(\App\Models\Catalog\Category::all()->toArray());
        // 3. Kiểm tra Slug tiếng Nhật trong Database
        $this->assertDatabaseHas('slugs', [
            'slug'        => 'フライパン-tokyo',
            'locale'      => 'ja',
            'is_default'  => 1, // SQLite dùng 1 thay cho true
            'redirect_to' => null
        ]);
    }


    /** @test */
    /** @test */
    public function it_handles_slug_history_and_redirect_when_updated()
    {
        // 1. Khởi tạo dữ liệu mẫu sạch
        $category = \App\Models\Catalog\Category::create([
            'status' => 1,
            'order' => 1,
            'parent_id' => null
        ]);

        // Tạo slug mặc định ban đầu gắn với ID của Category trên
        $category->slugs()->create([
            'slug' => 'old-slug',
            'locale' => 'vi',
            'is_default' => 1,
            'sluggable_type' => get_class($category)
        ]);
        
        // 2. Dữ liệu giả lập từ form gửi về để UPDATE
        $params = [
            'id' => $category->id,
            'status' => 1,
            'parent_id' => null,
            'order'  => 1,
            'translations' => [
                'vi' => [
                    'name' => 'Tên Mới',
                    'slug' => 'new-slug' 
                ]
            ]
        ];

        // 3. Chạy trực tiếp qua Repository
        $repo = app(\App\Repositories\Category\CategoryEloquentRepository::class);
        $repo->save($params, ['task' => 'edit-item']);
        // 4. Kiểm tra logic redirect trong Database
        // Slug cũ phải bị hạ cấp và trỏ về slug mới
        $this->assertDatabaseHas('slugs', [
            'slug' => 'old-slug',
            'is_default' => 0,
            'redirect_to' => 'new-slug'
        ]);

        // Slug mới phải được tạo và là mặc định
        $this->assertDatabaseHas('slugs', [
            'slug' => 'new-slug',
            'is_default' => 1,
            'redirect_to' => null
        ]);
    }
}
