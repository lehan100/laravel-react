<?php

namespace Tests\Feature;

use App\Models\MediaBanner;
use App\Models\MediaPosition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MediaBannerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_banner_with_translations_and_assign_positions()
    {
        config(['translatable.locales' => ['vi', 'en']]);

        $position = MediaPosition::create([
            'name' => 'Main Home Slider',
            'code' => 'home-slider',
            'status' => 1
        ]);

        $bannerData = [
            'status' => 1,
            'order'  => 1,
            'vi' => [
                'name'       => 'Chào Hè 2024',
                'content'    => 'Nội dung tiếng Việt',
                'photo'      => 'banner-vi.jpg',
            ],
            'en' => [
                'name'       => 'Summer Sale 2024',
                'content'    => 'English content',
                'photo'      => 'banner-en.jpg',
            ]
        ];
        $banner = MediaBanner::create([
            'status' => 1,
            'order'  => 1,
        ]);

        $banner->translateOrNew('vi')->fill($bannerData['vi']);
        $banner->translateOrNew('en')->fill($bannerData['en']);
        $banner->save();
        $banner->positions()->attach($position->id);
        $this->assertDatabaseHas('media_banners', [
            'id'     => $banner->id,
            'status' => 1,
            'order'  => 1
        ]);

        $this->assertDatabaseHas('media_banner_translations', [
            'media_banner_id' => $banner->id,
            'name' => 'Chào Hè 2024',
            'locale' => 'vi',
        ]);

        $this->assertDatabaseHas('media_banner_translations', [
            'media_banner_id' => $banner->id,
            'locale' => 'en',
            'name' => 'Summer Sale 2024'
        ]);


        $this->assertEquals(1, $banner->positions()->count());
        $this->assertEquals('home-slider', $banner->positions->first()->code);
    }

    /** @test */
    public function it_retrieves_correct_translation_based_on_app_locale()
    {
        config(['translatable.locales' => ['vi', 'en']]);

        $banner = MediaBanner::create([
            'status' => 1,
            'order'  => 1,
        ]);

        $banner->translateOrNew('vi')->fill(['name' => 'Tiếng Việt']);
        $banner->translateOrNew('en')->fill(['name' => 'English Name']);
        $banner->save();

        $banner = $banner->fresh();

        $this->assertEquals('Tiếng Việt', $banner->translate('vi')->name);
        $this->assertEquals('English Name', $banner->translate('en')->name);

        app()->setLocale('vi');
        $this->assertEquals('Tiếng Việt', $banner->name);

        app()->setLocale('en');
        $this->assertEquals('English Name', $banner->fresh()->name);
    }
}
