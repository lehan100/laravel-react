<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shipping_methods', function (Blueprint $table): void {
            if (! Schema::hasColumn('shipping_methods', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    public function down(): void
    {
        Schema::table('shipping_methods', function (Blueprint $table): void {
            if (Schema::hasColumn('shipping_methods', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });
    }
};
