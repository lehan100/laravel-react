<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
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

            if (Schema::hasTable('orders') && DB::connection()->getDriverName() !== 'sqlite') {
                $hasForeignKey = DB::table('information_schema.KEY_COLUMN_USAGE')
                    ->where('TABLE_SCHEMA', DB::getDatabaseName())
                    ->where('TABLE_NAME', 'order_items')
                    ->where('COLUMN_NAME', 'order_id')
                    ->where('REFERENCED_TABLE_NAME', 'orders')
                    ->exists();

                if (! $hasForeignKey) {
                    DB::table('order_items')
                        ->whereNotExists(function ($query): void {
                            $query->select(DB::raw(1))
                                ->from('orders')
                                ->whereColumn('orders.id', 'order_items.order_id');
                        })
                        ->delete();

                    Schema::table('order_items', function (Blueprint $table): void {
                        $table->foreign('order_id', 'order_items_order_id_foreign')
                            ->references('id')
                            ->on('orders')
                            ->cascadeOnDelete();
                    });
                }
            }

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
