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
        Schema::create('promotion_buytogift_offers', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('name')->nullable();
            $table->text('description')->nullable();

            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();

            $table->unsignedInteger('priority')->default(100);
            $table->boolean('is_active')->default(true);
            $table->boolean('stackable')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index('code');
            $table->index(['is_active', 'starts_at', 'ends_at']);
            $table->index(['priority', 'is_active']);
        });

        // 1 offer có nhiều rule: mua A tặng B, mua C tặng D, ...
        Schema::create('promotion_buytogift_offer_rules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('promotion_buytogift_offer_id');
            $table->foreign('promotion_buytogift_offer_id', 'buytogift_rules_offer_fk')
                ->references('id')
                ->on('promotion_buytogift_offers')
                ->cascadeOnDelete();

            // order_amount: đạt giá trị đơn, buy_product: mua sản phẩm điều kiện
            $table->enum('condition_type', ['order_amount', 'buy_product'])->default('buy_product');
            $table->decimal('min_order_amount', 12, 2)->nullable();
            $table->unsignedInteger('max_sets_per_order')->nullable(); // null = không giới hạn
            $table->unsignedInteger('priority')->default(100);
            $table->boolean('is_active')->default(true);
            $table->boolean('stackable')->default(false);

            $table->timestamps();
            $table->softDeletes();

            $table->index(['promotion_buytogift_offer_id', 'is_active'], 'buytogift_rules_offer_active_idx');
            $table->index(['priority', 'is_active'], 'buytogift_rules_priority_active_idx');
            $table->index(['condition_type', 'is_active'], 'buytogift_rules_condition_active_idx');
        });

        // Danh sách sản phẩm điều kiện theo từng rule
        Schema::create('promotion_buytogift_rule_buy_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('promotion_buytogift_rule_id');
            $table->foreign('promotion_buytogift_rule_id', 'buytogift_buy_items_rule_fk')
                ->references('id')
                ->on('promotion_buytogift_offer_rules')
                ->cascadeOnDelete();
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();
            $table->unsignedInteger('buy_qty')->default(1);
            $table->timestamps();

            $table->unique(
                ['promotion_buytogift_rule_id', 'product_id'],
                'promotion_buytogift_rule_buy_items_unique'
            );
            $table->index('product_id');
        });

        // Danh sách sản phẩm quà theo từng rule (có thể tặng chính nó)
        Schema::create('promotion_buytogift_rule_gift_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('promotion_buytogift_rule_id');
            $table->foreign('promotion_buytogift_rule_id', 'buytogift_gift_items_rule_fk')
                ->references('id')
                ->on('promotion_buytogift_offer_rules')
                ->cascadeOnDelete();
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();
            $table->unsignedInteger('gift_qty')->default(1);
            $table->boolean('is_auto_add')->default(true); // true: tự thêm quà vào cart
            $table->timestamps();

            $table->unique(
                ['promotion_buytogift_rule_id', 'product_id'],
                'promotion_buytogift_rule_gift_items_unique'
            );
            $table->index('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotion_buytogift_rule_gift_items');
        Schema::dropIfExists('promotion_buytogift_rule_buy_items');
        Schema::dropIfExists('promotion_buytogift_offer_rules');
        Schema::dropIfExists('promotion_buytogift_offers');
    }
};
