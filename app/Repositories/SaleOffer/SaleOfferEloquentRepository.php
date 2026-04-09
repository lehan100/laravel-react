<?php

namespace App\Repositories\SaleOffer;

use App\Models\Promotion\PromotionSaleOffer;
use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\DB;

class SaleOfferEloquentRepository extends EloquentRepository implements SaleOfferRepositoryInterface
{
    private array $FIELDSELECT = [
        'id',
        'code',
        'name',
        'discount_type',
        'discount_value',
        'max_discount_amount',
        'starts_at',
        'ends_at',
        'priority',
        'is_active',
        'stackable'
    ];

    public function getModel()
    {
        return PromotionSaleOffer::class;
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
            'products:id',
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
            $item->discount_type = $params['discount_type'] ?? $item->discount_type ?? 'percent';
            $item->discount_value = $params['discount_value'] ?? $item->discount_value ?? 0;
            $item->max_discount_amount = $params['max_discount_amount'] ?? $item->max_discount_amount;
            $item->starts_at = $params['starts_at'] ?? $item->starts_at;
            $item->ends_at = $params['ends_at'] ?? $item->ends_at;
            $item->priority = $params['priority'] ?? $item->priority ?? 100;
            $item->is_active = $params['is_active'] ?? $item->is_active ?? true;
            $item->stackable = $params['stackable'] ?? $item->stackable ?? false;
            $item->save();
            if (array_key_exists('product_ids', (array) $params)) {
                $item->products()->sync($params['product_ids'] ?? []);
            }

            DB::commit();
            return $item;
        } catch (\Throwable $e) {
            DB::rollBack();
            logger('Error save saleoffer: ' . $e->getMessage());
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
