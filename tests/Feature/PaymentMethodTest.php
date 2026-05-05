<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class PaymentMethodTest extends TestCase
{
    public function test_payment_methods_index_route_exists(): void
    {
        $this->assertTrue(Route::has('payment-methods.index'));
    }
}
