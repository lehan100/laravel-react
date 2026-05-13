<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ReportInventoryTranslationKeysTest extends TestCase
{
    #[Test]
    public function it_defines_the_inventory_action_keys_for_all_locales(): void
    {
        foreach (['vi', 'en', 'ja'] as $locale) {
            $translations = require base_path("lang/{$locale}/hancms.php");

            $reserveLabel = data_get($translations, 'report.inventory.actions.promotion_buytogift_reserve');
            $releaseLabel = data_get($translations, 'report.inventory.actions.promotion_buytogift_release');

            $this->assertNotEmpty($reserveLabel, "{$locale} translation is missing report.inventory.actions.promotion_buytogift_reserve");
            $this->assertNotEmpty($releaseLabel, "{$locale} translation is missing report.inventory.actions.promotion_buytogift_release");
        }
    }
}
