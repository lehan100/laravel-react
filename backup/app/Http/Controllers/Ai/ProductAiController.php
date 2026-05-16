<?php

namespace App\Http\Controllers\Ai;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use function Laravel\Ai\agent;

class ProductAiController extends Controller
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
                'message' => $this->productAiMessage('missing_input', $locale),
            ], 422);
        }

        try {
            $response = agent(
                instructions: $this->buildInstructions($locale)
            )->prompt($this->buildPrompt($name, $description, $seoKeyword, $currentContent));

            $content = trim((string) $response);

            if ($content === '') {
                return response()->json([
                    'message' => $this->productAiMessage('empty_response', $locale),
                ], 422);
            }

            return response()->json([
                'content' => $content,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => $this->productAiMessage('failed', $locale),
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
                'message' => $this->productAiMessage('missing_input', $locale),
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
                    'message' => $this->productAiMessage('empty_response', $locale),
                ], 422);
            }

            return response()->json($parsed);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => $this->productAiMessage('failed', $locale),
            ], 500);
        }
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
                'message' => $this->productAiMessage('missing_input', $locale),
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
                'message' => $this->productAiMessage('failed', $locale),
            ], 500);
        }
    }

    /**
     * JSON API messages for the current request locale (not app default).
     */
    private function productAiMessage(string $key, string $locale): string
    {
        return (string) __('hancms.catalog.product.ai.'.$key, [], $locale);
    }

    private function normalizeLocale(?string $locale): string
    {
        $normalized = Str::of((string) $locale)->lower()->replace('_', '-')->toString();

        if ($normalized === 'vn') {
            return 'vi';
        }

        return Str::before($normalized, '-') ?: 'vi';
    }

    private function buildInstructions(string $locale): string
    {
        $language = match ($locale) {
            'en' => 'English',
            'ja' => 'Japanese',
            default => 'Vietnamese',
        };

        return "You are an ecommerce content editor. Write concise, persuasive product content in {$language}. "
            .'Return HTML only (no markdown fences), suitable for TinyMCE. '
            .'Use semantic tags like <h2>, <p>, <ul>, <li>. '
            .'Do not include scripts, inline styles, forms, or iframes. '
            .'Keep the tone natural and trustworthy.';
    }

    private function buildPrompt(string $name, string $description, string $seoKeyword, string $currentContent): string
    {
        return <<<PROMPT
Create a high-quality, comprehensive, and SEO-optimized product detail content using the data below.

Product name: {$name}
Short description: {$description}
SEO keywords: {$seoKeyword}
Current content (if any, optimize and expand): {$currentContent}

SEO & Formatting Requirements:
- Return ONLY a valid HTML fragment (do not wrap in ```html).
- Structure & Visual Elements:
  * Do NOT include an <h1> tag (the platform already handles the product name as H1).
  * Introduction: Start directly with an <h2> tag introducing the product's main value proposition, integrating the keyword {$seoKeyword}. Follow with an engaging introduction paragraph.
  * Product Features: Use an <h3> tag (e.g., "Key Features & Benefits"), followed by a bulleted list (<ul> and <li>). Use <strong> at the beginning of each bullet point to highlight the feature name.
  * Technical Specifications (Visual Table): Include a clean HTML table (<table>) with 2 columns ("Specification" and "Detail") to list 3-4 key technical stats or product attributes for better scannability.
  * Call-to-Action (CTA): A short, persuasive closing paragraph wrapped in <p> with a strong call-to-action to drive purchases or inquiries.
- Keyword Optimization: Naturally integrate {$seoKeyword} in the <h2>, within the first 50 words of the introduction, and once inside the features or table. Maintain a natural keyword density (1.5 - 2%).
- Word Count: Expand the content thoroughly to stay strictly between 250-400 words. Ensure every sentence adds commercial value and addresses user search intent without adding fluff.

PROMPT;
    }

    private function buildSeoInstructions(string $locale): string
    {
        $language = match ($locale) {
            'en' => 'English',
            'ja' => 'Japanese',
            default => 'Vietnamese',
        };

        return "You are an ecommerce SEO copywriter. Write in {$language}. "
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
Generate SEO title and SEO description for a product page.

Product name: {$name}
Short description: {$description}
SEO keywords: {$seoKeyword}
Current product content: {$currentContent}
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

    /**
     * @return array{score: int, summary: string, keyword_density: array<int, array{keyword: string, count: int, density: float, status: string}>, checks: array<int, array{label: string, status: string, message: string}>, recommendations: array<int, string>}
     */
    private function buildLocalSeoAnalysis(
        string $locale,
        string $name,
        string $description,
        string $content,
        string $seoTitle,
        string $seoKeyword,
        string $seoDescription
    ): array {
        $t = fn (string $key): string => (string) __('hancms.catalog.product.ai.seo_check_rules.'.$key, [], $locale);
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

    /**
     * @return array<int, string>
     */
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

    /**
     * @return array{label: string, status: string, message: string}
     */
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

        return "You are an ecommerce SEO auditor. Write concise feedback in {$language}. "
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
Analyze SEO quality for this ecommerce product page.

Product name: {$name}
Short description: {$description}
Content HTML: {$content}
SEO title: {$seoTitle}
SEO keywords: {$seoKeyword}
SEO description: {$seoDescription}
Local metrics: {$localJson}

Evaluate:
- Search intent and keyword usage.
- Keyword density and stuffing risks.
- SEO title and description quality.
- Content depth, clarity, and conversion usefulness.

Return valid JSON only.
PROMPT;
    }

    /**
     * @return array<string, mixed>
     */
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
