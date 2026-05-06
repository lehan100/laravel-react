<?php

namespace App\Repositories\Page;

use App\Models\Catalog\Post;
use App\Models\Catalog\Product;
use App\Models\FieldGroup;
use App\Models\Media\MediaPosition;
use App\Models\Page;
use App\Models\Settings\Language;
use App\Models\Slug;
use App\Pipelines\HandleSlugHistory;
use App\Repositories\EloquentRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class PageEloquentRepository extends EloquentRepository implements PageRepositoryInterface
{
    public function getModel(): string
    {
        return Page::class;
    }

    public function lists($params = null, $options = null): LengthAwarePaginator|Collection|null
    {
        $task = $options['task'] ?? null;

        if ($task === 'admin-list-items') {
            $search = (string) ($params['search'] ?? '');
            $currentLocale = app()->getLocale();

            return $this->_model->newQuery()
                ->with([
                    'fieldGroup',
                    'translations' => function ($query) use ($currentLocale): void {
                        $query->select(['id', 'page_id', 'locale', 'title'])
                            ->where('locale', $currentLocale);
                    },
                ])
                ->when($search !== '', function ($query) use ($search): void {
                    $query->where(function ($query) use ($search): void {
                        $query
                            ->where('title', 'like', "%{$search}%")
                            ->orWhereHas('fieldGroup', function ($query) use ($search): void {
                                $query->where('title', 'like', "%{$search}%");
                            })
                            ->orWhereHas('translations', function ($query) use ($search): void {
                                $query->where('title', 'like', "%{$search}%");
                            });
                    });
                })
                ->latest('id')
                ->paginate(15)
                ->withQueryString();
        }

        return null;
    }

    public function get($params = null, $options = null): ?Page
    {
        if (($options['task'] ?? null) === 'get-item') {
            return $this->_model->newQuery()
                ->with(['fieldGroup', 'translations', 'slugs'])
                ->find($params['id'] ?? null);
        }

        return null;
    }

    public function save($params = null, $options = null): Page|bool
    {
        $task = $options['task'] ?? null;

        if (! in_array($task, ['add-item', 'edit-item', 'change-status'], true)) {
            return false;
        }

        if ($task === 'change-status') {
            $page = $this->_model->newQuery()->find($params['id'] ?? null);

            if (! $page instanceof Page) {
                return false;
            }

            $page->update(['status' => ! $page->status]);

            return $page;
        }

        return DB::transaction(function () use ($params, $task): Page|bool {
            $page = $task === 'add-item'
                ? new $this->_model
                : $this->_model->newQuery()->with('fieldGroup')->find($params['id'] ?? null);

            if (! $page instanceof Page) {
                return false;
            }

            $data = $this->normalizeRequest((array) $params, $page->exists ? $page : null);
            $defaultLocale = app()->getLocale();
            $defaultTranslation = $data['translations'][$defaultLocale]
                ?? Arr::first($data['translations'])
                ?? [];
            $pageSlug = $this->makeUniquePageSlug(
                (string) ($defaultTranslation['slug'] ?? $page->slug ?? $defaultTranslation['title'] ?? $page->title ?? ''),
                $page->exists ? $page->getKey() : null
            );

            $page->fill([
                'field_group_id' => $data['field_group_id'] ?? $page->field_group_id,
                'title' => (string) ($defaultTranslation['title'] ?? $page->title ?? ''),
                'slug' => $pageSlug,
                'status' => $data['status'] ?? true,
                'acf_data' => $data['content'],
            ]);
            $page->save();

            $translationsData = $data['translations'] ?? [];

            if ($translationsData === [] && filled($data['title'] ?? null)) {
                $translationsData = [
                    app()->getLocale() => [
                        'title' => $data['title'],
                        'slug' => $data['slug'] ?? '',
                    ],
                ];
            }

            foreach ($translationsData as $locale => $translationData) {
                $translation = $page->translateOrNew((string) $locale);
                $translation->fill([
                    'title' => (string) ($translationData['title'] ?? ''),
                ]);
                $translation->save();
            }

            app(Pipeline::class)
                ->send([
                    'item' => $page,
                    'translations' => $translationsData,
                ])
                ->through([
                    HandleSlugHistory::class,
                ])
                ->thenReturn();

            return $page;
        });
    }

    public function delete($params = null, $options = null): bool
    {
        $task = $options['task'] ?? null;

        if ($task === 'delete-item') {
            $page = $this->_model->newQuery()->find($params['id'] ?? null);

            return $page instanceof Page && (bool) $page->delete();
        }

        if ($task === 'delete-items') {
            $ids = Arr::wrap($params['ids'] ?? []);
            $pages = $this->_model->newQuery()->whereIn('id', $ids)->get();

            DB::transaction(function () use ($pages): void {
                $pages->each->delete();
            });

            return true;
        }

        return false;
    }

    /**
     * @return array<string, mixed>
     */
    public function getFormProps($params = null): array
    {
        $page = $params['page'] ?? null;
        $fieldGroup = $page?->fieldGroup;

        return [
            'page' => $page?->loadMissing(['translations', 'slugs', 'fieldGroup']),
            'pageTranslations' => $page?->translations?->mapWithKeys(function ($translation) use ($page): array {
                $slug = $page?->slugs
                    ?->where('locale', $translation->locale)
                    ->where('is_default', true)
                    ->whereNull('redirect_to')
                    ->first();

                return [(string) $translation->locale => [
                    'title' => $translation->title ?? '',
                    'slug' => $slug?->slug ?? '',
                ]];
            }) ?? [],
            'fieldGroup' => $fieldGroup,
            'fields' => $fieldGroup?->fields_schema ?? [],
            'fieldGroups' => FieldGroup::query()
                ->where('status', true)
                ->withCount('pages')
                ->orderBy('id')
                ->get(['id', 'title', 'fields_schema']),
            'content' => $page?->acf_data ?? [],
            'languages' => Language::query()
                ->where('status', true)
                ->orderBy('id')
                ->get(['id', 'name', 'code', 'photo']),
            'products' => Product::query()
                ->orderByDesc('id')
                ->limit(200)
                ->get()
                ->map(fn (Product $product): array => [
                    'id' => $product->id,
                    'sku' => $product->sku,
                    'label' => $product->name ?? $product->sku ?? "#{$product->id}",
                    'name' => $product->name ?? $product->sku ?? "#{$product->id}",
                    'price' => (float) $product->price,
                    'quantity' => $product->quantity,
                    'status' => $product->status,
                ]),
            'posts' => Post::query()
                ->with([
                    'translations' => function ($query): void {
                        $query->select(['post_id', 'locale', 'name']);
                    },
                ])
                ->orderByDesc('id')
                ->limit(200)
                ->get()
                ->map(fn (Post $post): array => [
                    'id' => $post->id,
                    'label' => $post->name ?? "#{$post->id}",
                    'name' => $post->name ?? "#{$post->id}",
                    'type' => $post->type,
                    'status' => $post->status,
                ]),
            'bannerPositions' => MediaPosition::query()
                ->select(['id', 'name', 'code'])
                ->orderBy('id')
                ->get(),
            'translations' => $this->translations(),
        ];
    }

    /**
     * @return array<string, string|array<string, string>>
     */
    public function translations(): array
    {
        return [
            'title' => __('hancms.page.title'),
            'create' => __('hancms.page.create'),
            'edit' => __('hancms.page.edit'),
            'fields' => __('hancms.page.fields'),
            'content' => __('hancms.page.content'),
            'messages' => [
                'created' => __('hancms.page.messages.created'),
                'updated' => __('hancms.page.messages.updated'),
                'deleted' => __('hancms.page.messages.deleted'),
            ],
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function normalizeRequest(array $data, ?Page $page = null): array
    {
        $translations = [];

        foreach ((array) ($data['translations'] ?? []) as $locale => $translationData) {
            if (! is_array($translationData)) {
                continue;
            }

            $title = trim((string) ($translationData['title'] ?? ''));
            $slug = trim((string) ($translationData['slug'] ?? ''));

            if ($slug === '') {
                $slug = $title;
            }

            $translations[(string) $locale] = [
                'title' => $title,
                'slug' => $slug,
            ];
        }

        if ($translations === [] && filled($data['title'] ?? null)) {
            $slug = trim((string) ($data['slug'] ?? ''));
            if ($slug === '') {
                $slug = (string) $data['title'];
            }

            $translations[app()->getLocale()] = [
                'title' => trim((string) $data['title']),
                'slug' => $slug,
            ];
        }

        $data['translations'] = $translations;

        $fieldGroup = $page?->fieldGroup ?? FieldGroup::query()->find($data['field_group_id'] ?? null);
        $fields = $fieldGroup?->fields_schema ?? [];

        $data['content'] = $this->normalizeContent(
            $data['content'] ?? [],
            $fields
        );

        return $data;
    }

    /**
     * @param  array<string, mixed>  $content
     * @param  array<int, array<string, mixed>>  $fields
     * @return array<string, array<string, mixed>>
     */
    private function normalizeContent(array $content, array $fields): array
    {
        $normalized = [];

        foreach ($content as $locale => $values) {
            if (! is_array($values)) {
                continue;
            }

            foreach ($fields as $field) {
                $key = (string) ($field['key'] ?? '');

                if ($key === '') {
                    continue;
                }

                $normalized[$locale][$key] = $this->normalizeFieldValue(
                    (string) ($field['type'] ?? 'text'),
                    Arr::get($values, $key)
                );
            }
        }

        return $normalized;
    }

    private function normalizeFieldValue(string $type, mixed $value): mixed
    {
        return match ($type) {
            'image' => is_array($value) ? Arr::get($value, 'url') : $value,
            'relation_new', 'product' => collect(is_array($value) ? $value : (filled($value) ? [$value] : []))
                ->filter(fn (mixed $item): bool => filled($item))
                ->map(fn (mixed $item): int => (int) $item)
                ->values()
                ->all(),
            'banner_position' => filled($value) ? (int) $value : null,
            default => $value,
        };
    }

    private function makeUniquePageSlug(string $value, ?int $ignorePageId = null): string
    {
        $slug = $this->normalizeSlug($value);

        if ($slug === '') {
            $slug = 'page';
        }

        $baseSlug = $slug;
        $suffix = 1;

        while ($this->pageSlugExists($slug, $ignorePageId)) {
            $slug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    private function pageSlugExists(string $slug, ?int $ignorePageId = null): bool
    {
        $pageExists = Page::query()
            ->when($ignorePageId !== null, fn ($query) => $query->whereKeyNot($ignorePageId))
            ->where('slug', $slug)
            ->exists();

        if ($pageExists) {
            return true;
        }

        return Slug::query()
            ->where('slug', $slug)
            ->when($ignorePageId !== null, function ($query) use ($ignorePageId): void {
                $query->where(function ($query) use ($ignorePageId): void {
                    $query->where('sluggable_type', '!=', Page::class)
                        ->orWhere('sluggable_id', '!=', $ignorePageId);
                });
            })
            ->exists();
    }

    private function normalizeSlug(string $value): string
    {
        $slug = strtolower(trim($value));

        if (class_exists(\Normalizer::class)) {
            $slug = \Normalizer::normalize($slug, \Normalizer::FORM_D) ?: $slug;
            $slug = preg_replace('/[\x{0300}-\x{036f}]/u', '', $slug);
        }

        $slug = str_replace(['đ', 'Đ'], ['d', 'd'], $slug);
        $slug = preg_replace('/[^\p{L}\p{N}\s-]/u', '', $slug);
        $slug = preg_replace('/(\s+)/u', '-', $slug);

        return trim((string) preg_replace('/-+/', '-', $slug), '-');
    }
}
