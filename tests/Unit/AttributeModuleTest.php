<?php

namespace Tests\Unit;

use App\Http\Resources\Catalog\AttributeResource;
use App\Http\Resources\Catalog\AttributeValueResource;
use App\Models\Catalog\AttributeValue;
use App\Models\Catalog\AttributeValueTranslation;
use App\Models\Catalog\ProductAttribute;
use App\Models\Catalog\ProductAttributeTranslation;
use Illuminate\Http\Request;
use Tests\TestCase;

class AttributeModuleTest extends TestCase
{
    public function test_attribute_resource_serializes_translations_and_value_media(): void
    {
        app()->setLocale('en');

        $attribute = new ProductAttribute([
            'id' => 1,
            'code' => 'color',
            'type' => 'image',
            'status' => 1,
            'order' => 2,
        ]);

        $attribute->setRelation('translations', collect([
            new ProductAttributeTranslation([
                'locale' => 'en',
                'name' => 'Color',
            ]),
            new ProductAttributeTranslation([
                'locale' => 'vi',
                'name' => 'Mau sac',
            ]),
        ]));

        $value = new AttributeValue([
            'id' => 10,
            'attribute_id' => 1,
            'image' => 'red.png',
            'color' => '#ff0000',
            'order' => 0,
        ]);

        $value->setRelation('translations', collect([
            new AttributeValueTranslation([
                'locale' => 'en',
                'value' => 'Red',
            ]),
            new AttributeValueTranslation([
                'locale' => 'vi',
                'value' => 'Do',
            ]),
        ]));

        $attribute->setRelation('values', collect([$value]));

        $payload = (new AttributeResource($attribute))->toArray(new Request);

        $this->assertSame('Color', $payload['name']);
        $this->assertSame('color', $payload['code']);
        $this->assertSame('image', $payload['type']);
        $this->assertTrue($payload['status']);
        $this->assertSame(2, $payload['order']);
        $this->assertSame(1, $payload['values_count']);
        $this->assertSame('Red', $payload['values'][0]['name']);
        $this->assertSame('Red', $payload['values'][0]['value']);
        $this->assertSame('#ff0000', $payload['values'][0]['color']);
        $this->assertArrayHasKey('image_url', $payload['values'][0]);
        $this->assertNotEmpty($payload['values'][0]['image_url']);
    }

    public function test_attribute_value_resource_uses_localized_value_fallback(): void
    {
        app()->setLocale('en');

        $attributeValue = new AttributeValue([
            'id' => 21,
            'attribute_id' => 3,
            'image' => null,
            'color' => '#00ff00',
            'order' => 4,
        ]);

        $attributeValue->setRelation('translations', collect([
            new AttributeValueTranslation([
                'locale' => 'en',
                'value' => 'Green',
            ]),
        ]));

        $payload = (new AttributeValueResource($attributeValue))->toArray(new Request);

        $this->assertSame('Green', $payload['name']);
        $this->assertSame('Green', $payload['value']);
        $this->assertSame('#00ff00', $payload['color']);
        $this->assertSame(4, $payload['order']);
    }
}
