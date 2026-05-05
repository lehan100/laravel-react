<?php

namespace App\Repositories\Location;

use App\Models\Settings\Province;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface LocationRepositoryInterface
{
    /**
     * @param  array{search?: string, per_page?: int}  $params
     */
    public function provincePaginator(array $params): LengthAwarePaginator;

    /**
     * @param  array{search?: string, per_page?: int}  $params
     */
    public function wardPaginator(Province $province, array $params): LengthAwarePaginator;

    /**
     * @return array{provinces: int, wards: int}
     */
    public function summary(): array;

    /**
     * @return array{wards: int}
     */
    public function provinceSummary(Province $province): array;

    public function loadProvinceForShow(Province $province): Province;
}
