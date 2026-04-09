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

            // order_amount: đạt giá trị đơn; buy_product: mua sản phẩm điều kiện
            $table->enum('condition_type', ['order_amount', 'buy_product'])->default('order_amount');
            $table->decimal('min_order_amount', 12, 2)->nullable();

            // Giới hạn số set quà tối đa trên 1 đơn (null = không giới hạn)
            $table->unsignedInteger('max_sets_per_order')->nullable();

            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();

            $table->unsignedInteger('priority')->default(100);
            $table->boolean('is_active')->default(true);
            $table->boolean('stackable')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index('code');
            $table->index(['condition_type', 'is_active']);
            $table->index(['is_active', 'starts_at', 'ends_at']);
            $table->index(['priority', 'is_active']);
        });

        // Sản phẩm điều kiện phải mua (hỗ trợ nhiều dòng để linh hoạt combo)
        Schema::create('promotion_buytogift_conditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promotion_buytogift_id')
                ->constrained('promotion_buytogift_offers')
                ->cascadeOnDelete();
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();
            $table->unsignedInteger('buy_qty')->default(1);
            $table->timestamps();

            $table->unique(['promotion_buytogift_id', 'product_id'], 'promotion_buytogift_conditions_unique');
            $table->index('product_id');
        });

        // Sản phẩm quà tặng (có thể trùng product điều kiện để "mua X tặng X")
        Schema::create('promotion_buytogift_rewards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promotion_buytogift_id')
                ->constrained('promotion_buytogift_offers')
                ->cascadeOnDelete();
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();
            $table->unsignedInteger('gift_qty')->default(1);
            $table->boolean('is_auto_add')->default(true); // true: tự thêm quà vào cart
            $table->timestamps();

            $table->unique(['promotion_buytogift_id', 'product_id'], 'promotion_buytogift_rewards_unique');
            $table->index('product_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotion_buytogift_rewards');
        Schema::dropIfExists('promotion_buytogift_conditions');
        Schema::dropIfExists('promotion_buytogift_offers');
    }
};
