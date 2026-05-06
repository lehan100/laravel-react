<?php

namespace Tests\Feature;

use App\Http\Middleware\PermissionMiddleware;
use App\Models\FieldGroup;
use App\Models\Page;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FieldGroupModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_field_group_index_can_render(): void
    {
        $response = $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->get(route('page-schemas.index'));

        $response->assertOk();
    }

    public function test_field_group_can_be_created_updated_and_deleted(): void
    {
        $response = $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->post(route('page-schemas.store'), [
                'title' => 'Landing Fields',
                'status' => true,
                'fields' => [
                    [
                        'key' => 'hero_title',
                        'label' => 'Hero title',
                        'type' => 'text',
                    ],
                    [
                        'key' => 'hero_banner',
                        'label' => 'Hero banner',
                        'type' => 'image',
                    ],
                ],
            ]);

        $response->assertRedirect(route('page-schemas.index'));
        $this->assertDatabaseCount('field_groups', 1);

        $fieldGroup = FieldGroup::query()->firstOrFail();
        $this->assertSame('Landing Fields', $fieldGroup->title);
        $this->assertCount(2, $fieldGroup->fields_schema);
        $this->assertTrue($fieldGroup->status);

        $updateResponse = $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->put(route('page-schemas.update', $fieldGroup), [
                'title' => 'Updated Fields',
                'status' => false,
                'fields' => [
                    [
                        'key' => 'hero_title',
                        'label' => 'Updated title',
                        'type' => 'text',
                    ],
                ],
            ]);

        $updateResponse->assertRedirect(route('page-schemas.edit', $fieldGroup));

        $fieldGroup->refresh();
        $this->assertSame('Updated Fields', $fieldGroup->title);
        $this->assertFalse($fieldGroup->status);
        $this->assertCount(1, $fieldGroup->fields_schema);

        $deleteResponse = $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->delete(route('page-schemas.destroy', $fieldGroup));

        $deleteResponse->assertRedirect(route('page-schemas.index'));
        $this->assertDatabaseCount('field_groups', 0);
    }

    public function test_field_group_in_use_cannot_be_deleted(): void
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

        Page::create([
            'field_group_id' => $fieldGroup->id,
            'title' => 'Landing Page',
            'slug' => 'landing-page',
            'status' => true,
            'acf_data' => [
                'vi' => [
                    'hero_title' => 'Hello',
                ],
            ],
        ]);

        $response = $this->withoutMiddleware([Authenticate::class, PermissionMiddleware::class])
            ->delete(route('page-schemas.destroy', $fieldGroup));

        $response->assertRedirect();
        $response->assertSessionHas('error', __('hancms.field_group.messages.in_use'));
        $this->assertDatabaseHas('field_groups', ['id' => $fieldGroup->id]);
    }
}
