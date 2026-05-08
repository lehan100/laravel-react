<?php

namespace Tests\Unit;

use App\Http\Resources\PageQuickStoreResource;
use App\Models\FieldGroup;
use App\Models\Page;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PageQuickStoreResourceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_does_not_lazy_load_translations_when_resolving(): void
    {
        $page = Page::query()->create([
            'field_group_id' => FieldGroup::query()->create([
                'title' => 'General',
                'fields_schema' => [],
                'status' => true,
            ])->id,
            'title' => 'Base title',
            'slug' => 'base-title',
            'status' => true,
            'acf_data' => [],
        ]);

        $freshPage = Page::query()->firstOrFail();
        $freshPage->loadMissing(['translations', 'fieldGroup']);

        DB::flushQueryLog();
        DB::enableQueryLog();

        $resolved = PageQuickStoreResource::make($freshPage)->resolve();

        $this->assertSame(0, count(DB::getQueryLog()));
        $this->assertSame('Base title', $resolved['label']);
        $this->assertSame('Base title', $resolved['name']);
    }
}
