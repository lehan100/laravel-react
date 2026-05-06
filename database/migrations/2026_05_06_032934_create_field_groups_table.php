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
        if (! Schema::hasTable('field_groups')) {
            Schema::create('field_groups', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->json('fields_schema')->nullable();
                $table->boolean('status')->default(true);
                $table->timestamps();
            });

            return;
        }

        Schema::table('field_groups', function (Blueprint $table) {
            if (! Schema::hasColumn('field_groups', 'title')) {
                $table->string('title')->after('id');
            }

            if (! Schema::hasColumn('field_groups', 'fields_schema')) {
                $table->json('fields_schema')->nullable()->after('title');
            }

            if (! Schema::hasColumn('field_groups', 'status')) {
                $table->boolean('status')->default(true)->after('fields_schema');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('field_groups');
    }
};
