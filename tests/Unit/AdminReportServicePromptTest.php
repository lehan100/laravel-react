<?php

namespace Tests\Unit;

use App\Repositories\BuyToGift\BuyToGiftRepositoryInterface;
use App\Repositories\Coupon\CouponRepositoryInterface;
use App\Repositories\Order\OrderRepositoryInterface;
use App\Repositories\Product\ProductRepositoryInterface;
use App\Repositories\SaleOffer\SaleOfferRepositoryInterface;
use App\Services\Reports\AdminReportService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AdminReportServicePromptTest extends TestCase
{
    #[Test]
    public function it_builds_analysis_prompt_in_the_current_locale(): void
    {
        $service = $this->makeService();

        $this->assertPromptLocale($service, 'vi', 'Phân tích báo cáo sau:', 'HTML fragment gọn, sạch');
        $this->assertPromptLocale($service, 'en', 'Analyze the report below:', 'clean HTML fragment only');
        $this->assertPromptLocale($service, 'ja', '以下のレポートを分析してください:', 'きれいなHTMLフラグメントのみ');
    }

    private function assertPromptLocale(AdminReportService $service, string $locale, string $expectedIntro, string $expectedInstructionSnippet): void
    {
        app()->setLocale($locale);

        $instructions = $this->invokePrivateMethod($service, 'analysisInstructions', [$this->normalizeLocale($locale)]);
        $prompt = $this->invokePrivateMethod($service, 'analysisPrompt', [[
            'type' => 'revenue',
            'title' => 'Sales report',
            'description' => 'Revenue overview',
            'rows' => [],
        ], $this->normalizeLocale($locale)]);

        $this->assertStringContainsString('HTML', $instructions);
        $this->assertStringContainsString($expectedInstructionSnippet, $instructions);
        $this->assertStringContainsString($expectedIntro, $prompt);
        $this->assertStringContainsString('"type":"revenue"', $prompt);
        $this->assertStringContainsString('<h3>', $prompt);
    }

    private function makeService(): AdminReportService
    {
        return new AdminReportService(
            $this->createMock(OrderRepositoryInterface::class),
            $this->createMock(ProductRepositoryInterface::class),
            $this->createMock(CouponRepositoryInterface::class),
            $this->createMock(SaleOfferRepositoryInterface::class),
            $this->createMock(BuyToGiftRepositoryInterface::class),
        );
    }

    /**
     * @param  array<int, mixed>  $arguments
     */
    private function invokePrivateMethod(object $object, string $method, array $arguments = []): mixed
    {
        $reflection = new \ReflectionClass($object);
        $reflectionMethod = $reflection->getMethod($method);
        $reflectionMethod->setAccessible(true);

        return $reflectionMethod->invokeArgs($object, $arguments);
    }

    private function normalizeLocale(string $locale): string
    {
        $normalized = strtolower(trim($locale));

        if ($normalized === 'vn') {
            return 'vi';
        }

        return explode('-', $normalized)[0] ?: 'vi';
    }
}
