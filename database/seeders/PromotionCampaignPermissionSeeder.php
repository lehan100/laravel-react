<?php

namespace Database\Seeders;

use App\Models\Users\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PromotionCampaignPermissionSeeder extends Seeder
{
    /**
     * @var array<int, string>
     */
    private array $permissions = [
        'promotion-campaign.index',
        'promotion-campaign.create',
        'promotion-campaign.store',
        'promotion-campaign.show',
        'promotion-campaign.edit',
        'promotion-campaign.update',
        'promotion-campaign.destroy',
        'promotion-campaign.destroy-many',
        'promotion-campaign.toggle-status',
        'promotion-campaign.products-picker',
        'promotion-campaign.public',
    ];

    public function run(): void
    {
        foreach ($this->permissions as $permission) {
            Permission::query()->firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $roles = Role::query()->whereIn('id', [1, 2])->get();
        foreach ($roles as $role) {
            $role->givePermissionTo($this->permissions);
        }

        $owner = User::query()->where('owner', true)->first();
        if ($owner !== null) {
            $owner->givePermissionTo($this->permissions);
        }
    }
}
