<?php

namespace Tests\Unit;

use App\Models\Account;
use App\Models\Users\User;
use Database\Seeders\LocationPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LocationPermissionSeederTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_seeds_location_permissions_for_the_owner_user(): void
    {
        $account = Account::query()->create([
            'name' => 'Acme',
        ]);

        $user = User::factory()->create([
            'account_id' => $account->id,
            'owner' => true,
        ]);

        $this->seed(LocationPermissionSeeder::class);

        $this->assertTrue($user->fresh()->can('locations.index'));
        $this->assertTrue($user->fresh()->can('locations.show'));
    }
}
