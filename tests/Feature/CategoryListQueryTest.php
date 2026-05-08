<?php

namespace Tests\Feature;

use App\Http\Resources\Catalog\CategoryCollection;
use App\Repositories\Category\CategoryEloquentRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CategoryListQueryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        app()->setLocale('vi');
        config(['translatable.locales' => ['vi', 'en', 'ja']]);
    }

    #[Test]
    public function it_does_not_lazy_load_category_slugs_when_serializing_the_admin_list(): void
    {
        $now = now();

        $categoryOneId = DB::table('categories')->insertGetId([
            'status' => 1,
            'order' => 1,
            'parent_id' => null,
            'type' => 'product',
            'photo' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $categoryTwoId = DB::table('categories')->insertGetId([
            'status' => 1,
            'order' => 2,
            'parent_id' => $categoryOneId,
            'type' => 'product',
            'photo' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('category_translations')->insert([
            [
                'category_id' => $categoryOneId,
                'locale' => 'vi',
                'name' => 'Danh mục 1',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'category_id' => $categoryTwoId,
                'locale' => 'vi',
                'name' => 'Danh mục 2',
                'description' => null,
                'content' => null,
                'seo_title' => null,
                'seo_keyword' => null,
                'seo_description' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('slugs')->insert([
            [
                'slug' => 'danh-muc-1',
                'locale' => 'vi',
                'sluggable_id' => $categoryOneId,
                'sluggable_type' => 'App\\Models\\Catalog\\Category',
                'redirect_to' => null,
                'status' => 1,
                'is_default' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'slug' => 'danh-muc-2',
                'locale' => 'vi',
                'sluggable_id' => $categoryTwoId,
                'sluggable_type' => 'App\\Models\\Catalog\\Category',
                'redirect_to' => null,
                'status' => 1,
                'is_default' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::flushQueryLog();
        DB::enableQueryLog();

        /** @var CategoryEloquentRepository $repository */
        $repository = app(CategoryEloquentRepository::class);
        $categories = $repository->lists(null, ['task' => 'admin-list-items']);

        (new CategoryCollection($categories))->toArray(request());

        $queryCount = count(DB::getQueryLog());

        $this->assertSame(3, $queryCount);
    }
}
