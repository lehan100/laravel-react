<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            if (! Schema::hasColumn('orders', 'province_code')) {
                $table->string('province_code', 20)->nullable()->after('customer_address');
                $table->foreign('province_code')
                    ->references('code')
                    ->on('provinces')
                    ->nullOnDelete();
            }

            if (! Schema::hasColumn('orders', 'ward_code')) {
                $table->string('ward_code', 20)->nullable()->after('province_code');
                $table->foreign('ward_code')
                    ->references('code')
                    ->on('wards')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            if (Schema::hasColumn('orders', 'ward_code')) {
                $table->dropForeign(['ward_code']);
                $table->dropColumn('ward_code');
            }

            if (Schema::hasColumn('orders', 'province_code')) {
                $table->dropForeign(['province_code']);
                $table->dropColumn('province_code');
            }
        });
    }
};
