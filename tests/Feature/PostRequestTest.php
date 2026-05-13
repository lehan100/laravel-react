<?php

namespace Tests\Feature;

use App\Http\Requests\Catalog\PostRequest;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PostRequestTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'database.default' => 'sqlite',
            'database.connections.sqlite.database' => ':memory:',
        ]);

        DB::purge('sqlite');

        Schema::connection('sqlite')->dropIfExists('categories');
        Schema::connection('sqlite')->create('categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('status')->default(0);
            $table->unsignedInteger('order')->default(0);
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('type', 20)->default('product');
            $table->string('photo')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    #[Test]
    public function it_accepts_news_and_blog_categories_for_posts(): void
    {
        $newsCategoryId = DB::connection('sqlite')->table('categories')->insertGetId([
            'status' => 1,
            'order' => 1,
            'type' => 'news',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $blogCategoryId = DB::connection('sqlite')->table('categories')->insertGetId([
            'status' => 1,
            'order' => 2,
            'type' => 'blog',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $newsValidator = Validator::make(
            $this->basePayload(['category_id' => $newsCategoryId]),
            (new PostRequest)->rules()
        );
        $blogValidator = Validator::make(
            $this->basePayload(['category_id' => $blogCategoryId]),
            (new PostRequest)->rules()
        );

        $this->assertTrue($newsValidator->passes(), $newsValidator->errors()->first() ?? 'News category should be valid.');
        $this->assertTrue($blogValidator->passes(), $blogValidator->errors()->first() ?? 'Blog category should be valid.');
    }

    #[Test]
    public function it_rejects_non_post_categories_for_posts(): void
    {
        $productCategoryId = DB::connection('sqlite')->table('categories')->insertGetId([
            'status' => 1,
            'order' => 1,
            'type' => 'product',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $validator = Validator::make(
            $this->basePayload(['category_id' => $productCategoryId]),
            (new PostRequest)->rules()
        );

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('category_id', $validator->errors()->messages());
    }

    #[Test]
    public function it_uses_the_post_name_translation_for_required_name_errors(): void
    {
        app()->setLocale('vi');

        $categoryId = DB::connection('sqlite')->table('categories')->insertGetId([
            'status' => 1,
            'order' => 1,
            'type' => 'news',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $validator = Validator::make(
            $this->basePayload([
                'category_id' => $categoryId,
                'translations' => [
                    'vi' => [
                        'name' => '',
                        'slug' => 'tin-tuc',
                        'description' => 'Mo ta',
                        'content' => '<p>Noi dung</p>',
                        'seo_title' => 'Tin tuc',
                        'seo_keyword' => 'tin tuc',
                        'seo_description' => 'Mo ta seo',
                    ],
                ],
            ]),
            (new PostRequest)->rules(),
            [],
            (new PostRequest)->attributes()
        );

        $this->assertFalse($validator->passes());
        $this->assertSame(
            'Trường tên bài viết không được bỏ trống.',
            $validator->errors()->first('translations.vi.name')
        );
    }

    #[Test]
    public function it_uses_the_post_type_translation_for_required_type_errors(): void
    {
        app()->setLocale('vi');

        $validator = Validator::make(
            $this->basePayload(['type' => '']),
            (new PostRequest)->rules(),
            [],
            (new PostRequest)->attributes()
        );

        $this->assertFalse($validator->passes());
        $this->assertSame(
            'Trường loại bài viết không được bỏ trống.',
            $validator->errors()->first('type')
        );
    }

    private function basePayload(array $overrides = []): array
    {
        return array_merge([
            'category_id' => 1,
            'photo' => 'post.webp',
            'type' => 'primary',
            'status' => 1,
            'order' => 0,
            'hit_viewer' => 0,
            'undo' => 0,
            'translations' => [
                'vi' => [
                    'name' => 'Tin tuc',
                    'slug' => 'tin-tuc',
                    'description' => 'Mo ta',
                    'content' => '<p>Noi dung</p>',
                    'seo_title' => 'Tin tuc',
                    'seo_keyword' => 'tin tuc',
                    'seo_description' => 'Mo ta seo',
                ],
            ],
        ], $overrides);
    }
}
