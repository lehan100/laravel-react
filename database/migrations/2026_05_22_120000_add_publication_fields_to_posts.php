<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table): void {
            $table->string('publication_status', 20)
                ->default('draft')
                ->after('status')
                ->index();

            $table->timestamp('published_at')
                ->nullable()
                ->after('publication_status');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table): void {
            $table->dropColumn(['publication_status', 'published_at']);
        });
    }
};
