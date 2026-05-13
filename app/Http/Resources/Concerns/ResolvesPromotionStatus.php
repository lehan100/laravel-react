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

        $now = Carbon::now($this->promotionStatusTimezone());
        $startsDate = $this->normalizePromotionDate($startsAt);
        $endsDate = $this->normalizePromotionDate($endsAt);

        if ($startsDate && $startsDate->greaterThan($now)) {
            return 'upcoming';
        }

        if ($endsDate && $endsDate->lessThan($now)) {
            return 'expired';
        }

        return 'active';
    }

    protected function normalizePromotionDate(Carbon|string|null $value): ?Carbon
    {
        if ($value === null) {
            return null;
        }

        $timezone = $this->promotionStatusTimezone();
        $dateString = $value instanceof Carbon ? $value->format('Y-m-d H:i:s') : (string) $value;

        return Carbon::parse($dateString, $timezone);
    }

    protected function promotionStatusTimezone(): string
    {
        return config('app.admin_timezone', 'Asia/Ho_Chi_Minh');
    }
}
