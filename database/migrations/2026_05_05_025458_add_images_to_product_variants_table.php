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
        if (Schema::hasColumn('product_variants', 'images')) {
            return;
        }

        Schema::table('product_variants', function (Blueprint $table) {
            $table->json('images')->nullable()->after('image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('product_variants', 'images')) {
            return;
        }

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn('images');
        });
    }
};
