<?php

namespace Tests\Feature;

use App\Http\Middleware\PermissionMiddleware;
use App\Models\Account;
use App\Models\Users\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Ai\Ai;
use Laravel\Ai\AnonymousAgent;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PostAiTranslationTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_translates_post_fields_into_other_locales_via_ai(): void
    {
        $account = Account::forceCreate(['name' => 'Demo Account']);
        $user = User::factory()->create([
            'account_id' => $account->id,
        ]);

        Ai::fakeAgent(AnonymousAgent::class, [
            json_encode([
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
            ], JSON_THROW_ON_ERROR),
        ]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->post(route('post.ai.translate'), [
                'source_locale' => 'vi',
                'target_locales' => ['en', 'ja'],
                'name' => 'Xin chào thế giới',
                'description' => 'Tóm tắt tiếng Việt',
                'content' => '<h2>Xin chào</h2><p>Nội dung tiếng Việt</p>',
                'seo_title' => 'Xin chào thế giới | HanCMS',
                'seo_keyword' => 'xin chao the gioi',
                'seo_description' => 'Mô tả SEO tiếng Việt',
            ]);

        $response->assertOk();
        $response->assertJsonPath('translations.en.name', 'Hello world');
        $response->assertJsonMissingPath('translations.en.slug');
        $response->assertJsonPath('translations.ja.description', '日本語の概要');
        $response->assertJsonMissingPath('translations.vi');
    }

    #[Test]
    public function it_suggests_post_content_via_ai(): void
    {
        $account = Account::forceCreate(['name' => 'Demo Account']);
        $user = User::factory()->create([
            'account_id' => $account->id,
        ]);

        Ai::fakeAgent(AnonymousAgent::class, [
            '<h2>Bài viết tối ưu SEO</h2><p>Nội dung được AI đề xuất.</p>',
        ]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->post(route('post.ai.suggest-content'), [
                'locale' => 'vi',
                'name' => 'Bài viết SEO',
                'description' => 'Tóm tắt bài viết',
                'seo_keyword' => 'bai viet seo',
                'current_content' => '',
            ]);

        $response->assertOk();
        $response->assertJsonPath('content', '<h2>Bài viết tối ưu SEO</h2><p>Nội dung được AI đề xuất.</p>');
    }

    #[Test]
    public function it_suggests_post_seo_via_ai(): void
    {
        $account = Account::forceCreate(['name' => 'Demo Account']);
        $user = User::factory()->create([
            'account_id' => $account->id,
        ]);

        Ai::fakeAgent(AnonymousAgent::class, [
            "SEO_TITLE: Bài viết SEO chuẩn\nSEO_DESCRIPTION: Hướng dẫn viết bài tối ưu SEO rõ ràng, dễ đọc và đúng ý định tìm kiếm.",
        ]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->post(route('post.ai.suggest-seo'), [
                'locale' => 'vi',
                'name' => 'Bài viết SEO',
                'description' => 'Tóm tắt bài viết',
                'seo_keyword' => 'bai viet seo',
                'current_content' => '<p>Nội dung hiện tại</p>',
                'current_seo_title' => '',
                'current_seo_description' => '',
            ]);

        $response->assertOk();
        $response->assertJsonPath('seo_title', 'Bài viết SEO chuẩn');
        $response->assertJsonPath('seo_description', 'Hướng dẫn viết bài tối ưu SEO rõ ràng, dễ đọc và đúng ý định tìm kiếm.');
    }
}
