<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ProductAiTranslationKeysTest extends TestCase
{
    #[Test]
    public function it_defines_the_product_ai_translate_button_key_for_all_locales(): void
    {
        foreach (['vi', 'en', 'ja'] as $locale) {
            $translations = require base_path("lang/{$locale}/hancms.php");
            $buttonLabel = data_get($translations, 'catalog.product.ai.translate_button');

            $this->assertNotEmpty($buttonLabel, "{$locale} translation is missing catalog.product.ai.translate_button");
        }
    }
}
