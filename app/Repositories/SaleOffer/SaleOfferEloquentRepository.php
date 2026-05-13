<?php

namespace App\Repositories\SaleOffer;

use App\Models\Catalog\Product;
use App\Models\Promotion\PromotionCampaign;
use App\Models\Promotion\PromotionSaleOffer;
use App\Repositories\EloquentRepository;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SaleOfferEloquentRepository extends EloquentRepository implements SaleOfferRepositoryInterface
{
    private array $FIELDSELECT = [
        'id',
        'code',
        'name',
        'campaign_id',
        'discount_type',
        'discount_value',
        'max_discount_amount',
        'starts_at',
        'ends_at',
        'priority',
        'is_active',
        'stackable',
    ];

    public function getModel()
    {
        return PromotionSaleOffer::class;
    }

    public function lists($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (! in_array($task, ['admin-list-items', 'admin-list-items-active'], true)) {
            return null;
        }

        $query = $this->_model->select($this->FIELDSELECT)
            ->orderBy('priority')
            ->orderByDesc('id');

        if (! empty($params['search'])) {
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
            'campaign' => function ($query): void {
                $query->select(['id', 'ends_at'])
                    ->with([
                        'translations' => function ($translationQuery): void {
                            $translationQuery->select(['id', 'promotion_campaign_id', 'locale', 'name'])
                                ->where('locale', app()->getLocale());
                        },
                    ]);
            },
        ])->find($params['id'] ?? null);
    }

    /**
     * @return Collection<int, array{id: int, name: string, ends_at: string|null}>
     */
    public function activeOptions(): Collection
    {
        return $this->_model->query()
            ->select(['id', 'code', 'name', 'ends_at', 'is_active'])
            ->where('is_active', true)
            ->orderByDesc('id')
            ->get()
            ->map(fn (PromotionSaleOffer $saleOffer): array => [
                'id' => (int) $saleOffer->id,
                'name' => $saleOffer->name ?: $saleOffer->code ?: ('#'.$saleOffer->id),
                'ends_at' => optional($saleOffer->ends_at)->format('Y-m-d\\TH:i'),
            ])
            ->values();
    }

    public function save($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (! $task) {
            return false;
        }

        if ($task === 'change-status') {
            $item = $this->_model->find($params['id'] ?? null);
            if (! $item) {
                return false;
            }

            $item->is_active = ! $item->is_active;

            return $item->save();
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

            $item->code = $params['code'] ?? $item->code;
            $item->name = $params['name'] ?? $item->name;
            $item->description = $params['description'] ?? $item->description;
            $campaignId = $params['campaign_id'] ?? $item->campaign_id;
            $item->campaign_id = $campaignId !== '' ? $campaignId : null;
            $item->discount_type = $params['discount_type'] ?? $item->discount_type ?? 'percent';
            $item->discount_value = $params['discount_value'] ?? $item->discount_value ?? 0;
            $item->max_discount_amount = $params['max_discount_amount'] ?? $item->max_discount_amount;
            $item->starts_at = $params['starts_at'] ?? $item->starts_at;
            if (! empty($item->campaign_id)) {
                $campaign = PromotionCampaign::query()->select(['id', 'starts_at', 'ends_at'])->find($item->campaign_id);
                $item->starts_at = $campaign?->starts_at ?? $item->starts_at;
                $item->ends_at = $campaign?->ends_at ?? ($params['ends_at'] ?? $item->ends_at);
            } else {
                $endsAt = $params['ends_at'] ?? $item->ends_at;
                $item->ends_at = $endsAt !== '' ? $endsAt : null;
            }
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
            logger('Error save saleoffer: '.$e->getMessage());

            return false;
        }
    }

    public function delete($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (! $task) {
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

    public function appliedProductsPaginator(int $saleOfferId, object $saleOffer, int $perPage = 20): LengthAwarePaginator
    {
        $currentLocale = app()->getLocale();
        $productsPaginator = Product::query()
            ->select(['products.id', 'products.sku', 'products.price', 'products.status'])
            ->join('saleoffer_products as sop', 'sop.product_id', '=', 'products.id')
            ->where('sop.promotion_saleoffer_id', $saleOfferId)
            ->with(['translations' => function ($query) use ($currentLocale): void {
                $query->select(['id', 'product_id', 'locale', 'name'])
                    ->where('locale', $currentLocale);
            }])
            ->orderBy('products.id')
            ->paginate($perPage)
            ->withQueryString();

        $rows = collect($productsPaginator->items())->map(function (Product $product) use ($saleOffer): array {
            $translations = $product->translations ?? collect();
            $name = optional($translations->first())->name ?: ($product->sku ?: ('#'.$product->id));
            $price = (float) ($product->price ?? 0);
            $discount = $this->calculateDiscountAmount(
                $price,
                (string) ($saleOffer->discount_type ?? 'percent'),
                (float) ($saleOffer->discount_value ?? 0),
                $saleOffer->max_discount_amount !== null ? (float) $saleOffer->max_discount_amount : null
            );

            return [
                'id' => (int) $product->id,
                'sku' => $product->sku,
                'name' => $name,
                'price' => $price,
                'discount_amount' => $discount,
                'final_price' => max(0, round($price - $discount, 2)),
                'status' => (int) ($product->status ?? 0),
            ];
        })->values();

        $productsPaginator->setCollection($rows);

        return $productsPaginator;
    }

    private function calculateDiscountAmount(
        float $price,
        string $discountType,
        float $discountValue,
        ?float $maxDiscountAmount = null
    ): float {
        $rawDiscount = $discountType === 'percent'
            ? ($price * $discountValue / 100)
            : $discountValue;

        if ($maxDiscountAmount !== null) {
            $rawDiscount = min($rawDiscount, $maxDiscountAmount);
        }

        return round(max(0, min($rawDiscount, $price)), 2);
    }

    public function getActiveOffersForCalculation(Carbon $now): Collection
    {
        return $this->_model->query()
            ->where('is_active', true)
            ->where(fn ($q) => $q->whereNull('starts_at')->orWhere('starts_at', '<=', $now))
            ->where(fn ($q) => $q->whereNull('ends_at')->orWhere('ends_at', '>=', $now))
            ->orderBy('priority')
            ->orderBy('id')
            ->with('products:id')
            ->get();
    }

    public function getAllOffers(): Collection
    {
        return $this->_model->query()->get();
    }
}
