<?php

namespace App\Repositories\BuyToGift;

use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\DB;

class BuyToGiftEloquentRepository extends EloquentRepository implements BuyToGiftRepositoryInterface
{
    private array $FIELDSELECT = [
        'id',
        'code',
        'name',
        'condition_type',
        'min_order_amount',
        'max_sets_per_order',
        'starts_at',
        'ends_at',
        'priority',
        'is_active',
        'stackable',
    ];

    public function getModel()
    {
        return PromotionBuyToGiftOffer::class;
    }

    public function lists($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (!in_array($task, ['admin-list-items', 'admin-list-items-active'], true)) {
            return null;
        }

        $query = $this->_model->select($this->FIELDSELECT)
            ->orderBy('priority')
            ->orderByDesc('id');

        if (!empty($params['search'])) {
            $search = trim((string) $params['search']);
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%");
            });
        }

        if ($task === 'admin-list-items-active') {
            $query->where('is_active', true);
        }

        $perPage = $params['pagination']['totalItemsPerPage'] ?? 20;
        return $query->paginate($perPage);
    }

    public function get($params = null, $options = null)
    {
        if (($options['task'] ?? null) !== 'get-item') {
            return null;
        }

        return $this->_model->with([
            'buyProducts:id',
            'giftProducts:id',
        ])->find($params['id'] ?? null);
    }

    public function save($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (!$task) {
            return false;
        }

        if ($task === 'change-status') {
            $item = $this->_model->find($params['id'] ?? null);
            if (!$item) {
                return false;
            }

            $item->is_active = !$item->is_active;
            return $item->save();
        }

        DB::beginTransaction();
        try {
            $item = $task === 'add-item'
                ? new $this->_model
                : $this->_model->find($params['id'] ?? null);

            if (!$item) {
                DB::rollBack();
                return false;
            }

            $item->code = $params['code'] ?? $item->code;
            $item->name = $params['name'] ?? $item->name;
            $item->description = $params['description'] ?? $item->description;
            $item->condition_type = $params['condition_type'] ?? $item->condition_type ?? 'order_amount';
            $item->min_order_amount = $params['min_order_amount'] ?? $item->min_order_amount;
            $item->max_sets_per_order = $params['max_sets_per_order'] ?? $item->max_sets_per_order;
            $item->starts_at = $params['starts_at'] ?? $item->starts_at;
            $item->ends_at = $params['ends_at'] ?? $item->ends_at;
            $item->priority = $params['priority'] ?? $item->priority ?? 100;
            $item->is_active = $params['is_active'] ?? $item->is_active ?? true;
            $item->stackable = $params['stackable'] ?? $item->stackable ?? false;
            $item->save();

            $buyQty = max(1, (int) ($params['buy_qty'] ?? 1));
            $giftQty = max(1, (int) ($params['gift_qty'] ?? 1));

            if (array_key_exists('buy_product_ids', (array) $params)) {
                $syncBuyProducts = collect($params['buy_product_ids'] ?? [])
                    ->mapWithKeys(fn($id) => [(int) $id => ['buy_qty' => $buyQty]])
                    ->all();
                $item->buyProducts()->sync($syncBuyProducts);
            }

            if (array_key_exists('gift_product_ids', (array) $params)) {
                $syncGiftProducts = collect($params['gift_product_ids'] ?? [])
                    ->mapWithKeys(fn($id) => [(int) $id => ['gift_qty' => $giftQty, 'is_auto_add' => true]])
                    ->all();
                $item->giftProducts()->sync($syncGiftProducts);
            }

            DB::commit();
            return $item;
        } catch (\Throwable $e) {
            DB::rollBack();
            logger('Error save buytogift: ' . $e->getMessage());
            return false;
        }
    }

    public function delete($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (!$task) {
            return false;
        }

        if ($task === 'delete-item') {
            $item = $this->_model->find($params['id'] ?? null);
            return $item ? $item->delete() : false;
        }

        if ($task === 'delete-items') {
            $ids = is_array($params['ids'] ?? null)
                ? $params['ids']
                : explode(',', (string) ($params['ids'] ?? ''));

            return $this->_model->whereIn('id', $ids)->delete();
        }

        return false;
    }
}
