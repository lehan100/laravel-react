<?php

namespace App\Repositories\Warehouse;

use App\Models\Catalog\Product;
use App\Models\Catalog\ProductVariant;
use App\Models\Sales\InventoryAdjustmentHistory;
use App\Repositories\EloquentRepository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

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
            ->with([
                'translations' => function ($q) use ($locale) {
                    $q->select(['id', 'product_id', 'locale', 'name'])->where('locale', $locale);
                },
                'variants' => function ($q) use ($locale) {
                    $q->select(['id', 'product_id', 'sku', 'price', 'stock', 'updated_at'])
                        ->with([
                            'translations' => function ($translationQuery) use ($locale) {
                                $translationQuery->select(['id', 'product_variant_id', 'locale', 'name'])
                                    ->where('locale', $locale);
                            },
                            'attributeValues' => function ($valueQuery) use ($locale) {
                                $valueQuery->select(['attribute_values.id', 'attribute_values.attribute_id', 'attribute_values.value'])
                                    ->with([
                                        'translations' => function ($translationQuery) use ($locale) {
                                            $translationQuery->select(['id', 'attribute_value_id', 'locale', 'value'])
                                                ->where('locale', $locale);
                                        },
                                        'attribute:id,name',
                                    ]);
                            },
                        ])
                        ->orderBy('id');
                },
            ]);

        if ($search !== '') {
            $query->where(function (Builder $q) use ($search, $locale) {
                $q->where('sku', 'like', "%{$search}%")
                    ->orWhere('id', 'like', "%{$search}%")
                    ->orWhereHas('translations', function (Builder $tq) use ($search, $locale) {
                        $tq->where('locale', $locale)->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('variants', function (Builder $variantQuery) use ($search, $locale) {
                        $variantQuery->where('sku', 'like', "%{$search}%")
                            ->orWhereHas('translations', function (Builder $translationQuery) use ($search, $locale) {
                                $translationQuery->where('locale', $locale)->where('name', 'like', "%{$search}%");
                            });
                    });
            });
        }

        if ($stockStatus === 'in_stock') {
            $query->where(function (Builder $q): void {
                $q->where('is_stock', true)
                    ->orWhereHas('variants', fn (Builder $variantQuery) => $variantQuery->where('stock', '>', 0));
            });
        } elseif ($stockStatus === 'out_stock') {
            $query->where(function (Builder $q): void {
                $q->where('is_stock', false)
                    ->orWhereHas('variants', fn (Builder $variantQuery) => $variantQuery->where('stock', '<=', 0));
            });
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
            if ($task !== 'get-variant-item') {
                return null;
            }

            $locale = app()->getLocale();
            $id = (int) ($params['id'] ?? 0);

            return ProductVariant::query()
                ->select(['id', 'product_id', 'sku', 'price', 'stock', 'updated_at'])
                ->with([
                    'product' => function ($q) use ($locale) {
                        $q->select(['id', 'sku', 'quantity', 'is_stock', 'status', 'price', 'updated_at'])
                            ->with(['translations' => function ($translationQuery) use ($locale) {
                                $translationQuery->select(['id', 'product_id', 'locale', 'name'])->where('locale', $locale);
                            }]);
                    },
                    'translations' => function ($q) use ($locale) {
                        $q->select(['id', 'product_variant_id', 'locale', 'name'])->where('locale', $locale);
                    },
                    'attributeValues' => function ($valueQuery) use ($locale) {
                        $valueQuery->select(['attribute_values.id', 'attribute_values.attribute_id', 'attribute_values.value'])
                            ->with([
                                'translations' => function ($translationQuery) use ($locale) {
                                    $translationQuery->select(['id', 'attribute_value_id', 'locale', 'value'])
                                        ->where('locale', $locale);
                                },
                                'attribute:id,name',
                            ]);
                    },
                ])
                ->find($id);
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

        if ($task === 'adjust-variant') {
            return $this->adjustVariantStock($params);
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

        if ($task === 'toggle-variant-stock') {
            return $this->toggleVariantStock($params);
        }

        return null;
    }

    public function delete($params = null, $options = null)
    {
        return null;
    }

    private function adjustVariantStock(array $params): ?ProductVariant
    {
        return DB::transaction(function () use ($params): ?ProductVariant {
            $variant = ProductVariant::query()
                ->lockForUpdate()
                ->find((int) ($params['variant_id'] ?? 0));

            if (! $variant) {
                return null;
            }

            $action = (string) ($params['action'] ?? 'set');
            $reason = trim((string) ($params['reason'] ?? ''));
            $oldQuantity = (int) ($variant->stock ?? 0);
            $newQuantity = $action === 'set'
                ? (int) ($params['set_quantity'] ?? 0)
                : $oldQuantity + (int) ($params['adjust_delta'] ?? 0);

            $newQuantity = max(0, $newQuantity);
            $variant->stock = $newQuantity;
            $variant->save();

            $this->writeVariantInventoryHistory($variant, $action, $oldQuantity, $newQuantity, $reason);

            return $variant->fresh();
        });
    }

    private function toggleVariantStock(array $params): ?ProductVariant
    {
        return DB::transaction(function () use ($params): ?ProductVariant {
            $variant = ProductVariant::query()
                ->lockForUpdate()
                ->find((int) ($params['variant_id'] ?? 0));

            if (! $variant) {
                return null;
            }

            $oldQuantity = (int) ($variant->stock ?? 0);
            $newQuantity = $oldQuantity > 0 ? 0 : 1;
            $variant->stock = $newQuantity;
            $variant->save();

            $this->writeVariantInventoryHistory(
                $variant,
                'set',
                $oldQuantity,
                $newQuantity,
                __('hancms.sales.warehouse.messages.toggle_reason'),
                ['type' => 'toggle_variant_stock']
            );

            return $variant->fresh();
        });
    }

    private function writeVariantInventoryHistory(
        ProductVariant $variant,
        string $action,
        int $oldQuantity,
        int $newQuantity,
        string $reason,
        array $extraMeta = []
    ): void {
        InventoryAdjustmentHistory::query()->create([
            'product_id' => $variant->product_id,
            'user_id' => auth()->id(),
            'action' => $action,
            'old_quantity' => $oldQuantity,
            'new_quantity' => $newQuantity,
            'delta' => $newQuantity - $oldQuantity,
            'reason' => $reason !== '' ? $reason : null,
            'meta' => array_merge([
                'channel' => 'website',
                'variant_id' => $variant->id,
                'variant_sku' => $variant->sku,
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ], $extraMeta),
        ]);
    }
}
