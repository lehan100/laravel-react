<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $this->call([
            LanguageSeeder::class,
            LocationPermissionSeeder::class,
            HancmsTranslationPermissionSeeder::class,
            PromotionCampaignPermissionSeeder::class,
            VietnameseAdministrativeUnitsSeeder::class,
            CatalogSampleSeeder::class,
            UserSeeder::class,
        ]);

        // $organizations = Organization::factory(100)
        //     ->create(['account_id' => $account->id]);

        // Contact::factory(100)
        //     ->create(['account_id' => $account->id])
        //     ->each(function ($contact) use ($organizations) {
        //         $contact->update(['organization_id' => $organizations->random()->id]);
        //     });
    }
}
