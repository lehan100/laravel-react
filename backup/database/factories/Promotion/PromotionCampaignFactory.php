<?php

namespace Database\Factories\Promotion;

use App\Models\Promotion\PromotionCampaign;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PromotionCampaign>
 */
class PromotionCampaignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'description' => fake()->optional()->paragraph(),
            'starts_at' => fake()->optional()->dateTimeBetween('-7 days', '+1 day'),
            'ends_at' => fake()->dateTimeBetween('+2 days', '+30 days'),
            'priority' => fake()->numberBetween(1, 100),
            'is_active' => true,
        ];
    }
}
