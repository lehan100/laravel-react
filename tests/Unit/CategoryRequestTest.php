<?php

namespace Tests\Unit;

use App\Http\Requests\Catalog\CategoryRequest;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CategoryRequestTest extends TestCase
{
    #[Test]
    public function it_uses_the_category_name_translation_for_required_name_errors(): void
    {
        app()->setLocale('vi');

        $request = new CategoryRequest;
        $validator = Validator::make(
            [
                'status' => 1,
                'type' => 'news',
                'page_id' => '',
                'photo' => '',
                'undo' => 0,
                'translations' => [
                    'vi' => [
                        'name' => '',
                        'slug' => 'danh-muc-tin-tuc',
                        'content' => 'Nội dung',
                        'description' => 'Mô tả',
                        'seo_title' => 'SEO title',
                        'seo_keyword' => 'seo keyword',
                        'seo_description' => 'SEO description',
                    ],
                ],
            ],
            $request->rules(),
            [],
            $request->attributes()
        );

        $this->assertFalse($validator->passes());
        $this->assertSame(
            'Trường tên danh mục không được bỏ trống.',
            $validator->errors()->first('translations.vi.name')
        );
    }
}
