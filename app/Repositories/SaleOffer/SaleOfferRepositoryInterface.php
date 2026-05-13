<?php

namespace App\Repositories\SaleOffer;

use App\Repositories\EloquentRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface SaleOfferRepositoryInterface extends EloquentRepositoryInterface
{
    public function appliedProductsPaginator(int $saleOfferId, object $saleOffer, int $perPage = 20): LengthAwarePaginator;

    /**
     * @return Collection<int, array{id: int, name: string, ends_at: string|null}>
     */
    public function activeOptions(): Collection;

    public function getActiveOffersForCalculation(Carbon $now): Collection;

    public function getAllOffers(): Collection;
}
