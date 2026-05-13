<?php

namespace Tests\Feature;

use App\Models\Promotion\PromotionCoupon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CouponIndexTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_includes_expiry_date_on_index(): void
    {
        $this->withoutMiddleware();

        PromotionCoupon::query()->create([
            'code' => 'COUPON-INDEX-002',
            'name' => 'Coupon lower priority',
            'discount_type' => 'fixed',
            'discount_value' => 25000,
            'priority' => 20,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'is_public' => true,
            'stackable' => false,
        ]);

        PromotionCoupon::query()->create([
            'code' => 'COUPON-INDEX-001',
            'name' => 'Coupon higher priority',
            'discount_type' => 'fixed',
            'discount_value' => 25000,
            'priority' => 10,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'is_public' => true,
            'stackable' => false,
        ]);

        $response = $this->get(route('coupon.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/Coupon/Index')
            ->has('items.data.0.ends_at')
            ->where('items.data.0.code', 'COUPON-INDEX-001')
            ->where('items.data.0.priority', 10)
            ->where('items.data.0.is_active', true)
            ->where('items.data.0.promotion_status', 'active')
        );
    }
}
