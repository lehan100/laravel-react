<?php

namespace Database\Factories\Catalog;

use App\Models\Catalog\Product;
use App\Models\Catalog\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductVariant>
 */
class ProductVariantFactory extends Factory
{
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
