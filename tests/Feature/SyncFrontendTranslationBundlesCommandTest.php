<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SyncFrontendTranslationBundlesCommandTest extends TestCase
{
    #[Test]
    public function it_generates_json_bundles_from_php_locale_files_via_the_command(): void
    {
        $basePath = sys_get_temp_dir().'/frontend-translation-command-'.uniqid('', true);

        mkdir($basePath.'/en', 0755, true);

        file_put_contents(
            $basePath.'/en/messages.php',
            "<?php\n\nreturn ".var_export([
                'greeting' => 'Hello',
            ], true).";\n"
        );

        try {
            $this->artisan('lang:sync-json', [
                '--path' => $basePath,
            ])->assertExitCode(0);

            $this->assertFileExists($basePath.'/php_en.json');

            $bundle = json_decode((string) file_get_contents($basePath.'/php_en.json'), true);

            $this->assertSame('Hello', $bundle['messages.greeting']);
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
