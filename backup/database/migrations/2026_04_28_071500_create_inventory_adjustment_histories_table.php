<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('inventory_adjustment_histories')) {
            return;
        }

        Schema::create('inventory_adjustment_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('product_id');
            $table->unsignedInteger('user_id')->nullable();
            $table->string('action', 100)->default('set');
            $table->integer('old_quantity')->default(0);
            $table->integer('new_quantity')->default(0);
            $table->integer('delta')->default(0);
            $table->string('reason', 500)->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index(['product_id', 'created_at']);
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('inventory_adjustment_histories')) {
            return;
        }

        Schema::dropIfExists('inventory_adjustment_histories');
    }
};
