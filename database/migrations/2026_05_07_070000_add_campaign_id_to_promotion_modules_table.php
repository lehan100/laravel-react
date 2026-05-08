<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('promotion_coupons', function (Blueprint $table): void {
            $table->foreignId('campaign_id')
                ->nullable()
                ->after('description')
                ->constrained('promotion_campaigns')
                ->nullOnDelete();
        });

        Schema::table('promotion_saleoffers', function (Blueprint $table): void {
            $table->foreignId('campaign_id')
                ->nullable()
                ->after('description')
                ->constrained('promotion_campaigns')
                ->nullOnDelete();
        });

        Schema::table('promotion_buytogift_offers', function (Blueprint $table): void {
            $table->foreignId('campaign_id')
                ->nullable()
                ->after('description')
                ->constrained('promotion_campaigns')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('promotion_buytogift_offers', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('campaign_id');
        });

        Schema::table('promotion_saleoffers', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('campaign_id');
        });

        Schema::table('promotion_coupons', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('campaign_id');
        });
    }
};
