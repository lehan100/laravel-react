<?php

namespace Tests\Feature;

use App\Repositories\Attribute\AttributeEloquentRepository;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class AttributeRepositoryTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        config(['translatable.locales' => ['vi', 'en', 'ja']]);
        app()->setLocale('vi');
    }

    public function test_it_persists_translation_locales_from_the_payload_instead_of_array_indexes(): void
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
                    'translations' => [
                        [
                            'locale' => 'vi',
                            'value' => 'Nhãn hàng',
                        ],
                        [
                            'locale' => 'en',
                            'value' => 'Label',
                        ],
                        [
                            'locale' => 'ja',
                            'value' => 'ラベル',
                        ],
                    ],
                ],
            ],
        ], ['task' => 'add-item']);

        $this->assertNotNull($attribute);
        $this->assertDatabaseHas('attribute_translations', [
            'attribute_id' => $attribute->id,
            'locale' => 'vi',
            'name' => 'Thương hiệu',
        ]);
        $this->assertDatabaseHas('attribute_translations', [
            'attribute_id' => $attribute->id,
            'locale' => 'en',
            'name' => 'Brand',
        ]);
        $this->assertDatabaseHas('attribute_translations', [
            'attribute_id' => $attribute->id,
            'locale' => 'ja',
            'name' => 'ブランド',
        ]);

        $value = $attribute->fresh()->values()->first();
        $this->assertNotNull($value);
        $this->assertDatabaseHas('attribute_value_translations', [
            'attribute_value_id' => $value->id,
            'locale' => 'vi',
            'value' => 'Nhãn hàng',
        ]);
        $this->assertDatabaseHas('attribute_value_translations', [
            'attribute_value_id' => $value->id,
            'locale' => 'en',
            'value' => 'Label',
        ]);
        $this->assertDatabaseHas('attribute_value_translations', [
            'attribute_value_id' => $value->id,
            'locale' => 'ja',
            'value' => 'ラベル',
        ]);
    }

    public function test_it_restores_soft_deleted_attribute_value_instead_of_inserting_duplicate(): void
    {
        $repository = app(AttributeEloquentRepository::class);

        $attribute = $repository->save([
            'code' => 'brand',
            'type' => 'image',
            'status' => 1,
            'translations' => [
                ['locale' => 'vi', 'name' => 'Thương hiệu'],
            ],
            'values' => [
                [
                    'translations' => [
                        ['locale' => 'vi', 'value' => 'JW Speaker'],
                    ],
                    'image' => 'old.webp',
                    'color' => '#000000',
                ],
            ],
        ], ['task' => 'add-item']);

        $deletedValue = $attribute->fresh()->values()->first();
        $deletedValue->delete();

        $updatedAttribute = $repository->save([
            'id' => $attribute->id,
            'code' => 'brand',
            'type' => 'image',
            'status' => 1,
            'translations' => [
                ['locale' => 'vi', 'name' => 'Thương hiệu'],
            ],
            'values' => [
                [
                    'translations' => [
                        ['locale' => 'vi', 'value' => 'JW Speaker'],
                    ],
                    'image' => 'new.webp',
                    'color' => '#000000',
                ],
            ],
        ], ['task' => 'edit-item']);

        $this->assertNotFalse($updatedAttribute);
        $this->assertDatabaseHas('attribute_values', [
            'id' => $deletedValue->id,
            'attribute_id' => $attribute->id,
            'value' => 'JW Speaker',
            'image' => 'new.webp',
            'deleted_at' => null,
        ]);
        $this->assertSame(1, $attribute->values()->withTrashed()->where('value', 'JW Speaker')->count());
    }

    public function test_it_deletes_multiple_attributes(): void
    {
        $repository = app(AttributeEloquentRepository::class);

        $firstAttribute = $repository->save([
            'code' => 'color',
            'type' => 'text',
            'status' => 1,
            'translations' => [
                ['locale' => 'vi', 'name' => 'Màu sắc'],
            ],
            'values' => [
                [
                    'translations' => [
                        ['locale' => 'vi', 'value' => 'Đỏ'],
                    ],
                ],
            ],
        ], ['task' => 'add-item']);

        $secondAttribute = $repository->save([
            'code' => 'size',
            'type' => 'text',
            'status' => 1,
            'translations' => [
                ['locale' => 'vi', 'name' => 'Kích cỡ'],
            ],
            'values' => [
                [
                    'translations' => [
                        ['locale' => 'vi', 'value' => 'XL'],
                    ],
                ],
            ],
        ], ['task' => 'add-item']);

        $repository->delete([
            'ids' => $firstAttribute->id.','.$secondAttribute->id,
        ], ['task' => 'delete-items']);

        $this->assertSoftDeleted('attributes', ['id' => $firstAttribute->id]);
        $this->assertSoftDeleted('attributes', ['id' => $secondAttribute->id]);
    }
}
