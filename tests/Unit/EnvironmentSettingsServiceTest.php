<?php

namespace Tests\Unit;

use App\Services\Settings\EnvironmentSettingsService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class EnvironmentSettingsServiceTest extends TestCase
{
    #[Test]
    public function it_reads_and_updates_ai_environment_values(): void
    {
        $path = tempnam(sys_get_temp_dir(), 'env-settings-');
        $this->assertIsString($path);

        file_put_contents($path, implode(PHP_EOL, [
            'APP_NAME=Laravel',
            'AI_PROVIDER=gemini',
            'OPENAI_API_KEY="old key"',
            'OLLAMA_BASE_URL=http://localhost:11434',
            '',
        ]));

        try {
            $service = new EnvironmentSettingsService($path);

            $current = $service->currentAiSettings();

            $this->assertSame('gemini', $current['AI_PROVIDER']);
            $this->assertSame('old key', $current['OPENAI_API_KEY']);
            $this->assertSame('http://localhost:11434', $current['OLLAMA_BASE_URL']);

            $service->updateValues([
                'AI_PROVIDER' => 'openai',
                'OPENAI_API_KEY' => 'new secret key',
                'OLLAMA_BASE_URL' => 'http://127.0.0.1:11434',
            ]);

            $updated = file_get_contents($path);

            $this->assertIsString($updated);
            $this->assertStringContainsString('AI_PROVIDER=openai', $updated);
            $this->assertStringContainsString('OPENAI_API_KEY="new secret key"', $updated);
            $this->assertStringContainsString('OLLAMA_BASE_URL=http://127.0.0.1:11434', $updated);
            $this->assertStringContainsString('APP_NAME=Laravel', $updated);
        } finally {
            @unlink($path);
        }
    }
}
