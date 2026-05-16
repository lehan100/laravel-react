<?php

namespace Tests\Unit;

use App\Services\Settings\LabelTranslationService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LabelTranslationServiceTest extends TestCase
{
    #[Test]
    public function it_prefers_label_overrides_and_falls_back_to_hancms_defaults(): void
    {
        $basePath = sys_get_temp_dir().'/label-translation-service-'.uniqid('', true);

        mkdir($basePath.'/vi', 0755, true);
        mkdir($basePath.'/en', 0755, true);

        file_put_contents(
            $basePath.'/vi/hancms.php',
            "<?php\n\nreturn ".var_export([
                'settings' => [
                    'mail_template' => [
                        'actions' => [
                            'preview' => 'Xem trước từ hancms',
                        ],
                    ],
                ],
                'shared_label' => 'Hancms mặc định',
                'hancms_only' => 'Chỉ có trong hancms',
            ], true).";\n"
        );

        file_put_contents(
            $basePath.'/vi/label.php',
            "<?php\n\nreturn ".var_export([
                'custom_only' => 'Chỉ có trong label',
                'shared_label' => 'Ghi đè từ label',
            ], true).";\n"
        );

        try {
            $service = new LabelTranslationService;
            $payload = $service->loadEditableTranslations(['vi', 'en'], $basePath);

            $this->assertSame([
                'custom_only',
                'shared_label',
            ], $payload['translation_keys']);
            $this->assertSame('Ghi đè từ label', $payload['translations']['vi']['shared_label']);
            $this->assertSame('Chỉ có trong label', $payload['translations']['vi']['custom_only']);
            $this->assertSame('', $payload['translations']['en']['shared_label']);
            $this->assertSame('', $payload['translations']['en']['custom_only']);
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
