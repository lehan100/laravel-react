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
            $table->string("sku")->nullable()->index(); 
            $table->integer("quantity")->nullable()->default(0);
            $table->integer("stock")->nullable()->default(0);
            $table->integer("weight")->nullable()->default(0);
            $table->decimal('price', 15, 2)->default(0);
            $table->integer('status')->unsigned()->nullable()->default(0);
            $table->integer('use_coupon')->unsigned()->nullable()->default(1);
            $table->integer('sort')->unsigned()->nullable()->default(0);
            $table->integer('hit_viewer')->unsigned()->nullable()->default(0);
            $table->integer('hit_order')->unsigned()->nullable()->default(0);
            $table->timestamps();
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
            $table->integer('sort')->default(0);
            $table->boolean('is_main')->default(false);
            $table->timestamps();
        });
        Schema::create('product_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->constrained('products')
                ->onDelete('cascade');
            $table->string('locale', 10)->index();
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->text('content')->nullable();
            // SEO Field
            $table->string('seo_title')->nullable();
            $table->string('seo_keyword')->nullable();
            $table->text('seo_description')->nullable();
            $table->unique(['product_id', 'locale'], 'product_locale_unique');
            $table->timestamps();
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
