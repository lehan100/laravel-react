<?php

namespace App\Repositories\Coupon;

use App\Models\Promotion\PromotionCoupon;
use App\Repositories\EloquentRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Collection;

interface CouponRepositoryInterface extends EloquentRepositoryInterface
{
    /**
     * @return Collection<int, array{id: int, name: string, ends_at: string|null}>
     */
    public function activeOptions(): Collection;

    public function getValidCouponByCode(string $code, Carbon $now): ?PromotionCoupon;

    public function getAllCoupons(): Collection;
}
