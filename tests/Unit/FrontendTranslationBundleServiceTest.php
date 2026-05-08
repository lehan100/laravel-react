<?php

namespace Tests\Unit;

use App\Services\Settings\FrontendTranslationBundleService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FrontendTranslationBundleServiceTest extends TestCase
{
    #[Test]
    public function it_generates_frontend_json_bundles_from_php_locale_files(): void
    {
        $basePath = sys_get_temp_dir().'/frontend-translation-bundle-'.uniqid('', true);

        mkdir($basePath.'/en/admin', 0755, true);
        mkdir($basePath.'/vi/admin', 0755, true);

        file_put_contents(
            $basePath.'/en/auth.php',
            "<?php\n\nreturn ".var_export([
                'button' => [
                    'delete' => 'Delete',
                ],
            ], true).";\n"
        );

        file_put_contents(
            $basePath.'/en/admin/menu.php',
            "<?php\n\nreturn ".var_export([
                'report' => [
                    'name' => 'Report menu',
                ],
            ], true).";\n"
        );

        file_put_contents(
            $basePath.'/vi/auth.php',
            "<?php\n\nreturn ".var_export([
                'button' => [
                    'delete' => 'Xóa',
                ],
            ], true).";\n"
        );

        file_put_contents(
            $basePath.'/vi/admin/menu.php',
            "<?php\n\nreturn ".var_export([
                'report' => [
                    'name' => 'Báo cáo',
                ],
            ], true).";\n"
        );

        try {
            $service = new FrontendTranslationBundleService($basePath);
            $generatedFiles = $service->sync();

            $this->assertSame([
                $basePath.'/php_en.json',
                $basePath.'/php_vi.json',
            ], $generatedFiles);

            $englishBundle = json_decode((string) file_get_contents($basePath.'/php_en.json'), true);
            $vietnameseBundle = json_decode((string) file_get_contents($basePath.'/php_vi.json'), true);

            $this->assertSame('Delete', $englishBundle['auth.button.delete']);
            $this->assertSame('Report menu', $englishBundle['admin.menu.report.name']);
            $this->assertSame('Xóa', $vietnameseBundle['auth.button.delete']);
            $this->assertSame('Báo cáo', $vietnameseBundle['admin.menu.report.name']);
        } finally {
            $this->deleteDirectory($basePath);
        }
    }

    #[Test]
    public function it_can_detect_and_rebuild_missing_frontend_json_bundles(): void
    {
        $basePath = sys_get_temp_dir().'/frontend-translation-ensure-'.uniqid('', true);

        mkdir($basePath.'/en/admin', 0755, true);
        mkdir($basePath.'/vi/admin', 0755, true);

        file_put_contents(
            $basePath.'/en/auth.php',
            "<?php\n\nreturn ".var_export([
                'button' => [
                    'delete' => 'Delete',
                ],
            ], true).";\n"
        );

        file_put_contents(
            $basePath.'/vi/auth.php',
            "<?php\n\nreturn ".var_export([
                'button' => [
                    'delete' => 'Xóa',
                ],
            ], true).";\n"
        );

        try {
            $service = new FrontendTranslationBundleService($basePath);

            $this->assertSame(['en', 'vi'], $service->missingGeneratedBundles());

            $generatedFiles = $service->ensure();

            $this->assertSame([
                $basePath.'/php_en.json',
                $basePath.'/php_vi.json',
            ], $generatedFiles);
            $this->assertSame([], $service->missingGeneratedBundles());
            $this->assertFileExists($basePath.'/php_en.json');
            $this->assertFileExists($basePath.'/php_vi.json');
        } finally {
            $this->deleteDirectory($basePath);
        }
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
