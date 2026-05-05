<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('order_timelines')) {
            Schema::table('order_timelines', function (Blueprint $table) {
                if (! Schema::hasColumn('order_timelines', 'order_id')) {
                    $table->unsignedBigInteger('order_id')->nullable()->index();
                }
                if (! Schema::hasColumn('order_timelines', 'user_id')) {
                    $table->unsignedInteger('user_id')->nullable()->index();
                }
                if (! Schema::hasColumn('order_timelines', 'event_type')) {
                    $table->string('event_type', 50)->nullable()->index();
                }
                if (! Schema::hasColumn('order_timelines', 'title')) {
                    $table->string('title')->nullable();
                }
                if (! Schema::hasColumn('order_timelines', 'description')) {
                    $table->text('description')->nullable();
                }
                if (! Schema::hasColumn('order_timelines', 'old_value')) {
                    $table->string('old_value')->nullable();
                }
                if (! Schema::hasColumn('order_timelines', 'new_value')) {
                    $table->string('new_value')->nullable();
                }
                if (! Schema::hasColumn('order_timelines', 'meta')) {
                    $table->json('meta')->nullable();
                }
            });

            return;
        }

        Schema::create('order_timelines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->unsignedInteger('user_id')->nullable()->index();
            $table->string('event_type', 50)->index();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('old_value')->nullable();
            $table->string('new_value')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('order_timelines')) {
            return;
        }

        Schema::dropIfExists('order_timelines');
    }
};
