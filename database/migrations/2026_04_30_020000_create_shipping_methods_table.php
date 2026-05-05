<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('shipping_methods')) {
            return;
        }

        Schema::create('shipping_methods', function (Blueprint $table) {
            $table->id();
            $table->string('code', 100)->unique();
            $table->string('provider', 100)->index();
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->json('settings')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_system')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipping_methods');
    }
};
