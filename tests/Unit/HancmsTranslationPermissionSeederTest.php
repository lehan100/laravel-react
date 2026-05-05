<?php

namespace Tests\Unit;

use App\Models\Account;
use App\Models\Users\User;
use Database\Seeders\HancmsTranslationPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class HancmsTranslationPermissionSeederTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_seeds_hancms_translation_permissions_for_the_owner_user(): void
    {
        $account = Account::query()->create([
            'name' => 'Acme',
        ]);

        $user = User::factory()->create([
            'account_id' => $account->id,
            'owner' => true,
        ]);

        $this->seed(HancmsTranslationPermissionSeeder::class);

        $this->assertTrue($user->fresh()->can('hancms-translations.index'));
        $this->assertTrue($user->fresh()->can('hancms-translations.store'));
    }
}
