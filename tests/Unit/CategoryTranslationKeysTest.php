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
                'hancms.catalog.category.news_add' => 'Thêm tin tức',
                'hancms.catalog.category.news_hint' => 'Các bài viết thuộc danh mục này.',
                'hancms.catalog.category.ai.suggest_seo' => 'AI gợi ý SEO',
                'hancms.catalog.category.ai.generating' => 'Đang tạo...',
                'hancms.message.empty' => 'Không có dữ liệu.',
            ],
            'en' => [
                'hancms.catalog.category.products' => 'Category Products',
                'hancms.catalog.category.products_hint' => 'Select the products that belong to this category.',
                'hancms.catalog.category.news_add' => 'Add news',
                'hancms.catalog.category.news_hint' => 'Posts that belong to this category.',
                'hancms.catalog.category.ai.suggest_seo' => 'AI Suggest SEO',
                'hancms.catalog.category.ai.generating' => 'Generating...',
                'hancms.message.empty' => 'No data.',
            ],
            'ja' => [
                'hancms.catalog.category.products' => 'カテゴリーの商品',
                'hancms.catalog.category.products_hint' => 'このカテゴリーに属する商品を選択してください。',
                'hancms.catalog.category.news_add' => 'ニュースを追加',
                'hancms.catalog.category.news_hint' => 'このカテゴリーに属する記事です。',
                'hancms.catalog.category.ai.suggest_seo' => 'AIでSEO提案',
                'hancms.catalog.category.ai.generating' => '生成中...',
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
