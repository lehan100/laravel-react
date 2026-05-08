<?php

namespace Tests\Unit;

use App\Repositories\Category\CategoryEloquentRepository;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CategoryProductPickerDataTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        app()->setLocale('ja');
        config(['translatable.locales' => ['vi', 'en', 'ja']]);
    }

    #[Test]
    public function it_returns_zero_quantity_for_products_without_stock_management(): void
    {
        $now = now();

        $productId = DB::table('products')->insertGetId([
            'sku' => 'A001',
            'quantity' => 900,
            'weight' => 1,
            'price' => 590000,
            'is_coupon' => 0,
            'is_stock' => 0,
            'status' => 1,
            'order' => 1,
            'hit_viewer' => 0,
            'hit_order' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('product_translations')->insert([
            'product_id' => $productId,
            'locale' => 'ja',
            'name' => 'JP Nước hoa Charme Cool Water',
            'description' => null,
            'content' => null,
            'seo_title' => null,
            'seo_keyword' => null,
            'seo_description' => null,
            'order' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        /** @var CategoryEloquentRepository $repository */
        $repository = app(CategoryEloquentRepository::class);
        $picker = $repository->getProductPickerData(12, 'Charme');

        $this->assertNotEmpty($picker['data']);
        $row = collect($picker['data'])->firstWhere('id', $productId);

        $this->assertNotNull($row);
        $this->assertSame(0, (int) ($row['quantity'] ?? -1));
        $this->assertSame(0, (int) ($row['is_stock'] ?? -1));
    }

    #[Test]
    public function it_eager_loads_campaign_slugs_when_fetching_selected_product_rows(): void
    {
        $now = now();

        $productId = DB::table('products')->insertGetId([
            'sku' => 'A002',
            'quantity' => 12,
            'weight' => 1,
            'price' => 120000,
            'is_coupon' => 0,
            'is_stock' => 1,
            'status' => 1,
            'order' => 1,
            'hit_viewer' => 0,
            'hit_order' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('product_translations')->insert([
            'product_id' => $productId,
            'locale' => 'ja',
            'name' => 'JP Nước hoa Charme Cool Water',
            'description' => null,
            'content' => null,
            'seo_title' => null,
            'seo_keyword' => null,
            'seo_description' => null,
            'order' => 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $campaignId = DB::table('promotion_campaigns')->insertGetId([
            'starts_at' => $now,
            'ends_at' => $now->copy()->addDay(),
            'priority' => 1,
            'is_active' => 1,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('promotion_campaign_translations')->insert([
            'promotion_campaign_id' => $campaignId,
            'locale' => 'ja',
            'name' => 'キャンペーン',
            'description' => null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('slugs')->insert([
            'slug' => 'campaign-ja',
            'locale' => 'ja',
            'sluggable_id' => $campaignId,
            'sluggable_type' => 'App\\Models\\Promotion\\PromotionCampaign',
            'redirect_to' => null,
            'status' => 1,
            'is_default' => 1,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::table('promotion_campaign_products')->insert([
            'product_id' => $productId,
            'promotion_campaign_id' => $campaignId,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        DB::flushQueryLog();
        DB::enableQueryLog();

        /** @var CategoryEloquentRepository $repository */
        $repository = app(CategoryEloquentRepository::class);
        $rows = $repository->getSelectedProductRows([$productId]);

        $this->assertNotEmpty($rows);
        $this->assertSame(6, count(DB::getQueryLog()));
        $this->assertSame('campaign-ja', $rows[0]['campaigns'][0]['slug'] ?? null);
    }
}
