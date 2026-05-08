<?php

namespace App\Repositories\FieldGroup;

use App\Models\FieldGroup;
use App\Repositories\EloquentRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class FieldGroupEloquentRepository extends EloquentRepository implements FieldGroupRepositoryInterface
{
    public function getModel(): string
    {
        return FieldGroup::class;
    }

    public function isInUse(int $id): bool
    {
        return $this->_model->newQuery()
            ->whereKey($id)
            ->whereHas('pages')
            ->exists();
    }

    public function lists($params = null, $options = null): LengthAwarePaginator|Collection|null
    {
        if (($options['task'] ?? null) === 'admin-list-items') {
            $search = (string) ($params['search'] ?? '');

            return $this->_model->newQuery()
                ->withCount('pages')
                ->when($search !== '', function ($query) use ($search): void {
                    $query->where('title', 'like', "%{$search}%");
                })
                ->latest('id')
                ->paginate(15)
                ->withQueryString();
        }

        return null;
    }

    public function get($params = null, $options = null): ?FieldGroup
    {
        if (($options['task'] ?? null) === 'get-item') {
            return $this->_model->newQuery()
                ->withCount('pages')
                ->find($params['id'] ?? null);
        }

        return null;
    }

    public function save($params = null, $options = null): FieldGroup|bool
    {
        $task = $options['task'] ?? null;

        if (! in_array($task, ['add-item', 'edit-item', 'change-status'], true)) {
            return false;
        }

        if ($task === 'change-status') {
            $fieldGroup = $this->_model->newQuery()->find($params['id'] ?? null);

            if (! $fieldGroup instanceof FieldGroup) {
                return false;
            }

            $fieldGroup->update(['status' => ! $fieldGroup->status]);

            return $fieldGroup;
        }

        return DB::transaction(function () use ($params, $task): FieldGroup|bool {
            $fieldGroup = $task === 'add-item'
                ? new $this->_model
                : $this->_model->newQuery()->find($params['id'] ?? null);

            if (! $fieldGroup instanceof FieldGroup) {
                return false;
            }

            $data = $this->normalizeRequest((array) $params);

            $fieldGroup->fill([
                'title' => $data['title'],
                'fields_schema' => $data['fields'],
                'status' => $data['status'] ?? true,
            ]);
            $fieldGroup->save();

            return $fieldGroup;
        });
    }

    public function delete($params = null, $options = null): bool
    {
        $task = $options['task'] ?? null;

        if ($task === 'delete-item') {
            $fieldGroup = $this->_model->newQuery()->find($params['id'] ?? null);

            return $fieldGroup instanceof FieldGroup && (bool) $fieldGroup->delete();
        }

        if ($task === 'delete-items') {
            $ids = Arr::wrap($params['ids'] ?? []);
            $fieldGroups = $this->_model->newQuery()
                ->whereIn('id', $ids)
                ->whereDoesntHave('pages')
                ->get();

            DB::transaction(function () use ($fieldGroups): void {
                $fieldGroups->each->delete();
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
        return [
            'fieldGroup' => $params['fieldGroup'] ?? null,
            'translations' => $this->translations(),
        ];
    }

    /**
     * @return array<string, string|array<string, string>>
     */
    public function translations(): array
    {
        return [
            'title' => __('hancms.content.menu_name'),
            'create' => __('hancms.button.created'),
            'edit' => __('hancms.button.edit'),
            'field_design' => __('hancms.content.field_design'),
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
    private function normalizeRequest(array $data): array
    {
        $data['fields'] = collect($data['fields'] ?? [])
            ->map(function (array $field): array {
                return [
                    'key' => (string) ($field['key'] ?? ''),
                    'label' => (string) ($field['label'] ?? ''),
                    'type' => (string) ($field['type'] ?? 'text'),
                    'translatable' => (bool) ($field['translatable'] ?? true),
                    'required' => (bool) ($field['required'] ?? true),
                ];
            })
            ->filter(fn (array $field): bool => $field['key'] !== '' && $field['label'] !== '')
            ->values()
            ->all();

        return $data;
    }
}
