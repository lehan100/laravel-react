<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->createOrUpdateAttributesTable();
        $this->createOrUpdateAttributeTranslationsTable();
        $this->createOrUpdateAttributeValuesTable();
        $this->createOrUpdateAttributeValueTranslationsTable();
        $this->addProductVariantColumnsToProductsTable();
        $this->createOrUpdateProductVariantsTable();
        $this->createOrUpdateVariantTranslationsTable();
        $this->createOrUpdateVariantAttributeValuesTable();
        $this->addBuyToGiftVariantColumns();
        $this->createOrUpdateBuyToGiftGiftVariantOptionsTable();
        $this->migrateLegacyVariantNameTranslations();
    }

    public function down(): void
    {
        Schema::dropIfExists('promotion_buytogift_rule_gift_variant_options');

        if (Schema::hasTable('promotion_buytogift_rule_buy_items') && Schema::hasColumn('promotion_buytogift_rule_buy_items', 'variant_id')) {
            Schema::table('promotion_buytogift_rule_buy_items', function (Blueprint $table): void {
                $table->unique(
                    ['promotion_buytogift_rule_id', 'product_id'],
                    'promotion_buytogift_rule_buy_items_unique'
                );
                $table->dropUnique('promotion_buytogift_rule_buy_items_variant_unique');
                $table->dropConstrainedForeignId('variant_id');
            });
        }

        if (Schema::hasTable('promotion_buytogift_rule_gift_items') && Schema::hasColumn('promotion_buytogift_rule_gift_items', 'variant_id')) {
            Schema::table('promotion_buytogift_rule_gift_items', function (Blueprint $table): void {
                $table->unique(
                    ['promotion_buytogift_rule_id', 'product_id'],
                    'promotion_buytogift_rule_gift_items_unique'
                );
                $table->dropUnique('promotion_buytogift_rule_gift_items_variant_unique');
                $table->dropConstrainedForeignId('variant_id');
            });
        }

        if (Schema::hasTable('promotion_buytogift_rule_stock_allocations') && Schema::hasColumn('promotion_buytogift_rule_stock_allocations', 'variant_id')) {
            Schema::table('promotion_buytogift_rule_stock_allocations', function (Blueprint $table): void {
                $table->unique(
                    ['promotion_buytogift_offer_rule_id', 'product_id'],
                    'buytogift_rule_stock_allocations_unique'
                );
                $table->dropUnique('buytogift_rule_stock_allocations_variant_unique');
                $table->dropConstrainedForeignId('variant_id');
            });
        }

        Schema::dropIfExists('variant_attribute_values');
        Schema::dropIfExists('variant_translations');
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('attribute_value_translations');
        Schema::dropIfExists('attribute_translations');
        Schema::dropIfExists('attribute_values');
        Schema::dropIfExists('attributes');

        if (Schema::hasTable('products')) {
            Schema::table('products', function (Blueprint $table): void {
                $columns = [];

                if (Schema::hasColumn('products', 'brand')) {
                    $columns[] = 'brand';
                }

                if (Schema::hasColumn('products', 'base_price')) {
                    $columns[] = 'base_price';
                }

                if ($columns !== []) {
                    $table->dropColumn($columns);
                }
            });
        }
    }

    private function createOrUpdateAttributesTable(): void
    {
        if (! Schema::hasTable('attributes')) {
            Schema::create('attributes', function (Blueprint $table): void {
                $table->id();
                $table->string('name')->nullable();
                $table->string('code', 150)->nullable();
                $table->string('type')->default('text');
                $table->unsignedInteger('status')->default(1);
                $table->unsignedInteger('order')->default(0);
                $table->timestamps();
                $table->softDeletes();

                $table->unique('name');
                $table->unique('code', 'attributes_code_unique');
            });

            return;
        }

        Schema::table('attributes', function (Blueprint $table): void {
            if (! Schema::hasColumn('attributes', 'code')) {
                $table->string('code', 150)->nullable()->after('name');
                $table->unique('code', 'attributes_code_unique');
            }

            if (! Schema::hasColumn('attributes', 'type')) {
                $table->string('type')->default('text')->after('code');
            }

            if (! Schema::hasColumn('attributes', 'status')) {
                $table->unsignedInteger('status')->default(1)->after('type');
            }

            if (! Schema::hasColumn('attributes', 'order')) {
                $table->unsignedInteger('order')->default(0)->after('status');
            }

            if (! Schema::hasColumn('attributes', 'deleted_at')) {
                $table->softDeletes()->after('updated_at');
            }
        });
    }

    private function createOrUpdateAttributeTranslationsTable(): void
    {
        if (Schema::hasTable('attribute_translations')) {
            return;
        }

        Schema::create('attribute_translations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('attribute_id')->constrained('attributes')->cascadeOnDelete();
            $table->string('locale', 10);
            $table->string('name');
            $table->timestamps();

            $table->unique(['attribute_id', 'locale']);
            $table->index(['locale', 'name']);
        });
    }

    private function createOrUpdateAttributeValuesTable(): void
    {
        if (! Schema::hasTable('attribute_values')) {
            Schema::create('attribute_values', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('attribute_id')->constrained('attributes')->cascadeOnDelete();
                $table->string('value');
                $table->string('image')->nullable();
                $table->string('color', 20)->nullable();
                $table->unsignedInteger('order')->default(0);
                $table->timestamps();
                $table->softDeletes();

                $table->unique(['attribute_id', 'value']);
            });

            return;
        }

        Schema::table('attribute_values', function (Blueprint $table): void {
            if (! Schema::hasColumn('attribute_values', 'image')) {
                $table->string('image')->nullable()->after('value');
            }

            if (! Schema::hasColumn('attribute_values', 'color')) {
                $table->string('color', 20)->nullable()->after('image');
            }

            if (! Schema::hasColumn('attribute_values', 'order')) {
                $table->unsignedInteger('order')->default(0)->after('color');
            }

            if (! Schema::hasColumn('attribute_values', 'deleted_at')) {
                $table->softDeletes()->after('updated_at');
            }
        });
    }

    private function createOrUpdateAttributeValueTranslationsTable(): void
    {
        if (Schema::hasTable('attribute_value_translations')) {
            return;
        }

        Schema::create('attribute_value_translations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('attribute_value_id')->constrained('attribute_values')->cascadeOnDelete();
            $table->string('locale', 10);
            $table->string('value');
            $table->timestamps();

            $table->unique(['attribute_value_id', 'locale']);
            $table->index(['locale', 'value']);
        });
    }

    private function addProductVariantColumnsToProductsTable(): void
    {
        if (! Schema::hasTable('products')) {
            return;
        }

        Schema::table('products', function (Blueprint $table): void {
            if (! Schema::hasColumn('products', 'brand')) {
                $table->string('brand')->nullable()->after('weight');
            }

            if (! Schema::hasColumn('products', 'base_price')) {
                $table->decimal('base_price', 15, 2)->default(0)->after('brand');
            }
        });
    }

    private function createOrUpdateProductVariantsTable(): void
    {
        if (! Schema::hasTable('product_variants')) {
            Schema::create('product_variants', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
                $table->string('sku')->unique();
                $table->decimal('price', 15, 2);
                $table->unsignedInteger('stock')->default(0);
                $table->string('image')->nullable();
                $table->json('images')->nullable();
                $table->timestamps();

                $table->index(['product_id', 'stock']);
            });

            return;
        }

        Schema::table('product_variants', function (Blueprint $table): void {
            if (! Schema::hasColumn('product_variants', 'images')) {
                $table->json('images')->nullable()->after('image');
            }
        });
    }

    private function createOrUpdateVariantTranslationsTable(): void
    {
        if (Schema::hasTable('variant_translations')) {
            return;
        }

        Schema::create('variant_translations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_variant_id')->constrained('product_variants')->cascadeOnDelete();
            $table->string('locale', 10);
            $table->string('name');
            $table->timestamps();

            $table->unique(['product_variant_id', 'locale']);
        });
    }

    private function createOrUpdateVariantAttributeValuesTable(): void
    {
        if (Schema::hasTable('variant_attribute_values')) {
            return;
        }

        Schema::create('variant_attribute_values', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_variant_id')->constrained('product_variants')->cascadeOnDelete();
            $table->foreignId('attribute_value_id')->constrained('attribute_values')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['product_variant_id', 'attribute_value_id'], 'variant_attribute_value_unique');
        });
    }

    private function addBuyToGiftVariantColumns(): void
    {
        foreach ([
            'promotion_buytogift_rule_buy_items' => 'buy_items',
            'promotion_buytogift_rule_gift_items' => 'gift_items',
            'promotion_buytogift_rule_stock_allocations' => 'stock_allocations',
        ] as $tableName => $uniqueSuffix) {
            if (! Schema::hasTable($tableName) || Schema::hasColumn($tableName, 'variant_id')) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) use ($tableName, $uniqueSuffix): void {
                $table->foreignId('variant_id')
                    ->nullable()
                    ->after('product_id')
                    ->constrained('product_variants')
                    ->cascadeOnDelete();

                if ($tableName === 'promotion_buytogift_rule_stock_allocations') {
                    $table->unique(
                        ['promotion_buytogift_offer_rule_id', 'product_id', 'variant_id'],
                        'buytogift_rule_stock_allocations_variant_unique'
                    );
                    $table->dropUnique('buytogift_rule_stock_allocations_unique');

                    return;
                }

                $table->unique(
                    ['promotion_buytogift_rule_id', 'product_id', 'variant_id'],
                    "promotion_buytogift_rule_{$uniqueSuffix}_variant_unique"
                );
                $table->dropUnique("promotion_buytogift_rule_{$uniqueSuffix}_unique");
            });
        }
    }

    private function createOrUpdateBuyToGiftGiftVariantOptionsTable(): void
    {
        if (Schema::hasTable('promotion_buytogift_rule_gift_variant_options')) {
            return;
        }

        Schema::create('promotion_buytogift_rule_gift_variant_options', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('promotion_buytogift_offer_rule_id');
            $table->foreignId('product_id');
            $table->foreignId('variant_id');
            $table->unsignedInteger('reserve_qty')->default(0);
            $table->timestamps();

            $table->foreign('promotion_buytogift_offer_rule_id', 'pbg_gift_var_opt_rule_fk')
                ->references('id')
                ->on('promotion_buytogift_offer_rules')
                ->cascadeOnDelete();
            $table->foreign('product_id', 'pbg_gift_var_opt_product_fk')
                ->references('id')
                ->on('products')
                ->cascadeOnDelete();
            $table->foreign('variant_id', 'pbg_gift_var_opt_variant_fk')
                ->references('id')
                ->on('product_variants')
                ->cascadeOnDelete();

            $table->unique(
                ['promotion_buytogift_offer_rule_id', 'product_id', 'variant_id'],
                'promotion_buytogift_rule_gift_variant_options_unique'
            );
            $table->index(['product_id', 'variant_id']);
        });
    }

    private function migrateLegacyVariantNameTranslations(): void
    {
        if (! Schema::hasTable('product_variants') || ! Schema::hasColumn('product_variants', 'name_translations')) {
            return;
        }

        DB::table('product_variants')
            ->select(['id', 'name_translations'])
            ->whereNotNull('name_translations')
            ->orderBy('id')
            ->get()
            ->each(function (object $row): void {
                $translations = is_string($row->name_translations)
                    ? json_decode($row->name_translations, true)
                    : (array) $row->name_translations;

                if (! is_array($translations) || $translations === []) {
                    return;
                }

                foreach ($translations as $locale => $name) {
                    if (! is_string($name) || trim($name) === '') {
                        continue;
                    }

                    DB::table('variant_translations')->updateOrInsert(
                        [
                            'product_variant_id' => $row->id,
                            'locale' => (string) $locale,
                        ],
                        [
                            'name' => trim($name),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]
                    );
                }
            });

        Schema::table('product_variants', function (Blueprint $table): void {
            $table->dropColumn('name_translations');
        });
    }
};
