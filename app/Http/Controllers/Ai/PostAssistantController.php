<?php

namespace App\Http\Controllers\Ai;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ai\GenerateAiPostDraftRequest;
use App\Http\Requests\Ai\ScheduleAiPostDraftRequest;
use App\Repositories\Category\CategoryRepositoryInterface;
use App\Services\Ai\PostDraftStorage;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

use function Laravel\Ai\agent;

class PostAssistantController extends Controller
{
    public function __construct(private CategoryRepositoryInterface $categoryRepository) {}

    public function index(PostDraftStorage $draftStorage): InertiaResponse
    {
        $batches = $this->prepareBatches($draftStorage->all());

        return Inertia::render('Admin/Ai/PostAssistant/Index', [
            'locale' => app()->getLocale(),
            'itemsCategoryActive' => $this->getActiveCategories(),
            'batches' => $batches,
            'batchSummary' => $this->summarizeBatches($batches),
        ]);
    }

    public function create(PostDraftStorage $draftStorage): InertiaResponse
    {
        $batches = $this->prepareBatches($draftStorage->all());

        return Inertia::render('Admin/Ai/PostAssistant/Created', [
            'locale' => app()->getLocale(),
            'itemsCategoryActive' => $this->getActiveCategories(),
            'batches' => $batches,
            'batchSummary' => $this->summarizeBatches($batches),
        ]);
    }

    public function edit(string $token, PostDraftStorage $draftStorage): InertiaResponse
    {
        $batch = $draftStorage->get($token);

        abort_if(! is_array($batch), 404);
        $batches = $this->prepareBatches($draftStorage->all());

        return Inertia::render('Admin/Ai/PostAssistant/Edit', [
            'locale' => app()->getLocale(),
            'itemsCategoryActive' => $this->getActiveCategories(),
            'batch' => $this->prepareBatch($batch),
            'batches' => $batches,
            'batchSummary' => $this->summarizeBatches($batches),
        ]);
    }

    public function generate(GenerateAiPostDraftRequest $request, PostDraftStorage $draftStorage): JsonResponse
    {
        $topic = trim((string) $request->input('topic'));
        $quantity = (int) $request->input('quantity');
        $categoryId = $request->input('category_id');
        $locale = $this->normalizeLocale(app()->getLocale());

        try {
            $items = $this->generateDraftsFromAi($topic, $quantity, $locale);
        } catch (\Throwable $exception) {
            report($exception);

            return response()->json([
                'message' => __('hancms.ai_assistant.post_assistant.failed_generate'),
            ], 500);
        }

        $now = Carbon::now()->startOfHour()->addHours(2);
        $batchItems = collect($items)
            ->map(fn (array $item, int $index): array => [
                'draft_id' => sprintf('draft-%s', $index + 1),
                'title' => $item['title'],
                'description' => $item['description'],
                'content' => $item['content'],
                'photo' => '',
                'photo_url' => '',
                'translations' => [
                    $locale => [
                        'title' => $item['title'],
                        'description' => $item['description'],
                        'content' => $item['content'],
                        'photo' => '',
                        'photo_url' => '',
                    ],
                ],
                'published_at' => $now->copy()->addMinutes($index * 30)->format('Y-m-d\TH:i'),
            ])
            ->all();

        $batch = [
            'token' => '',
            'topic' => $topic,
            'locale' => $locale,
            'category_id' => $categoryId,
            'created_at' => Carbon::now()->toDateTimeString(),
            'items' => $batchItems,
        ];

        $token = $draftStorage->store($batch);
        $batch['token'] = $token;
        $draftStorage->update($token, $batch);

        return response()->json([
            'message' => __('hancms.ai_assistant.post_assistant.generated'),
            'batch_token' => $token,
            'items' => $batchItems,
        ]);
    }

