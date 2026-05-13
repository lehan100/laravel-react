<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('promotion_buytogift_rule_buy_items', function (Blueprint $table): void {
            if (! Schema::hasColumn('promotion_buytogift_rule_buy_items', 'variant_id')) {
                $table->foreignId('variant_id')
                    ->nullable()
                    ->after('product_id')
                    ->constrained('product_variants')
                    ->cascadeOnDelete();
            }

            $table->unique(
                ['promotion_buytogift_rule_id', 'product_id', 'variant_id'],
                'promotion_buytogift_rule_buy_items_variant_unique'
            );
            $table->dropUnique('promotion_buytogift_rule_buy_items_unique');
        });

        Schema::table('promotion_buytogift_rule_gift_items', function (Blueprint $table): void {
            if (! Schema::hasColumn('promotion_buytogift_rule_gift_items', 'variant_id')) {
                $table->foreignId('variant_id')
                    ->nullable()
                    ->after('product_id')
                    ->constrained('product_variants')
                    ->cascadeOnDelete();
            }

            $table->unique(
                ['promotion_buytogift_rule_id', 'product_id', 'variant_id'],
                'promotion_buytogift_rule_gift_items_variant_unique'
            );
            $table->dropUnique('promotion_buytogift_rule_gift_items_unique');
        });

        Schema::table('promotion_buytogift_rule_stock_allocations', function (Blueprint $table): void {
            if (! Schema::hasColumn('promotion_buytogift_rule_stock_allocations', 'variant_id')) {
                $table->foreignId('variant_id')
                    ->nullable()
                    ->after('product_id')
                    ->constrained('product_variants')
                    ->cascadeOnDelete();
            }

            $table->unique(
                ['promotion_buytogift_offer_rule_id', 'product_id', 'variant_id'],
                'buytogift_rule_stock_allocations_variant_unique'
            );
            $table->dropUnique('buytogift_rule_stock_allocations_unique');
        });
    }

    public function down(): void
    {
        Schema::table('promotion_buytogift_rule_buy_items', function (Blueprint $table): void {
            $table->unique(
                ['promotion_buytogift_rule_id', 'product_id'],
                'promotion_buytogift_rule_buy_items_unique'
            );
            $table->dropUnique('promotion_buytogift_rule_buy_items_variant_unique');
            $table->dropConstrainedForeignId('variant_id');
        });

        Schema::table('promotion_buytogift_rule_gift_items', function (Blueprint $table): void {
            $table->unique(
                ['promotion_buytogift_rule_id', 'product_id'],
                'promotion_buytogift_rule_gift_items_unique'
            );
            $table->dropUnique('promotion_buytogift_rule_gift_items_variant_unique');
            $table->dropConstrainedForeignId('variant_id');
        });

        Schema::table('promotion_buytogift_rule_stock_allocations', function (Blueprint $table): void {
            $table->unique(
                ['promotion_buytogift_offer_rule_id', 'product_id'],
                'buytogift_rule_stock_allocations_unique'
            );
            $table->dropUnique('buytogift_rule_stock_allocations_variant_unique');
            $table->dropConstrainedForeignId('variant_id');
        });
    }
};
