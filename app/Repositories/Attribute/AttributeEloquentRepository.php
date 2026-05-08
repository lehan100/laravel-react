<?php

namespace App\Repositories\Attribute;

use App\Models\Catalog\AttributeValue;
use App\Models\Catalog\ProductAttribute;
use App\Models\Settings\Language;
use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AttributeEloquentRepository extends EloquentRepository implements AttributeRepositoryInterface
{
    private array $FIELDSELECT = [
        'id',
        'name',
        'code',
        'type',
        'status',
        'order',
        'created_at',
    ];

    public function getModel()
    {
        return ProductAttribute::class;
    }

    public function lists($params = null, $options = null)
    {
        $task = $options['task'] ?? null;

        if (in_array($task, ['admin-list-items', 'admin-list-items-active'], true)) {
            $query = $this->_model->query()
                ->select($this->FIELDSELECT)
                ->with([
                    'translations' => function ($query) {
                        $query->select(['id', 'attribute_id', 'locale', 'name']);
                    },
                    'values' => function ($query) {
                        $query->select(['id', 'attribute_id', 'value', 'image', 'color', 'order'])
                            ->with(['translations' => function ($sq) {
                                $sq->select(['id', 'attribute_value_id', 'locale', 'value']);
                            }])
                            ->orderBy('order', 'asc')
                            ->orderBy('id', 'asc');
                    },
                ])
                ->orderBy('order', 'asc')
                ->orderBy('id', 'asc');

            if ($task === 'admin-list-items-active') {
                $query->where('status', 1);
            }

            return $this->normalizeAttributeLocales($query->get());
        }

        return collect();
    }

    public function get($params = null, $options = null)
    {
        if (($options['task'] ?? null) === 'get-item') {
            $attribute = $this->_model->query()
                ->with([
                    'translations',
                    'values' => function ($query) {
                        $query->orderBy('order', 'asc')->orderBy('id', 'asc')
                            ->with('translations');
                    },
                ])
                ->find($params['id']);

            if (! $attribute) {
                return null;
            }

            return $this->normalizeAttributeLocale($attribute);
        }

        return null;
    }

    public function save($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (! $task) {
            return false;
        }

        DB::beginTransaction();
        try {
            $item = $task === 'add-item'
                ? new $this->_model
                : $this->_model->find($params['id']);

            if (! $item) {
                DB::rollBack();

                return false;
            }

            $item->name = $this->resolvePrimaryAttributeName($params['translations'] ?? []);
            $item->code = $this->normalizeCodeValue($params['code'] ?? null);
            $item->type = $params['type'] ?? 'text';
            $item->status = (int) ($params['status'] ?? 0);
            $item->order = array_key_exists('order', $params)
                ? (int) ($params['order'] ?? 0)
                : (int) ($item->exists ? ($item->order ?? 0) : 0);
            $item->save();

            $this->syncAttributeTranslations($item, is_array($params['translations'] ?? null) ? $params['translations'] : []);
            $this->syncAttributeValues($item, is_array($params['values'] ?? null) ? $params['values'] : []);

            DB::commit();

            return $item->refresh()->load('translations', 'values.translations');
        } catch (\Throwable $throwable) {
            DB::rollBack();
            logger('Error save attribute: '.$throwable->getMessage());

            return false;
        }
    }

    public function delete($params = null, $options = null)
    {
        if (($options['task'] ?? null) === 'delete-item') {
            $item = $this->_model->with('values')->find($params['id']);
            if (! $item) {
                return false;
            }

            return $item->delete();
        }

        if (($options['task'] ?? null) === 'delete-items') {
            $ids = is_array($params['ids'] ?? null)
                ? $params['ids']
                : explode(',', (string) ($params['ids'] ?? ''));

            return $this->_model->whereIn('id', array_filter($ids))->get()->each(function (ProductAttribute $item): void {
                $item->delete();
            });
        }

        return false;
    }

    private function syncAttributeTranslations(ProductAttribute $attribute, array $translations): void
    {
        $keptLocales = [];

        foreach ($translations as $locale => $translationData) {
            $translationLocale = $this->resolveTranslationLocale($translationData['locale'] ?? null, $locale);
            $name = trim((string) ($translationData['name'] ?? ''));

            if ($name === '') {
                continue;
            }

            $attribute->translations()->updateOrCreate(
                ['locale' => $translationLocale],
                ['name' => $name]
            );

            $keptLocales[] = $translationLocale;
        }

        $attribute->translations()
            ->when($keptLocales !== [], fn ($query) => $query->whereNotIn('locale', $keptLocales))
            ->delete();
    }

    private function syncAttributeValues(ProductAttribute $attribute, array $values): void
    {
        $keptIds = [];

        foreach ($values as $index => $valueData) {
            $value = null;
            if (! empty($valueData['id'])) {
                $value = $attribute->values()->whereKey($valueData['id'])->first();
            }

            $image = $this->normalizeAttributeImageName($valueData['image'] ?? null);
            $primaryValue = $this->resolvePrimaryValueName($valueData['translations'] ?? [], $valueData['value'] ?? null);

            if (! $value && $primaryValue !== '') {
                $value = $attribute->values()
                    ->withTrashed()
                    ->where('value', $primaryValue)
                    ->first();
            }

            $value ??= $attribute->values()->make();

            if ($value->trashed()) {
                $value->restore();
            }

            $value->fill([
                'value' => $primaryValue,
                'image' => $image,
                'color' => $this->normalizeColorValue($valueData['color'] ?? null),
                'order' => (int) ($valueData['order'] ?? $index),
            ]);
            $value->save();

            $this->syncAttributeValueTranslations($value, is_array($valueData['translations'] ?? null) ? $valueData['translations'] : []);

            $keptIds[] = $value->id;
        }

        $attribute->values()
            ->when($keptIds !== [], fn ($query) => $query->whereNotIn('id', $keptIds))
            ->get()
            ->each(function (AttributeValue $value): void {
                $value->delete();
            });
    }

    private function syncAttributeValueTranslations(AttributeValue $value, array $translations): void
    {
        $keptLocales = [];

        foreach ($translations as $locale => $translationData) {
            $translationLocale = $this->resolveTranslationLocale($translationData['locale'] ?? null, $locale);
            $text = trim((string) ($translationData['value'] ?? ''));

            if ($text === '') {
                continue;
            }

            $value->translations()->updateOrCreate(
                ['locale' => $translationLocale],
                ['value' => $text]
            );

            $keptLocales[] = $translationLocale;
        }

        $value->translations()
            ->when($keptLocales !== [], fn ($query) => $query->whereNotIn('locale', $keptLocales))
            ->delete();
    }

    private function resolvePrimaryAttributeName(array $translations): ?string
    {
        foreach ($translations as $translationData) {
            $name = trim((string) ($translationData['name'] ?? ''));
            if ($name !== '') {
                return $name;
            }
        }

        return null;
    }

    private function resolveTranslationLocale(mixed $locale, mixed $fallback): string
    {
        if (is_string($locale) || is_int($locale)) {
            $locale = trim((string) $locale);

            if ($locale !== '') {
                return $locale;
            }
        }

        if (is_string($fallback) || is_int($fallback)) {
            $fallback = trim((string) $fallback);

            if ($fallback !== '') {
                return $fallback;
            }
        }

        return app()->getLocale();
    }

    private function resolvePrimaryValueName(array $translations, mixed $fallback): ?string
    {
        foreach ($translations as $translationData) {
            $value = trim((string) ($translationData['value'] ?? ''));
            if ($value !== '') {
                return $value;
            }
        }

        if (is_string($fallback) && trim($fallback) !== '') {
            return trim($fallback);
        }

        return null;
    }

    private function normalizeAttributeImageName(mixed $image): ?string
    {
        if (! is_string($image)) {
            return null;
        }

        $image = trim($image);

        if ($image === '') {
            return null;
        }

        if (str_starts_with($image, '/') || str_starts_with($image, 'http://') || str_starts_with($image, 'https://')) {
            return $image;
        }

        $path = parse_url($image, PHP_URL_PATH);
        $path = is_string($path) && $path !== '' ? $path : $image;

        if (str_contains($path, '/')) {
            return ltrim($path, '/');
        }

        $fileName = basename($path);

        return $fileName !== '' ? $fileName : null;
    }

    private function normalizeColorValue(mixed $color): ?string
    {
        if (! is_string($color)) {
            return null;
        }

        $color = trim($color);

        return $color !== '' ? Str::of($color)->upper()->value() : null;
    }

    private function normalizeAttributeLocales(iterable $attributes): iterable
    {
        $activeLocales = $this->activeLocaleCodes();

        return collect($attributes)->map(function (ProductAttribute $attribute) use ($activeLocales) {
            return $this->normalizeAttributeLocale($attribute, $activeLocales);
        });
    }

    private function normalizeAttributeLocale(ProductAttribute $attribute, ?array $activeLocales = null): ProductAttribute
    {
        $activeLocales ??= $this->activeLocaleCodes();

        if ($attribute->relationLoaded('translations')) {
            $attribute->setRelation(
                'translations',
                $attribute->translations->map(function ($translation) use ($activeLocales) {
                    $translation->locale = $this->normalizeLocaleKey((string) $translation->locale, $activeLocales);

                    return $translation;
                })->values()
            );
        }

        if ($attribute->relationLoaded('values')) {
            $attribute->setRelation(
                'values',
                $attribute->values->map(function (AttributeValue $value) use ($activeLocales) {
                    if ($value->relationLoaded('translations')) {
                        $value->setRelation(
                            'translations',
                            $value->translations->map(function ($translation) use ($activeLocales) {
                                $translation->locale = $this->normalizeLocaleKey((string) $translation->locale, $activeLocales);

                                return $translation;
                            })->values()
                        );
                    }

                    return $value;
                })->values()
            );
        }

        return $attribute;
    }

    /**
     * @return array<int, string>
     */
    private function activeLocaleCodes(): array
    {
        return Language::query()
            ->where('status', 1)
            ->orderBy('id', 'asc')
            ->pluck('code')
            ->map(fn (string $code): string => $this->normalizeLocaleKey($code, []))
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @param  array<int, string>  $activeLocales
     */
    private function normalizeLocaleKey(string $locale, array $activeLocales): string
    {
        $normalized = strtolower(trim($locale));

        if ($normalized === '') {
            return $normalized;
        }

        if (ctype_digit($normalized)) {
            $index = (int) $normalized;

            return $activeLocales[$index] ?? $normalized;
        }

        return str_replace('_', '-', $normalized);
    }

    private function normalizeCodeValue(mixed $code): ?string
    {
        if (! is_string($code)) {
            return null;
        }

        $code = trim($code);

        if ($code === '') {
            return null;
        }

        return Str::of($code)->lower()->replaceMatches('/[^a-z0-9._-]+/', '-')->replaceMatches('/-+/', '-')->trim('-')->value();
    }
}
