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
        Schema::create('media_banners', function (Blueprint $table) {
            $table->id();
            $table->string("lang_code", 10)->default('vi')->index();
            $table->string("name")->nullable();
            $table->string("alias_link")->nullable();
            $table->string("photo")->nullable();
            $table->unsignedTinyInteger('status')->default(0);
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('media_positions', function (Blueprint $table) {
            $table->id();
            $table->string("name")->nullable();
            $table->string("code")->unique();
            $table->unsignedTinyInteger('status')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('media_banner_translations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('media_banner_id')
                ->constrained('media_banners')
                ->onDelete('cascade');

            $table->string('locale', 10)->index();
            $table->string('name')->nullable();
            $table->text('description')->nullable(); 
            $table->text('content')->nullable();   
            $table->unique(['media_banner_id', 'locale'], 'banner_id_locale_unique');
            $table->timestamps();
        });
        Schema::create('media_banner_position', function (Blueprint $table) {
            $table->id();
            $table->foreignId("position_id")->constrained("media_positions")->onDelete('cascade');
            $table->foreignId("banner_id")->constrained("media_banners")->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_banner_position');
        Schema::dropIfExists('media_banners');
        Schema::dropIfExists('media_positions');
    }
};
