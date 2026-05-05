<?php

namespace App\Repositories\Location;

use App\Models\Settings\Province;
use App\Models\Settings\Ward;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class LocationEloquentRepository implements LocationRepositoryInterface
{
    public function provincePaginator(array $params): LengthAwarePaginator
    {
        $search = trim((string) ($params['search'] ?? ''));
        $perPage = $this->normalizePerPage($params['per_page'] ?? 20, 20);

        return Province::query()
            ->with('administrativeUnit')
            ->withCount('wards')
            ->when($search !== '', fn (Builder $query) => $this->applyLocationSearch($query, $search))
            ->orderBy('code')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function wardPaginator(Province $province, array $params): LengthAwarePaginator
    {
        $search = trim((string) ($params['search'] ?? ''));
        $perPage = $this->normalizePerPage($params['per_page'] ?? 50, 50);

        return Ward::query()
            ->with(['province', 'administrativeUnit'])
            ->where('province_code', $province->code)
            ->when($search !== '', fn (Builder $query) => $this->applyLocationSearch($query, $search))
            ->orderBy('code')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function summary(): array
    {
        return [
            'provinces' => Province::query()->count(),
            'wards' => Ward::query()->count(),
        ];
    }

    public function provinceSummary(Province $province): array
    {
        return [
            'wards' => $province->wards()->count(),
        ];
    }

    public function loadProvinceForShow(Province $province): Province
    {
        return $province->load(['administrativeUnit'])->loadCount('wards');
    }

    private function applyLocationSearch(Builder $query, string $search): void
    {
        $query->where(function (Builder $builder) use ($search): void {
            $builder->where('code', 'like', "%{$search}%")
                ->orWhere('name', 'like', "%{$search}%")
                ->orWhere('full_name', 'like', "%{$search}%")
                ->orWhere('code_name', 'like', "%{$search}%");
        });
    }

    private function normalizePerPage(mixed $value, int $default): int
    {
        return max(10, min(100, (int) ($value ?: $default)));
    }
}
