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

class ProductAiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_suggests_product_content_via_ai(): void
    {
        $account = Account::forceCreate(['name' => 'Demo Account']);
        $user = User::factory()->create([
            'account_id' => $account->id,
        ]);

        Ai::fakeAgent(AnonymousAgent::class, [
            '<h2>Mô tả sản phẩm</h2><p>Nội dung được AI đề xuất.</p>',
        ]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->post(route('product.ai.suggest-content'), [
                'locale' => 'vi',
                'name' => 'Sản phẩm demo',
                'description' => 'Tóm tắt sản phẩm',
                'seo_keyword' => 'san pham demo',
                'current_content' => '',
            ]);

        $response->assertOk();
        $response->assertJsonPath('content', '<h2>Mô tả sản phẩm</h2><p>Nội dung được AI đề xuất.</p>');
    }

    #[Test]
    public function it_suggests_product_seo_via_ai(): void
    {
        $account = Account::forceCreate(['name' => 'Demo Account']);
        $user = User::factory()->create([
            'account_id' => $account->id,
        ]);

        Ai::fakeAgent(AnonymousAgent::class, [
            "SEO_TITLE: Sản phẩm demo chuẩn SEO\nSEO_DESCRIPTION: Mô tả ngắn gọn, rõ ràng, tối ưu ý định tìm kiếm cho sản phẩm demo.",
        ]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->post(route('product.ai.suggest-seo'), [
                'locale' => 'vi',
                'name' => 'Sản phẩm demo',
                'description' => 'Tóm tắt sản phẩm',
                'seo_keyword' => 'san pham demo',
                'current_content' => '<p>Nội dung hiện tại</p>',
                'current_seo_title' => '',
                'current_seo_description' => '',
            ]);

        $response->assertOk();
        $response->assertJsonPath('seo_title', 'Sản phẩm demo chuẩn SEO');
        $response->assertJsonPath('seo_description', 'Mô tả ngắn gọn, rõ ràng, tối ưu ý định tìm kiếm cho sản phẩm demo.');
    }

    #[Test]
    public function it_analyzes_product_seo_via_ai(): void
    {
        $account = Account::forceCreate(['name' => 'Demo Account']);
        $user = User::factory()->create([
            'account_id' => $account->id,
        ]);

        Ai::fakeAgent(AnonymousAgent::class, [
            json_encode([
                'score' => 86,
                'summary' => 'SEO tổng thể tốt, cần bổ sung thêm lợi ích sản phẩm.',
                'recommendations' => [
                    'Thêm từ khóa chính vào đoạn mô tả đầu tiên.',
                ],
            ], JSON_UNESCAPED_UNICODE),
        ]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->post(route('product.ai.analyze-seo'), [
                'locale' => 'vi',
                'name' => 'Sản phẩm demo',
                'description' => 'Tóm tắt sản phẩm demo chuẩn SEO.',
                'content' => '<p>Sản phẩm demo có chất lượng tốt, phù hợp nhu cầu mua sắm.</p>',
                'seo_title' => 'Sản phẩm demo chuẩn SEO',
                'seo_keyword' => 'sản phẩm demo, chuẩn seo',
                'seo_description' => 'Sản phẩm demo chuẩn SEO với thông tin rõ ràng, dễ đọc và phù hợp ý định tìm kiếm.',
            ]);

        $response->assertOk();
        $response->assertJsonPath('score', 86);
        $response->assertJsonPath('summary', 'SEO tổng thể tốt, cần bổ sung thêm lợi ích sản phẩm.');
        $response->assertJsonCount(2, 'keyword_density');
        $response->assertJsonCount(5, 'checks');
        $response->assertJsonPath('checks.0.label', 'Độ dài tiêu đề SEO');
        $response->assertJsonPath('recommendations.0', 'Thêm từ khóa chính vào đoạn mô tả đầu tiên.');
    }

    #[Test]
    public function it_returns_product_ai_validation_message_in_request_locale(): void
    {
        $account = Account::forceCreate(['name' => 'Demo Account']);
        $user = User::factory()->create([
            'account_id' => $account->id,
        ]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->postJson(route('product.ai.suggest-content'), [
                'locale' => 'en',
                'name' => '',
                'description' => '',
                'seo_keyword' => '',
                'current_content' => '',
            ]);

        $response->assertUnprocessable();
        $response->assertJsonPath(
            'message',
            'Please enter at least name, description, or keywords before generating.'
        );
    }
}
