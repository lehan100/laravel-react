<?php

namespace App\Repositories\BuyToGift;

use App\Repositories\EloquentRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Collection;

interface BuyToGiftRepositoryInterface extends EloquentRepositoryInterface
{
    /**
     * @return Collection<int, array{id: int, name: string, ends_at: string|null}>
     */
    public function activeOptions(): Collection;

    public function getOffersWithRulesForSync(): Collection;

    public function getAllocationsForUpdate(int $ruleId, array $allocationKeys): Collection;

    public function createAllocation(array $payload): void;

    public function getActiveOffersForCalculation(Carbon $now): Collection;

    public function getAllOffersWithRuleCount(): Collection;
}
