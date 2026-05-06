<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('pages') && Schema::hasColumn('pages', 'title')) {
            Schema::table('pages', function (Blueprint $table): void {
                $table->string('title')->nullable()->change();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('pages') && Schema::hasColumn('pages', 'title')) {
            Schema::table('pages', function (Blueprint $table): void {
                $table->string('title')->nullable(false)->change();
            });
        }
    }
};
