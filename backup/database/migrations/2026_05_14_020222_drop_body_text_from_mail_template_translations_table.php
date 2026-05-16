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
        Schema::table('mail_template_translations', function (Blueprint $table) {
            $table->dropColumn('body_text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mail_template_translations', function (Blueprint $table) {
            $table->longText('body_text')->nullable()->after('body_html');
        });
    }
};
