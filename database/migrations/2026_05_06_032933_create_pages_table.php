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
        if (! Schema::hasTable('pages')) {
            Schema::create('pages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('field_group_id')->constrained()->cascadeOnUpdate();
                $table->string('title')->nullable();
                $table->string('slug')->unique();
                $table->boolean('status')->default(true);
                $table->json('acf_data')->nullable();
                $table->timestamps();
            });
        } else {
            Schema::table('pages', function (Blueprint $table) {
                if (! Schema::hasColumn('pages', 'field_group_id')) {
                    $table->foreignId('field_group_id')->after('id')->constrained()->cascadeOnUpdate();
                }

                if (! Schema::hasColumn('pages', 'title')) {
                    $table->string('title')->nullable()->after('field_group_id');
                }

                if (! Schema::hasColumn('pages', 'slug')) {
                    $table->string('slug')->unique()->after('title');
                }

                if (! Schema::hasColumn('pages', 'status')) {
                    $table->boolean('status')->default(true)->after('slug');
                }

                if (! Schema::hasColumn('pages', 'acf_data')) {
                    $table->json('acf_data')->nullable()->after('status');
                }
            });
        }

        if (Schema::hasTable('categories') && ! Schema::hasColumn('categories', 'page_id')) {
            Schema::table('categories', function (Blueprint $table): void {
                $table->foreignId('page_id')
                    ->nullable()
                    ->after('photo')
                    ->constrained('pages')
                    ->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('categories') && Schema::hasColumn('categories', 'page_id')) {
            Schema::table('categories', function (Blueprint $table): void {
                $table->dropConstrainedForeignId('page_id');
            });
        }

        Schema::dropIfExists('pages');
    }
};
