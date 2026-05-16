<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MailTemplateTranslationKeysTest extends TestCase
{
    #[Test]
    public function it_resolves_the_preview_button_translation_in_supported_locales(): void
    {
        $cases = [
            'vi' => 'Xem trước email',
            'en' => 'Preview Email',
            'ja' => 'メールをプレビュー',
        ];

        foreach ($cases as $locale => $expectedValue) {
            app()->setLocale($locale);

            $this->assertSame($expectedValue, trans('hancms.settings.mail_template.actions.preview'));
        }
    }
}
