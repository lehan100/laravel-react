<?php

namespace App\Http\Resources\Concerns;

use Illuminate\Support\Carbon;

trait ResolvesPromotionStatus
{
    protected function resolvePromotionStatus(bool $isActive, Carbon|string|null $startsAt, Carbon|string|null $endsAt): string
    {
        if (! $isActive) {
            return 'inactive';
        }

        if ($startsAt && $this->isFutureDate($startsAt)) {
            return 'upcoming';
        }

        if ($endsAt && $this->isPastDate($endsAt)) {
            return 'expired';
        }

        return 'active';
    }

    protected function isFutureDate(Carbon|string $value): bool
    {
        return $value instanceof Carbon ? $value->isFuture() : Carbon::parse($value)->isFuture();
    }

    protected function isPastDate(Carbon|string $value): bool
    {
        return $value instanceof Carbon ? $value->isPast() : Carbon::parse($value)->isPast();
    }
}
