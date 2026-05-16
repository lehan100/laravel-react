<?php

namespace App\Services\Settings;

use Illuminate\Support\Facades\File;

class LabelTranslationService
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

        $translationKeys = [];
        foreach ($locales as $locale) {
            foreach (array_keys($this->flattenLocaleTranslations($locale, $basePath)) as $translationKey) {
                if (! in_array($translationKey, $translationKeys, true)) {
                    $translationKeys[] = $translationKey;
                }
            }
        }

        $translations = [];
        foreach ($locales as $locale) {
            $localeTranslations = $this->flattenLocaleTranslations($locale, $basePath);

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

    /**
     * @return array<string, mixed>
     */
    private function flattenLocaleTranslations(string $locale, ?string $basePath = null): array
    {
        return $this->flattenTranslations($this->loadLocaleFile($locale, 'label.php', $basePath));
    }

    /**
     * @return array<string, mixed>
     */
    private function loadLocaleFile(string $locale, string $fileName, ?string $basePath = null): array
    {
        $path = $this->localeFilePath($locale, $fileName, $basePath);

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

    private function localeFilePath(string $locale, string $fileName, ?string $basePath = null): string
    {
        $base = $basePath ? rtrim($basePath, DIRECTORY_SEPARATOR) : lang_path();

        return $base.DIRECTORY_SEPARATOR.$locale.DIRECTORY_SEPARATOR.$fileName;
    }
}
