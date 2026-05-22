<?php

namespace App\Console\Commands;

use App\Models\Catalog\Category;
use App\Models\Catalog\Post;
use App\Repositories\Post\PostRepositoryInterface;
use App\Services\Ai\PostDraftStorage;
use Carbon\Carbon;
use Illuminate\Console\Command;

class PublishAiPostDrafts extends Command
{
    protected $signature = 'ai-posts:publish';

    protected $description = 'Publish AI post drafts when their scheduled publish time arrives.';

    public function handle(PostDraftStorage $draftStorage, PostRepositoryInterface $postRepository): int
    {
        $timezone = env('APP_TIMEZONE', config('app.timezone', 'UTC'));
        $now = Carbon::now($timezone);
        $batches = $draftStorage->all();
        $publishedCount = 0;

        $activeLocales = \App\Models\Settings\Language::query()->where('status', 1)->pluck('code')->all();

        foreach ($batches as $batch) {
            $batchToken = $batch['token'] ?? null;
            $items = collect($batch['items'] ?? []);
            $dueItems = $items->filter(function (array $item) use ($now, $timezone): bool {
                return Carbon::parse($item['published_at'], $timezone)->lte($now);
            });

            if ($dueItems->isEmpty()) {
                continue;
            }

            $remainingItems = $items->reject(function (array $item) use ($now, $timezone): bool {
                return Carbon::parse($item['published_at'], $timezone)->lte($now);
            })->values()->all();

            $failedDrafts = [];
            $successfulDrafts = [];

            foreach ($dueItems as $draft) {
                $categoryId = $batch['category_id'] ?? $this->resolveDefaultCategoryId();
                $translations = $this->normalizeDraftTranslations($batch, $draft);
                
                // Identify missing locales
                $missingLocales = [];
                $sourceLocale = $batch['locale'] ?? app()->getLocale();
                
                foreach ($activeLocales as $locale) {
                    if (empty($translations[$locale]['name']) && empty($translations[$locale]['content'])) {
                        $missingLocales[] = $locale;
                    }
                }

                if (!empty($missingLocales)) {
                    try {
                        $translateController = app(\App\Http\Controllers\Ai\LocaleTranslateController::class);
                        $request = \Illuminate\Http\Request::create('/api/ai/translate', 'POST', [
                            'module' => 'post',
                            'source_locale' => $sourceLocale,
                            'target_locales' => $missingLocales,
                            'fields' => [
                                'title' => $draft['translations'][$sourceLocale]['title'] ?? $draft['title'] ?? '',
                                'description' => $draft['translations'][$sourceLocale]['description'] ?? $draft['description'] ?? '',
                                'content' => $draft['translations'][$sourceLocale]['content'] ?? $draft['content'] ?? '',
                            ],
                        ]);

                        $response = $translateController->translate($request);
                        if ($response->status() === 200) {
                            $data = $response->getData(true);
                            $newTranslations = $data['translations'] ?? [];
                            foreach ($newTranslations as $loc => $transData) {
                                $translations[$loc] = [
                                    'name' => $transData['title'] ?? '',
                                    'description' => $transData['description'] ?? '',
                                    'content' => $transData['content'] ?? '',
                                ];
                            }
                        } else {
                            $this->warn("Skipping draft {$draft['draft_id']} because AI translation failed.");
                            $failedDrafts[] = $draft;
                            continue;
                        }
                    } catch (\Exception $e) {
                        $this->warn("Skipping draft {$draft['draft_id']} because AI translation threw an exception.");
                        $failedDrafts[] = $draft;
                        continue;
                    }
                }

                if ($categoryId === null) {
                    $this->warn('Skipping draft because no default category is available.');
                    $failedDrafts[] = $draft;
                    continue;
                }

                $postRepository->createScheduledPost([
                    'category_id' => $categoryId,
                    'photo' => $draft['photo'] ?? null,
                    'type' => 'primary',
                    'status' => 1,
                    'publication_status' => Post::PUBLICATION_STATUS_PUBLISHED,
                    'published_at' => $draft['published_at'],
                    'translations' => $translations,
                ]);

                $publishedCount++;
                $successfulDrafts[] = $draft;
            }

            if ($batchToken !== null) {
                $remainingItems = array_merge($remainingItems, $failedDrafts);
                if (count($remainingItems) === 0) {
                    $draftStorage->delete($batchToken);
                } else {
                    $batch['items'] = $remainingItems;
                    $batch['published_count'] = ($batch['published_count'] ?? 0) + count($successfulDrafts);
                    $draftStorage->update($batchToken, $batch);
                }
            }
        }

        $this->info(sprintf('Published %d AI draft(s).', $publishedCount));

        return 0;
    }

    private function resolveDefaultCategoryId(): ?int
    {
        return Category::query()
            ->where('status', 1)
            ->whereIn('type', ['blog', 'news'])
            ->value('id');
    }

    /**
     * @param  array<string, mixed>  $batch
     * @param  array<string, mixed>  $draft
     * @return array<string, array<string, string>>
     */
    private function normalizeDraftTranslations(array $batch, array $draft): array
    {
        $translations = [];
        $sourceTranslations = is_array($draft['translations'] ?? null) ? $draft['translations'] : [];

        foreach ($sourceTranslations as $locale => $translation) {
            if (! is_array($translation)) {
                continue;
            }

            $title = trim((string) ($translation['title'] ?? $draft['title'] ?? ''));
            $content = trim((string) ($translation['content'] ?? $draft['content'] ?? ''));
            $description = trim((string) ($translation['description'] ?? $draft['description'] ?? ''));

            if ($title === '' && $content === '') {
                continue;
            }

            $translations[(string) $locale] = [
                'name' => $title,
                'description' => $description,
                'content' => $content,
            ];
        }

        if ($translations !== []) {
            return $translations;
        }

        $locale = (string) ($batch['locale'] ?? app()->getLocale());

        return [
            $locale => [
                'name' => (string) ($draft['title'] ?? ''),
                'description' => (string) ($draft['description'] ?? ''),
                'content' => (string) ($draft['content'] ?? ''),
            ],
        ];
    }
}
