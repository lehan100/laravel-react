<?php

namespace App\Repositories\SaleOffer;

use App\Repositories\EloquentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface SaleOfferRepositoryInterface extends EloquentRepositoryInterface
{
    public function appliedProductsPaginator(int $saleOfferId, object $saleOffer, int $perPage = 20): LengthAwarePaginator;
}
