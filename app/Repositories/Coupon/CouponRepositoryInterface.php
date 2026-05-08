<?php

namespace App\Repositories\Coupon;

use App\Repositories\EloquentRepositoryInterface;
use Illuminate\Support\Collection;

interface CouponRepositoryInterface extends EloquentRepositoryInterface
{
    /**
     * @return Collection<int, array{id: int, name: string, ends_at: string|null}>
     */
    public function activeOptions(): Collection;
}
