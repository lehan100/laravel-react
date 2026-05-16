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
        Schema::create('mail_templates', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('module')->nullable()->index();
            $table->string('fallback_locale', 10)->nullable()->index();
            $table->json('variables')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('mail_template_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mail_template_id')
                ->constrained('mail_templates')
                ->cascadeOnDelete();
            $table->string('locale', 10)->index();
            $table->string('name');
            $table->string('subject');
            $table->longText('body_html');
            $table->longText('body_text')->nullable();
            $table->timestamps();

            $table->unique(['mail_template_id', 'locale'], 'mail_template_locale_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mail_template_translations');
        Schema::dropIfExists('mail_templates');
    }
};
