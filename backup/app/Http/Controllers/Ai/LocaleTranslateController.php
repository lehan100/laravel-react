<?php

namespace App\Http\Controllers\Ai;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\JsonSchema\Types\Type;
use Illuminate\Support\Str;
use JsonException;

use function Laravel\Ai\agent;

class LocaleTranslateController extends Controller
{
    public function translate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'module' => ['nullable', 'string', 'max:50'],
            'source_locale' => ['required', 'string', 'max:10'],
            'target_locales' => ['required', 'array', 'min:1'],
            'target_locales.*' => ['required', 'string', 'max:10'],
            'fields' => ['required', 'array', 'min:1'],
            'fields.*' => ['nullable', 'string', 'max:100000'],
        ]);

        $module = Str::of((string) ($validated['module'] ?? 'content'))->lower()->trim()->toString();
        $sourceLocaleOriginal = Str::of((string) $validated['source_locale'])->lower()->trim()->toString();
        $sourceLocale = $this->normalizeLocale($sourceLocaleOriginal);
        [$targetLocales, $targetLocaleMap] = $this->normalizeTargetLocales($validated['target_locales'], $sourceLocale);

        $fields = collect($validated['fields'])
            ->mapWithKeys(fn ($value, $field) => [Str::of((string) $field)->trim()->toString() => trim((string) $value)])
            ->filter(fn (string $value): bool => $value !== '')
            ->all();

        if ($fields === []) {
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
                instructions: $this->buildInstructions($module, $sourceLocale, $targetLocaleMap, array_keys($fields)),
                schema: fn (JsonSchema $schema) => $this->buildSchema($schema, $targetLocales, array_keys($fields))
            )->prompt($this->buildPrompt($module, $sourceLocaleOriginal, $targetLocales, $fields));

            $translated = $this->normalizeTranslationResponse($response->toArray(), $targetLocales, array_keys($fields));

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

            try {
                $raw = agent(
                    instructions: $this->buildJsonFallbackInstructions($module, $sourceLocale, $targetLocaleMap, array_keys($fields))
                )->prompt($this->buildJsonFallbackPrompt(
                    $module,
                    $sourceLocaleOriginal,
                    $targetLocales,
                    $fields,
                    array_keys($fields)
                ));

                $translated = $this->normalizeTranslationResponse(
                    $this->parseJsonTranslationResponse(trim((string) $raw)),
                    $targetLocales,
                    array_keys($fields)
                );

                if ($translated !== []) {
                    return response()->json([
                        'translations' => $translated,
                        'fallback' => true,
                    ]);
                }
            } catch (\Throwable $fallbackException) {
                report($fallbackException);
            }

            return response()->json([
                'message' => __('hancms.catalog.post.ai.failed'),
            ], 500);
        }
    }

    /**
     * @param  array<int, string>  $targetLocales
     * @param  array<int, string>  $fieldKeys
     * @return array<string, Type>
     */
    private function buildSchema(JsonSchema $schema, array $targetLocales, array $fieldKeys): array
    {
        $fieldSchemas = [];

        foreach ($fieldKeys as $fieldKey) {
            $fieldSchemas[$fieldKey] = $schema->string()->required();
        }

        $localeSchemas = [];

        foreach ($targetLocales as $locale) {
            $localeSchemas[$locale] = $schema->object($fieldSchemas)
                ->withoutAdditionalProperties()
                ->required();
        }

        return [
            'translations' => $schema->object($localeSchemas)
                ->withoutAdditionalProperties()
                ->required(),
        ];
    }

    /**
     * @param  array<string, string>  $targetLocaleMap  original => normalized
     * @param  array<string, string>  $fields
     */
    private function buildInstructions(string $module, string $sourceLocale, array $targetLocaleMap, array $fields): string
    {
        $moduleLabel = $this->moduleLabel($module);
        $sourceLanguage = $this->languageName($sourceLocale);
        $targetLanguages = collect($targetLocaleMap)
            ->map(fn (string $normalized, string $original): string => $this->languageName($normalized).' ('.$original.')')
            ->implode(', ');
        $fieldList = implode(', ', $fields);
        $extraRules = in_array('content', $fields, true)
            ? 'If the field `content` contains HTML, preserve the HTML structure and translate only the visible text.'
            : 'Return plain translated text for every requested field.';

        return "You are a professional multilingual editor for {$moduleLabel}. "
            ."Translate the source fields from {$sourceLanguage} into these target languages: {$targetLanguages}. "
            ."Translate only these fields: {$fieldList}. "
            .'Preserve meaning, tone, and SEO intent. '
            .$extraRules.' '
            .'If a source field is empty, keep the translated field empty. '
            .'Return only structured data for the requested target locales. '
            .'Do not add explanations, notes, markdown, or extra fields.';
    }

    /**
     * @param  array<int, string>  $targetLocales
     * @param  array<string, string>  $fields
     */
    private function buildPrompt(string $module, string $sourceLocale, array $targetLocales, array $fields): string
    {
        $moduleLabel = $this->moduleLabel($module);
        $sourceLanguage = $this->languageName($this->normalizeLocale($sourceLocale));
        $fieldJson = json_encode($fields, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $targetSummary = collect($targetLocales)
            ->map(fn (string $locale): string => '- '.$locale.' => '.$this->languageName($this->normalizeLocale($locale)))
            ->implode("\n");

        return <<<PROMPT
Translate the following {$moduleLabel} fields from {$sourceLanguage} ({$sourceLocale}).

Target locales:
{$targetSummary}

Source fields JSON:
{$fieldJson}

Return only translated values for the requested target locales.
PROMPT;
    }

    /**
     * @param  array<string, string>  $targetLocaleMap  original => normalized
     * @param  array<int, string>  $fieldKeys
     */
    private function buildJsonFallbackInstructions(string $module, string $sourceLocale, array $targetLocaleMap, array $fieldKeys): string
    {
        $moduleLabel = $this->moduleLabel($module);
        $sourceLanguage = $this->languageName($sourceLocale);
        $targetLanguages = collect($targetLocaleMap)
            ->map(fn (string $normalized, string $original): string => $this->languageName($normalized).' ('.$original.')')
            ->implode(', ');
        $fieldList = implode(', ', $fieldKeys);
        $extraRules = in_array('content', $fieldKeys, true)
            ? 'If the field `content` contains HTML, preserve the HTML structure and translate only the visible text.'
            : 'Return plain translated text for every requested field.';

        return "You are a professional multilingual editor for {$moduleLabel}. "
            ."Translate the source fields from {$sourceLanguage} into these target languages: {$targetLanguages}. "
            ."Translate only these fields: {$fieldList}. "
            .'Preserve meaning, tone, and SEO intent. '
            .$extraRules.' '
            .'Return only valid JSON. Do not wrap in markdown code fences. '
            .'Do not add explanations, notes, or extra keys.';
    }

    /**
     * @param  array<int, string>  $targetLocales
     * @param  array<string, string>  $fields
     * @param  array<int, string>  $fieldKeys
     */
    private function buildJsonFallbackPrompt(string $module, string $sourceLocale, array $targetLocales, array $fields, array $fieldKeys): string
    {
        $moduleLabel = $this->moduleLabel($module);
        $sourceLanguage = $this->languageName($this->normalizeLocale($sourceLocale));
        $fieldJson = json_encode($fields, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $targets = collect($targetLocales)
            ->map(fn (string $locale): string => '- '.$locale.' => '.$this->languageName($this->normalizeLocale($locale)))
            ->implode("\n");
        $fieldList = implode(', ', $fieldKeys);

        return <<<PROMPT
Translate the following {$moduleLabel} fields from {$sourceLanguage} ({$sourceLocale}).

Target locales:
{$targets}

Source fields JSON:
{$fieldJson}

Return ONLY valid JSON in this exact shape:
{
  "translations": {
    "locale_code": {
      {$this->jsonFieldsExample($fieldList)}
    }
  }
}
PROMPT;
    }

    private function jsonFieldsExample(string $fieldList): string
    {
        return collect(explode(',', $fieldList))
            ->map(fn (string $field) => trim($field))
            ->filter()
            ->map(fn (string $field) => '"'.$field.'": ""')
            ->implode(",\n      ");
    }

    /**
     * @return array<string, mixed>
     */
    private function parseJsonTranslationResponse(string $raw): array
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
     * @param  array<int, string>  $fieldKeys
     * @return array<string, array<string, string>>
     */
    private function normalizeTranslationResponse(array $response, array $targetLocales, array $fieldKeys): array
    {
        $translations = data_get($response, 'translations', []);

        if (! is_array($translations)) {
            return [];
        }

        $normalized = [];

        foreach ($targetLocales as $locale) {
            $localeData = $translations[$locale] ?? null;
            if (! is_array($localeData)) {
                $normalizedLocale = $this->normalizeLocale($locale);
                $localeData = $translations[$normalizedLocale] ?? null;
            }

            if (! is_array($localeData)) {
                continue;
            }

            $fields = [];

            foreach ($fieldKeys as $fieldKey) {
                $value = trim((string) ($localeData[$fieldKey] ?? ''));

                if ($value !== '') {
                    $fields[$fieldKey] = $value;
                }
            }

            if ($fields !== []) {
                $normalized[$locale] = $fields;
            }
        }

        return $normalized;
    }

    private function normalizeLocale(?string $locale): string
    {
        $normalized = Str::of((string) $locale)->lower()->replace('_', '-')->toString();

        if ($normalized === 'vn') {
            return 'vi';
        }

        return Str::before($normalized, '-') ?: 'vi';
    }

    private function moduleLabel(string $module): string
    {
        return match ($module) {
            'category' => 'category page',
            'product' => 'product page',
            'attribute' => 'attribute labels',
            default => 'content',
        };
    }

    private function languageName(string $locale): string
    {
        return match ($locale) {
            'vi' => 'Vietnamese',
            'en' => 'English',
            'ja' => 'Japanese',
            default => Str::of($locale)->upper()->toString(),
        };
    }

    /**
     * Keep the original locale codes for response keys (e.g. `vn`) while normalizing internally (e.g. `vi`).
     *
     * @param  array<int, string>  $locales
     * @return array{0: array<int, string>, 1: array<string, string>}
     */
    private function normalizeTargetLocales(array $locales, string $sourceLocaleNormalized): array
    {
        $targets = [];
        $map = [];
        $seenNormalized = [];

        foreach ($locales as $locale) {
            $original = Str::of((string) $locale)->lower()->trim()->toString();
            $normalized = $this->normalizeLocale($original);

            if ($normalized === '' || $normalized === $sourceLocaleNormalized) {
                continue;
            }

            if (isset($seenNormalized[$normalized])) {
                continue;
            }

            $seenNormalized[$normalized] = true;
            $targets[] = $original;
            $map[$original] = $normalized;
        }

        return [$targets, $map];
    }
}
