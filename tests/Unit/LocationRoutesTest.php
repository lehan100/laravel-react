<?php

namespace Tests\Unit;

use Illuminate\Support\Facades\Route;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LocationRoutesTest extends TestCase
{
    #[Test]
    public function it_registers_the_location_routes(): void
    {
        $this->assertTrue(Route::has('locations.index'));
        $this->assertTrue(Route::has('locations.show'));
    }
}
