<?php

namespace App\Repositories\PaymentMethod;

use App\Models\Sales\PaymentMethod;
use App\Repositories\EloquentRepository;

class PaymentMethodEloquentRepository extends EloquentRepository implements PaymentMethodRepositoryInterface
{
    private const DEFAULT_METHODS = [
        [
            'code' => 'cash_on_delivery',
            'provider' => 'cash_on_delivery',
            'name' => 'Thanh toán khi nhận hàng (COD)',
            'description' => 'Khách thanh toán khi nhận hàng',
            'sort_order' => 0,
        ],
        [
            'code' => 'momo',
            'provider' => 'momo',
            'name' => 'MoMo',
            'description' => 'Ví điện tử MoMo',
            'sort_order' => 1,
        ],
        [
            'code' => 'zalopay',
            'provider' => 'zalopay',
            'name' => 'ZaloPay',
            'description' => 'Ví điện tử ZaloPay',
            'sort_order' => 2,
        ],
        [
            'code' => 'vnpay',
            'provider' => 'vnpay',
            'name' => 'VNPay',
            'description' => 'Cổng thanh toán VNPay',
            'sort_order' => 3,
        ],
        [
            'code' => 'paypal',
            'provider' => 'paypal',
            'name' => 'PayPal',
            'description' => 'Thanh toán PayPal',
            'sort_order' => 4,
        ],
    ];

    public function getModel()
    {
        return PaymentMethod::class;
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

        $query = PaymentMethod::query();
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
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

            return PaymentMethod::query()->find($id);
        }

        return null;
    }

    public function save($params = null, $options = null)
    {
        $task = $options['task'] ?? null;

        if ($task === 'add-item') {
            return PaymentMethod::query()->create([
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
            $item = PaymentMethod::query()->find((int) ($params['id'] ?? 0));
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
            $item = PaymentMethod::query()->find((int) ($params['id'] ?? 0));
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
            return PaymentMethod::query()->where('id', (int) ($params['id'] ?? 0))->delete();
        }

        if ($task === 'delete-items') {
            $ids = array_filter(explode(',', (string) ($params['ids'] ?? '')));
            if (empty($ids)) {
                return 0;
            }

            return PaymentMethod::query()->whereIn('id', $ids)->delete();
        }

        return 0;
    }

    private function ensureDefaultMethods(): void
    {
        foreach (self::DEFAULT_METHODS as $method) {
            PaymentMethod::query()->firstOrCreate(
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
