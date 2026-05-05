<?php

namespace Tests\Feature;

use App\Repositories\Attribute\AttributeEloquentRepository;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class AttributeControllerJsonTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        config(['translatable.locales' => ['vi', 'en', 'ja']]);
        app()->setLocale('vi');
    }

    public function test_quick_save_store_returns_json_attribute_for_xhr_requests(): void
    {
        $response = $this->withoutMiddleware()->postJson(route('attribute.quick-save'), [
            'code' => 'brand',
            'type' => 'text',
            'status' => 1,
            'order' => 0,
            'translations' => [
                [
                    'locale' => 'vi',
                    'name' => 'Thương hiệu',
                ],
                [
                    'locale' => 'en',
                    'name' => 'Brand',
                ],
                [
                    'locale' => 'ja',
                    'name' => 'ブランド',
                ],
            ],
            'values' => [
                [
                    'order' => 0,
                    'translations' => [
                        [
                            'locale' => 'vi',
                            'value' => 'Hương Thị',
                        ],
                        [
                            'locale' => 'en',
                            'value' => 'Huong Thi',
                        ],
                        [
                            'locale' => 'ja',
                            'value' => 'Hương Thị',
                        ],
                    ],
                    'image' => '',
                    'color' => '',
                ],
            ],
        ]);

        $response->assertOk();
        $response->assertJsonPath('attribute.code', 'brand');
        $response->assertJsonPath('attribute.translations.0.locale', '0');
        $response->assertJsonPath('attribute.translations.0.name', 'Thương hiệu');
        $response->assertJsonPath('attribute.values.0.value', 'Hương Thị');
        $response->assertJsonPath('attribute.values.0.translations.0.locale', '0');
        $response->assertJsonPath('attribute.values.0.translations.0.value', 'Hương Thị');
    }

    public function test_quick_save_update_returns_json_attribute_for_xhr_requests(): void
    {
        $repository = app(AttributeEloquentRepository::class);

        $attribute = $repository->save([
            'code' => 'brand',
            'type' => 'text',
            'status' => 1,
            'translations' => [
                [
                    'locale' => 'vi',
                    'name' => 'Thương hiệu',
                ],
                [
                    'locale' => 'en',
                    'name' => 'Brand',
                ],
                [
                    'locale' => 'ja',
                    'name' => 'ブランド',
                ],
            ],
            'values' => [
                [
                    'order' => 0,
                    'translations' => [
                        [
                            'locale' => 'vi',
                            'value' => 'Hương Thị',
                        ],
                        [
                            'locale' => 'en',
                            'value' => 'Huong Thi',
                        ],
                        [
                            'locale' => 'ja',
                            'value' => 'Hương Thị',
                        ],
                    ],
                    'image' => '',
                    'color' => '',
                ],
                [
                    'order' => 1,
                    'translations' => [
                        [
                            'locale' => 'vi',
                            'value' => 'Jw Speaker',
                        ],
                        [
                            'locale' => 'en',
                            'value' => 'Jw Speaker',
                        ],
                        [
                            'locale' => 'ja',
                            'value' => 'Jw Speaker',
                        ],
                    ],
                    'image' => '',
                    'color' => '',
                ],
            ],
        ], ['task' => 'add-item']);

        $response = $this->withoutMiddleware()->postJson(route('attribute.quick-save'), [
            'code' => 'brand-updated',
            'type' => 'text',
            'status' => 1,
            'order' => 0,
            'id' => $attribute->id,
            'translations' => [
                [
                    'locale' => 'vi',
                    'name' => 'Thương hiệu',
                ],
                [
                    'locale' => 'en',
                    'name' => 'Brand',
                ],
                [
                    'locale' => 'ja',
                    'name' => 'ブランド',
                ],
            ],
            'values' => [
                [
                    'id' => $attribute->values()->first()->id,
                    'order' => 0,
                    'translations' => [
                        [
                            'locale' => 'vi',
                            'value' => 'Hương Thị',
                        ],
                        [
                            'locale' => 'en',
                            'value' => 'Huong Thi',
                        ],
                        [
                            'locale' => 'ja',
                            'value' => 'Hương Thị',
                        ],
                    ],
                    'image' => '',
                    'color' => '',
                ],
                [
                    'order' => 1,
                    'translations' => [
                        [
                            'locale' => 'vi',
                            'value' => 'Jw Speaker',
                        ],
                        [
                            'locale' => 'en',
                            'value' => 'Jw Speaker',
                        ],
                        [
                            'locale' => 'ja',
                            'value' => 'Jw Speaker',
                        ],
                    ],
                    'image' => '',
                    'color' => '',
                ],
                [
                    'order' => 2,
                    'translations' => [
                        [
                            'locale' => 'vi',
                            'value' => 'Jw Speaker',
                        ],
                        [
                            'locale' => 'en',
                            'value' => 'Jw Speaker',
                        ],
                        [
                            'locale' => 'ja',
                            'value' => 'Jw Speaker',
                        ],
                    ],
                    'image' => '',
                    'color' => '',
                ],
            ],
        ]);

        $response->assertOk();
        $response->assertJsonPath('attribute.id', $attribute->id);
        $response->assertJsonPath('attribute.code', 'brand-updated');
        $response->assertJsonPath('attribute.values.0.value', 'Hương Thị');
        $response->assertJsonPath('attribute.values.1.value', 'Jw Speaker');
        $response->assertJsonCount(2, 'attribute.values');
    }
}
