<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('promotion_buytogift_offer_rules', function (Blueprint $table) {
            $table->unsignedInteger('max_gift_qty')->nullable()->after('max_sets_per_order');
        });
    }

    public function down(): void
    {
        Schema::table('promotion_buytogift_offer_rules', function (Blueprint $table) {
            $table->dropColumn('max_gift_qty');
        });
    }
};
