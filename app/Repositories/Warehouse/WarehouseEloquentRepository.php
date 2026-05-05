<?php

namespace App\Repositories\Warehouse;

use App\Models\Catalog\Product;
use App\Repositories\EloquentRepository;
use Illuminate\Database\Eloquent\Builder;

class WarehouseEloquentRepository extends EloquentRepository implements WarehouseRepositoryInterface
{
    public function getModel()
    {
        return Product::class;
    }

    public function lists($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if ($task !== 'admin-list-items') {
            return null;
        }

        $locale = app()->getLocale();
        $search = trim((string) ($params['search'] ?? ''));
        $stockStatus = (string) ($params['stock_status'] ?? 'all');
        $perPage = max(10, min(100, (int) ($params['per_page'] ?? 20)));

        $query = Product::query()
            ->select(['id', 'sku', 'quantity', 'is_stock', 'status', 'price', 'updated_at'])
            ->with(['translations' => function ($q) use ($locale) {
                $q->select(['id', 'product_id', 'locale', 'name'])->where('locale', $locale);
            }]);

        if ($search !== '') {
            $query->where(function (Builder $q) use ($search, $locale) {
                $q->where('sku', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$search}%")
                    ->orWhereHas('translations', function (Builder $tq) use ($search, $locale) {
                        $tq->where('locale', $locale)->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($stockStatus === 'in_stock') {
            $query->where('is_stock', true);
        } elseif ($stockStatus === 'out_stock') {
            $query->where('is_stock', false);
        }

        return $query
            ->orderBy('quantity')
            ->orderByDesc('updated_at')
            ->paginate($perPage);
    }

    public function get($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if ($task !== 'get-item') {
            return null;
        }

        $locale = app()->getLocale();
        $id = (int) ($params['id'] ?? 0);

        return Product::query()
            ->select(['id', 'sku', 'quantity', 'is_stock', 'status', 'price', 'updated_at'])
            ->with([
                'translations' => function ($q) use ($locale) {
                    $q->select(['id', 'product_id', 'locale', 'name'])->where('locale', $locale);
                },
                'adjustmentHistories' => function ($q) {
                    $q->select(['id', 'product_id', 'user_id', 'action', 'old_quantity', 'new_quantity', 'delta', 'reason', 'created_at'])
                        ->with('user:id,first_name,last_name,email')
                        ->limit(50);
                },
            ])
            ->find($id);
    }

    public function save($params = null, $options = null)
    {
        $task = $options['task'] ?? null;

        if ($task === 'adjust-item') {
            $product = Product::query()->find((int) ($params['id'] ?? 0));
            if (! $product) {
                return null;
            }

            $action = (string) ($params['action'] ?? 'set');
            $reason = trim((string) ($params['reason'] ?? ''));

            $oldQuantity = (int) ($product->quantity ?? 0);
            if ($action === 'set') {
                $newQuantity = (int) ($params['set_quantity'] ?? 0);
            } else {
                $delta = (int) ($params['adjust_delta'] ?? 0);
                $newQuantity = $oldQuantity + $delta;
            }
            if ($newQuantity < 0) {
                $newQuantity = 0;
            }

            request()->attributes->set('inventory_log_context', [
                'action' => $action,
                'reason' => $reason !== '' ? $reason : null,
                'meta' => [
                    'channel' => 'website',
                    'ip' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ],
            ]);

            $product->quantity = $newQuantity;
            $product->is_stock = $newQuantity > 0;
            $product->save();

            return $product->fresh();
        }

        if ($task === 'toggle-stock') {
            $product = Product::query()->find((int) ($params['id'] ?? 0));
            if (! $product) {
                return null;
            }

            $nextStock = ! $product->is_stock;
            request()->attributes->set('inventory_log_context', [
                'action' => 'set',
                'reason' => __('hancms.sales.warehouse.messages.toggle_reason'),
                'meta' => [
                    'channel' => 'website',
                    'type' => 'toggle_stock',
                    'old_is_stock' => (bool) $product->is_stock,
                    'new_is_stock' => $nextStock,
                    'ip' => request()->ip(),
                    'user_agent' => request()->userAgent(),
                ],
            ]);
            $product->is_stock = $nextStock;
            $product->save();

            return $product->fresh();
        }

        return null;
    }

    public function delete($params = null, $options = null)
    {
        return null;
    }
}
