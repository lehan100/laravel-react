<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('administrative_regions', function (Blueprint $table): void {
            $table->unsignedTinyInteger('id')->primary();
            $table->string('name');
            $table->string('name_en');
            $table->string('code_name')->nullable();
            $table->string('code_name_en')->nullable();
        });

        Schema::create('administrative_units', function (Blueprint $table): void {
            $table->unsignedTinyInteger('id')->primary();
            $table->string('full_name')->nullable();
            $table->string('full_name_en')->nullable();
            $table->string('short_name')->nullable();
            $table->string('short_name_en')->nullable();
            $table->string('code_name')->nullable();
            $table->string('code_name_en')->nullable();
        });

        Schema::create('provinces', function (Blueprint $table): void {
            $table->string('code', 20)->primary();
            $table->string('name');
            $table->string('name_en')->nullable();
            $table->string('full_name');
            $table->string('full_name_en')->nullable();
            $table->string('code_name')->nullable();
            $table->unsignedTinyInteger('administrative_unit_id')->nullable();
            $table->foreign('administrative_unit_id')
                ->references('id')
                ->on('administrative_units')
                ->nullOnDelete();
            $table->index('administrative_unit_id', 'idx_provinces_unit');
        });

        Schema::create('wards', function (Blueprint $table): void {
            $table->string('code', 20)->primary();
            $table->string('name');
            $table->string('name_en')->nullable();
            $table->string('full_name')->nullable();
            $table->string('full_name_en')->nullable();
            $table->string('code_name')->nullable();
            $table->string('province_code', 20)->nullable();
            $table->unsignedTinyInteger('administrative_unit_id')->nullable();
            $table->foreign('province_code')
                ->references('code')
                ->on('provinces')
                ->nullOnDelete();
            $table->foreign('administrative_unit_id')
                ->references('id')
                ->on('administrative_units')
                ->nullOnDelete();
            $table->index('province_code', 'idx_wards_province');
            $table->index('administrative_unit_id', 'idx_wards_unit');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wards');
        Schema::dropIfExists('provinces');
        Schema::dropIfExists('administrative_units');
        Schema::dropIfExists('administrative_regions');
    }
};
