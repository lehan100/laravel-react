<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\Users\User;
use Database\Seeders\HancmsTranslationPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class HancmsTranslationPageTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_renders_the_translation_editor_with_config_path(): void
    {
        $account = Account::query()->create([
            'name' => 'Demo Account',
        ]);

        $user = User::factory()->create([
            'account_id' => $account->id,
            'owner' => true,
        ]);

        $this->seed(HancmsTranslationPermissionSeeder::class);

        $response = $this->actingAs($user)->get(route('cms-translations.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/HancmsTranslation/Index')
            ->has('langs')
            ->has('translation_keys')
            ->has('translations')
            ->where('config_path.path', 'media/photo')
        );
    }
}
