<?php

namespace App\Repositories\BuyToGift;

use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionBuyToGiftOfferRule;
use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\DB;

class BuyToGiftEloquentRepository extends EloquentRepository implements BuyToGiftRepositoryInterface
{
    private array $FIELDSELECT = [
        'id',
        'code',
        'name',
        'description',
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
            ->with([
                'rules' => function ($q) {
                    $q->select([
                        'id',
                        'promotion_buytogift_offer_id',
                        'condition_type',
                        'min_order_amount',
                        'max_sets_per_order',
                        'priority',
                        'is_active',
                    ])
                    ->orderBy('priority')
                    ->orderBy('id');
                },
            ])
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
            'rules' => function ($q) {
                $q->orderBy('priority')->orderBy('id');
            },
            'rules.buyProducts:id',
            'rules.giftProducts:id',
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
            $item->starts_at = $params['starts_at'] ?? $item->starts_at;
            $item->ends_at = $params['ends_at'] ?? $item->ends_at;
            $item->priority = $params['priority'] ?? $item->priority ?? 100;
            $item->is_active = $params['is_active'] ?? $item->is_active ?? true;
            $item->stackable = $params['stackable'] ?? $item->stackable ?? false;
            $item->save();

            if (is_array($params['rules'] ?? null) && count($params['rules']) > 0) {
                $this->syncMultiRules($item, $params['rules'], $params);
            } else {
                $this->syncLegacySingleRule($item, $params, $task);
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

    private function syncLegacySingleRule(PromotionBuyToGiftOffer $item, array $params, string $task): void
    {
        $rule = null;
        if ($task === 'add-item') {
            $rule = new PromotionBuyToGiftOfferRule();
            $rule->promotion_buytogift_offer_id = $item->id;
        } else {
            $rule = $item->rules()->orderBy('priority')->orderBy('id')->first();
            if (!$rule) {
                $rule = new PromotionBuyToGiftOfferRule();
                $rule->promotion_buytogift_offer_id = $item->id;
            }
        }

        $rule->condition_type = $params['condition_type'] ?? $rule->condition_type ?? 'order_amount';
        $rule->min_order_amount = $params['min_order_amount'] ?? $rule->min_order_amount;
        $rule->max_sets_per_order = $params['max_sets_per_order'] ?? $rule->max_sets_per_order;
        $rule->priority = $params['priority'] ?? $rule->priority ?? 100;
        $rule->is_active = $params['is_active'] ?? $rule->is_active ?? true;
        $rule->stackable = $params['stackable'] ?? $rule->stackable ?? false;
        $rule->save();

        $buyQty = max(1, (int) ($params['buy_qty'] ?? 1));
        $giftQty = max(1, (int) ($params['gift_qty'] ?? 1));

        $syncBuyProducts = collect($params['buy_product_ids'] ?? [])
            ->mapWithKeys(fn($id) => [(int) $id => ['buy_qty' => $buyQty]])
            ->all();
        $rule->buyProducts()->sync($syncBuyProducts);

        $syncGiftProducts = collect($params['gift_product_ids'] ?? [])
            ->mapWithKeys(fn($id) => [(int) $id => ['gift_qty' => $giftQty, 'is_auto_add' => true]])
            ->all();
        $rule->giftProducts()->sync($syncGiftProducts);
    }

    private function syncMultiRules(PromotionBuyToGiftOffer $item, array $rulesInput, array $params): void
    {
        $existingRules = $item->rules()->get()->keyBy('id');
        $keepIds = [];

        foreach ($rulesInput as $index => $row) {
            if (!is_array($row)) {
                continue;
            }

            $ruleId = isset($row['id']) ? (int) $row['id'] : null;
            $rule = $ruleId && $existingRules->has($ruleId)
                ? $existingRules->get($ruleId)
                : new PromotionBuyToGiftOfferRule(['promotion_buytogift_offer_id' => $item->id]);

            $rule->condition_type = $row['condition_type'] ?? 'order_amount';
            $rule->min_order_amount = $row['min_order_amount'] ?? null;
            $rule->max_sets_per_order = $row['max_sets_per_order'] ?? null;
            $rule->priority = isset($row['priority']) ? (int) $row['priority'] : ((int) ($params['priority'] ?? 100) + (int) $index);
            $rule->is_active = array_key_exists('is_active', $row)
                ? filter_var($row['is_active'], FILTER_VALIDATE_BOOLEAN)
                : true;
            $rule->stackable = array_key_exists('stackable', $row)
                ? filter_var($row['stackable'], FILTER_VALIDATE_BOOLEAN)
                : false;
            $rule->promotion_buytogift_offer_id = $item->id;
            $rule->save();

            $keepIds[] = (int) $rule->id;

            $buyQty = max(1, (int) ($row['buy_qty'] ?? 1));
            $giftQty = max(1, (int) ($row['gift_qty'] ?? 1));

            $syncBuyProducts = collect($row['buy_product_ids'] ?? [])
                ->mapWithKeys(fn($id) => [(int) $id => ['buy_qty' => $buyQty]])
                ->all();
            $rule->buyProducts()->sync($syncBuyProducts);

            $syncGiftProducts = collect($row['gift_product_ids'] ?? [])
                ->mapWithKeys(fn($id) => [(int) $id => ['gift_qty' => $giftQty, 'is_auto_add' => true]])
                ->all();
            $rule->giftProducts()->sync($syncGiftProducts);
        }

        if (!empty($keepIds)) {
            $item->rules()->whereNotIn('id', $keepIds)->delete();
        } else {
            $item->rules()->delete();
        }
    }
}
