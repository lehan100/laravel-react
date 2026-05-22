<?php

namespace Database\Seeders;

use App\Models\Users\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class HancmsTranslationPermissionSeeder extends Seeder
{
    /**
     * @var array<int, string>
     */
    private array $permissions = [
        'cms-translations.index',
        'cms-translations.store',
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
