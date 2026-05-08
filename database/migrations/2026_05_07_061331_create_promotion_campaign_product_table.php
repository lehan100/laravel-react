<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('promotion_campaign_products');

        Schema::create('promotion_campaign_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promotion_campaign_id')->constrained('promotion_campaigns')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->unique(['promotion_campaign_id', 'product_id'], 'pcp_campaign_product_unique');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotion_campaign_products');
    }
};
