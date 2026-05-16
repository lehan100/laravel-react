<?php

namespace App\Http\Controllers\Ai;

use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\CategorySeoSuggestionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

use function Laravel\Ai\agent;

class CategoryAiController extends Controller
{
    public function suggestSeo(CategorySeoSuggestionRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $name = trim((string) ($validated['name'] ?? ''));
        $content = trim((string) ($validated['content'] ?? ''));
        $seoKeyword = trim((string) ($validated['seo_keyword'] ?? ''));
        $currentSeoTitle = trim((string) ($validated['current_seo_title'] ?? ''));
        $currentSeoDescription = trim((string) ($validated['current_seo_description'] ?? ''));
        $locale = $this->normalizeLocale($validated['locale'] ?? null);

        if ($name === '' && $content === '' && $seoKeyword === '') {
            return response()->json([
                'message' => __('hancms.catalog.category.ai.missing_input'),
            ], 422);
        }

        try {
            $response = agent(
                instructions: $this->buildSeoInstructions($locale)
            )->prompt($this->buildSeoPrompt(
                $name,
                $content,
                $seoKeyword,
                $currentSeoTitle,
                $currentSeoDescription
            ));

            $parsed = $this->parseSeoResponse(trim((string) $response));

            if (($parsed['seo_title'] ?? '') === '' && ($parsed['seo_description'] ?? '') === '') {
                return response()->json([
                    'message' => __('hancms.catalog.category.ai.empty_response'),
                ], 422);
            }

            return response()->json($parsed);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'message' => __('hancms.catalog.category.ai.failed'),
            ], 500);
        }
    }

    private function normalizeLocale(?string $locale): string
    {
        $normalized = Str::of((string) $locale)->lower()->replace('_', '-')->toString();

        if ($normalized === 'vn') {
            return 'vi';
        }

        return Str::before($normalized, '-') ?: 'vi';
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
        string $content,
        string $seoKeyword,
        string $currentSeoTitle,
        string $currentSeoDescription
    ): string {
        return <<<PROMPT
Generate SEO title and SEO description for a category page.

Category name: {$name}
Category content: {$content}
SEO keywords: {$seoKeyword}
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

    /**
     * @return array{seo_title: string, seo_description: string}
     */
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
