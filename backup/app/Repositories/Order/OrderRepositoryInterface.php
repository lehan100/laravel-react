<?php

namespace App\Repositories\Order;

use App\Models\Promotion\PromotionBuyToGiftOfferRule;
use App\Repositories\EloquentRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Collection;

interface OrderRepositoryInterface extends EloquentRepositoryInterface
{
    public function calculateSoldQuantityForRule(PromotionBuyToGiftOfferRule $rule, ?int $excludeOrderId = null): int;

    public function getOrdersByDateRange(Carbon $startDate, Carbon $endDate): Collection;

    public function getTopSellingProducts(Carbon $startDate, Carbon $endDate, int $limit = 15): Collection;

    public function getDiscountTotalByDateRange(Carbon $startDate, Carbon $endDate): float;
}
