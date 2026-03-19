<?php

namespace Tests\Feature;

use App\Models\MediaBanner;
use App\Models\MediaPosition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MediaBannerTest extends TestCase
{
    // Bắt buộc dùng RefreshDatabase để làm sạch DB mỗi lần chạy test
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_banner_with_translations_and_assign_positions()
    {
        // Thiết lập locales giả lập cho package Translatable
        config(['translatable.locales' => ['vi', 'en']]);

        // 1. Prepare: Tạo một Position trước
        $position = MediaPosition::create([
            'name' => 'Main Home Slider',
            'code' => 'home-slider',
            'status' => 1
        ]);

        // 2. Prepare: Dữ liệu Banner đa ngôn ngữ (photo và alias_link nằm trong mảng ngôn ngữ)
        $bannerData = [
            'status' => 1,
            'order'  => 1,
            'vi' => [
                'name'       => 'Chào Hè 2024',
                'content'    => 'Nội dung tiếng Việt',
                'description'=> 'Mô tả tiếng Việt',
                'photo'      => 'banner-vi.jpg',
                'alias_link' => 'https://example.com',
            ],
            'en' => [
                'name'       => 'Summer Sale 2024',
                'content'    => 'English content',
                'description'=> 'English description',
                'photo'      => 'banner-en.jpg',
                'alias_link' => 'https://example.com',
            ]
        ];

        // 3. Act: Tạo Banner và gắn Position (Pivot)
        $banner = MediaBanner::create($bannerData);
        $banner->positions()->attach($position->id);

        // 4. Assert: Kiểm tra bảng chính (Chỉ có status và order)
        $this->assertDatabaseHas('media_banners', [
            'id'     => $banner->id,
            'status' => 1,
            'order'  => 1
        ]);

        // 5. Assert: Kiểm tra bảng Translations (Nơi chứa photo và alias_link)
        $this->assertDatabaseHas('media_banner_translations', [
            'media_banner_id' => $banner->id,
            'locale'     => 'vi',
            'name'       => 'Chào Hè 2024',
            'photo'      => 'banner-vi.jpg',
            'alias_link' => 'https://example.com'
        ]);

        $this->assertDatabaseHas('media_banner_translations', [
            'media_banner_id' => $banner->id,
            'locale'     => 'en',
            'name'       => 'Summer Sale 2024',
            'photo'      => 'banner-en.jpg'
        ]);

        // 6. Assert: Kiểm tra quan hệ Many-to-Many
        $this->assertEquals(1, $banner->positions()->count());
        $this->assertEquals('home-slider', $banner->positions->first()->code);
    }

    /** @test */
    public function it_retrieves_correct_translation_based_on_app_locale()
    {
        config(['translatable.locales' => ['vi', 'en']]);
        $banner = MediaBanner::create([
            'vi' => ['name' => 'Tiếng Việt'],
            'en' => ['name' => 'English Name']
        ]);

        app()->setLocale('vi');
        $this->assertEquals('Tiếng Việt', $banner->name);

        app()->setLocale('en');
        $this->assertEquals('English Name', $banner->name);
    }

    /** @test */
    public function it_soft_deletes_the_banner()
    {
        config(['translatable.locales' => ['vi']]);
        $banner = MediaBanner::create([
            'vi' => ['name' => 'Temporary Banner']
        ]);

        $banner->delete();

        // Kiểm tra xóa mềm ở bảng chính
        $this->assertSoftDeleted('media_banners', ['id' => $banner->id]);

        // Kiểm tra bản dịch vẫn còn trong DB (không bị xóa cứng)
        $this->assertDatabaseHas('media_banner_translations', [
            'media_banner_id' => $banner->id,
            'name' => 'Temporary Banner'
        ]);
    }
}
