<?php

namespace Database\Seeders;

use App\Models\Settings\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $languages = [
            [
                'name' => 'Vietnamese',
                'code' => 'vi',
                'currency' => 'VND',
                'photo' => 'vi-1772204431-1772682777.webp',
                'status' => 1,
            ],
            [
                'name' => 'English',
                'code' => 'en',
                'currency' => 'USD',
                'photo' => 'en-1772204447-1772682765.webp',
                'status' => 1,
            ],
            [
                'name' => 'Japanese',
                'code' => 'ja',
                'currency' => 'JPY',
                'photo' => 'ja-1772204497-1772682754.webp',
                'status' => 1,
            ],
        ];

        foreach ($languages as $language) {
            Language::updateOrCreate(['code' => $language['code']], $language);
        }
    }
}
