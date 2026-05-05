<?php

namespace Tests\Unit;

use App\Models\Sales\Order;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class OrderObserverRegistrationTest extends TestCase
{
    #[Test]
    public function it_registers_order_observer_for_core_model_events(): void
    {
        $dispatcher = app('events');

        $this->assertNotEmpty($dispatcher->getListeners('eloquent.created: '.Order::class));
        $this->assertNotEmpty($dispatcher->getListeners('eloquent.updated: '.Order::class));
        $this->assertNotEmpty($dispatcher->getListeners('eloquent.deleted: '.Order::class));
    }
}
