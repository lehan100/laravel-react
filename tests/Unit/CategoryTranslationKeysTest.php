<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CategoryTranslationKeysTest extends TestCase
{
    #[Test]
    public function it_resolves_category_product_labels_and_empty_message_in_supported_locales(): void
    {
        $cases = [
            'vi' => [
                'hancms.catalog.category.products' => 'Sản phẩm của danh mục',
                'hancms.catalog.category.products_hint' => 'Chọn các sản phẩm thuộc danh mục này.',
                'hancms.catalog.category.fields.name' => 'Tên danh mục',
                'hancms.catalog.category.news_add' => 'Thêm tin tức',
                'hancms.catalog.category.news_hint' => 'Các bài viết thuộc danh mục này.',
                'hancms.catalog.category.ai.translate_button' => 'AI dịch tự động',
                'hancms.catalog.category.ai.suggest_seo' => 'AI gợi ý SEO',
                'hancms.catalog.category.ai.generating' => 'Đang tạo...',
                'hancms.catalog.category.quick_page_slug_lock' => 'KHÓA',
                'hancms.catalog.category.quick_page_slug_edit' => 'SỬA',
                'hancms.catalog.category.quick_page_saving' => 'Đang tạo...',
                'hancms.message.empty' => 'Không có dữ liệu.',
            ],
            'en' => [
                'hancms.catalog.category.products' => 'Category Products',
                'hancms.catalog.category.products_hint' => 'Select the products that belong to this category.',
                'hancms.catalog.category.fields.name' => 'Category name',
                'hancms.catalog.category.news_add' => 'Add news',
                'hancms.catalog.category.news_hint' => 'Posts that belong to this category.',
                'hancms.catalog.category.ai.translate_button' => 'AI auto-translate',
                'hancms.catalog.category.ai.suggest_seo' => 'AI Suggest SEO',
                'hancms.catalog.category.ai.generating' => 'Generating...',
                'hancms.catalog.category.quick_page_slug_lock' => 'LOCK',
                'hancms.catalog.category.quick_page_slug_edit' => 'EDIT',
                'hancms.catalog.category.quick_page_saving' => 'Creating...',
                'hancms.message.empty' => 'No data.',
            ],
            'ja' => [
                'hancms.catalog.category.products' => 'カテゴリーの商品',
                'hancms.catalog.category.products_hint' => 'このカテゴリーに属する商品を選択してください。',
                'hancms.catalog.category.fields.name' => 'カテゴリー名',
                'hancms.catalog.category.news_add' => 'ニュースを追加',
                'hancms.catalog.category.news_hint' => 'このカテゴリーに属する記事です。',
                'hancms.catalog.category.ai.translate_button' => 'AI自動翻訳',
                'hancms.catalog.category.ai.suggest_seo' => 'AIでSEO提案',
                'hancms.catalog.category.ai.generating' => '生成中...',
                'hancms.catalog.category.quick_page_slug_lock' => 'ロック',
                'hancms.catalog.category.quick_page_slug_edit' => '編集',
                'hancms.catalog.category.quick_page_saving' => '作成中...',
                'hancms.message.empty' => 'データがありません。',
            ],
        ];

        foreach ($cases as $locale => $expectedTranslations) {
            app()->setLocale($locale);

            foreach ($expectedTranslations as $key => $expectedValue) {
                $this->assertSame($expectedValue, trans($key));
            }
        }
    }
}
