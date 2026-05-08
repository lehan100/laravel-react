<?php

namespace Tests\Unit;

use App\Services\Media\FolderNamingService;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaFolderNamingTest extends TestCase
{
    public function test_it_slugifies_folder_names_for_paths_and_keeps_metadata_paths_stable(): void
    {
        $service = app(FolderNamingService::class);

        $this->assertSame('sach-hay', $service->slugFolderName('Sách Hay'));
        $this->assertSame('.folder.json', $service->metadataFilename());
        $this->assertSame('collections/sach-hay/.folder.json', $service->metadataPath('collections/sach-hay'));
    }

    public function test_it_reads_display_names_from_folder_metadata(): void
    {
        Storage::fake('media_root');

        $service = app(FolderNamingService::class);
        $disk = Storage::disk('media_root');

        $disk->makeDirectory('collections/sach-hay');
        $service->storeMetadata($disk, 'collections/sach-hay', 'Sách Hay');

        $this->assertSame('Sách Hay', $service->displayName($disk, 'collections/sach-hay'));
    }
}
