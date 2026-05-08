<?php

namespace Tests\Feature\Jobs\Settings;

use App\Jobs\Settings\EnsureFrontendTranslationBundles;
use App\Services\Settings\FrontendTranslationBundleService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class EnsureFrontendTranslationBundlesTest extends TestCase
{
    #[Test]
    public function it_rebuilds_missing_frontend_json_bundles_when_the_job_runs(): void
    {
        $basePath = sys_get_temp_dir().'/frontend-translation-ensure-job-'.uniqid('', true);

        mkdir($basePath.'/ja/admin', 0755, true);

        file_put_contents(
            $basePath.'/ja/admin/nav.php',
            "<?php\n\nreturn ".var_export([
                'title' => 'ナビ',
            ], true).";\n"
        );

        try {
            $job = new EnsureFrontendTranslationBundles($basePath);
            $job->handle(new FrontendTranslationBundleService($basePath));

            $this->assertFileExists($basePath.'/php_ja.json');

            $bundle = json_decode((string) file_get_contents($basePath.'/php_ja.json'), true);

            $this->assertSame('ナビ', $bundle['admin.nav.title']);
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
