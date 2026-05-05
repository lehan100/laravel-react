<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('order_items')) {
            Schema::table('order_items', function (Blueprint $table) {
                if (! Schema::hasColumn('order_items', 'order_id')) {
                    $table->unsignedBigInteger('order_id')->nullable()->index();
                }
                if (! Schema::hasColumn('order_items', 'product_id')) {
                    $table->unsignedBigInteger('product_id')->nullable()->index();
                }
                if (! Schema::hasColumn('order_items', 'product_name')) {
                    $table->string('product_name')->nullable();
                }
                if (! Schema::hasColumn('order_items', 'product_sku')) {
                    $table->string('product_sku')->nullable()->index();
                }
                if (! Schema::hasColumn('order_items', 'quantity')) {
                    $table->unsignedInteger('quantity')->default(1);
                }
                if (! Schema::hasColumn('order_items', 'unit_price')) {
                    $table->decimal('unit_price', 15, 2)->default(0);
                }
                if (! Schema::hasColumn('order_items', 'line_total')) {
                    $table->decimal('line_total', 15, 2)->default(0);
                }
                if (! Schema::hasColumn('order_items', 'meta')) {
                    $table->json('meta')->nullable();
                }
            });

            return;
        }

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('product_name');
            $table->string('product_sku')->nullable()->index();
            $table->unsignedInteger('quantity')->default(1);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('line_total', 15, 2)->default(0);
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('order_items')) {
            return;
        }

        Schema::dropIfExists('order_items');
    }
};
