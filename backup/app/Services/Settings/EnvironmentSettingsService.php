<?php

namespace App\Services\Settings;

use Illuminate\Support\Str;

class EnvironmentSettingsService
{
    public function __construct(private ?string $path = null)
    {
        $this->path = $this->path ?? base_path('.env');
    }

    /**
     * Get the list of editable AI environment keys.
     *
     * @return array<int, string>
     */
    public function aiKeys(): array
    {
        return [
            'AI_PROVIDER',
            'AI_IMAGE_PROVIDER',
            'AI_AUDIO_PROVIDER',
            'AI_TRANSCRIPTION_PROVIDER',
            'AI_EMBEDDING_PROVIDER',
            'AI_RERANKING_PROVIDER',
            'ANTHROPIC_API_KEY',
            'AZURE_OPENAI_API_KEY',
            'AZURE_OPENAI_URL',
            'AZURE_OPENAI_API_VERSION',
            'AZURE_OPENAI_DEPLOYMENT',
            'AZURE_OPENAI_EMBEDDING_DEPLOYMENT',
            'COHERE_API_KEY',
            'DEEPSEEK_API_KEY',
            'ELEVENLABS_API_KEY',
            'GEMINI_API_KEY',
            'GROQ_API_KEY',
            'JINA_API_KEY',
            'MISTRAL_API_KEY',
            'OLLAMA_API_KEY',
            'OLLAMA_BASE_URL',
            'OPENAI_API_KEY',
            'OPENROUTER_API_KEY',
            'VOYAGEAI_API_KEY',
            'XAI_API_KEY',
        ];
    }

    /**
     * Read the current AI settings from the environment file.
     *
     * @return array<string, string>
     */
    public function currentAiSettings(): array
    {
        return $this->readValues($this->aiKeys());
    }

    /**
     * Read the given keys from the environment file.
     *
     * @param  array<int, string>  $keys
     * @return array<string, string>
     */
    public function readValues(array $keys): array
    {
        $values = array_fill_keys($keys, '');
        $contents = $this->readFile();

        foreach ($this->splitLines($contents) as $line) {
            if (! preg_match('/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/', $line, $matches)) {
                continue;
            }

            $key = $matches[1];

            if (! array_key_exists($key, $values)) {
                continue;
            }

            $values[$key] = $this->parseValue($matches[2]);
        }

        return $values;
    }

    /**
     * Persist the given environment values to disk.
     *
     * @param  array<string, scalar|null>  $values
     */
    public function updateValues(array $values): void
    {
        $contents = $this->readFile();
        $lines = $this->splitLines($contents);
        $remaining = $values;

        foreach ($lines as $index => $line) {
            if (! preg_match('/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/', $line, $matches)) {
                continue;
            }

            $key = $matches[1];

            if (! array_key_exists($key, $remaining)) {
                continue;
            }

            $lines[$index] = $key.'='.$this->formatValue($remaining[$key]);
            unset($remaining[$key]);
        }

        foreach ($remaining as $key => $value) {
            $lines[] = $key.'='.$this->formatValue($value);
        }

        $this->writeFile(implode(PHP_EOL, $lines));
    }

    /**
     * Read the raw environment file contents.
     */
    private function readFile(): string
    {
        if (! file_exists($this->path)) {
            return '';
        }

        return (string) file_get_contents($this->path);
    }

    /**
     * Write the environment file contents.
     */
    private function writeFile(string $contents): void
    {
        $normalizedContents = rtrim($contents, "\r\n").PHP_EOL;
        file_put_contents($this->path, $normalizedContents);
    }

    /**
     * Split file content into individual lines.
     *
     * @return array<int, string>
     */
    private function splitLines(string $contents): array
    {
        if ($contents === '') {
            return [];
        }

        /** @var array<int, string> $lines */
        $lines = preg_split('/\R/', $contents) ?: [];

        return $lines;
    }

    /**
     * Parse a raw environment value.
     */
    private function parseValue(string $value): string
    {
        $trimmed = trim($value);

        if ($trimmed === "''" || $trimmed === '""') {
            return '';
        }

        if (Str::startsWith($trimmed, '"') && Str::endsWith($trimmed, '"')) {
            return stripcslashes(substr($trimmed, 1, -1));
        }

        if (Str::startsWith($trimmed, "'") && Str::endsWith($trimmed, "'")) {
            return substr($trimmed, 1, -1);
        }

        return $trimmed;
    }

    /**
     * Format a value for .env storage.
     *
     * @param  scalar|null  $value
     */
    private function formatValue(mixed $value): string
    {
        $stringValue = $value === null ? '' : (string) $value;

        if ($stringValue === '') {
            return '';
        }

        if (preg_match('/[\s#"\']/', $stringValue) === 1) {
            return '"'.addcslashes($stringValue, '\\"').'"';
        }

        return $stringValue;
    }
}
