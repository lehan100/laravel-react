<?php

namespace Tests\Unit;

use App\Models\Catalog\Product;
use App\Models\Catalog\ProductTranslation;
use App\Models\FieldGroup;
use App\Models\Page;
use App\Repositories\Page\PageEloquentRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PageEloquentRepositoryTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_eager_loads_product_translations_when_building_form_props(): void
    {
        $page = Page::query()->create([
            'field_group_id' => FieldGroup::query()->create([
                'title' => 'General',
                'fields_schema' => [],
                'status' => true,
            ])->id,
            'title' => 'Page title',
            'slug' => 'page-title',
            'status' => true,
            'acf_data' => [],
        ]);

        foreach (range(1, 2) as $index) {
            $product = Product::query()->create([
                'sku' => 'SKU-'.$index,
                'quantity' => 10,
                'weight' => 1,
                'price' => 1000,
                'status' => 1,
                'is_coupon' => false,
                'is_stock' => true,
                'order' => $index,
                'hit_viewer' => 0,
                'hit_order' => 0,
            ]);

            ProductTranslation::query()->create([
                'product_id' => $product->id,
                'locale' => app()->getLocale(),
                'name' => 'Product '.$index,
            ]);
        }

        DB::flushQueryLog();
        DB::enableQueryLog();

        $repository = new PageEloquentRepository;
        $repository->getFormProps([
            'page' => $page,
        ]);

        $queries = collect(DB::getQueryLog());
        $productTranslationQueries = $queries->filter(function (array $query): bool {
            return str_contains($query['query'], 'product_translations');
        });

        $this->assertCount(1, $productTranslationQueries);
    }
}
