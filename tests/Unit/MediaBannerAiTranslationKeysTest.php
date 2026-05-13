<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MediaBannerAiTranslationKeysTest extends TestCase
{
    #[Test]
    public function it_defines_the_media_banner_ai_translate_button_key_for_all_locales(): void
    {
        foreach (['vi', 'en', 'ja'] as $locale) {
            $translations = require base_path("lang/{$locale}/hancms.php");
            $buttonLabel = data_get($translations, 'media.banner.ai.translate_button');
            $generatingLabel = data_get($translations, 'catalog.media_banner.ai.generating');

            $this->assertNotEmpty($buttonLabel, "{$locale} translation is missing media.banner.ai.translate_button");
            $this->assertNotEmpty($generatingLabel, "{$locale} translation is missing catalog.media_banner.ai.generating");
        }
    }
}