    public function schedule(ScheduleAiPostDraftRequest $request, PostDraftStorage $draftStorage): JsonResponse|RedirectResponse
    {
        $token = $request->input('batch_token');
        $batch = $draftStorage->get($token);

        if (! is_array($batch)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => __('hancms.ai_assistant.post_assistant.batch_not_found'),
                ], 404);
            }

            return back()->with('error', __('hancms.ai_assistant.post_assistant.batch_not_found'));
        }

        $categoryId = $request->input('category_id');

        $items = collect($request->input('items'))->map(fn (array $item): array => [
            'draft_id' => $item['draft_id'],
            'title' => trim((string) ($item['title'] ?? '')),
            'description' => trim((string) ($item['description'] ?? '')),
            'content' => trim((string) ($item['content'] ?? '')),
            'photo' => trim((string) ($item['photo'] ?? '')),
            'photo_url' => trim((string) ($item['photo_url'] ?? '')),
            'translations' => is_array($item['translations'] ?? null) ? $item['translations'] : [],
            'published_at' => $item['published_at'],
        ])->keyBy('draft_id');

        $batch['category_id'] = $categoryId;
        $batch['items'] = collect($batch['items'])
            ->map(function (array $item) use ($items): array {
                $itemData = $items->get($item['draft_id']);

                if (! is_array($itemData)) {
                    return $item;
                }

                return [
                    ...$item,
                    'title' => $itemData['title'] !== '' ? $itemData['title'] : ($item['title'] ?? ''),
                    'description' => array_key_exists('description', $itemData) ? $itemData['description'] : ($item['description'] ?? ''),
                    'content' => array_key_exists('content', $itemData) ? $itemData['content'] : ($item['content'] ?? ''),
                    'photo' => array_key_exists('photo', $itemData) ? $itemData['photo'] : ($item['photo'] ?? ''),
                    'photo_url' => array_key_exists('photo_url', $itemData) ? $itemData['photo_url'] : ($item['photo_url'] ?? ''),
                    'translations' => array_key_exists('translations', $itemData) && is_array($itemData['translations'])
                        ? $itemData['translations']
                        : ($item['translations'] ?? []),
                    'published_at' => $itemData['published_at'] ?? $item['published_at'],
                ];
            })
            ->all();

        $draftStorage->update($token, $batch);

        if (! $request->expectsJson()) {
            return redirect()
                ->route('ai.post-assistant.edit', $token)
                ->with('success', __('hancms.ai_assistant.post_assistant.scheduled'));
        }

        return response()->json([
            'message' => __('hancms.ai_assistant.post_assistant.scheduled'),
            'batch_token' => $token,
            'items' => $batch['items'],
        ]);
    }

    public function destroy(string $token, PostDraftStorage $draftStorage): RedirectResponse
    {
        $batch = $draftStorage->get($token);

        if (! is_array($batch)) {
            abort(404);
        }

        $draftStorage->delete($token);

        return redirect()
            ->route('ai.post-assistant.index')
            ->with('success', __('hancms.ai_assistant.post_assistant.deleted'));
    }

    private function generateDraftsFromAi(string $topic, int $quantity, string $locale): array
    {
        $language = $this->languageName($locale);
        $instructions = "You are a senior {$language} content strategist and editor. "
            .'Generate complete article drafts only as valid JSON.';
        $prompt = <<<PROMPT
Create {$quantity} unique article drafts for the topic "{$topic}" in {$language}.

Requirements:
- Each draft must take a distinct angle and avoid rewriting the same idea with different words.
- Title: concise, compelling, and SEO-aware.
- Description: a 2-3 sentence summary that can work as a post excerpt.
- Content: a complete long-form article in {$language}, roughly 700-1000 words, with:
  - a strong introduction
  - 3-5 body sections with clear H2/H3 headings
  - practical examples, tips, or step-by-step guidance
  - one short checklist, comparison, or FAQ section
  - a conclusion with a natural call to action
- Write clean HTML only, suitable for a rich text editor. Use semantic tags such as <p>, <h2>, <h3>, <ul>, <li>, <blockquote>, and <strong>.
- Do not include an <h1> tag, markdown fences, or explanatory text.
- Keep the tone helpful, human, and trustworthy. Avoid generic filler.

Return only valid JSON with this exact array shape:
[
  {
    "title": "",
    "description": "",
    "content": ""
  }
]
PROMPT;

        $response = agent(instructions: $instructions)->prompt($prompt);
        $decoded = json_decode($this->normalizeJsonString((string) $response), true);

        if (! is_array($decoded) || count($decoded) < 1) {
            throw new \RuntimeException('Invalid AI response content.');
        }

        return collect($decoded)
            ->map(fn ($item): array => [
                'title' => trim((string) ($item['title'] ?? 'Untitled')),
                'description' => trim((string) ($item['description'] ?? '')),
                'content' => trim((string) ($item['content'] ?? '')),
            ])
            ->filter(fn (array $item): bool => $item['title'] !== '' && $item['content'] !== '')
            ->take($quantity)
            ->values()
            ->all();
    }

    private function normalizeJsonString(string $response): string
    {
        $start = strpos($response, '[');
        $end = strrpos($response, ']');

        if ($start === false || $end === false || $end <= $start) {
            return $response;
        }

        return substr($response, $start, $end - $start + 1);
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

    /**
     * @param  array<int, array<string, mixed>>  $batches
     * @return array<int, array<string, mixed>>
     */
    private function prepareBatches(array $batches): array
    {
        return collect($batches)
            ->map(fn (array $batch): array => $this->prepareBatch($batch))
            ->sortByDesc('created_at')
            ->values()
            ->all();
    }

    /**
     * @param  array<string, mixed>  $batch
     * @return array<string, mixed>
     */
    private function prepareBatch(array $batch): array
    {
        $items = collect($batch['items'] ?? []);
        $timezone = env('APP_TIMEZONE', config('app.timezone', 'UTC'));
        $now = Carbon::now($timezone);

        $dueCount = $items->filter(function (array $item) use ($now, $timezone): bool {
            return Carbon::parse($item['published_at'] ?? now($timezone), $timezone)->lte($now);
        })->count();

        $publishedCount = $batch['published_count'] ?? 0;
        $totalItems = $items->count() + $publishedCount;

        return [
            ...$batch,
            'total_items' => $items->count(),
            'due_items' => $dueCount,
            'upcoming_items' => max(0, $items->count() - $dueCount),
            'progress' => $totalItems > 0 ? (int) round(($publishedCount / $totalItems) * 100) : 0,
        ];
    }

    /**
     * @param  array<int, array<string, mixed>>  $batches
     * @return array<string, int>
     */
    private function summarizeBatches(array $batches): array
    {
        return [
            'groups' => count($batches),
            'drafts' => array_sum(array_map(fn (array $batch): int => (int) ($batch['total_items'] ?? 0), $batches)),
            'ready_to_public' => array_sum(array_map(fn (array $batch): int => (int) ($batch['due_items'] ?? 0), $batches)),
            'upcoming' => array_sum(array_map(fn (array $batch): int => (int) ($batch['upcoming_items'] ?? 0), $batches)),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function getActiveCategories(): array
    {
        if (! Schema::hasTable('categories')) {
            return [];
        }

        $categories = $this->categoryRepository->lists(null, [
            'task' => 'admin-list-items-active',
            'type' => ['blog', 'news'],
        ]);

        return is_iterable($categories) ? collect($categories)->values()->all() : [];
    }
}
