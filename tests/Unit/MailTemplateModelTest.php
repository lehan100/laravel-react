<?php

namespace Tests\Unit;

use App\Models\Settings\MailTemplate;
use App\Models\Settings\MailTemplateTranslation;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MailTemplateModelTest extends TestCase
{
    #[Test]
    public function it_configures_the_mail_template_model_for_translations(): void
    {
        $mailTemplate = new MailTemplate;
        $translation = new MailTemplateTranslation;

        $this->assertInstanceOf(TranslatableContract::class, $mailTemplate);
        $this->assertContains(Translatable::class, class_uses_recursive(MailTemplate::class));
        $this->assertSame('mail_templates', $mailTemplate->getTable());
        $this->assertSame(MailTemplateTranslation::class, $mailTemplate->translationModel);
        $this->assertSame(['key', 'module', 'fallback_locale', 'variables', 'is_active'], $mailTemplate->getFillable());
        $this->assertSame(['name', 'subject', 'body_html'], $mailTemplate->translatedAttributes);
        $this->assertSame('mail_template_translations', $translation->getTable());
        $this->assertSame(
            ['mail_template_id', 'locale', 'name', 'subject', 'body_html'],
            $translation->getFillable()
        );
        $this->assertTrue(method_exists($translation, 'mailTemplate'));
    }
}
