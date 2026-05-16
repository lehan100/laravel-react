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
                'message' => $this->postAiMessage('missing_input', $locale),
            ], 422);
        }

        try {
            $response = agent(
                instructions: $this->buildInstructions($locale)
            )->prompt($this->buildPrompt($name, $description, $seoKeyword, $currentContent));

            $content = trim((string) $response);

            if ($content === '') {
                return response()->json([
                    'message' => $this->postAiMessage('empty_response', $locale),
                ], 422);
            }

            return response()->json([
                'content' => $content,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => $this->postAiMessage('failed', $locale),
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
                'message' => $this->postAiMessage('missing_input', $locale),
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
                    'message' => $this->postAiMessage('empty_response', $locale),
                ], 422);
            }

            return response()->json($parsed);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => $this->postAiMessage('failed', $locale),
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
                'message' => $this->postAiMessage('missing_input', $sourceLocale),
            ], 422);
        }

        if ($targetLocales === []) {
            return response()->json([
                'message' => $this->postAiMessage('empty_response', $sourceLocale),
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
                    'message' => $this->postAiMessage('empty_response', $sourceLocale),
                ], 422);
            }

            return response()->json([
                'translations' => $translated,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => $this->postAiMessage('failed', $sourceLocale),
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
Create a high-quality, comprehensive, and SEO-optimized post content using the data below.

Post title: {$name}
Summary: {$description}
SEO keywords: {$seoKeyword}
Current content (if any, optimize and expand): {$currentContent}

SEO & Formatting Requirements:
- Return ONLY a valid HTML fragment (do not wrap in ```html).
- Structure & Visual Elements:
  * Do NOT include an <h1> tag.
  * Introduction: Start with an <h2> tag containing a variation of {$seoKeyword}, followed by an engaging opening paragraph.
  * Visual Highlight: Include a callout section using a <blockquote> tag to highlight a key takeaway or expert tip.
  * Body Section 1: Use an <h2> or <h3> tag to introduce a detailed bulleted list (<ul>/<li>) explaining key points or steps.
  * Body Section 2 (Visual Data): Include a simple HTML table (<table>) with 2-3 columns (e.g., Feature vs. Benefit, or Steps vs. Details) to make the data easy to scan.
  * Conclusion: A short closing paragraph wrapped in <p> with a clear call-to-action (CTA).
- Formatting for Scannability: Use <strong> tags to bold important phrases and critical terms naturally throughout the text.
- Keyword Optimization: Integrate {$seoKeyword} naturally in the <h2>, early in the first paragraph, inside the table or list, and in the conclusion. Maintain a natural 1.5 - 2.5% keyword density.
- Word Count: Expand the content thoroughly to stay strictly between 300-500 words. Keep it concise, engaging, and search-intent focused without adding fluff.

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

    public function analyzeSeo(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'locale' => ['nullable', 'string', 'max:10'],
            'name' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'content' => ['nullable', 'string', 'max:100000'],
            'seo_title' => ['nullable', 'string', 'max:255'],
            'seo_keyword' => ['nullable', 'string', 'max:2000'],
            'seo_description' => ['nullable', 'string', 'max:1000'],
        ]);

        $name = trim((string) ($validated['name'] ?? ''));
        $description = trim((string) ($validated['description'] ?? ''));
        $content = trim((string) ($validated['content'] ?? ''));
        $seoTitle = trim((string) ($validated['seo_title'] ?? ''));
        $seoKeyword = trim((string) ($validated['seo_keyword'] ?? ''));
        $seoDescription = trim((string) ($validated['seo_description'] ?? ''));
        $locale = $this->normalizeLocale($validated['locale'] ?? null);

        if ($name === '' && $description === '' && $content === '' && $seoTitle === '' && $seoKeyword === '' && $seoDescription === '') {
            return response()->json([
                'message' => $this->postAiMessage('missing_input', $locale),
            ], 422);
        }

        $localAnalysis = $this->buildLocalSeoAnalysis($locale, $name, $description, $content, $seoTitle, $seoKeyword, $seoDescription);

        try {
            $response = agent(
                instructions: $this->buildSeoAnalysisInstructions($locale)
            )->prompt($this->buildSeoAnalysisPrompt(
                $name,
                $description,
                $content,
                $seoTitle,
                $seoKeyword,
                $seoDescription,
                $localAnalysis
            ));

            $aiAnalysis = $this->parseSeoAnalysisResponse(trim((string) $response));

            return response()->json(array_replace_recursive($localAnalysis, $aiAnalysis));
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => $this->postAiMessage('failed', $locale),
            ], 500);
        }
    }

    private function postAiMessage(string $key, string $locale): string
    {
        return (string) __('hancms.catalog.post.ai.'.$key, [], $locale);
    }

    private function buildLocalSeoAnalysis(
        string $locale,
        string $name,
        string $description,
        string $content,
        string $seoTitle,
        string $seoKeyword,
        string $seoDescription
    ): array {
        $t = fn (string $key): string => (string) __('hancms.catalog.post.ai.seo_check_rules.'.$key, [], $locale);
        $plainContent = Str::of(strip_tags($description.' '.$content))->squish()->toString();
        $searchText = Str::of($name.' '.$description.' '.$content.' '.$seoTitle.' '.$seoDescription)
            ->stripTags()
            ->lower()
            ->squish()
            ->toString();
        $wordCount = max(1, $this->countWords($plainContent));
        $keywords = $this->extractKeywords($seoKeyword);
        $keywordDensity = array_map(function (string $keyword) use ($searchText, $wordCount): array {
            $count = $this->countKeywordOccurrences($searchText, $keyword);
            $density = round(($count / $wordCount) * 100, 2);

            return [
                'keyword' => $keyword,
                'count' => $count,
                'density' => $density,
                'status' => $density >= 0.5 && $density <= 3.0 ? 'good' : ($density > 3.0 ? 'warning' : 'missing'),
            ];
        }, $keywords);

        $okLabel = $t('status_ok');
        $checks = [
            $this->seoCheck($t('title_length.label'), mb_strlen($seoTitle) >= 30 && mb_strlen($seoTitle) <= 60, $t('title_length.hint'), $okLabel),
            $this->seoCheck($t('description_length.label'), mb_strlen($seoDescription) >= 120 && mb_strlen($seoDescription) <= 160, $t('description_length.hint'), $okLabel),
            $this->seoCheck($t('keyword_in_title.label'), $keywords === [] || str_contains(Str::lower($seoTitle), Str::lower($keywords[0])), $t('keyword_in_title.hint'), $okLabel),
            $this->seoCheck($t('keyword_in_description.label'), $keywords === [] || str_contains(Str::lower($seoDescription), Str::lower($keywords[0])), $t('keyword_in_description.hint'), $okLabel),
            $this->seoCheck($t('content_depth.label'), $wordCount >= 120, $t('content_depth.hint'), $okLabel),
        ];

        $passedChecks = collect($checks)->where('status', 'good')->count();
        $score = (int) round(($passedChecks / max(1, count($checks))) * 100);

        return [
            'score' => $score,
            'summary' => $score >= 80 ? $t('summary_good') : $t('summary_needs_improvement'),
            'keyword_density' => $keywordDensity,
            'checks' => $checks,
            'recommendations' => collect($checks)
                ->where('status', 'warning')
                ->pluck('message')
                ->values()
                ->all(),
        ];
    }

    private function extractKeywords(string $seoKeyword): array
    {
        return Str::of($seoKeyword)
            ->replace(["\r\n", "\r", "\n", ';'], ',')
            ->explode(',')
            ->map(fn (string $keyword): string => Str::of($keyword)->squish()->lower()->toString())
            ->filter(fn (string $keyword): bool => $keyword !== '')
            ->unique()
            ->take(8)
            ->values()
            ->all();
    }

    private function countWords(string $content): int
    {
        preg_match_all('/[\p{L}\p{N}]+/u', Str::lower($content), $matches);

        return count($matches[0] ?? []);
    }

    private function countKeywordOccurrences(string $content, string $keyword): int
    {
        if ($keyword === '') {
            return 0;
        }

        return substr_count($content, Str::lower($keyword));
    }

    private function seoCheck(string $label, bool $passes, string $failMessage, string $okMessage): array
    {
        return [
            'label' => $label,
            'status' => $passes ? 'good' : 'warning',
            'message' => $passes ? $okMessage : $failMessage,
        ];
    }

    private function buildSeoAnalysisInstructions(string $locale): string
    {
        $language = match ($locale) {
            'en' => 'English',
            'ja' => 'Japanese',
            default => 'Vietnamese',
        };

        return "You are a blog post SEO auditor. Write concise feedback in {$language}. "
            .'Return valid JSON only with keys: score, summary, recommendations. '
            .'score must be an integer from 0 to 100. recommendations must be an array of short strings.';
    }

    private function buildSeoAnalysisPrompt(
        string $name,
        string $description,
        string $content,
        string $seoTitle,
        string $seoKeyword,
        string $seoDescription,
        array $localAnalysis
    ): string {
        $localJson = json_encode($localAnalysis, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return <<<PROMPT
Analyze SEO quality for this blog post page.

Post title: {$name}
Summary: {$description}
Content HTML: {$content}
SEO title: {$seoTitle}
SEO keywords: {$seoKeyword}
SEO description: {$seoDescription}
Local metrics: {$localJson}

Evaluate:
- Search intent and keyword usage.
- Keyword density and stuffing risks.
- SEO title and description quality.
- Content depth, clarity, and reading interest.

Return valid JSON only.
PROMPT;
    }

    private function parseSeoAnalysisResponse(string $raw): array
    {
        $decoded = json_decode($raw, true);

        if (! is_array($decoded)) {
            return [
                'recommendations' => $raw !== '' ? [Str::of(strip_tags($raw))->squish()->limit(300)->toString()] : [],
            ];
        }

        $analysis = [
            'recommendations' => collect($decoded['recommendations'] ?? [])
                ->filter(fn ($item): bool => is_scalar($item))
                ->map(fn ($item): string => Str::of((string) $item)->stripTags()->squish()->limit(220)->toString())
                ->filter()
                ->values()
                ->all(),
        ];

        if (isset($decoded['score']) && is_numeric($decoded['score'])) {
            $analysis['score'] = max(0, min(100, (int) $decoded['score']));
        }

        $summary = Str::of((string) ($decoded['summary'] ?? ''))->stripTags()->squish()->limit(300)->toString();
        if ($summary !== '') {
            $analysis['summary'] = $summary;
        }

        return $analysis;
    }
}
