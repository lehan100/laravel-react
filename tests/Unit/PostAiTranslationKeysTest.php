<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PostAiTranslationKeysTest extends TestCase
{
    #[Test]
    public function it_defines_the_post_ai_translate_button_key_for_all_locales(): void
    {
        foreach (['vi', 'en', 'ja'] as $locale) {
            $translations = require base_path("lang/{$locale}/hancms.php");
            $buttonLabel = data_get($translations, 'catalog.post.ai.translate_button');
            $nameLabel = data_get($translations, 'catalog.post.fields.name');
            $typeLabel = data_get($translations, 'catalog.post.fields.type');

            $this->assertNotEmpty($buttonLabel, "{$locale} translation is missing catalog.post.ai.translate_button");
            $this->assertNotEmpty($nameLabel, "{$locale} translation is missing catalog.post.fields.name");
            $this->assertNotEmpty($typeLabel, "{$locale} translation is missing catalog.post.fields.type");
        }
    }
}
