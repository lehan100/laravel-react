<?php

namespace App\Repositories\PromotionCampaign;

use App\Repositories\EloquentRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface PromotionCampaignRepositoryInterface extends EloquentRepositoryInterface
{
    public function appliedProductsPaginator(int $promotionCampaignId, object $campaign, int $perPage = 20): LengthAwarePaginator;

    public function findBySlug(string $slug): ?object;

    /**
     * @return Collection<int, array{id: int, name: string, ends_at: string|null}>
     */
    public function activeOptions(): Collection;
}
