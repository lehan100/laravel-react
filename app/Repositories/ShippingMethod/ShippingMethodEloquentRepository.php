<?php

namespace App\Repositories\ShippingMethod;

use App\Models\Sales\ShippingMethod;
use App\Repositories\EloquentRepository;

class ShippingMethodEloquentRepository extends EloquentRepository implements ShippingMethodRepositoryInterface
{
    private const DEFAULT_METHODS = [
        [
            'code' => 'ghn',
            'provider' => 'ghn',
            'name' => 'GHN',
            'description' => 'Giao Hàng Nhanh',
            'sort_order' => 0,
        ],
        [
            'code' => 'ghtk',
            'provider' => 'ghtk',
            'name' => 'GHTK',
            'description' => 'Giao Hàng Tiết Kiệm',
            'sort_order' => 1,
        ],
        [
            'code' => 'viettel_post',
            'provider' => 'viettel_post',
            'name' => 'Viettel Post',
            'description' => 'Viettel Post shipping API',
            'sort_order' => 2,
        ],
        [
            'code' => 'jnt',
            'provider' => 'jnt',
            'name' => 'J&T Express',
            'description' => 'J&T Express shipping API',
            'sort_order' => 3,
        ],
        [
            'code' => 'ninja_van',
            'provider' => 'ninja_van',
            'name' => 'Ninja Van',
            'description' => 'Ninja Van shipping API',
            'sort_order' => 4,
        ],
    ];

    public function getModel()
    {
        return ShippingMethod::class;
    }

    public function lists($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if ($task !== 'admin-list-items') {
            return null;
        }

        $this->ensureDefaultMethods();

        $search = trim((string) ($params['search'] ?? ''));
        $perPage = max(10, min(100, (int) ($params['per_page'] ?? 20)));

        $query = ShippingMethod::query();
        if ($search !== '') {
            $query->where(function ($builder) use ($search) {
                $builder->where('code', 'like', "%{$search}%")
                    ->orWhere('provider', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        return $query
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate($perPage);
    }

    public function get($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        $id = (int) ($params['id'] ?? 0);

        if ($task === 'get-item') {
            $this->ensureDefaultMethods();

            return ShippingMethod::query()->find($id);
        }

        return null;
    }

    public function save($params = null, $options = null)
    {
        $task = $options['task'] ?? null;

        if ($task === 'add-item') {
            return ShippingMethod::query()->create([
                'code' => trim((string) ($params['code'] ?? '')),
                'provider' => trim((string) ($params['provider'] ?? '')),
                'name' => trim((string) ($params['name'] ?? '')),
                'description' => isset($params['description']) ? trim((string) $params['description']) : null,
                'settings' => is_array($params['settings'] ?? null) ? $params['settings'] : [],
                'sort_order' => (int) ($params['sort_order'] ?? 0),
                'is_active' => (bool) ($params['is_active'] ?? true),
                'is_system' => (bool) ($params['is_system'] ?? false),
            ]);
        }

        if ($task === 'edit-item') {
            $item = ShippingMethod::query()->find((int) ($params['id'] ?? 0));
            if (! $item) {
                return null;
            }

            $item->update([
                'code' => trim((string) ($params['code'] ?? '')),
                'provider' => trim((string) ($params['provider'] ?? '')),
                'name' => trim((string) ($params['name'] ?? '')),
                'description' => isset($params['description']) ? trim((string) $params['description']) : null,
                'settings' => is_array($params['settings'] ?? null) ? $params['settings'] : [],
                'sort_order' => (int) ($params['sort_order'] ?? 0),
                'is_active' => (bool) ($params['is_active'] ?? true),
            ]);

            return $item->fresh();
        }

        if ($task === 'toggle-status') {
            $item = ShippingMethod::query()->find((int) ($params['id'] ?? 0));
            if (! $item) {
                return null;
            }

            $item->is_active = ! $item->is_active;
            $item->save();

            return $item->fresh();
        }

        return null;
    }

    public function delete($params = null, $options = null)
    {
        $task = $options['task'] ?? null;

        if ($task === 'delete-item') {
            return ShippingMethod::query()->where('id', (int) ($params['id'] ?? 0))->delete();
        }

        if ($task === 'delete-items') {
            $ids = array_filter(explode(',', (string) ($params['ids'] ?? '')));
            if (empty($ids)) {
                return 0;
            }

            return ShippingMethod::query()->whereIn('id', $ids)->delete();
        }

        return 0;
    }

    private function ensureDefaultMethods(): void
    {
        foreach (self::DEFAULT_METHODS as $method) {
            ShippingMethod::query()->firstOrCreate(
                ['code' => $method['code']],
                [
                    'provider' => $method['provider'],
                    'name' => $method['name'],
                    'description' => $method['description'],
                    'settings' => [],
                    'is_active' => true,
                    'is_system' => true,
                    'sort_order' => $method['sort_order'],
                ]
            );
        }
    }
}
