<?php

namespace Tests\Unit;

use App\Http\Requests\Catalog\ProductRequest;
use App\Models\Catalog\AttributeValue;
use App\Models\Catalog\ProductAttribute;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class ProductVariantRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_request_accepts_valid_variant_payload(): void
    {
        [$red, , $xl] = $this->createAttributeValues();

        $validator = $this->validator([
            'variants' => [
                [
                    'sku' => 'TSHIRT-RED-XL',
                    'price' => 129000,
                    'stock' => 8,
                    'translations' => [
                        'vi' => [
                            'name' => 'Áo thun đỏ XL',
                        ],
                        'en' => [
                            'name' => 'Red T-Shirt XL',
                        ],
                        'ja' => [
                            'name' => '赤いTシャツ XL',
                        ],
                    ],
                    'attribute_value_ids' => [$red->id, $xl->id],
                ],
            ],
        ]);

        $this->assertTrue($validator->passes());
    }

    public function test_product_request_rejects_duplicate_attribute_in_one_variant(): void
    {
        [$red, $blue] = $this->createAttributeValues();

        $validator = $this->validator([
            'variants' => [
                [
                    'sku' => 'TSHIRT-COLOR-CONFLICT',
                    'price' => 129000,
                    'stock' => 8,
                    'translations' => [
                        'vi' => [
                            'name' => 'Áo thun xung đột màu',
                        ],
                        'en' => [
                            'name' => 'Color conflict shirt',
                        ],
                        'ja' => [
                            'name' => '色の衝突シャツ',
                        ],
                    ],
                    'attribute_value_ids' => [$red->id, $blue->id],
                ],
            ],
        ]);

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('variants.0.attribute_value_ids', $validator->errors()->toArray());
    }

    public function test_product_request_rejects_duplicate_variant_combination(): void
    {
        [$red, , $xl] = $this->createAttributeValues();

        $validator = $this->validator([
            'variants' => [
                [
                    'sku' => 'TSHIRT-RED-XL-1',
                    'price' => 129000,
                    'stock' => 8,
                    'translations' => [
                        'vi' => [
                            'name' => 'Áo thun đỏ XL',
                        ],
                        'en' => [
                            'name' => 'Red T-Shirt XL',
                        ],
                        'ja' => [
                            'name' => '赤いTシャツ XL',
                        ],
                    ],
                    'attribute_value_ids' => [$red->id, $xl->id],
                ],
                [
                    'sku' => 'TSHIRT-RED-XL-2',
                    'price' => 139000,
                    'stock' => 5,
                    'translations' => [
                        'vi' => [
                            'name' => 'Áo thun đỏ XL 2',
                        ],
                        'en' => [
                            'name' => 'Red T-Shirt XL 2',
                        ],
                        'ja' => [
                            'name' => '赤いTシャツ XL 2',
                        ],
                    ],
                    'attribute_value_ids' => [$xl->id, $red->id],
                ],
            ],
        ]);

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('variants.1.attribute_value_ids', $validator->errors()->toArray());
    }

    public function test_product_request_rejects_variant_without_any_localized_name(): void
    {
        [$red, , $xl] = $this->createAttributeValues();

        $validator = $this->validator([
            'variants' => [
                [
                    'sku' => 'TSHIRT-NO-NAME',
                    'price' => 129000,
                    'stock' => 8,
                    'translations' => [
                        'vi' => [
                            'name' => '',
                        ],
                        'en' => [
                            'name' => '   ',
                        ],
                        'ja' => [
                            'name' => '',
                        ],
                    ],
                    'attribute_value_ids' => [$red->id, $xl->id],
                ],
            ],
        ]);

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('variants.0.translations', $validator->errors()->toArray());
    }

    public function test_product_request_rejects_empty_attribute_values_when_other_variant_uses_attributes(): void
    {
        [$red, , $xl] = $this->createAttributeValues();

        $validator = $this->validator([
            'variants' => [
                [
                    'sku' => 'TSHIRT-EMPTY-ATTR',
                    'price' => 129000,
                    'stock' => 8,
                    'translations' => [
                        'vi' => [
                            'name' => 'Áo thun trống',
                        ],
                        'en' => [
                            'name' => 'Empty attr shirt',
                        ],
                        'ja' => [
                            'name' => '属性なしシャツ',
                        ],
                    ],
                    'attribute_value_ids' => [],
                ],
                [
                    'sku' => 'TSHIRT-WITH-ATTR',
                    'price' => 139000,
                    'stock' => 5,
                    'translations' => [
                        'vi' => [
                            'name' => 'Áo thun có thuộc tính',
                        ],
                        'en' => [
                            'name' => 'Attr shirt',
                        ],
                        'ja' => [
                            'name' => '属性付きシャツ',
                        ],
                    ],
                    'attribute_value_ids' => [$red->id, $xl->id],
                ],
            ],
        ]);

        $this->assertFalse($validator->passes());
        $this->assertArrayHasKey('variants.0.attribute_value_ids', $validator->errors()->toArray());
    }

    /**
     * @return array{0: AttributeValue, 1: AttributeValue, 2: AttributeValue}
     */
    private function createAttributeValues(): array
    {
        $color = ProductAttribute::query()->create(['name' => 'Color']);
        $size = ProductAttribute::query()->create(['name' => 'Size']);

        return [
            AttributeValue::query()->create(['attribute_id' => $color->id, 'value' => 'Red']),
            AttributeValue::query()->create(['attribute_id' => $color->id, 'value' => 'Blue']),
            AttributeValue::query()->create(['attribute_id' => $size->id, 'value' => 'XL']),
        ];
    }

    private function validator(array $overrides)
    {
        $payload = array_replace_recursive([
            'status' => 1,
            'translations' => [
                'en' => [
                    'name' => 'T-Shirt',
                ],
            ],
            'variants' => [
                [
                    'sku' => 'TSHIRT-BASE',
                    'price' => 100000,
                    'stock' => 1,
                    'translations' => [
                        'vi' => [
                            'name' => 'Áo thun cơ bản',
                        ],
                        'en' => [
                            'name' => 'Basic T-Shirt',
                        ],
                        'ja' => [
                            'name' => 'ベーシックTシャツ',
                        ],
                    ],
                    'attribute_value_ids' => [],
                ],
            ],
        ], $overrides);

        $request = ProductRequest::create('/admin123/product', 'POST', $payload);
        $validator = Validator::make($request->all(), $request->rules());

        foreach ($request->after() as $afterValidation) {
            $validator->after($afterValidation);
        }

        return $validator;
    }
}
