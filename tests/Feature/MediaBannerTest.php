<?php

namespace Tests\Feature;

use App\Models\MediaBanner;
use App\Models\MediaPosition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class MediaBannerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // 1. Cấu hình đa ngôn ngữ
        config(['translatable.locales' => ['vi', 'en']]);
        config(['translatable.locale' => 'vi']);
        
        // 2. Cấu hình đường dẫn chính (để Trait biết chỗ đẩy vào)
        config(['image.path.photo' => 'uploads/banners']);
        
        // 3. Giả lập các ổ đĩa
        Storage::fake('public'); // Ổ đĩa chính
        Storage::fake('local');  // Giả lập cho thư mục /tmp nếu bồ dùng disk local
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

        // 2. Prepare: Giả lập file đã nằm trong thư mục TMP
        // Giả sử bồ lưu tên file vào DB, Trait sẽ bốc file từ tmp này đi
        $tempFileName = 'banner_temp_123.jpg';
        
        // 3. Act: Khởi tạo Banner
        $banner = new MediaBanner();
        $banner->status = 1;
        $banner->order = 1;

        // Gán dữ liệu bản dịch
        // Nếu Trait của bồ nhận UploadedFile, hãy dùng UploadedFile::fake()
        // Nếu Trait nhận tên file trong tmp, hãy truyền string tên file
        $fileVi = UploadedFile::fake()->image('banner-vi.jpg');

        $banner->translateOrNew('vi')->fill([
            'name'       => 'Chào Hè 2024',
            'content'    => 'Nội dung tiếng Việt',
            'photo'      => $fileVi, // Trait sẽ bắt sự kiện saving để move từ tmp sang chính
            'alias_link' => 'https://example.com',
        ]);

        $banner->translateOrNew('en')->fill([
            'name'       => 'Summer Sale 2024',
            'photo'      => UploadedFile::fake()->image('banner-en.jpg'),
        ]);

        $banner->save();
        $banner->positions()->attach($position->id);

        // 4. Assert: Kiểm tra bảng chính
        $this->assertDatabaseHas('media_banners', ['id' => $banner->id]);

        // 5. Assert: Kiểm tra bản dịch đã được lưu
        $this->assertDatabaseHas('media_banner_translations', [
            'media_banner_id' => $banner->id,
            'locale'          => 'vi',
            'name'            => 'Chào Hè 2024',
        ]);

        // 6. Assert: Kiểm tra file đã được move vào thư mục chính (nếu Trait xử lý đúng)
        // Lấy tên file thực tế từ DB vì Trait thường đổi tên file (timestamp...)
        $savedPhoto = $banner->translate('vi')->photo;
        Storage::disk('public')->assertExists('uploads/banners/' . $savedPhoto);
    }

    /** @test */
    public function it_retrieves_correct_translation_based_on_app_locale()
    {
        $banner = new MediaBanner(['status' => 1]);
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
        $banner = new MediaBanner(['status' => 1]);
        $banner->translateOrNew('vi')->name = 'Temporary Banner';
        $banner->save();

        $banner->delete();

        $this->assertSoftDeleted('media_banners', ['id' => $banner->id]);
        $this->assertDatabaseHas('media_banner_translations', [
            'name' => 'Temporary Banner'
        ]);
    }
}
