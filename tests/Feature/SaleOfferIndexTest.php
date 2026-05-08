<?php

namespace Tests\Feature;

use App\Models\Promotion\PromotionSaleOffer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SaleOfferIndexTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_includes_expiry_date_on_index(): void
    {
        $this->withoutMiddleware();

        PromotionSaleOffer::query()->create([
            'code' => 'SALE-INDEX-001',
            'name' => 'Sale index summary',
            'discount_type' => 'percent',
            'discount_value' => 10,
            'priority' => 1,
            'starts_at' => now()->subDay(),
            'ends_at' => now()->addDay(),
            'is_active' => true,
            'stackable' => true,
        ]);

        $response = $this->get(route('saleoffer.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Promotion/SaleOffer/Index')
            ->has('items.data.0.ends_at')
            ->where('items.data.0.is_active', true)
            ->where('items.data.0.promotion_status', 'active')
        );
    }
}
