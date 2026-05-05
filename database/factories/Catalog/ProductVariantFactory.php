<?php

namespace Database\Factories\Catalog;

use App\Models\Catalog\Product;
use App\Models\Catalog\ProductVariant;
use App\Models\Catalog\ProductVariantTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    public function configure(): static
    {
        return $this->afterCreating(function (ProductVariant $variant): void {
            ProductVariantTranslation::query()->create([
                'product_variant_id' => $variant->id,
                'locale' => 'vi',
                'name' => $this->faker->words(2, true),
            ]);
        });
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::query()->create([
                'sku' => $this->faker->unique()->bothify('PRD-####'),
                'price' => $this->faker->randomFloat(2, 10, 500),
                'status' => 1,
            ])->id,
            'sku' => $this->faker->unique()->bothify('VAR-####'),
            'price' => $this->faker->randomFloat(2, 10, 500),
            'stock' => $this->faker->numberBetween(0, 100),
            'image' => null,
            'images' => [],
        ];
    }
}
