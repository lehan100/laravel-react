<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class HancmsButtonTranslationKeysTest extends TestCase
{
    #[Test]
    public function it_resolves_the_delete_button_translation_in_supported_locales(): void
    {
        $cases = [
            'vi' => [
                'hancms.button.delete' => 'Xóa',
                'hancms.button.delete_selected' => 'Xóa đã chọn',
            ],
            'en' => [
                'hancms.button.delete' => 'Delete',
                'hancms.button.delete_selected' => 'Delete selected',
            ],
            'ja' => [
                'hancms.button.delete' => '削除',
                'hancms.button.delete_selected' => '選択を削除',
            ],
        ];

        foreach ($cases as $locale => $expectedValues) {
            app()->setLocale($locale);

            foreach ($expectedValues as $key => $expectedValue) {
                $this->assertSame($expectedValue, trans($key));
            }
        }
    }
}
