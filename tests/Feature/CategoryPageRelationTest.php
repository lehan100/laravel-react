<?php

namespace Tests\Feature;

use App\Http\Middleware\PermissionMiddleware;
use App\Models\Account;
use App\Models\Catalog\Category;
use App\Models\FieldGroup;
use App\Models\Page;
use App\Models\Users\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryPageRelationTest extends TestCase
{
    use RefreshDatabase;

    public function test_category_create_shows_available_pages_and_saves_page_relation(): void
    {
        $fieldGroup = FieldGroup::create([
            'title' => 'Category Schema',
            'fields_schema' => [
                [
                    'key' => 'hero_title',
                    'label' => 'Hero title',
                    'type' => 'text',
                    'translatable' => true,
                    'required' => true,
                ],
            ],
            'status' => true,
        ]);

        $page = Page::create([
            'field_group_id' => $fieldGroup->id,
            'title' => 'Landing Page',
            'slug' => 'landing-page',
            'status' => true,
            'acf_data' => [],
        ]);

        $account = Account::forceCreate(['name' => 'Test Account']);
        $user = User::factory()->create(['account_id' => $account->id]);

        $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->get(route('category.create'))
            ->assertOk()
            ->assertSee('Category Schema');

        $payload = [
            'status' => 1,
            'type' => 'page',
            'page_id' => $page->id,
            'parent_id' => 0,
            'photo' => '',
            'undo' => 0,
            'translations' => [
                'vi' => [
                    'name' => 'Danh mục trang',
                    'slug' => 'danh-muc-trang',
                    'description' => 'Mô tả danh mục',
                    'content' => 'Nội dung danh mục',
                    'seo_title' => 'SEO title',
                    'seo_keyword' => 'seo keyword',
                    'seo_description' => 'SEO description',
                ],
            ],
        ];

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->post(route('category.store'), $payload);

        $category = Category::query()->firstOrFail();

        $response->assertRedirect(route('category.edit', $category->id));

        $this->assertDatabaseCount('categories', 1);
        $this->assertDatabaseHas('categories', [
            'page_id' => $page->id,
            'type' => 'page',
        ]);
    }
}
