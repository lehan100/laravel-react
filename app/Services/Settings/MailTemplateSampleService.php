<?php

namespace App\Services\Settings;

use Illuminate\Support\Facades\File;
use RuntimeException;

class MailTemplateSampleService
{
    /**
     * @return array<int, array<string, mixed>>
     */
    public function all(): array
    {
        return [
            $this->sample(
                key: 'order_created',
                label: __('hancms.settings.mail_template.samples.new_order'),
                fallbackLocale: 'vi',
                variables: [
                    'brand_company',
                    'brand_phone',
                    'brand_address',
                    'brand_logo_url',
                    'brand_copyright',
                    'order_code',
                    'customer_name',
                    'order_total',
                    'payment_method',
                    'shipping_method',
                    'order_url',
                    'items_html',
                    'items_text',
                    'items_count',
                ],
                translations: [
                    'vi' => [
                        'locale' => 'vi',
                        'name' => 'Đơn hàng mới',
                        'subject' => 'Đơn hàng #{{order_code}} đã được tạo',
                        'body_html' => $this->loadTemplateBodyHtml('order-created', 'vi'),
                    ],
                    'en' => [
                        'locale' => 'en',
                        'name' => 'New Order',
                        'subject' => 'Order #{{order_code}} has been created',
                        'body_html' => $this->loadTemplateBodyHtml('order-created', 'en'),
                    ],
                    'ja' => [
                        'locale' => 'ja',
                        'name' => '新しい注文',
                        'subject' => '注文 #{{order_code}} が作成されました',
                        'body_html' => $this->loadTemplateBodyHtml('order-created', 'ja'),
                    ],
                ],
            ),
            $this->sample(
                key: 'order_updated',
                label: __('hancms.settings.mail_template.samples.order_updated'),
                fallbackLocale: 'vi',
                variables: [
                    'brand_company',
                    'brand_phone',
                    'brand_address',
                    'brand_logo_url',
                    'brand_copyright',
                    'order_code',
                    'customer_name',
                    'order_status',
                    'order_total',
                    'order_url',
                    'items_html',
                    'items_text',
                    'items_count',
                ],
                translations: [
                    'vi' => [
                        'locale' => 'vi',
                        'name' => 'Cập nhật đơn hàng',
                        'subject' => 'Đơn hàng #{{order_code}} đã được cập nhật',
                        'body_html' => $this->loadTemplateBodyHtml('order-updated', 'vi'),
                    ],
                    'en' => [
                        'locale' => 'en',
                        'name' => 'Order Updated',
                        'subject' => 'Order #{{order_code}} has been updated',
                        'body_html' => $this->loadTemplateBodyHtml('order-updated', 'en'),
                    ],
                    'ja' => [
                        'locale' => 'ja',
                        'name' => '注文更新',
                        'subject' => '注文 #{{order_code}} が更新されました',
                        'body_html' => $this->loadTemplateBodyHtml('order-updated', 'ja'),
                    ],
                ],
            ),
            $this->sample(
                key: 'order_paid',
                label: __('hancms.settings.mail_template.samples.order_paid'),
                fallbackLocale: 'vi',
                variables: [
                    'brand_company',
                    'brand_phone',
                    'brand_address',
                    'brand_logo_url',
                    'brand_copyright',
                    'order_code',
                    'customer_name',
                    'amount_paid',
                    'payment_method',
                    'order_total',
                    'order_url',
                ],
                translations: [
                    'vi' => [
                        'locale' => 'vi',
                        'name' => 'Thanh toán thành công',
                        'subject' => 'Đơn hàng #{{order_code}} đã thanh toán thành công',
                        'body_html' => $this->loadTemplateBodyHtml('order-paid', 'vi'),
                    ],
                    'en' => [
                        'locale' => 'en',
                        'name' => 'Payment Successful',
                        'subject' => 'Order #{{order_code}} has been paid successfully',
                        'body_html' => $this->loadTemplateBodyHtml('order-paid', 'en'),
                    ],
                    'ja' => [
                        'locale' => 'ja',
                        'name' => '支払い完了',
                        'subject' => '注文 #{{order_code}} の支払いが完了しました',
                        'body_html' => $this->loadTemplateBodyHtml('order-paid', 'ja'),
                    ],
                ],
            ),
            $this->sample(
                key: 'order_shipped',
                label: __('hancms.settings.mail_template.samples.order_shipped'),
                fallbackLocale: 'vi',
                variables: [
                    'brand_company',
                    'brand_phone',
                    'brand_address',
                    'brand_logo_url',
                    'brand_copyright',
                    'order_code',
                    'customer_name',
                    'shipping_method',
                    'tracking_number',
                    'tracking_url',
                    'order_total',
                    'order_url',
                ],
                translations: [
                    'vi' => [
                        'locale' => 'vi',
                        'name' => 'Đã giao hàng',
                        'subject' => 'Đơn hàng #{{order_code}} đã được bàn giao cho đơn vị vận chuyển',
                        'body_html' => $this->loadTemplateBodyHtml('order-shipped', 'vi'),
                    ],
                    'en' => [
                        'locale' => 'en',
                        'name' => 'Order Shipped',
                        'subject' => 'Order #{{order_code}} has been handed to the shipping carrier',
                        'body_html' => $this->loadTemplateBodyHtml('order-shipped', 'en'),
                    ],
                    'ja' => [
                        'locale' => 'ja',
                        'name' => '発送済み',
                        'subject' => '注文 #{{order_code}} が配送業者に引き渡されました',
                        'body_html' => $this->loadTemplateBodyHtml('order-shipped', 'ja'),
                    ],
                ],
            ),
            $this->sample(
                key: 'order_cancelled',
                label: __('hancms.settings.mail_template.samples.order_cancelled'),
                fallbackLocale: 'vi',
                variables: [
                    'brand_company',
                    'brand_phone',
                    'brand_address',
                    'brand_logo_url',
                    'brand_copyright',
                    'order_code',
                    'customer_name',
                    'cancellation_reason',
                    'order_total',
                    'order_url',
                ],
                translations: [
                    'vi' => [
                        'locale' => 'vi',
                        'name' => 'Đơn hàng đã hủy',
                        'subject' => 'Đơn hàng #{{order_code}} đã được hủy',
                        'body_html' => $this->loadTemplateBodyHtml('order-cancelled', 'vi'),
                    ],
                    'en' => [
                        'locale' => 'en',
                        'name' => 'Order Cancelled',
                        'subject' => 'Order #{{order_code}} has been cancelled',
                        'body_html' => $this->loadTemplateBodyHtml('order-cancelled', 'en'),
                    ],
                    'ja' => [
                        'locale' => 'ja',
                        'name' => '注文キャンセル',
                        'subject' => '注文 #{{order_code}} はキャンセルされました',
                        'body_html' => $this->loadTemplateBodyHtml('order-cancelled', 'ja'),
                    ],
                ],
            ),
        ];
    }

