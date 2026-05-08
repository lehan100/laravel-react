<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LayoutRouteSettingsTest extends TestCase
{
    #[Test]
    public function layout_routes_use_the_settings_path(): void
    {
        $this->assertSame(url('/admin123/settings'), route('layout.index'));
        $this->assertSame(url('/admin123/settings/store'), route('layout.store'));
    }
}
