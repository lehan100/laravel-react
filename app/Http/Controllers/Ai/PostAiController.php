<?php

namespace App\Http\Controllers\Ai;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use JsonException;

use function Laravel\Ai\agent;

class PostAiController extends Controller
{
    public function suggestContent(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'locale' => ['nullable', 'string', 'max:10'],
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'seo_keyword' => ['nullable', 'string', 'max:2000'],
            'current_content' => ['nullable', 'string', 'max:100000'],
        ]);

        $name = trim((string) ($validated['name'] ?? ''));
        $description = trim((string) ($validated['description'] ?? ''));
        $seoKeyword = trim((string) ($validated['seo_keyword'] ?? ''));
        $currentContent = trim((string) ($validated['current_content'] ?? ''));
        $locale = $this->normalizeLocale($validated['locale'] ?? null);

        if ($name === '' && $description === '' && $seoKeyword === '' && $currentContent === '') {
            return response()->json([
                'message' => __('hancms.catalog.post.ai.missing_input'),
            ], 422);
        }

        try {
            $response = agent(
                instructions: $this->buildInstructions($locale)
            )->prompt($this->buildPrompt($name, $description, $seoKeyword, $currentContent));

            $content = trim((string) $response);

            if ($content === '') {
                return response()->json([
                    'message' => __('hancms.catalog.post.ai.empty_response'),
                ], 422);
            }

            return response()->json([
                'content' => $content,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => __('hancms.catalog.post.ai.failed'),
            ], 500);
        }
    }

    public function suggestSeo(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'locale' => ['nullable', 'string', 'max:10'],
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'seo_keyword' => ['nullable', 'string', 'max:2000'],
            'current_content' => ['nullable', 'string', 'max:100000'],
            'current_seo_title' => ['nullable', 'string', 'max:255'],
            'current_seo_description' => ['nullable', 'string', 'max:1000'],
        ]);

        $name = trim((string) ($validated['name'] ?? ''));
        $description = trim((string) ($validated['description'] ?? ''));
        $seoKeyword = trim((string) ($validated['seo_keyword'] ?? ''));
        $currentContent = trim((string) ($validated['current_content'] ?? ''));
        $currentSeoTitle = trim((string) ($validated['current_seo_title'] ?? ''));
        $currentSeoDescription = trim((string) ($validated['current_seo_description'] ?? ''));
        $locale = $this->normalizeLocale($validated['locale'] ?? null);

        if ($name === '' && $description === '' && $seoKeyword === '' && $currentContent === '') {
            return response()->json([
                'message' => __('hancms.catalog.post.ai.missing_input'),
            ], 422);
        }

        try {
            $response = agent(
                instructions: $this->buildSeoInstructions($locale)
            )->prompt($this->buildSeoPrompt(
                $name,
                $description,
                $seoKeyword,
                $currentContent,
                $currentSeoTitle,
                $currentSeoDescription
            ));

            $parsed = $this->parseSeoResponse(trim((string) $response));

            if (($parsed['seo_title'] ?? '') === '' && ($parsed['seo_description'] ?? '') === '') {
                return response()->json([
                    'message' => __('hancms.catalog.post.ai.empty_response'),
                ], 422);
            }

            return response()->json($parsed);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => __('hancms.catalog.post.ai.failed'),
            ], 500);
        }
    }

    public function translate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'source_locale' => ['required', 'string', 'max:10'],
            'target_locales' => ['required', 'array', 'min:1'],
            'target_locales.*' => ['required', 'string', 'max:10'],
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'content' => ['nullable', 'string', 'max:100000'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_keyword' => ['nullable', 'string', 'max:2000'],
            'seo_description' => ['nullable', 'string', 'max:1000'],
        ]);

        $sourceLocale = $this->normalizeLocale($validated['source_locale']);
        $targetLocales = collect($validated['target_locales'])
            ->map(fn (string $locale): string => $this->normalizeLocale($locale))
            ->filter(fn (string $locale): bool => $locale !== '' && $locale !== $sourceLocale)
            ->unique()
            ->values()
            ->all();

        $name = trim((string) ($validated['name'] ?? ''));
        $description = trim((string) ($validated['description'] ?? ''));
        $content = trim((string) ($validated['content'] ?? ''));
        $seoTitle = trim((string) ($validated['seo_title'] ?? ''));
        $seoKeyword = trim((string) ($validated['seo_keyword'] ?? ''));
        $seoDescription = trim((string) ($validated['seo_description'] ?? ''));

        if ($name === '' && $description === '' && $content === '' && $seoTitle === '' && $seoKeyword === '' && $seoDescription === '') {
            return response()->json([
                'message' => __('hancms.catalog.post.ai.missing_input'),
            ], 422);
        }

        if ($targetLocales === []) {
            return response()->json([
                'message' => __('hancms.catalog.post.ai.empty_response'),
            ], 422);
        }

        try {
            $response = agent(
                instructions: $this->buildTranslationInstructions($sourceLocale, $targetLocales)
            )->prompt($this->buildTranslationPrompt(
                $sourceLocale,
                $targetLocales,
                $name,
                $description,
                $content,
                $seoTitle,
                $seoKeyword,
                $seoDescription
            ));

            $translated = $this->normalizeTranslationResponse(
                $this->parseTranslationResponse(trim((string) $response)),
                $targetLocales
            );

            if ($translated === []) {
                return response()->json([
                    'message' => __('hancms.catalog.post.ai.empty_response'),
                ], 422);
            }

            return response()->json([
                'translations' => $translated,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => __('hancms.catalog.post.ai.failed'),
            ], 500);
        }
    }

    /**
     * @param  array<int, string>  $targetLocales
     */
    private function buildTranslationInstructions(string $sourceLocale, array $targetLocales): string
    {
        $sourceLanguage = $this->languageName($sourceLocale);
        $targetLanguages = collect($targetLocales)
            ->map(fn (string $locale): string => $this->languageName($locale).' ('.$locale.')')
            ->implode(', ');

        return 'You are a professional multilingual editor for blog posts. '
            ."Translate the source content from {$sourceLanguage} into these target languages: {$targetLanguages}. "
            .'Preserve meaning, tone, headings, and SEO intent. '
            .'Return only valid JSON for the requested target locales. '
            .'If a source field is empty, keep the translated field empty. '
            .'Do not add explanations, notes, markdown, or code fences.';
    }

    /**
     * @param  array<int, string>  $targetLocales
     */
    private function buildTranslationPrompt(
        string $sourceLocale,
        array $targetLocales,
        string $name,
        string $description,
        string $content,
        string $seoTitle,
        string $seoKeyword,
        string $seoDescription
    ): string {
        $targets = collect($targetLocales)
            ->map(fn (string $locale): string => '- '.$locale.' => '.$this->languageName($locale))
            ->implode("\n");

        return <<<PROMPT
Translate the post data below from {$sourceLocale} into each target locale.

Target locales:
{$targets}

Source fields:
name: {$name}
description: {$description}
content: {$content}
seo_title: {$seoTitle}
seo_keyword: {$seoKeyword}
seo_description: {$seoDescription}

Return only valid JSON in this exact shape:
{
  "translations": {
    "locale_code": {
      "name": "",
      "description": "",
      "content": "",
      "seo_title": "",
      "seo_keyword": "",
      "seo_description": ""
    }
  }
}
PROMPT;
    }

    /**
     * @return array<string, mixed>
     */
    private function parseTranslationResponse(string $raw): array
    {
        $json = trim($raw);

        if (Str::startsWith($json, '```')) {
            $json = preg_replace('/^```(?:json)?\s*|\s*```$/i', '', $json) ?? $json;
        }

        $start = strpos($json, '{');
        $end = strrpos($json, '}');

        if ($start !== false && $end !== false && $end >= $start) {
            $json = substr($json, $start, $end - $start + 1);
        }

        try {
            $decoded = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException) {
            return [];
        }

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @param  array<int, string>  $targetLocales
     * @param  array<string, mixed>  $response
     * @return array<string, array<string, string>>
     */
    private function normalizeTranslationResponse(array $response, array $targetLocales): array
    {
        $translations = [];

        foreach ($targetLocales as $locale) {
            $localeData = data_get($response, "translations.$locale");

            if (! is_array($localeData)) {
                continue;
            }

            $normalized = [];

            foreach (['name', 'description', 'content', 'seo_title', 'seo_keyword', 'seo_description'] as $field) {
                $value = trim((string) ($localeData[$field] ?? ''));

                if ($value !== '') {
                    $normalized[$field] = $value;
                }
            }

            if ($normalized !== []) {
                $translations[$locale] = $normalized;
            }
        }

        return $translations;
    }

    private function normalizeLocale(?string $locale): string
    {
        $normalized = Str::of((string) $locale)->lower()->replace('_', '-')->toString();

        if ($normalized === 'vn') {
            return 'vi';
        }

        return Str::before($normalized, '-') ?: 'vi';
    }

    private function languageName(string $locale): string
    {
        return match ($this->normalizeLocale($locale)) {
            'en' => 'English',
            'ja' => 'Japanese',
            default => 'Vietnamese',
        };
    }

    private function buildInstructions(string $locale): string
    {
        $language = match ($locale) {
            'en' => 'English',
            'ja' => 'Japanese',
            default => 'Vietnamese',
        };

        return "You are a professional blog editor. Write concise, engaging post content in {$language}. "
            .'Return HTML only (no markdown fences), suitable for TinyMCE. '
            .'Use semantic tags like <h2>, <p>, <ul>, <li>. '
            .'Do not include scripts, inline styles, forms, or iframes. '
            .'Keep the tone helpful and trustworthy.';
    }

    private function buildPrompt(string $name, string $description, string $seoKeyword, string $currentContent): string
    {
        return <<<PROMPT
Create post content using the data below.

Post title: {$name}
Summary: {$description}
SEO keywords: {$seoKeyword}
Current content (if any, improve and rewrite): {$currentContent}

Output requirements:
- Return only valid HTML fragment.
- Include one heading section, key points as a list, and a short closing paragraph.
- Keep total length around 150-300 words.
PROMPT;
    }

    private function buildSeoInstructions(string $locale): string
    {
        $language = match ($locale) {
            'en' => 'English',
            'ja' => 'Japanese',
            default => 'Vietnamese',
        };

        return "You are an SEO copywriter for content pages. Write in {$language}. "
            .'Return plain text only in exactly this format: '
            .'SEO_TITLE: <value> on one line, and SEO_DESCRIPTION: <value> on next line. '
            .'Do not add any extra labels or explanations.';
    }

    private function buildSeoPrompt(
        string $name,
        string $description,
        string $seoKeyword,
        string $currentContent,
        string $currentSeoTitle,
        string $currentSeoDescription
    ): string {
        return <<<PROMPT
Generate SEO title and SEO description for a post page.

Post title: {$name}
Summary: {$description}
SEO keywords: {$seoKeyword}
Current post content: {$currentContent}
Current SEO title: {$currentSeoTitle}
Current SEO description: {$currentSeoDescription}

Requirements:
- SEO title: max 60 characters.
- SEO description: max 160 characters.
- Natural wording, clear search intent, avoid clickbait.
- Include main keyword naturally if available.

Return only:
SEO_TITLE: ...
SEO_DESCRIPTION: ...
PROMPT;
    }

    private function parseSeoResponse(string $raw): array
    {
        $seoTitle = '';
        $seoDescription = '';

        foreach (preg_split('/\r\n|\r|\n/', $raw) as $line) {
            $line = trim((string) $line);
            if ($line === '') {
                continue;
            }

            if (Str::startsWith(Str::upper($line), 'SEO_TITLE:')) {
                $seoTitle = trim(Str::after($line, ':'));

                continue;
            }

            if (Str::startsWith(Str::upper($line), 'SEO_DESCRIPTION:')) {
                $seoDescription = trim(Str::after($line, ':'));
            }
        }

        return [
            'seo_title' => Str::of(strip_tags($seoTitle))->squish()->limit(60, '')->toString(),
            'seo_description' => Str::of(strip_tags($seoDescription))->squish()->limit(160, '')->toString(),
        ];
    }
}