    /**
     * @param  array<int, string>  $variables
     * @param  array<string, array{locale: string, name: string, subject: string, body_html: string}>  $translations
     * @return array<string, mixed>
     */
    private function sample(string $key, string $label, string $fallbackLocale, array $variables, array $translations): array
    {
        return [
            'key' => $key,
            'label' => $label,
            'fallbackLocale' => $fallbackLocale,
            'variables' => $variables,
            'translations' => $translations,
        ];
    }

    private function loadTemplateBodyHtml(string $templateKey, string $locale): string
    {
        $copy = $this->templateCopyFor($templateKey, $locale);
        $replacements = array_merge($copy, $this->mailTemplateLocaleTokens($locale), [
            'mail_headline' => $copy['headline'],
            'mail_intro' => $copy['intro'],
            'mail_footer' => $copy['footer'],
        ]);

        return $this->replaceTemplateTokens($this->loadTemplateBody($templateKey), $replacements);
    }

    private function loadTemplateBody(string $templateKey): string
    {
        $path = resource_path("views/mail-templates/templates/{$templateKey}.html");

        if (! File::exists($path)) {
            throw new RuntimeException(sprintf('Mail template HTML file not found: %s', $path));
        }

        return File::get($path);
    }

    private function loadTemplatePartial(string $name): string
    {
        $path = resource_path("views/mail-templates/templates/partials/{$name}.html");

        if (! File::exists($path)) {
            throw new RuntimeException(sprintf('Mail template partial not found: %s', $path));
        }

        return File::get($path);
    }

