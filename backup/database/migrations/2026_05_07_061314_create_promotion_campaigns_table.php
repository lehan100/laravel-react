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
        Schema::create('promotion_campaigns', function (Blueprint $table) {
            $table->id();
            $table->text('description')->nullable();
            $table->dateTime('starts_at')->nullable();
            $table->dateTime('ends_at')->nullable();
            $table->integer('priority')->default(100);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('promotion_coupons', function (Blueprint $table): void {
            if (! Schema::hasColumn('promotion_coupons', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->nullable()
                    ->after('description')
                    ->constrained('promotion_campaigns')
                    ->nullOnDelete();
            }
        });

        Schema::table('promotion_saleoffers', function (Blueprint $table): void {
            if (! Schema::hasColumn('promotion_saleoffers', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->nullable()
                    ->after('description')
                    ->constrained('promotion_campaigns')
                    ->nullOnDelete();
            }
        });

        Schema::table('promotion_buytogift_offers', function (Blueprint $table): void {
            if (! Schema::hasColumn('promotion_buytogift_offers', 'campaign_id')) {
                $table->foreignId('campaign_id')
                    ->nullable()
                    ->after('description')
                    ->constrained('promotion_campaigns')
                    ->nullOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('promotion_buytogift_offers') && Schema::hasColumn('promotion_buytogift_offers', 'campaign_id')) {
            Schema::table('promotion_buytogift_offers', function (Blueprint $table): void {
                $table->dropConstrainedForeignId('campaign_id');
            });
        }

        if (Schema::hasTable('promotion_saleoffers') && Schema::hasColumn('promotion_saleoffers', 'campaign_id')) {
            Schema::table('promotion_saleoffers', function (Blueprint $table): void {
                $table->dropConstrainedForeignId('campaign_id');
            });
        }

        if (Schema::hasTable('promotion_coupons') && Schema::hasColumn('promotion_coupons', 'campaign_id')) {
            Schema::table('promotion_coupons', function (Blueprint $table): void {
                $table->dropConstrainedForeignId('campaign_id');
            });
        }

        Schema::dropIfExists('promotion_campaigns');
    }
};
