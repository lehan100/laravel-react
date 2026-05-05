<?php

namespace Tests\Feature;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class ImageUploadControllerTest extends TestCase
{
    public function test_attribute_upload_accepts_photo_field_and_returns_webp_file(): void
    {
        File::ensureDirectoryExists(public_path('var/temp'));

        $response = $this->post(route('attribute.upload'), [
            'photo' => UploadedFile::fake()->image('brand.jpg'),
        ]);

        $response->assertOk();
        $response->assertJsonStructure([
            'file_name',
            'uploaded',
            'status',
            'url',
        ]);

        $fileName = $response->json('file_name');
        $this->assertIsString($fileName);
        $this->assertNotSame('', trim($fileName));
        $this->assertFileExists(public_path('var/temp/'.$fileName));

        File::delete(public_path('var/temp/'.$fileName));
    }
}
