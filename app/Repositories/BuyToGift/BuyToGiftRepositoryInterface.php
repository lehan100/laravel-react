<?php

namespace App\Repositories\BuyToGift;

use App\Repositories\EloquentRepositoryInterface;
use Illuminate\Support\Collection;

interface BuyToGiftRepositoryInterface extends EloquentRepositoryInterface
{
    /**
     * @return Collection<int, array{id: int, name: string, ends_at: string|null}>
     */
    public function activeOptions(): Collection;
}
