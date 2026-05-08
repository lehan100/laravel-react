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
}
