<?php

namespace Tests\Feature;

use App\Models\MediaBanner;
use App\Models\MediaPosition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaBannerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Thiết lập cấu hình bắt buộc cho package Translatable trong môi trường Test
        config(['translatable.locales' => ['vi', 'en']]);
        config(['translatable.locale' => 'vi']);
        
        // Thiết lập cấu hình đường dẫn ảnh để Trait HasImageFile không bị lỗi null
        config(['image.path.photo' => 'uploads/test']);
        
        // Giả lập ổ đĩa public
        Storage::fake('public');
    }

    /** @test */
    public function it_can_create_a_banner_with_translations_and_assign_positions()
    {
        // 1. Prepare: Tạo Position
        $position = MediaPosition::create([
            'name' => 'Main Home Slider',
            'code' => 'home-slider',
            'status' => 1
        ]);

        // 2. Act: Tạo Banner và gán bản dịch (Sử dụng fill để đảm bảo tính ổn định trong Test)
        $banner = new MediaBanner();
        $banner->status = 1;
        $banner->order = 1;

        // Gán dữ liệu tiếng Việt
        $banner->translateOrNew('vi')->fill([
            'name'       => 'Chào Hè 2024',
            'content'    => 'Nội dung tiếng Việt',
            'description'=> 'Mô tả tiếng Việt',
            'photo'      => 'banner-vi.jpg',
            'alias_link' => 'https://example.com',
        ]);

        // Gán dữ liệu tiếng Anh
        $banner->translateOrNew('en')->fill([
            'name'       => 'Summer Sale 2024',
            'content'    => 'English content',
            'description'=> 'English description',
            'photo'      => 'banner-en.jpg',
            'alias_link' => 'https://example.com',
        ]);

        $banner->save();
        $banner->positions()->attach($position->id);

        // 3. Assert: Kiểm tra bảng chính
        $this->assertDatabaseHas('media_banners', [
            'id'     => $banner->id,
            'status' => 1,
        ]);

        // 4. Assert: Kiểm tra bảng Translations
        $this->assertDatabaseHas('media_banner_translations', [
            'media_banner_id' => $banner->id,
            'locale'     => 'vi',
            'name'       => 'Chào Hè 2024',
            'photo'      => 'banner-vi.jpg'
        ]);

        $this->assertDatabaseHas('media_banner_translations', [
            'media_banner_id' => $banner->id,
            'locale'     => 'en',
            'name'       => 'Summer Sale 2024'
        ]);

        // 5. Assert: Kiểm tra quan hệ Many-to-Many
        $this->assertEquals(1, $banner->positions()->count());
        $this->assertEquals('home-slider', $banner->positions->first()->code);
    }

    /** @test */
    public function it_retrieves_correct_translation_based_on_app_locale()
    {
        $banner = new MediaBanner();
        $banner->translateOrNew('vi')->name = 'Tiếng Việt';
        $banner->translateOrNew('en')->name = 'English Name';
        $banner->save();

        app()->setLocale('vi');
        $this->assertEquals('Tiếng Việt', $banner->name);

        app()->setLocale('en');
        $this->assertEquals('English Name', $banner->name);
    }

    /** @test */
    public function it_soft_deletes_the_banner()
    {
        $banner = new MediaBanner();
        $banner->translateOrNew('vi')->name = 'Temporary Banner';
        $banner->save();

        $banner->delete();

        // Kiểm tra xóa mềm
        $this->assertSoftDeleted('media_banners', ['id' => $banner->id]);

        // Bản dịch vẫn phải tồn tại (chế độ xóa mềm bảng chính)
        $this->assertDatabaseHas('media_banner_translations', [
            'media_banner_id' => $banner->id,
            'name' => 'Temporary Banner'
        ]);
    }
}
