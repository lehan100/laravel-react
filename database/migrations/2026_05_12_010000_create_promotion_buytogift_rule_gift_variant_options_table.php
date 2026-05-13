<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('promotion_buytogift_rule_gift_variant_options')) {
            return;
        }

        Schema::create('promotion_buytogift_rule_gift_variant_options', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('promotion_buytogift_offer_rule_id');
            $table->foreignId('product_id');
            $table->foreignId('variant_id');
            $table->unsignedInteger('reserve_qty')->default(0);
            $table->timestamps();

            $table->foreign('promotion_buytogift_offer_rule_id', 'pbg_gift_var_opt_rule_fk')
                ->references('id')
                ->on('promotion_buytogift_offer_rules')
                ->cascadeOnDelete();
            $table->foreign('product_id', 'pbg_gift_var_opt_product_fk')
                ->references('id')
                ->on('products')
                ->cascadeOnDelete();
            $table->foreign('variant_id', 'pbg_gift_var_opt_variant_fk')
                ->references('id')
                ->on('product_variants')
                ->cascadeOnDelete();

            $table->unique(
                ['promotion_buytogift_offer_rule_id', 'product_id', 'variant_id'],
                'promotion_buytogift_rule_gift_variant_options_unique'
            );
            $table->index(['product_id', 'variant_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotion_buytogift_rule_gift_variant_options');
    }
};
