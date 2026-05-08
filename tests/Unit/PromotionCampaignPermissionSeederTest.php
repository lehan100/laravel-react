<?php

namespace Tests\Unit;

use App\Models\Account;
use App\Models\Users\User;
use Database\Seeders\PromotionCampaignPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PromotionCampaignPermissionSeederTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_seeds_promotion_campaign_permissions_for_the_owner_user(): void
    {
        $account = Account::query()->create([
            'name' => 'Acme',
        ]);

        $user = User::factory()->create([
            'account_id' => $account->id,
            'owner' => true,
        ]);

        $this->seed(PromotionCampaignPermissionSeeder::class);

        $this->assertTrue($user->fresh()->can('promotion-campaign.index'));
        $this->assertTrue($user->fresh()->can('promotion-campaign.create'));
        $this->assertTrue($user->fresh()->can('promotion-campaign.public'));
    }
}
