<?php

namespace Tests\Unit;

use App\Services\Settings\HancmsTranslationService;
use Illuminate\Support\Arr;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class HancmsTranslationServiceTest extends TestCase
{
    private string $basePath;

    protected function setUp(): void
    {
        parent::setUp();

        $this->basePath = sys_get_temp_dir().'/hancms-translation-service-'.uniqid('', true);
        mkdir($this->basePath.'/vi', 0755, true);
        mkdir($this->basePath.'/en', 0755, true);

        file_put_contents(
            $this->basePath.'/vi/hancms.php',
            "<?php\n\nreturn ".var_export([
                'button' => [
                    'delete' => 'Xóa',
                ],
                'report' => [
                    'name' => 'Báo cáo',
                    'product' => [
                        'name' => 'Báo cáo sản phẩm',
                    ],
                ],
            ], true).";\n"
        );

        file_put_contents(
            $this->basePath.'/en/hancms.php',
            "<?php\n\nreturn ".var_export([
                'button' => [
                    'delete' => 'Delete',
                ],
                'report' => [
                    'name' => 'Report',
                    'product' => [
                        'name' => 'Product report',
                    ],
                ],
            ], true).";\n"
        );
    }

    protected function tearDown(): void
    {
        $this->deleteDirectory($this->basePath);

        parent::tearDown();
    }

    #[Test]
    public function it_loads_flat_translation_keys_for_all_locales(): void
    {
        $service = new HancmsTranslationService;

        $payload = $service->loadEditableTranslations(['vi', 'en'], $this->basePath);

        $this->assertSame([
            'button.delete',
            'report.name',
            'report.product.name',
        ], $payload['translation_keys']);

        $this->assertSame('Xóa', $payload['translations']['vi']['button.delete']);
        $this->assertSame('Delete', $payload['translations']['en']['button.delete']);
        $this->assertSame('Báo cáo sản phẩm', $payload['translations']['vi']['report.product.name']);
        $this->assertSame('Product report', $payload['translations']['en']['report.product.name']);
    }

    #[Test]
    public function it_saves_nested_translation_arrays_back_to_locale_files(): void
    {
        $service = new HancmsTranslationService;

        $service->saveTranslations([
            'vi' => [
                'button.delete' => 'Xóa ngay',
                'report.product.name' => 'Báo cáo sản phẩm mới',
            ],
        ], $this->basePath);

        $saved = require $this->basePath.'/vi/hancms.php';

        $this->assertSame('Xóa ngay', Arr::get($saved, 'button.delete'));
        $this->assertSame('Báo cáo sản phẩm mới', Arr::get($saved, 'report.product.name'));
        $this->assertSame('Báo cáo', Arr::get($saved, 'report.name'));
    }

    private function deleteDirectory(string $directory): void
    {
        if (! is_dir($directory)) {
            return;
        }

        $items = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($items as $item) {
            if ($item->isDir()) {
                rmdir($item->getPathname());
            } else {
                unlink($item->getPathname());
            }
        }

        rmdir($directory);
    }
}
