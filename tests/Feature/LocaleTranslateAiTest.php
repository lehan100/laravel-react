<?php

namespace Tests\Feature;

use App\Http\Middleware\PermissionMiddleware;
use App\Models\Account;
use App\Models\Users\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Ai\Ai;
use Laravel\Ai\AnonymousAgent;
use Laravel\Ai\StructuredAnonymousAgent;
use PHPUnit\Framework\Attributes\Test;
use RuntimeException;
use Tests\TestCase;

class LocaleTranslateAiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_translates_multi_field_content_for_catalog_modules(): void
    {
        $account = Account::forceCreate(['name' => 'Demo Account']);
        $user = User::factory()->create([
            'account_id' => $account->id,
        ]);

        Ai::fakeAgent(StructuredAnonymousAgent::class, [
            [
                'translations' => [
                    'en' => [
                        'name' => 'Hello world',
                        'description' => 'English summary',
                        'content' => '<h2>Hello</h2><p>English content</p>',
                        'seo_title' => 'Hello world | HanCMS',
                        'seo_keyword' => 'hello world',
                        'seo_description' => 'English SEO description',
                    ],
                    'ja' => [
                        'name' => 'こんにちは世界',
                        'description' => '日本語の概要',
                        'content' => '<h2>こんにちは</h2><p>日本語の本文</p>',
                        'seo_title' => 'こんにちは世界 | HanCMS',
                        'seo_keyword' => 'こんにちは世界',
                        'seo_description' => '日本語のSEO説明',
                    ],
                ],
            ],
        ]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->post(route('ai.translate'), [
                'module' => 'product',
                'source_locale' => 'vi',
                'target_locales' => ['en', 'ja'],
                'fields' => [
                    'name' => 'Xin chào thế giới',
                    'description' => 'Tóm tắt tiếng Việt',
                    'content' => '<h2>Xin chào</h2><p>Nội dung tiếng Việt</p>',
                    'seo_title' => 'Xin chào thế giới | HanCMS',
                    'seo_keyword' => 'xin chao the gioi',
                    'seo_description' => 'Mô tả SEO tiếng Việt',
                ],
            ]);

        $response->assertOk();
        $response->assertJsonPath('translations.en.name', 'Hello world');
        $response->assertJsonPath('translations.en.content', '<h2>Hello</h2><p>English content</p>');
        $response->assertJsonPath('translations.ja.seo_description', '日本語のSEO説明');
        $response->assertJsonMissingPath('translations.vi');
    }

    #[Test]
    public function it_translates_attribute_names_for_other_locales(): void
    {
        $account = Account::forceCreate(['name' => 'Demo Account']);
        $user = User::factory()->create([
            'account_id' => $account->id,
        ]);

        Ai::fakeAgent(StructuredAnonymousAgent::class, [
            [
                'translations' => [
                    'en' => [
                        'name' => 'Color',
                    ],
                    'ja' => [
                        'name' => 'カラー',
                    ],
                ],
            ],
        ]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->post(route('ai.translate'), [
                'module' => 'attribute',
                'source_locale' => 'vi',
                'target_locales' => ['en', 'ja'],
                'fields' => [
                    'name' => 'Màu sắc',
                ],
            ]);

        $response->assertOk();
        $response->assertJsonPath('translations.en.name', 'Color');
        $response->assertJsonPath('translations.ja.name', 'カラー');
        $response->assertJsonMissingPath('translations.vi');
    }

    #[Test]
    public function it_keeps_the_original_target_locale_codes_in_the_response(): void
    {
        $account = Account::forceCreate(['name' => 'Demo Account']);
        $user = User::factory()->create([
            'account_id' => $account->id,
        ]);

        Ai::fakeAgent(StructuredAnonymousAgent::class, [
            [
                'translations' => [
                    'vn' => [
                        'name' => 'Sản phẩm mẫu',
                        'description' => 'Mô tả tiếng Việt',
                    ],
                ],
            ],
        ]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->post(route('ai.translate'), [
                'module' => 'product',
                'source_locale' => 'en',
                'target_locales' => ['vn'],
                'fields' => [
                    'name' => 'Sample product',
                    'description' => 'English description',
                ],
            ]);

        $response->assertOk();
        $response->assertJsonPath('translations.vn.name', 'Sản phẩm mẫu');
        $response->assertJsonMissingPath('translations.vi');
    }

    #[Test]
    public function it_maps_normalized_locale_keys_back_to_the_original_target_locale_code(): void
    {
        $account = Account::forceCreate(['name' => 'Demo Account']);
        $user = User::factory()->create([
            'account_id' => $account->id,
        ]);

        Ai::fakeAgent(StructuredAnonymousAgent::class, [
            [
                'translations' => [
                    'vi' => [
                        'title' => 'Trang mẫu',
                    ],
                ],
            ],
        ]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->post(route('ai.translate'), [
                'module' => 'page',
                'source_locale' => 'en',
                'target_locales' => ['vn'],
                'fields' => [
                    'title' => 'Sample page',
                ],
            ]);

        $response->assertOk();
        $response->assertJsonPath('translations.vn.title', 'Trang mẫu');
    }

    #[Test]
    public function it_falls_back_to_json_text_when_structured_translation_fails(): void
    {
        $account = Account::forceCreate(['name' => 'Demo Account']);
        $user = User::factory()->create([
            'account_id' => $account->id,
        ]);

        Ai::fakeAgent(StructuredAnonymousAgent::class, fn () => throw new RuntimeException('Gemini schema error'));

        Ai::fakeAgent(AnonymousAgent::class, [
            json_encode([
                'translations' => [
                    'en' => [
                        'name' => 'Hello world',
                    ],
                ],
            ], JSON_THROW_ON_ERROR),
        ]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->post(route('ai.translate'), [
                'module' => 'product',
                'source_locale' => 'vi',
                'target_locales' => ['en'],
                'fields' => [
                    'name' => 'Xin chào thế giới',
                ],
            ]);

        $response->assertOk();
        $response->assertJsonPath('translations.en.name', 'Hello world');
    }

    #[Test]
    public function it_translates_promotion_campaign_fields_into_other_locales(): void
    {
        $account = Account::forceCreate(['name' => 'Demo Account']);
        $user = User::factory()->create([
            'account_id' => $account->id,
        ]);

        Ai::fakeAgent(StructuredAnonymousAgent::class, [
            [
                'translations' => [
                    'en' => [
                        'name' => 'Summer sale',
                        'description' => 'Discounts for the summer season',
                    ],
                    'ja' => [
                        'name' => 'サマーセール',
                        'description' => '夏季限定の割引',
                    ],
                ],
            ],
        ]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->post(route('ai.translate'), [
                'module' => 'promotion-campaign',
                'source_locale' => 'vi',
                'target_locales' => ['en', 'ja'],
                'fields' => [
                    'name' => 'Khuyến mãi hè',
                    'description' => 'Giảm giá cho mùa hè',
                ],
            ]);

        $response->assertOk();
        $response->assertJsonPath('translations.en.name', 'Summer sale');
        $response->assertJsonPath('translations.ja.description', '夏季限定の割引');
        $response->assertJsonMissingPath('translations.vi');
    }
}
