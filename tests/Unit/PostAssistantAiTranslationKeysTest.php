<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PostAssistantAiTranslationKeysTest extends TestCase
{
    #[Test]
    public function it_defines_the_post_assistant_ai_translation_keys_for_all_locales(): void
    {
        $expected = [
            'vi' => [
                'hancms.ai_assistant.post_assistant.save_changes' => 'Lưu thay đổi',
                'hancms.ai_assistant.post_assistant.group_drafts' => 'Bản nháp trong group',
                'hancms.ai_assistant.post_assistant.statistics_title' => 'Thống kê nhóm',
                'hancms.ai_assistant.post_assistant.translate_button' => 'AI dịch tự động',
                'hancms.ai_assistant.post_assistant.translating' => 'Đang dịch...',
                'hancms.ai_assistant.post_assistant.missing_input' => 'Hãy nhập nội dung ở ngôn ngữ hiện tại trước khi dịch.',
                'hancms.ai_assistant.post_assistant.no_target_locales' => 'Không có ngôn ngữ đích để dịch.',
                'hancms.ai_assistant.post_assistant.empty_response' => 'AI chưa trả về bản dịch.',
                'hancms.ai_assistant.post_assistant.failed_translate' => 'Không thể dịch tự động lúc này.',
            ],
            'en' => [
                'hancms.ai_assistant.post_assistant.save_changes' => 'Save changes',
                'hancms.ai_assistant.post_assistant.group_drafts' => 'Drafts in group',
                'hancms.ai_assistant.post_assistant.statistics_title' => 'Group statistics',
                'hancms.ai_assistant.post_assistant.translate_button' => 'AI auto-translate',
                'hancms.ai_assistant.post_assistant.translating' => 'Translating...',
                'hancms.ai_assistant.post_assistant.missing_input' => 'Enter content in the current language before translating.',
                'hancms.ai_assistant.post_assistant.no_target_locales' => 'No target languages available for translation.',
                'hancms.ai_assistant.post_assistant.empty_response' => 'AI did not return any translations.',
                'hancms.ai_assistant.post_assistant.failed_translate' => 'Unable to translate automatically right now.',
            ],
            'ja' => [
                'hancms.ai_assistant.post_assistant.save_changes' => '変更を保存',
                'hancms.ai_assistant.post_assistant.group_drafts' => 'グループ内の下書き',
                'hancms.ai_assistant.post_assistant.statistics_title' => 'グループ統計',
                'hancms.ai_assistant.post_assistant.translate_button' => 'AI自動翻訳',
                'hancms.ai_assistant.post_assistant.translating' => '翻訳中...',
                'hancms.ai_assistant.post_assistant.missing_input' => '翻訳する前に、現在の言語で内容を入力してください。',
                'hancms.ai_assistant.post_assistant.no_target_locales' => '翻訳先の言語がありません。',
                'hancms.ai_assistant.post_assistant.empty_response' => 'AIが翻訳を返しませんでした。',
                'hancms.ai_assistant.post_assistant.failed_translate' => '現在、自動翻訳できません。',
            ],
        ];

        foreach ($expected as $locale => $translations) {
            app()->setLocale($locale);

            foreach ($translations as $key => $value) {
                $this->assertSame($value, trans($key));
            }
        }
    }
}
