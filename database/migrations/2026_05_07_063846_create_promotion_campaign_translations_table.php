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
        Schema::create('promotion_campaign_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promotion_campaign_id')
                ->constrained('promotion_campaigns')
                ->cascadeOnDelete();
            $table->string('locale', 10)->index();
            $table->string('name')->nullable();
            $table->string('slug')->nullable();
            $table->unique(['promotion_campaign_id', 'locale'], 'promotion_campaign_locale_unique');
            $table->unique(['slug', 'locale'], 'promotion_campaign_slug_locale_unique');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotion_campaign_translations');
    }
};
