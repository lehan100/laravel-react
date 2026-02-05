<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\DatabaseTransactions;

abstract class TestCase extends BaseTestCase
{
    //use RefreshDatabase;
    use DatabaseTransactions;
    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
    }
}
