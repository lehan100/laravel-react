<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('payment_methods')) {
            return;
        }

        Schema::table('payment_methods', function (Blueprint $table) {
            if (! Schema::hasColumn('payment_methods', 'provider')) {
                $table->string('provider', 50)->nullable()->after('code');
            }
            if (! Schema::hasColumn('payment_methods', 'settings')) {
                $table->json('settings')->nullable()->after('description');
            }
            if (! Schema::hasColumn('payment_methods', 'is_system')) {
                $table->boolean('is_system')->default(true)->after('is_active');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('payment_methods')) {
            return;
        }

        Schema::table('payment_methods', function (Blueprint $table) {
            if (Schema::hasColumn('payment_methods', 'provider')) {
                $table->dropColumn('provider');
            }
            if (Schema::hasColumn('payment_methods', 'settings')) {
                $table->dropColumn('settings');
            }
            if (Schema::hasColumn('payment_methods', 'is_system')) {
                $table->dropColumn('is_system');
            }
        });
    }
};
