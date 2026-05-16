<?php

namespace Tests\Unit;

use App\Services\Settings\MailTemplateSampleService;
use Illuminate\Support\Facades\File;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MailTemplateSampleServiceTest extends TestCase
{
    #[Test]
    public function it_loads_body_only_email_templates_from_files(): void
    {
        $labelPath = lang_path('vi/label.php');
        $originalLabelExists = File::exists($labelPath);
        $originalLabelContent = $originalLabelExists ? File::get($labelPath) : null;

        try {
            $currentLabel = $originalLabelExists ? require $labelPath : [];
            $currentLabel = is_array($currentLabel) ? $currentLabel : [];

            File::put(
                $labelPath,
                "<?php\n\nreturn ".var_export(array_replace($currentLabel, [
                    'brand_phone_label' => 'Điện thoại riêng',
                ]), true).";\n"
            );

            $service = app(MailTemplateSampleService::class);
            $samples = $service->all();
            $templatePath = resource_path('views/mail-templates/templates/order-created.html');
            $rawTemplate = File::get($templatePath);

            $this->assertCount(5, $samples);
            $this->assertSame('order_created', $samples[0]['key']);
            $this->assertStringContainsString('{{items_html}}', $samples[0]['translations']['vi']['body_html']);
            $this->assertStringContainsString('Sản phẩm đã mua', $samples[0]['translations']['vi']['body_html']);
            $this->assertStringContainsString('Mã đơn hàng', $samples[0]['translations']['vi']['body_html']);
            $this->assertStringNotContainsString('Điện thoại riêng', $samples[0]['translations']['vi']['body_html']);
            $this->assertStringNotContainsString('Nếu bạn không đặt đơn hàng này', $samples[0]['translations']['vi']['body_html']);
            $this->assertStringContainsString('Purchased items', $samples[0]['translations']['en']['body_html']);
            $this->assertStringNotContainsString('Phone', $samples[0]['translations']['vi']['body_html']);
            $this->assertStringNotContainsString('Phone', $samples[0]['translations']['en']['body_html']);
            $this->assertStringContainsString('Order code', $samples[0]['translations']['en']['body_html']);
            $this->assertStringContainsString('注文番号', $samples[0]['translations']['ja']['body_html']);
            $this->assertStringContainsString('購入商品', $samples[0]['translations']['ja']['body_html']);
            $this->assertStringNotContainsString('{{mail_footer}}', $samples[0]['translations']['vi']['body_html']);
            $this->assertStringNotContainsString('{{mail_headline}}', $samples[0]['translations']['vi']['body_html']);
            $this->assertStringNotContainsString('{{mail_intro}}', $samples[0]['translations']['vi']['body_html']);
            $this->assertStringNotContainsString('@include', $samples[0]['translations']['vi']['body_html']);
            $this->assertStringStartsWith('<tr>', ltrim($rawTemplate));
            $this->assertStringNotContainsString('{{brand_company}}', $rawTemplate);
            $this->assertStringNotContainsString('Purchased items', $rawTemplate);
            $this->assertStringContainsString('{{items_heading}}', $rawTemplate);
            $this->assertStringContainsString('{{items_item_label}}', $rawTemplate);
            $this->assertStringContainsString('{{items_qty_label}}', $rawTemplate);
            $this->assertStringContainsString('{{items_amount_label}}', $rawTemplate);
            $this->assertStringNotContainsString('Phone:', $rawTemplate);
            $this->assertStringNotContainsString('{{brand_phone_label}}', $rawTemplate);
            $this->assertStringNotContainsString('{{brand_address_label}}', $rawTemplate);
            $this->assertStringNotContainsString('{{brand_tax_label}}', $rawTemplate);
        } finally {
            if ($originalLabelExists) {
                File::put($labelPath, $originalLabelContent);
            } elseif (File::exists($labelPath)) {
                File::delete($labelPath);
            }
        }
    }
}
