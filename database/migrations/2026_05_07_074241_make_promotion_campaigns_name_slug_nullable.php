<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('promotion_campaigns')) {
            return;
        }

        if (Schema::hasColumn('promotion_campaigns', 'name')) {
            DB::statement('ALTER TABLE `promotion_campaigns` MODIFY `name` varchar(255) NULL');
        }

        if (Schema::hasColumn('promotion_campaigns', 'slug')) {
            DB::statement('ALTER TABLE `promotion_campaigns` MODIFY `slug` varchar(255) NULL');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('promotion_campaigns')) {
            return;
        }

        if (Schema::hasColumn('promotion_campaigns', 'name')) {
            DB::statement('ALTER TABLE `promotion_campaigns` MODIFY `name` varchar(255) NOT NULL');
        }

        if (Schema::hasColumn('promotion_campaigns', 'slug')) {
            DB::statement('ALTER TABLE `promotion_campaigns` MODIFY `slug` varchar(255) NOT NULL');
        }
    }
};
