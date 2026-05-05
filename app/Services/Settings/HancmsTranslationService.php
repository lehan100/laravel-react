<?php

namespace App\Services\Settings;

use Illuminate\Support\Facades\File;

class HancmsTranslationService
{
    /**
     * @return array{translation_keys: array<int, string>, translations: array<string, array<string, string>>}
     */
    public function loadEditableTranslations(array $locales, ?string $basePath = null): array
    {
        $locales = array_values(array_filter($locales, static fn ($locale) => is_string($locale) && $locale !== ''));

        if ($locales === []) {
            return [
                'translation_keys' => [],
                'translations' => [],
            ];
        }

        $baseLocale = in_array(config('app.fallback_locale', 'vi'), $locales, true)
            ? (string) config('app.fallback_locale', 'vi')
            : $locales[0];

        $masterTranslations = $this->loadLocaleFile($baseLocale, $basePath);
        $translationKeys = array_keys($this->flattenTranslations($masterTranslations));

        $translations = [];
        foreach ($locales as $locale) {
            $localeTranslations = $this->flattenTranslations($this->loadLocaleFile($locale, $basePath));

            $translations[$locale] = [];
            foreach ($translationKeys as $translationKey) {
                $translations[$locale][$translationKey] = (string) ($localeTranslations[$translationKey] ?? '');
            }
        }

        return [
            'translation_keys' => $translationKeys,
            'translations' => $translations,
        ];
    }

    public function saveTranslations(array $translations, ?string $basePath = null): void
    {
        foreach ($translations as $locale => $localeTranslations) {
            if (! is_string($locale) || $locale === '' || ! is_array($localeTranslations)) {
                continue;
            }

            $content = $this->loadLocaleFile($locale, $basePath);

            foreach ($localeTranslations as $key => $value) {
                if (! is_string($key) || $key === '') {
                    continue;
                }

                $this->setNestedTranslation($content, $key, is_scalar($value) ? (string) $value : '');
            }

            $this->writeLocaleFile($locale, $content, $basePath);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function loadLocaleFile(string $locale, ?string $basePath = null): array
    {
        $path = $this->localeFilePath($locale, $basePath);

        if (! File::exists($path)) {
            return [];
        }

        $content = require $path;

        return is_array($content) ? $content : [];
    }

    /**
     * @return array<string, string>
     */
    private function flattenTranslations(array $translations, string $prefix = ''): array
    {
        $flattened = [];

        foreach ($translations as $key => $value) {
            $key = (string) $key;
            $dotKey = $prefix === '' ? $key : $prefix.'.'.$key;

            if (is_array($value)) {
                $flattened = array_merge($flattened, $this->flattenTranslations($value, $dotKey));

                continue;
            }

            $flattened[$dotKey] = is_scalar($value) ? (string) $value : '';
        }

        return $flattened;
    }

    /**
     * @param  array<string, mixed>  $content
     */
    private function setNestedTranslation(array &$content, string $key, string $value): void
    {
        $segments = explode('.', $key);
        $cursor = &$content;

        foreach ($segments as $segment) {
            if (! array_key_exists($segment, $cursor) || ! is_array($cursor[$segment])) {
                $cursor[$segment] = [];
            }

            $cursor = &$cursor[$segment];
        }

        $cursor = $value;
    }

    private function writeLocaleFile(string $locale, array $content, ?string $basePath = null): void
    {
        $path = $this->localeFilePath($locale, $basePath);
        $directory = dirname($path);

        if (! File::isDirectory($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $fileContent = "<?php\n\nreturn ".var_export($content, true).";\n";

        File::put($path, $fileContent);
    }

    private function localeFilePath(string $locale, ?string $basePath = null): string
    {
        $base = $basePath ? rtrim($basePath, DIRECTORY_SEPARATOR) : lang_path();

        return $base.DIRECTORY_SEPARATOR.$locale.DIRECTORY_SEPARATOR.'hancms.php';
    }
}
