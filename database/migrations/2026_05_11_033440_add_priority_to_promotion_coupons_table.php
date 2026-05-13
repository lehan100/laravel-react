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
        Schema::table('promotion_coupons', function (Blueprint $table): void {
            $table->unsignedInteger('priority')->default(100)->after('ends_at');
            $table->index(['priority', 'is_active'], 'promotion_coupons_priority_active_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('promotion_coupons', function (Blueprint $table): void {
            $table->dropIndex('promotion_coupons_priority_active_idx');
            $table->dropColumn('priority');
        });
    }
};
