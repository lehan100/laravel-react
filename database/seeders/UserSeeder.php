<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Users\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $account = Account::firstOrCreate(['name' => 'Acme Corporation']);

        $admin = User::updateOrCreate(
            ['email' => 'lehan100@gmail.com'],
            [
                'account_id' => $account->id,
                'first_name' => 'Lê',
                'last_name' => 'Hân',
                'password' => '123',
                'owner' => true,
                'status' => 1,
                'group' => 1,
            ]
        );

        User::factory(5)->create(['account_id' => $account->id]);

        // Create Super Admin role
        $role = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);

        // Assign all current permissions to the role
        $allPermissions = Permission::all();
        $role->syncPermissions($allPermissions);

        // Assign role to the user
        $admin->assignRole($role);

        // Also sync permissions directly to the user
        $admin->syncPermissions($allPermissions);
    }
}
