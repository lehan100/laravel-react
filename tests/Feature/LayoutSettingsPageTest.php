<?php

namespace Tests\Feature;

use App\Http\Middleware\PermissionMiddleware;
use App\Models\Account;
use App\Models\Users\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LayoutSettingsPageTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_renders_the_settings_page_with_ai_configuration_data(): void
    {
        $account = Account::query()->create([
            'name' => 'Demo Account',
        ]);

        $user = User::factory()->create([
            'account_id' => $account->id,
            'owner' => true,
        ]);

        $response = $this->actingAs($user)
            ->withoutMiddleware(PermissionMiddleware::class)
            ->get(route('layout.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Layout/Index')
            ->has('langs')
            ->has('pages')
            ->has('ai_settings')
            ->where('config_path.path', 'media/photo')
        );
    }
}
