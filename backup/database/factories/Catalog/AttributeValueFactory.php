<?php

namespace Database\Factories\Catalog;

use App\Models\Catalog\AttributeValue;
use App\Models\Catalog\ProductAttribute;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AttributeValue>
 */
class AttributeValueFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'attribute_id' => ProductAttribute::factory(),
            'value' => $this->faker->unique()->word(),
        ];
    }
}
