<?php

namespace Tests\Feature;

use App\Http\Controllers\Admin\Media\TinyMCEController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MediaTinyMCEControllerTest extends TestCase
{
    #[Test]
    public function it_creates_slugged_folder_paths_while_preserving_display_names(): void
    {
        Storage::fake('media_root');

        $controller = app(TinyMCEController::class);
        $request = Request::create('/admin123/media-create-folder', 'POST', [
            'name' => 'Sách Hay',
            'path' => 'collections',
        ]);

        $response = $controller->createFolder($request);
        $payload = $response->getData(true);

        $this->assertTrue($payload['success']);
        $this->assertSame('collections/sach-hay', $payload['path']);
        $this->assertSame('Sách Hay', $payload['name']);

        $disk = Storage::disk('media_root');
        $this->assertTrue($disk->exists('collections/sach-hay'));
        $this->assertTrue($disk->exists('collections/sach-hay/.folder.json'));

        $listResponse = $controller->getImages(Request::create('/admin123/media-images', 'GET', [
            'path' => 'collections/sach-hay',
        ]));
        $listPayload = $listResponse->getData(true);

        $this->assertSame('Collections', $listPayload['breadcrumbs'][0]['name']);
        $this->assertSame('collections', $listPayload['breadcrumbs'][0]['path']);
        $this->assertSame('Sách Hay', $listPayload['breadcrumbs'][1]['name']);
        $this->assertSame('collections/sach-hay', $listPayload['breadcrumbs'][1]['path']);
        $this->assertSame([], $listPayload['items']);
    }

    #[Test]
    public function it_allows_folder_renames_that_only_change_casing(): void
    {
        Storage::fake('media_root');

        $controller = app(TinyMCEController::class);
        $createRequest = Request::create('/admin123/media-create-folder', 'POST', [
            'name' => 'Sách Hay',
            'path' => 'collections',
        ]);
        $controller->createFolder($createRequest);

        $renameRequest = Request::create('/admin123/media-rename', 'POST', [
            'old_path' => 'collections/sach-hay',
            'new_name' => 'SÁCH HAY',
            'type' => 'folder',
        ]);

        $response = $controller->rename($renameRequest);
        $payload = $response->getData(true);

        $this->assertTrue($payload['success']);
        $this->assertSame('collections/sach-hay', $payload['path']);
        $this->assertSame('SÁCH HAY', $payload['name']);

        $disk = Storage::disk('media_root');
        $this->assertTrue($disk->exists('collections/sach-hay'));
        $this->assertSame(
            'SÁCH HAY',
            json_decode((string) $disk->get('collections/sach-hay/.folder.json'), true)['name']
        );
    }
}
