<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('orders')) {
            Schema::table('orders', function (Blueprint $table) {
                if (! Schema::hasColumn('orders', 'order_number')) {
                    $table->string('order_number', 50)->nullable()->after('id');
                }
                if (! Schema::hasColumn('orders', 'user_id')) {
                    $table->unsignedInteger('user_id')->nullable()->index();
                }
                if (! Schema::hasColumn('orders', 'payment_method_id')) {
                    $table->unsignedBigInteger('payment_method_id')->nullable()->index();
                }
                if (! Schema::hasColumn('orders', 'price_snapshot')) {
                    $table->json('price_snapshot')->nullable()->after('payment_method_id');
                }
                if (! Schema::hasColumn('orders', 'customer_name')) {
                    $table->string('customer_name')->nullable();
                }
                if (! Schema::hasColumn('orders', 'customer_email')) {
                    $table->string('customer_email')->nullable();
                }
                if (! Schema::hasColumn('orders', 'customer_phone')) {
                    $table->string('customer_phone', 50)->nullable();
                }
                if (! Schema::hasColumn('orders', 'customer_address')) {
                    $table->string('customer_address', 1000)->nullable();
                }
                if (! Schema::hasColumn('orders', 'note')) {
                    $table->text('note')->nullable();
                }

                if (! Schema::hasColumn('orders', 'coupon_code')) {
                    $table->string('coupon_code')->nullable()->after('note');
                }

                if (! Schema::hasColumn('orders', 'order_status')) {
                    $table->string('order_status', 30)->default('pending')->index();
                }
                if (! Schema::hasColumn('orders', 'payment_status')) {
                    $table->string('payment_status', 30)->default('unpaid')->index();
                }
                if (! Schema::hasColumn('orders', 'shipping_status')) {
                    $table->string('shipping_status', 30)->default('pending')->index();
                }
                if (! Schema::hasColumn('orders', 'total_quantity')) {
                    $table->unsignedInteger('total_quantity')->default(0);
                }
                if (! Schema::hasColumn('orders', 'subtotal')) {
                    $table->decimal('subtotal', 15, 2)->default(0);
                }
                if (! Schema::hasColumn('orders', 'discount_total')) {
                    $table->decimal('discount_total', 15, 2)->default(0);
                }

                if (! Schema::hasColumn('orders', 'applied_promotions')) {
                    $table->json('applied_promotions')->nullable()->after('discount_total');
                }

                if (! Schema::hasColumn('orders', 'shipping_total')) {
                    $table->decimal('shipping_total', 15, 2)->default(0);
                }
                if (! Schema::hasColumn('orders', 'grand_total')) {
                    $table->decimal('grand_total', 15, 2)->default(0);
                }
                if (! Schema::hasColumn('orders', 'placed_at')) {
                    $table->timestamp('placed_at')->nullable()->index();
                }
                if (! Schema::hasColumn('orders', 'deleted_at')) {
                    $table->softDeletes();
                }
            });

            return;
        }

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 50)->unique();
            $table->unsignedInteger('user_id')->nullable()->index();
            $table->unsignedBigInteger('payment_method_id')->nullable()->index();
            $table->json('price_snapshot')->nullable();
            $table->string('customer_name');
            $table->string('customer_email')->nullable();
            $table->string('customer_phone', 50)->nullable();
            $table->string('customer_address', 1000)->nullable();
            $table->text('note')->nullable();
            $table->string('coupon_code')->nullable();
            $table->string('order_status', 30)->default('pending')->index();
            $table->string('payment_status', 30)->default('unpaid')->index();
            $table->string('shipping_status', 30)->default('pending')->index();
            $table->unsignedInteger('total_quantity')->default(0);
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount_total', 15, 2)->default(0);
            $table->json('applied_promotions')->nullable();
            $table->decimal('shipping_total', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2)->default(0);
            $table->timestamp('placed_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('orders')) {
            return;
        }

        Schema::dropIfExists('orders');
    }
};
