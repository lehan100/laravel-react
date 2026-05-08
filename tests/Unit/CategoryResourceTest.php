<?php

namespace Tests\Unit;

use App\Http\Resources\Catalog\CategoryResource;
use App\Models\Catalog\Category;
use App\Models\Catalog\CategoryTranslation;
use App\Models\Slug;
use Illuminate\Http\Request;
use Tests\TestCase;

class CategoryResourceTest extends TestCase
{
    public function test_category_resource_keeps_nested_photo_paths_intact(): void
    {
        app()->setLocale('vi');

        $category = new Category([
            'id' => 1,
            'parent_id' => null,
            'type' => 'product',
            'status' => 1,
            'order' => 0,
            'page_id' => null,
            'photo' => 'media/editor/categories/brand-logo.png',
        ]);

        $category->setRelation('translations', collect([
            new CategoryTranslation([
                'locale' => 'vi',
                'name' => 'Thương hiệu',
            ]),
        ]));

        $category->setRelation('slugs', collect([
            new Slug([
                'locale' => 'vi',
                'slug' => 'thuong-hieu',
                'redirect_to' => null,
                'is_default' => true,
            ]),
        ]));

        $payload = (new CategoryResource($category))->toArray(new Request);

        $this->assertSame('/media/editor/categories/brand-logo.png', $payload['photo_url']);
        $this->assertSame('Thương hiệu', $payload['translations']['vi']['name']);
        $this->assertSame('thuong-hieu', $payload['translations']['vi']['slug']);
    }

    public function test_category_resource_prefixes_filename_photos_with_config_path(): void
    {
        app()->setLocale('vi');

        $category = new Category([
            'id' => 2,
            'parent_id' => null,
            'type' => 'product',
            'status' => 1,
            'order' => 0,
            'page_id' => null,
            'photo' => 'brand-logo.png',
        ]);

        $category->setRelation('translations', collect());
        $category->setRelation('slugs', collect());

        $payload = (new CategoryResource($category))->toArray(new Request);

        $this->assertSame(url('/').'/media/category/brand-logo.png', $payload['photo_url']);
    }
}
