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
            $nameLabel = data_get($translations, 'catalog.product.fields.name');
            $quantityWarning = data_get($translations, 'catalog.product.warnings.quantity_zero');
            $priceWarning = data_get($translations, 'catalog.product.warnings.price_zero');
            $stockWarning = data_get($translations, 'catalog.product.warnings.stock_zero');
            $noImageWarning = data_get($translations, 'catalog.product.warnings.no_images');

            $this->assertNotEmpty($buttonLabel, "{$locale} translation is missing catalog.product.ai.translate_button");
            $this->assertNotEmpty($nameLabel, "{$locale} translation is missing catalog.product.fields.name");
            $this->assertNotEmpty($quantityWarning, "{$locale} translation is missing catalog.product.warnings.quantity_zero");
            $this->assertNotEmpty($priceWarning, "{$locale} translation is missing catalog.product.warnings.price_zero");
            $this->assertNotEmpty($stockWarning, "{$locale} translation is missing catalog.product.warnings.stock_zero");
            $this->assertNotEmpty($noImageWarning, "{$locale} translation is missing catalog.product.warnings.no_images");
        }
    }
}
