<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('promotion_buytogift_offer_rules', function (Blueprint $table) {
            if (! Schema::hasColumn('promotion_buytogift_offer_rules', 'stock_scope')) {
                $table->enum('stock_scope', ['all', 'limited'])
                    ->default('all')
                    ->after('stackable');
            }

            if (! Schema::hasColumn('promotion_buytogift_offer_rules', 'stock_limit')) {
                $table->unsignedInteger('stock_limit')
                    ->nullable()
                    ->after('stock_scope');
            }
        });
    }

    public function down(): void
    {
        Schema::table('promotion_buytogift_offer_rules', function (Blueprint $table) {
            if (Schema::hasColumn('promotion_buytogift_offer_rules', 'stock_limit')) {
                $table->dropColumn('stock_limit');
            }

            if (Schema::hasColumn('promotion_buytogift_offer_rules', 'stock_scope')) {
                $table->dropColumn('stock_scope');
            }
        });
    }
};