    /**
     * @param  array<string, string>  $replacements
     */
    private function replaceTemplateTokens(string $content, array $replacements): string
    {
        return preg_replace_callback('/{{\s*([a-zA-Z0-9_.-]+)\s*}}/', static function (array $matches) use ($replacements): string {
            $token = $matches[1];

            return $replacements[$token] ?? $matches[0];
        }, $content) ?? $content;
    }

    /**
     * @return array{title: string, headline: string, intro: string, footer: string}
     */
    private function templateCopyFor(string $templateKey, string $locale): array
    {
        $copies = [
            'order-created' => [
                'vi' => [
                    'title' => 'New Order',
                    'headline' => 'Đơn hàng mới',
                    'intro' => 'Xin chào {{customer_name}}, đơn hàng của bạn đã được tiếp nhận thành công.',
                    'footer' => 'Nếu bạn không đặt đơn hàng này, vui lòng liên hệ ngay với bộ phận hỗ trợ.',
                ],
                'en' => [
                    'title' => 'New Order',
                    'headline' => 'New Order',
                    'intro' => 'Hello {{customer_name}}, your order has been successfully received.',
                    'footer' => 'If you did not place this order, please contact our support team immediately.',
                ],
                'ja' => [
                    'title' => '新しい注文',
                    'headline' => '新しい注文',
                    'intro' => '{{customer_name}} 様、ご注文は正常に受け付けられました。',
                    'footer' => 'この注文に心当たりがない場合は、すぐにサポートまでご連絡ください。',
                ],
            ],
            'order-updated' => [
                'vi' => [
                    'title' => 'Order Updated',
                    'headline' => 'Cập nhật đơn hàng',
                    'intro' => 'Xin chào {{customer_name}}, đơn hàng #{{order_code}} vừa có cập nhật mới.',
                    'footer' => 'Nếu bạn cần hỗ trợ, đội ngũ chăm sóc khách hàng luôn sẵn sàng.',
                ],
                'en' => [
                    'title' => 'Order Updated',
                    'headline' => 'Order Updated',
                    'intro' => 'Hello {{customer_name}}, your order #{{order_code}} has a new update.',
                    'footer' => 'If you need help, our support team is here for you.',
                ],
                'ja' => [
                    'title' => '注文更新',
                    'headline' => '注文更新',
                    'intro' => '{{customer_name}} 様、注文 #{{order_code}} に更新があります。',
                    'footer' => 'ご不明点があれば、サポートチームまでご連絡ください。',
                ],
            ],
            'order-paid' => [
                'vi' => [
                    'title' => 'Payment Successful',
                    'headline' => 'Thanh toán thành công',
                    'intro' => 'Xin chào {{customer_name}}, thanh toán cho đơn hàng #{{order_code}} đã được xác nhận.',
                    'footer' => 'Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đang được chuẩn bị.',
                ],
                'en' => [
                    'title' => 'Payment Successful',
                    'headline' => 'Payment Confirmed',
                    'intro' => 'Hello {{customer_name}}, we have received payment for order #{{order_code}}.',
                    'footer' => 'Thank you for your payment. Your order is being prepared.',
                ],
                'ja' => [
                    'title' => '支払い完了',
                    'headline' => '支払い完了',
                    'intro' => '{{customer_name}} 様、注文 #{{order_code}} の支払いを確認しました。',
                    'footer' => 'ご入金ありがとうございます。現在注文を準備しています。',
                ],
            ],
            'order-shipped' => [
                'vi' => [
                    'title' => 'Order Shipped',
                    'headline' => 'Đã giao hàng',
                    'intro' => 'Xin chào {{customer_name}}, đơn hàng #{{order_code}} đã được bàn giao cho đơn vị vận chuyển.',
                    'footer' => 'Bạn có thể theo dõi hành trình đơn hàng qua liên kết bên dưới.',
                ],
                'en' => [
                    'title' => 'Order Shipped',
                    'headline' => 'Your order is on the way',
                    'intro' => 'Hello {{customer_name}}, your order #{{order_code}} has been handed over to the shipping carrier.',
                    'footer' => 'You can follow the shipment journey using the link below.',
                ],
                'ja' => [
                    'title' => '発送済み',
                    'headline' => '発送済み',
                    'intro' => '{{customer_name}} 様、注文 #{{order_code}} は配送業者に引き渡されました。',
                    'footer' => '以下のリンクから配送状況を確認できます。',
                ],
            ],
            'order-cancelled' => [
                'vi' => [
                    'title' => 'Order Cancelled',
                    'headline' => 'Đơn hàng đã hủy',
                    'intro' => 'Xin chào {{customer_name}}, đơn hàng #{{order_code}} đã được hủy.',
                    'footer' => 'Nếu bạn cần hỗ trợ thêm, vui lòng liên hệ với chúng tôi.',
                ],
                'en' => [
                    'title' => 'Order Cancelled',
                    'headline' => 'Order Cancelled',
                    'intro' => 'Hello {{customer_name}}, your order #{{order_code}} has been cancelled.',
                    'footer' => 'If you need further assistance, please contact us.',
                ],
                'ja' => [
                    'title' => '注文キャンセル',
                    'headline' => '注文キャンセル',
                    'intro' => '{{customer_name}} 様、注文 #{{order_code}} はキャンセルされました。',
                    'footer' => 'さらにサポートが必要な場合は、お問い合わせください。',
                ],
            ],
        ];

        $templateCopies = $copies[$templateKey] ?? $copies['order-created'];

        return $templateCopies[$locale] ?? $templateCopies['vi'];
    }

