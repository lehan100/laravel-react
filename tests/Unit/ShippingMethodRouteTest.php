<?php

namespace Tests\Unit;

use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ShippingMethodRouteTest extends TestCase
{
    #[Test]
    public function it_registers_the_shipping_method_routes(): void
    {
        $this->assertTrue(Route::has('shipping-methods.index'));
        $this->assertTrue(Route::has('shipping-methods.toggle-status'));
    }
}
