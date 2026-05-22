<?php

namespace Tests\Feature;

use App\Services\Ai\PostDraftStorage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Ai\Ai;
use Laravel\Ai\AnonymousAgent;
use Laravel\Ai\Prompts\AgentPrompt;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AiPostAssistantTest extends TestCase
{
    private string $aiDatabasePath;

    protected function setUp(): void
    {
        parent::setUp();

        $this->aiDatabasePath = storage_path('framework/testing/ai-post-assistant.sqlite');
        File::ensureDirectoryExists(dirname($this->aiDatabasePath));
        File::delete($this->aiDatabasePath);

        config([
            'database.connections.ai_posts.database' => $this->aiDatabasePath,
        ]);

        DB::purge('ai_posts');
    }

    protected function tearDown(): void
    {
        File::delete($this->aiDatabasePath);
        DB::purge('ai_posts');

        parent::tearDown();
    }

    #[Test]
    public function it_generates_reviewable_draft_batches_and_persists_them_in_the_ai_sqlite_store(): void
    {
        Ai::fakeAgent(AnonymousAgent::class, [
            json_encode([
                [
                    'title' => 'Kinh nghiệm chọn lò nướng pizza cho gia đình',
                    'description' => 'Gợi ý chọn lò nướng phù hợp cho nhu cầu gia đình và kinh doanh nhỏ.',
                    'content' => '<h2>Giới thiệu</h2><p>Nội dung bài viết chi tiết.</p>',
                ],
                [
                    'title' => 'Các loại lò nướng pizza phổ biến',
                    'description' => 'Tổng quan các lựa chọn lò nướng trên thị trường hiện nay.',
                    'content' => '<h2>Phân loại lò nướng</h2><p>Nội dung bài viết chi tiết.</p>',
                ],
            ], JSON_UNESCAPED_UNICODE),
        ]);

        $response = $this->withoutMiddleware()->postJson(route('ai.post-assistant.generate'), [
            'topic' => 'lò nướng bánh pizza',
            'quantity' => 2,
        ]);

        $response->assertOk();
        $response->assertJsonCount(2, 'items');
        $response->assertJsonPath('items.0.description', 'Gợi ý chọn lò nướng phù hợp cho nhu cầu gia đình và kinh doanh nhỏ.');

        $token = (string) $response->json('batch_token');
        $this->assertNotSame('', $token);

        $storedBatch = DB::connection('ai_posts')
            ->table('ai_post_batches')
            ->where('token', $token)
            ->first();

        $this->assertNotNull($storedBatch);

        $storedPayload = json_decode((string) $storedBatch->payload, true);
        $this->assertSame('Kinh nghiệm chọn lò nướng pizza cho gia đình', $storedPayload['items'][0]['title']);
        $this->assertSame('', $storedPayload['items'][0]['photo']);

        AnonymousAgent::assertPrompted(function (AgentPrompt $prompt): bool {
            return $prompt->contains('Create 2 unique article drafts for the topic')
                && $prompt->contains('Description: a 2-3 sentence summary')
                && $prompt->contains('roughly 700-1000 words')
                && $prompt->contains('clean HTML only');
        });
    }

    #[Test]
    public function it_persists_review_edits_when_scheduling_batches(): void
    {
        Ai::fakeAgent(AnonymousAgent::class, [
            json_encode([
                [
                    'title' => 'Bài viết số 1',
                    'description' => 'Mô tả ban đầu.',
                    'content' => '<p>Nội dung ban đầu.</p>',
                ],
            ], JSON_UNESCAPED_UNICODE),
        ]);

        $generated = $this->withoutMiddleware()->postJson(route('ai.post-assistant.generate'), [
            'topic' => 'chủ đề demo',
            'quantity' => 1,
        ]);

        $token = (string) $generated->json('batch_token');
        $draft = $generated->json('items.0');

        $response = $this->withoutMiddleware()->postJson(route('ai.post-assistant.schedule'), [
            'batch_token' => $token,
            'items' => [
                [
                    'draft_id' => $draft['draft_id'],
                    'title' => 'Bài viết đã chỉnh sửa',
                    'description' => 'Mô tả đã chỉnh sửa.',
                    'content' => '<h2>Đã chỉnh sửa</h2><p>Nội dung sau review.</p>',
                    'photo' => 'featured-image.webp',
                    'published_at' => '2026-05-22T10:30',
                ],
            ],
        ]);

        $response->assertOk();
        $response->assertJsonPath('items.0.title', 'Bài viết đã chỉnh sửa');
        $response->assertJsonPath('items.0.photo', 'featured-image.webp');

        $storedBatch = DB::connection('ai_posts')
            ->table('ai_post_batches')
            ->where('token', $token)
            ->first();

        $storedPayload = json_decode((string) $storedBatch->payload, true);
        $this->assertSame('Bài viết đã chỉnh sửa', $storedPayload['items'][0]['title']);
        $this->assertSame('Mô tả đã chỉnh sửa.', $storedPayload['items'][0]['description']);
        $this->assertSame('featured-image.webp', $storedPayload['items'][0]['photo']);
        $this->assertSame('2026-05-22T10:30', $storedPayload['items'][0]['published_at']);
    }

    #[Test]
    public function it_redirects_with_a_success_flash_when_scheduling_from_a_web_request(): void
    {
        Ai::fakeAgent(AnonymousAgent::class, [
            json_encode([
                [
                    'title' => 'Bài viết số 1',
                    'description' => 'Mô tả ban đầu.',
                    'content' => '<p>Nội dung ban đầu.</p>',
                ],
            ], JSON_UNESCAPED_UNICODE),
        ]);

        $generated = $this->withoutMiddleware()->postJson(route('ai.post-assistant.generate'), [
            'topic' => 'chủ đề demo',
            'quantity' => 1,
        ]);

        $token = (string) $generated->json('batch_token');
        $draft = $generated->json('items.0');

        $response = $this->withoutMiddleware()->post(route('ai.post-assistant.schedule'), [
            'batch_token' => $token,
            'items' => [
                [
                    'draft_id' => $draft['draft_id'],
                    'title' => 'Bài viết đã chỉnh sửa',
                    'description' => 'Mô tả đã chỉnh sửa.',
                    'content' => '<h2>Đã chỉnh sửa</h2><p>Nội dung sau review.</p>',
                    'photo' => 'featured-image.webp',
                    'published_at' => '2026-05-22T10:30',
                ],
            ],
        ]);

        $response->assertRedirect(route('ai.post-assistant.edit', $token));
        $response->assertSessionHas('success', __('hancms.ai_assistant.post_assistant.scheduled'));
    }

    #[Test]
    public function it_renders_the_index_create_and_edit_pages(): void
    {
        $this->withoutMiddleware()->get(route('ai.post-assistant.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Ai/PostAssistant/Index')
            );

        $this->withoutMiddleware()->get(route('ai.post-assistant.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Ai/PostAssistant/Created')
            );

        $storage = app(PostDraftStorage::class);
        $token = $storage->store([
            'token' => '',
            'topic' => 'Chủ đề kiểm thử',
            'locale' => 'vi',
            'category_id' => null,
            'created_at' => now()->toDateTimeString(),
            'items' => [
                [
                    'draft_id' => 'draft-1',
                    'title' => 'Bản nháp kiểm thử',
                    'description' => 'Mô tả kiểm thử.',
                    'content' => '<p>Nội dung kiểm thử.</p>',
                    'photo' => '',
                    'photo_url' => '',
                    'translations' => [
                        'vi' => [
                            'title' => 'Bản nháp kiểm thử',
                            'description' => 'Mô tả kiểm thử.',
                            'content' => '<p>Nội dung kiểm thử.</p>',
                            'photo' => '',
                            'photo_url' => '',
                        ],
                    ],
                    'published_at' => now()->addHour()->format('Y-m-d\TH:i'),
                ],
            ],
        ]);

        $this->withoutMiddleware()->get(route('ai.post-assistant.edit', $token))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Ai/PostAssistant/Edit')
                ->where('batch.token', $token)
                ->where('batch.items.0.title', 'Bản nháp kiểm thử')
            );
    }

    #[Test]
    public function it_deletes_a_saved_batch_from_the_ai_sqlite_store(): void
    {
        $storage = app(PostDraftStorage::class);
        $token = $storage->store([
            'token' => '',
            'topic' => 'Batch cần xóa',
            'locale' => 'vi',
            'category_id' => null,
            'created_at' => now()->toDateTimeString(),
            'items' => [
                [
                    'draft_id' => 'draft-1',
                    'title' => 'Bản nháp sẽ bị xóa',
                    'description' => 'Mô tả',
                    'content' => '<p>Nội dung</p>',
                    'photo' => '',
                    'photo_url' => '',
                    'translations' => [],
                    'published_at' => now()->addHour()->format('Y-m-d\TH:i'),
                ],
            ],
        ]);

        $response = $this->withoutMiddleware()->delete(route('ai.post-assistant.destroy', $token));

        $response->assertRedirect(route('ai.post-assistant.index'));
        $this->assertNull($storage->get($token));
        $this->assertDatabaseMissing('ai_post_batches', [
            'token' => $token,
        ], 'ai_posts');
    }
}
