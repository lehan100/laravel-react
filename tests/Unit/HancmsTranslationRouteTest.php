<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class HancmsTranslationRouteTest extends TestCase
{
    #[Test]
    public function it_registers_hancms_translation_routes(): void
    {
        $this->assertTrue(route('hancms-translations.index') !== '');
        $this->assertTrue(route('hancms-translations.store') !== '');
    }
}
