<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class AdminLoginThrottleTest extends TestCase
{
    public function test_admin_post_login_route_exists(): void
    {
        $this->assertTrue(Route::has('auth.post-login'));
    }
}