    /**
     * @return array<string, string>
     */
    private function mailTemplateLocaleTokens(string $locale): array
    {
        return match (strtolower($locale)) {
            'en' => [
                'brand_phone_label' => $this->resolveTokenLabel($locale, 'brand_phone_label'),
                'brand_address_label' => $this->resolveTokenLabel($locale, 'brand_address_label'),
                'brand_tax_label' => $this->resolveTokenLabel($locale, 'brand_tax_label'),
                'order_code_label' => $this->resolveTokenLabel($locale, 'order_code_label'),
                'customer_label' => $this->resolveTokenLabel($locale, 'customer_label'),
                'payment_method_label' => $this->resolveTokenLabel($locale, 'payment_method_label'),
                'shipping_method_label' => $this->resolveTokenLabel($locale, 'shipping_method_label'),
                'paid_amount_label' => $this->resolveTokenLabel($locale, 'paid_amount_label'),
                'order_total_label' => $this->resolveTokenLabel($locale, 'order_total_label'),
                'cancellation_reason_label' => $this->resolveTokenLabel($locale, 'cancellation_reason_label'),
                'new_status_label' => $this->resolveTokenLabel($locale, 'new_status_label'),
                'tracking_number_label' => $this->resolveTokenLabel($locale, 'tracking_number_label'),
                'items_heading' => $this->resolveTokenLabel($locale, 'items_heading'),
                'items_item_label' => $this->resolveTokenLabel($locale, 'items_item_label'),
                'items_qty_label' => $this->resolveTokenLabel($locale, 'items_qty_label'),
                'items_amount_label' => $this->resolveTokenLabel($locale, 'items_amount_label'),
                'order_cta_label' => $this->resolveTokenLabel($locale, 'order_cta_label'),
                'update_cta_label' => $this->resolveTokenLabel($locale, 'update_cta_label'),
                'pay_cta_label' => $this->resolveTokenLabel($locale, 'pay_cta_label'),
                'track_cta_label' => $this->resolveTokenLabel($locale, 'track_cta_label'),
            ],
            'ja' => [
                'brand_phone_label' => $this->resolveTokenLabel($locale, 'brand_phone_label'),
                'brand_address_label' => $this->resolveTokenLabel($locale, 'brand_address_label'),
                'brand_tax_label' => $this->resolveTokenLabel($locale, 'brand_tax_label'),
                'order_code_label' => $this->resolveTokenLabel($locale, 'order_code_label'),
                'customer_label' => $this->resolveTokenLabel($locale, 'customer_label'),
                'payment_method_label' => $this->resolveTokenLabel($locale, 'payment_method_label'),
                'shipping_method_label' => $this->resolveTokenLabel($locale, 'shipping_method_label'),
                'paid_amount_label' => $this->resolveTokenLabel($locale, 'paid_amount_label'),
                'order_total_label' => $this->resolveTokenLabel($locale, 'order_total_label'),
                'cancellation_reason_label' => $this->resolveTokenLabel($locale, 'cancellation_reason_label'),
                'new_status_label' => $this->resolveTokenLabel($locale, 'new_status_label'),
                'tracking_number_label' => $this->resolveTokenLabel($locale, 'tracking_number_label'),
                'items_heading' => $this->resolveTokenLabel($locale, 'items_heading'),
                'items_item_label' => $this->resolveTokenLabel($locale, 'items_item_label'),
                'items_qty_label' => $this->resolveTokenLabel($locale, 'items_qty_label'),
                'items_amount_label' => $this->resolveTokenLabel($locale, 'items_amount_label'),
                'order_cta_label' => $this->resolveTokenLabel($locale, 'order_cta_label'),
                'update_cta_label' => $this->resolveTokenLabel($locale, 'update_cta_label'),
                'pay_cta_label' => $this->resolveTokenLabel($locale, 'pay_cta_label'),
                'track_cta_label' => $this->resolveTokenLabel($locale, 'track_cta_label'),
            ],
            default => [
                'brand_phone_label' => $this->resolveTokenLabel($locale, 'brand_phone_label'),
                'brand_address_label' => $this->resolveTokenLabel($locale, 'brand_address_label'),
                'brand_tax_label' => $this->resolveTokenLabel($locale, 'brand_tax_label'),
                'order_code_label' => $this->resolveTokenLabel($locale, 'order_code_label'),
                'customer_label' => $this->resolveTokenLabel($locale, 'customer_label'),
                'payment_method_label' => $this->resolveTokenLabel($locale, 'payment_method_label'),
                'shipping_method_label' => $this->resolveTokenLabel($locale, 'shipping_method_label'),
                'paid_amount_label' => $this->resolveTokenLabel($locale, 'paid_amount_label'),
                'order_total_label' => $this->resolveTokenLabel($locale, 'order_total_label'),
                'cancellation_reason_label' => $this->resolveTokenLabel($locale, 'cancellation_reason_label'),
                'new_status_label' => $this->resolveTokenLabel($locale, 'new_status_label'),
                'tracking_number_label' => $this->resolveTokenLabel($locale, 'tracking_number_label'),
                'items_heading' => $this->resolveTokenLabel($locale, 'items_heading'),
                'items_item_label' => $this->resolveTokenLabel($locale, 'items_item_label'),
                'items_qty_label' => $this->resolveTokenLabel($locale, 'items_qty_label'),
                'items_amount_label' => $this->resolveTokenLabel($locale, 'items_amount_label'),
                'order_cta_label' => $this->resolveTokenLabel($locale, 'order_cta_label'),
                'update_cta_label' => $this->resolveTokenLabel($locale, 'update_cta_label'),
                'pay_cta_label' => $this->resolveTokenLabel($locale, 'pay_cta_label'),
                'track_cta_label' => $this->resolveTokenLabel($locale, 'track_cta_label'),
            ],
        };
    }

    private function resolveTokenLabel(string $locale, string $token): string
    {
        $labelValue = $this->loadLocaleTokenValue($locale, 'label.php', [$token]);

        if ($labelValue !== null) {
            return $labelValue;
        }

        $hancmsValue = $this->loadLocaleTokenValue($locale, 'hancms.php', [
            "settings.mail_template.tokens.{$token}",
            $token,
        ]);

        return $hancmsValue ?? '';
    }

    /**
     * @param  array<int, string>  $paths
     */
    private function loadLocaleTokenValue(string $locale, string $fileName, array $paths): ?string
    {
        $path = lang_path($locale.DIRECTORY_SEPARATOR.$fileName);

        if (! File::exists($path)) {
            return null;
        }

        $content = require $path;

        if (! is_array($content)) {
            return null;
        }

        foreach ($paths as $tokenPath) {
            $value = data_get($content, $tokenPath);

            if (is_scalar($value)) {
                return (string) $value;
            }
        }

        return null;
    }
}
