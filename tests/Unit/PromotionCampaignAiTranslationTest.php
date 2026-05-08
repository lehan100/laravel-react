<?php

namespace Tests\Unit;

use Illuminate\Support\Facades\Lang;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PromotionCampaignAiTranslationTest extends TestCase
{
    #[Test]
    public function it_translates_the_promotion_campaign_ai_generating_label_in_supported_locales(): void
    {
        $cases = [
            'en' => 'Generating...',
            'vi' => 'Đang tạo...',
            'ja' => '生成中...',
        ];

        foreach ($cases as $locale => $expected) {
            Lang::setLocale($locale);

            $this->assertSame($expected, trans('hancms.promotion.campaign.ai.generating'));
        }
    }
}
