<?php

namespace App\Repositories\MailTemplate;

use App\Models\Settings\MailTemplate;
use App\Repositories\EloquentRepository;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class MailTemplateEloquentRepository extends EloquentRepository implements MailTemplateRepositoryInterface
{
    private array $fieldSelect = [
        'id',
        'key',
        'module',
        'fallback_locale',
        'variables',
        'is_active',
        'created_at',
    ];

    public function getModel(): string
    {
        return MailTemplate::class;
    }

    public function lists($params = null, $options = null)
    {
        $task = $options['task'] ?? null;

        if (! in_array($task, ['admin-list-items', 'admin-list-items-active'], true)) {
            return null;
        }

        $currentLocale = app()->getLocale();
        $query = $this->_model->select($this->fieldSelect)
            ->with([
                'translations' => function ($builder) use ($currentLocale): void {
                    $builder->select(['id', 'mail_template_id', 'locale', 'name', 'subject'])
                        ->where('locale', $currentLocale);
                },
            ])
            ->orderByDesc('id');

        $search = trim((string) ($params['search'] ?? ''));
        if ($search !== '') {
            $query->where(function ($builder) use ($search): void {
                $builder->where('key', 'like', "%{$search}%")
                    ->orWhere('module', 'like', "%{$search}%")
                    ->orWhereHas('translations', function ($translationQuery) use ($search): void {
                        $translationQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('subject', 'like', "%{$search}%");
                    });
            });
        }

        if ($task === 'admin-list-items-active') {
            $query->where('is_active', true);
        }

        $perPage = (int) ($params['pagination']['totalItemsPerPage'] ?? 20);

        return $query->paginate($perPage);
    }

    public function get($params = null, $options = null)
    {
        if (($options['task'] ?? null) !== 'get-item') {
            return null;
        }

        return $this->_model->with('translations')->find($params['id'] ?? null);
    }

    public function save($params = null, $options = null)
    {
        $task = $options['task'] ?? null;

        if (! in_array($task, ['add-item', 'edit-item'], true)) {
            return false;
        }

        DB::beginTransaction();
        try {
            $item = $task === 'add-item'
                ? new $this->_model
                : $this->_model->find($params['id'] ?? null);

            if (! $item) {
                DB::rollBack();

                return false;
            }

            $item->key = trim((string) ($params['key'] ?? $item->key));
            $item->module = $this->nullableTrim($params['module'] ?? null);
            $item->fallback_locale = $this->nullableTrim($params['fallback_locale'] ?? null);
            $item->variables = is_array($params['variables'] ?? null) ? $params['variables'] : [];
            $item->is_active = (bool) ($params['is_active'] ?? $item->is_active ?? true);
            $item->save();

            foreach ((array) ($params['translations'] ?? []) as $locale => $translationData) {
                $translation = $item->translateOrNew((string) $locale);
                $translation->fill(Arr::only($translationData, ['name', 'subject', 'body_html']));
                $translation->save();
            }

            DB::commit();

            return $item->fresh('translations');
        } catch (\Throwable $e) {
            DB::rollBack();
            logger('Error save mail template: '.$e->getMessage());

            return false;
        }
    }

    public function delete($params = null, $options = null)
    {
        $task = $options['task'] ?? null;

        if (! in_array($task, ['delete-item', 'delete-items'], true)) {
            return false;
        }

        if ($task === 'delete-item') {
            $item = $this->_model->find($params['id'] ?? null);

            return $item ? $item->delete() : false;
        }

        $ids = is_array($params['ids'] ?? null) ? $params['ids'] : explode(',', (string) ($params['ids'] ?? ''));

        return $this->_model->whereIn('id', $ids)->get()->each->delete();
    }

    public function findByKey(string $key): ?MailTemplate
    {
        return $this->_model->where('key', $key)->first();
    }

    private function nullableTrim(mixed $value): ?string
    {
        $value = is_string($value) ? trim($value) : $value;

        return is_string($value) && $value !== '' ? $value : null;
    }
}
