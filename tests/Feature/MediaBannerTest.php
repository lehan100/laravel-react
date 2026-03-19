<?php

namespace Tests\Feature;

use App\Models\MediaBanner;
use App\Models\MediaPosition;
// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MediaBannerTest extends TestCase
{
    // use RefreshDatabase;

    /** @test */
    public function it_can_create_a_banner_with_translations_and_assign_positions()
    {
        config(['translatable.locales' => ['vi', 'en']]);
        // 1. Prepare: Create a Position
        $position = MediaPosition::create([
            'name' => 'Main Home Slider',
            'code' => 'home-slider',
            'status' => 1
        ]);

        // 2. Prepare: Multi-language Banner data
        $bannerData = [

            'status'     => 1,
            'order'      => 1,
            // Translation data for Astrotomic/Translatable
            'vi' => [
                'name'    => 'Chao He 2024',
                'content' => 'Noi dung tieng Viet',
                'description' => 'Noi dung tieng Viet',
                'photo'      => 'banner-sample.jpg',
                'alias_link' => 'https://example.com',
            ],
            'en' => [
                'name'    => 'Summer Sale 2024',
                'content' => 'English content description',
                'description' => 'English content description',
                'photo'      => 'banner-sample.jpg',
                'alias_link' => 'https://example.com',
            ]
        ];

        // 3. Act: Create Banner
        $banner = MediaBanner::create($bannerData);
        $banner->positions()->attach($position->id); // Many-to-Many link

        // 4. Assert: Check Main Table
        $this->assertDatabaseHas('media_banners', [
            'photo' => 'banner-sample.jpg',
            'alias_link' => 'https://example.com'
        ]);

        // 5. Assert: Check Translation Table
        $this->assertDatabaseHas('media_banner_translations', [
            'media_banner_id' => $banner->id,
            'locale' => 'vi',
            'name' => 'Chao He 2024'
        ]);

        $this->assertDatabaseHas('media_banner_translations', [
            'media_banner_id' => $banner->id,
            'locale' => 'en',
            'name' => 'Summer Sale 2024'
        ]);

        // 6. Assert: Check Relationship
        $this->assertEquals(1, $banner->positions()->count());
        $this->assertEquals('home-slider', $banner->positions->first()->code);
    }

    /** @test */
    public function it_retrieves_correct_translation_based_on_app_locale()
    {
        config(['translatable.locales' => ['vi', 'en']]);
        $banner = MediaBanner::create([
            'vi' => ['name' => 'Tieng Viet'],
            'en' => ['name' => 'English Name']
        ]);

        // Test Vietnamese
        app()->setLocale('vi');
        $this->assertEquals('Tieng Viet', $banner->name);

        // Test English
        app()->setLocale('en');
        $this->assertEquals('English Name', $banner->name);
    }

    /** @test */
    public function it_soft_deletes_the_banner()
    {
        config(['translatable.locales' => ['vi', 'en']]);
        $banner = MediaBanner::create([
            'vi' => ['name' => 'Temporary Banner']
        ]);

        $banner->delete();

        // Assert record is hidden (soft deleted)
        $this->assertSoftDeleted($banner);

        // Assert the translation record still exists in DB
        $this->assertDatabaseHas('media_banner_translations', [
            'name' => 'Temporary Banner'
        ]);
    }
}
