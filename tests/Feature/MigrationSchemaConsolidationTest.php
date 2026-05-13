<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MigrationSchemaConsolidationTest extends TestCase
{
    #[Test]
    public function it_keeps_the_merged_schema_changes_in_the_main_migrations(): void
    {
        $this->assertStringContainsString(
            "->unsignedInteger('priority')->default(100);",
            file_get_contents(base_path('database/migrations/2026_04_09_065346_create_promotion_coupon_table.php'))
        );
        $this->assertStringContainsString(
            "->unsignedInteger('sold_quantity')->default(0);",
            file_get_contents(base_path('database/migrations/2026_03_20_022259_create_product_table.php'))
        );
        $this->assertStringContainsString(
            "->string('coupon_code')->nullable();",
            file_get_contents(base_path('database/migrations/2026_04_28_085321_create_orders_table.php'))
        );
        $this->assertStringContainsString(
            "->json('applied_promotions')->nullable();",
            file_get_contents(base_path('database/migrations/2026_04_28_085321_create_orders_table.php'))
        );
        $this->assertStringContainsString(
            "->string('action', 100)->default('set');",
            file_get_contents(base_path('database/migrations/2026_04_28_071500_create_inventory_adjustment_histories_table.php'))
        );
        $this->assertStringContainsString(
            "->text('description')->nullable();",
            file_get_contents(base_path('database/migrations/2026_05_07_063846_create_promotion_campaign_translations_table.php'))
        );
        $this->assertStringContainsString(
            "->string('title')->nullable();",
            file_get_contents(base_path('database/migrations/2026_05_06_032933_create_pages_table.php'))
        );
        $this->assertStringContainsString(
            "->foreignId('page_id')",
            file_get_contents(base_path('database/migrations/2026_05_06_032933_create_pages_table.php'))
        );
        $this->assertStringContainsString(
            "->unsignedInteger('max_gift_qty')->nullable();",
            file_get_contents(base_path('database/migrations/2026_04_09_094719_create_promotion_buytogift_table.php'))
        );
        $this->assertStringContainsString(
            "Schema::create('promotion_buytogift_rule_stock_allocations'",
            file_get_contents(base_path('database/migrations/2026_04_09_094719_create_promotion_buytogift_table.php'))
        );
        $this->assertStringContainsString(
            "Schema::create('promotion_buytogift_rule_gift_variant_options'",
            file_get_contents(base_path('database/migrations/2026_05_05_022430_create_product_attribute_variant_schema.php'))
        );
        $this->assertStringContainsString(
            "->foreignId('variant_id')",
            file_get_contents(base_path('database/migrations/2026_05_05_022430_create_product_attribute_variant_schema.php'))
        );

        $this->assertFileDoesNotExist(base_path('database/migrations/2026_05_11_033440_add_priority_to_promotion_coupons_table.php'));
        $this->assertFileDoesNotExist(base_path('database/migrations/2026_05_11_040800_add_sold_quantity_to_products_table.php'));
        $this->assertFileDoesNotExist(base_path('database/migrations/2026_05_11_080430_add_promotion_fields_to_orders_table.php'));
        $this->assertFileDoesNotExist(base_path('database/migrations/2026_05_11_034318_alter_inventory_adjustment_histories_action_column.php'));
        $this->assertFileDoesNotExist(base_path('database/migrations/2026_05_07_070000_add_campaign_id_to_promotion_modules_table.php'));
    }
}
