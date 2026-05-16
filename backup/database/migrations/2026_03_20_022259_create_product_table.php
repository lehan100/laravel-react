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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->nullable()->index();
            $table->integer('quantity')->nullable()->default(0);
            $table->unsignedInteger('sold_quantity')->default(0);
            $table->integer('weight')->nullable()->default(0);
            $table->decimal('price', 15, 2)->default(0);
            $table->boolean('is_coupon')->default(false);
            $table->boolean('is_stock')->default(false);
            $table->unsignedTinyInteger('status')->default(0);
            $table->unsignedInteger('order')->default(0);
            $table->integer('hit_viewer')->unsigned()->nullable()->default(0);
            $table->integer('hit_order')->unsigned()->nullable()->default(0);
            $table->index(['status', 'order']);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('category_product', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->unique(['product_id', 'category_id']);
        });
        Schema::create('product_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('filename');
            $table->string('disk')->default('public');
            $table->string('alt')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('product_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->constrained('products')
                ->onDelete('cascade');
            $table->string('locale', 10)->index();
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('content')->nullable();
            // SEO Field
            $table->string('seo_title')->nullable();
            $table->string('seo_keyword')->nullable();
            $table->text('seo_description')->nullable();
            $table->integer('order')->default(0);
            $table->unique(['product_id', 'locale'], 'product_locale_unique');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_product');
        Schema::dropIfExists('product_photos');
        Schema::dropIfExists('product_translations');
        Schema::dropIfExists('products');
    }
};
