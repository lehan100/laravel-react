<?php

namespace App\Services\Settings;

use Illuminate\Support\Facades\File;

class FrontendTranslationBundleService
{
    public function __construct(private ?string $basePath = null)
    {
        $this->basePath = $this->basePath ?? lang_path();
    }

    /**
     * Ensure all generated frontend translation bundles exist.
     *
     * @return array<int, string>
     */
    public function ensure(?string $basePath = null): array
    {
        if ($basePath !== null && $basePath !== '') {
            $this->basePath = $basePath;
        }

        if ($this->missingGeneratedBundles() === []) {
            return [];
        }

        return $this->sync();
    }

    /**
     * Sync translated PHP locale files into frontend JSON bundles.
     *
     * @return array<int, string>
     */
    public function sync(?string $basePath = null): array
    {
        if ($basePath !== null && $basePath !== '') {
            $this->basePath = $basePath;
        }

        $generatedFiles = [];

        foreach ($this->getLocales() as $locale) {
            $translations = $this->collectLocaleTranslations($locale);

            if ($translations === []) {
                $this->deleteGeneratedBundle($locale);

                continue;
            }

            $generatedFiles[] = $this->writeGeneratedBundle($locale, $translations);
        }

        return $generatedFiles;
    }

    /**
     * @return array<int, string>
     */
    public function missingGeneratedBundles(?string $basePath = null): array
    {
        if ($basePath !== null && $basePath !== '') {
            $this->basePath = $basePath;
        }

        return collect($this->getLocales())
            ->filter(fn (string $locale): bool => ! File::exists($this->generatedBundlePath($locale)))
            ->values()
            ->all();
    }

    /**
     * @return array<int, string>
     */
    private function getLocales(): array
    {
        if (! File::isDirectory($this->basePath)) {
            return [];
        }

        return collect(File::directories($this->basePath))
            ->map(fn (string $directory): string => basename($directory))
            ->filter(function (string $locale): bool {
                return File::isDirectory($this->localePath($locale))
                    && collect(File::allFiles($this->localePath($locale)))
                        ->contains(fn ($file): bool => $file->getExtension() === 'php');
            })
            ->sort()
            ->values()
            ->all();
    }

    /**
     * @return array<string, string>
     */
    private function collectLocaleTranslations(string $locale): array
    {
        $localePath = $this->localePath($locale);

        if (! File::isDirectory($localePath)) {
            return [];
        }

        $translations = [];

        collect(File::allFiles($localePath))
            ->filter(fn ($file): bool => $file->getExtension() === 'php')
            ->sortBy(fn ($file): string => $file->getPathname())
            ->each(function ($file) use (&$translations, $localePath): void {
                $content = require $file->getPathname();

                if (! is_array($content)) {
                    return;
                }

                $prefix = $this->translationPrefix($localePath, $file->getPathname());
                $translations = array_merge(
                    $translations,
                    $this->flattenTranslations($content, $prefix)
                );
            });

        return $translations;
    }

    /**
     * @param  array<string, mixed>  $translations
     */
    private function writeGeneratedBundle(string $locale, array $translations): string
    {
        $path = $this->generatedBundlePath($locale);
        $directory = dirname($path);

        if (! File::isDirectory($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        File::put($path, json_encode($translations, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

        return $path;
    }

    private function deleteGeneratedBundle(string $locale): void
    {
        $path = $this->generatedBundlePath($locale);

        if (File::exists($path)) {
            File::delete($path);
        }
    }

    /**
     * @param  array<string, mixed>  $translations
     * @return array<string, string>
     */
    private function flattenTranslations(array $translations, string $prefix = ''): array
    {
        $flattened = [];

        foreach ($translations as $key => $value) {
            $dotKey = $prefix === '' ? (string) $key : $prefix.'.'.(string) $key;

            if (is_array($value)) {
                $flattened = array_merge($flattened, $this->flattenTranslations($value, $dotKey));

                continue;
            }

            $flattened[$dotKey] = is_scalar($value) ? (string) $value : '';
        }

        return $flattened;
    }

    private function translationPrefix(string $localePath, string $filePath): string
    {
        $relativePath = str_replace($localePath.DIRECTORY_SEPARATOR, '', $filePath);
        $relativePath = preg_replace('/\.php$/', '', $relativePath) ?? '';

        return str_replace(DIRECTORY_SEPARATOR, '.', $relativePath);
    }

    private function localePath(string $locale): string
    {
        return rtrim($this->basePath, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$locale;
    }

    private function generatedBundlePath(string $locale): string
    {
        return rtrim($this->basePath, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.'php_'.$locale.'.json';
    }
}
