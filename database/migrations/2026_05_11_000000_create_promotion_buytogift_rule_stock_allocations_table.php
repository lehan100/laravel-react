<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotion_buytogift_rule_stock_allocations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('promotion_buytogift_offer_rule_id');
            $table->foreign('promotion_buytogift_offer_rule_id', 'buytogift_rule_stock_allocations_rule_fk')
                ->references('id')
                ->on('promotion_buytogift_offer_rules')
                ->cascadeOnDelete();
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();
            $table->unsignedInteger('allocated_quantity')->default(0);
            $table->timestamps();

            $table->unique(
                ['promotion_buytogift_offer_rule_id', 'product_id'],
                'buytogift_rule_stock_allocations_unique'
            );
            $table->index('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotion_buytogift_rule_stock_allocations');
    }
};
