<?php

namespace App\Observers;

use App\Models\Promotion\PromotionCoupon;
use Illuminate\Support\Facades\Log;

class PromotionCouponObserver
{
    /**
     * Chuẩn hóa dữ liệu trước khi tạo mới coupon.
     */
    public function creating(PromotionCoupon $coupon): void
    {
        if (! empty($coupon->code)) {
            $coupon->code = mb_strtoupper(trim((string) $coupon->code));
        }
    }

    /**
     * Chuẩn hóa dữ liệu trước khi cập nhật coupon.
     */
    public function updating(PromotionCoupon $coupon): void
    {
        if (! empty($coupon->code)) {
            $coupon->code = mb_strtoupper(trim((string) $coupon->code));
        }
    }

    public function deleting(PromotionCoupon $coupon): void
    {
        if ($coupon->campaign_id === null) {
            return;
        }

        $coupon->newQuery()
            ->whereKey($coupon->getKey())
            ->update(['campaign_id' => null]);
    }

    public function created(PromotionCoupon $coupon): void
    {
        Log::info('--- NEW COUPON CREATED ---', [
            'id' => $coupon->id,
            'code' => $coupon->code,
            'discount_type' => $coupon->discount_type,
            'discount_value' => $coupon->discount_value,
        ]);
    }
}
