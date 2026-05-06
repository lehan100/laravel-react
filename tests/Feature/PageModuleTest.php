<?php

namespace Tests\Feature;

use App\Http\Middleware\PermissionMiddleware;
use App\Models\Account;
use App\Models\FieldGroup;
use App\Models\Page;
use App\Models\Settings\Language;
use App\Models\Users\User;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PageModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_page_index_can_render(): void
    {
        $response = $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->get(route('pages.index'));

        $response->assertOk();
    }

    public function test_page_form_languages_include_photos(): void
    {
        Language::create([
            'name' => 'Tiếng Việt',
            'code' => 'vi',
            'photo' => 'vn.png',
            'status' => 1,
        ]);

        FieldGroup::create([
            'title' => 'Landing Fields',
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

        $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->get(route('pages.create'))
            ->assertInertia(fn (Assert $page) => $page
                ->has('languages', 1, fn (Assert $languages) => $languages
                    ->where('code', 'vi')
                    ->where('photo', 'vn.png')
                    ->etc()
                )
            );
    }

    public function test_page_quick_store_returns_selectable_page_data(): void
    {
        $account = Account::forceCreate(['name' => 'Test Account']);
        $user = User::factory()->create(['account_id' => $account->id]);

        $fieldGroup = FieldGroup::create([
            'title' => 'Landing Fields',
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

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->post(route('pages.quick-store'), [
                'field_group_id' => $fieldGroup->id,
                'status' => 1,
                'translations' => [
                    'vi' => [
                        'title' => 'Trang Nhanh',
                        'slug' => 'trang-nhanh',
                    ],
                    'en' => [
                        'title' => 'Quick Page',
                        'slug' => 'quick-page',
                    ],
                    'ja' => [
                        'title' => 'クイックページ',
                        'slug' => 'quick-page-ja',
                    ],
                ],
            ]);

        $response->assertOk()
            ->assertJsonPath('page.label', 'Trang Nhanh')
            ->assertJsonPath('page.has_content', false);

        $page = Page::query()->firstOrFail();

        $this->assertDatabaseHas('page_translations', [
            'page_id' => $page->id,
            'locale' => 'vi',
            'title' => 'Trang Nhanh',
        ]);
        $this->assertDatabaseHas('slugs', [
            'sluggable_id' => $page->id,
            'sluggable_type' => Page::class,
            'locale' => 'vi',
            'slug' => 'trang-nhanh',
        ]);
        $this->assertDatabaseHas('page_translations', [
            'page_id' => $page->id,
            'locale' => 'en',
            'title' => 'Quick Page',
        ]);
        $this->assertDatabaseHas('page_translations', [
            'page_id' => $page->id,
            'locale' => 'ja',
            'title' => 'クイックページ',
        ]);
    }

    public function test_page_create_shows_page_counts_and_allows_used_field_groups(): void
    {
        $usedFieldGroup = FieldGroup::create([
            'title' => 'Used Schema',
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

        $availableFieldGroup = FieldGroup::create([
            'title' => 'Available Schema',
            'fields_schema' => [
                [
                    'key' => 'hero_banner',
                    'label' => 'Hero banner',
                    'type' => 'image',
                    'translatable' => true,
                    'required' => true,
                ],
            ],
            'status' => true,
        ]);

        Page::create([
            'field_group_id' => $usedFieldGroup->id,
            'title' => 'Used Page',
            'slug' => 'used-page',
            'status' => true,
            'acf_data' => [],
        ]);

        $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->get(route('pages.create'))
            ->assertInertia(fn (Assert $page) => $page
                ->has('fieldGroups', 2)
                ->where('fieldGroups.0.id', $usedFieldGroup->id)
                ->where('fieldGroups.0.pages_count', 1)
                ->where('fieldGroups.1.id', $availableFieldGroup->id)
                ->where('fieldGroups.1.pages_count', 0)
                ->etc()
            );

        $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->post(route('pages.store'), [
                'translations' => [
                    'vi' => [
                        'title' => 'Blocked Page',
                        'slug' => 'blocked-page',
                    ],
                ],
                'field_group_id' => $usedFieldGroup->id,
                'content' => [],
            ])
            ->assertRedirect(route('pages.index'));

        $this->assertDatabaseCount('pages', 2);
    }

    public function test_page_can_be_created_with_multilingual_content(): void
    {
        $fieldGroup = FieldGroup::create([
            'title' => 'Landing Fields',
            'fields_schema' => [
                [
                    'key' => 'hero_title',
                    'label' => 'Hero title',
                    'type' => 'text',
                    'translatable' => true,
                    'required' => true,
                ],
                [
                    'key' => 'hero_banner',
                    'label' => 'Hero banner',
                    'type' => 'image',
                    'translatable' => true,
                    'required' => true,
                ],
                [
                    'key' => 'featured_post',
                    'label' => 'Featured post',
                    'type' => 'relation_new',
                    'translatable' => true,
                    'required' => true,
                ],
                [
                    'key' => 'featured_products',
                    'label' => 'Featured products',
                    'type' => 'product',
                    'translatable' => true,
                    'required' => true,
                ],
            ],
            'status' => true,
        ]);

        $payload = [
            'field_group_id' => $fieldGroup->id,
            'translations' => [
                'vi' => [
                    'title' => 'Trang Chủ',
                    'slug' => 'trang-chu',
                ],
                'en' => [
                    'title' => 'Landing Page',
                    'slug' => 'landing-page',
                ],
            ],
            'content' => [
                'vi' => [
                    'hero_title' => 'Tiêu đề tiếng Việt',
                    'hero_banner' => '/storage/pages/banner-vi.jpg',
                    'featured_post' => [5, 7],
                    'featured_products' => [11, 12],
                ],
                'en' => [
                    'hero_title' => 'English title',
                    'hero_banner' => '/storage/pages/banner-en.jpg',
                    'featured_post' => [8, 9],
                    'featured_products' => [13, 14],
                ],
            ],
        ];

        $response = $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->post(route('pages.store'), $payload);

        $response->assertRedirect(route('pages.index'));

        $this->assertDatabaseCount('pages', 1);
        $this->assertDatabaseCount('field_groups', 1);

        $page = Page::query()->firstOrFail();

        $this->assertSame('Trang Chủ', $page->title);
        $this->assertSame('Tiêu đề tiếng Việt', $page->acf_data['vi']['hero_title']);
        $this->assertSame([5, 7], $page->acf_data['vi']['featured_post']);
        $this->assertSame([11, 12], $page->acf_data['vi']['featured_products']);
        $this->assertSame('/storage/pages/banner-en.jpg', $page->acf_data['en']['hero_banner']);
        $this->assertSame([8, 9], $page->acf_data['en']['featured_post']);
        $this->assertSame([13, 14], $page->acf_data['en']['featured_products']);
        $this->assertDatabaseHas('page_translations', [
            'page_id' => $page->id,
            'locale' => 'vi',
            'title' => 'Trang Chủ',
        ]);
        $this->assertDatabaseHas('page_translations', [
            'page_id' => $page->id,
            'locale' => 'en',
            'title' => 'Landing Page',
        ]);
        $this->assertDatabaseHas('slugs', [
            'sluggable_id' => $page->id,
            'sluggable_type' => Page::class,
            'locale' => 'vi',
            'slug' => 'trang-chu',
        ]);
        $this->assertDatabaseHas('slugs', [
            'sluggable_id' => $page->id,
            'sluggable_type' => Page::class,
            'locale' => 'en',
            'slug' => 'landing-page',
        ]);
    }

    public function test_page_slug_is_normalized_from_title(): void
    {
        $fieldGroup = FieldGroup::create([
            'title' => 'Landing Fields',
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

        $response = $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->post(route('pages.store'), [
                'field_group_id' => $fieldGroup->id,
                'translations' => [
                    'vi' => [
                        'title' => 'Nước hoa Chàm Đỏ 2026',
                    ],
                ],
                'content' => [
                    'vi' => [
                        'hero_title' => 'Hero title',
                    ],
                ],
            ]);

        $response->assertRedirect(route('pages.index'));

        $page = Page::query()->firstOrFail();

        $this->assertDatabaseHas('slugs', [
            'sluggable_id' => $page->id,
            'sluggable_type' => Page::class,
            'locale' => 'vi',
            'slug' => 'nuoc-hoa-cham-do-2026',
        ]);
    }

    public function test_page_appends_number_when_slug_exists(): void
    {
        $fieldGroup = FieldGroup::create([
            'title' => 'Landing Fields',
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

        $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->post(route('pages.store'), [
                'field_group_id' => $fieldGroup->id,
                'translations' => [
                    'vi' => [
                        'title' => 'Trang Chủ',
                        'slug' => 'trang-chu',
                    ],
                ],
                'content' => [
                    'vi' => [
                        'hero_title' => 'First title',
                    ],
                ],
            ])
            ->assertRedirect(route('pages.index'));

        $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->post(route('pages.store'), [
                'field_group_id' => $fieldGroup->id,
                'translations' => [
                    'vi' => [
                        'title' => 'Trang Mới',
                        'slug' => 'trang-chu',
                    ],
                ],
                'content' => [
                    'vi' => [
                        'hero_title' => 'Second title',
                    ],
                ],
            ])
            ->assertRedirect(route('pages.index'));

        $this->assertDatabaseCount('pages', 2);
        $this->assertDatabaseHas('slugs', [
            'slug' => 'trang-chu',
        ]);
        $this->assertDatabaseHas('slugs', [
            'slug' => 'trang-chu-1',
        ]);
    }

    public function test_page_can_be_updated_and_deleted(): void
    {
        $fieldGroup = FieldGroup::create([
            'title' => 'Landing Fields',
            'fields_schema' => [
                [
                    'key' => 'hero_title',
                    'label' => 'Hero title',
                    'type' => 'text',
                    'translatable' => true,
                    'required' => true,
                ],
                [
                    'key' => 'related_posts',
                    'label' => 'Related posts',
                    'type' => 'relation_new',
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
            'acf_data' => [
                'vi' => [
                    'hero_title' => 'Old value',
                    'related_posts' => [1, 3],
                ],
            ],
        ]);

        $response = $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->put(route('pages.update', $page), [
                'status' => false,
                'translations' => [
                    'vi' => [
                        'title' => 'Trang Chủ Cập Nhật',
                        'slug' => 'trang-chu-cap-nhat',
                    ],
                ],
                'content' => [
                    'vi' => [
                        'hero_title' => 'New value',
                        'related_posts' => [2, 4],
                    ],
                ],
            ]);

        $response->assertRedirect(route('pages.edit', $page));

        $page->refresh();
        $this->assertFalse($page->status);
        $this->assertSame('Trang Chủ Cập Nhật', $page->title);
        $this->assertSame('New value', $page->acf_data['vi']['hero_title']);
        $this->assertSame([2, 4], $page->acf_data['vi']['related_posts']);
        $this->assertDatabaseHas('field_groups', ['id' => $fieldGroup->id]);
        $this->assertDatabaseHas('page_translations', [
            'page_id' => $page->id,
            'locale' => 'vi',
            'title' => 'Trang Chủ Cập Nhật',
        ]);
        $this->assertDatabaseHas('slugs', [
            'sluggable_id' => $page->id,
            'sluggable_type' => Page::class,
            'locale' => 'vi',
            'slug' => 'trang-chu-cap-nhat',
        ]);

        $deleteResponse = $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->delete(route('pages.destroy', $page));

        $deleteResponse->assertRedirect(route('pages.index'));
        $this->assertDatabaseCount('pages', 0);
        $this->assertDatabaseCount('field_groups', 1);
    }
}
