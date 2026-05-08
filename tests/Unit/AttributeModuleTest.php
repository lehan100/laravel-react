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
        app()->setLocale('vi');

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

        $this->assertSame('Mau sac', $payload['name']);
        $this->assertSame('color', $payload['code']);
        $this->assertSame('image', $payload['type']);
        $this->assertTrue($payload['status']);
        $this->assertSame(2, $payload['order']);
        $this->assertSame(1, $payload['values_count']);
        $this->assertSame('Do', $payload['values'][0]['name']);
        $this->assertSame('Do', $payload['values'][0]['value']);
        $this->assertSame('#ff0000', $payload['values'][0]['color']);
        $this->assertArrayHasKey('image_url', $payload['values'][0]);
        $this->assertNotEmpty($payload['values'][0]['image_url']);
    }

    public function test_attribute_value_resource_uses_localized_value_fallback(): void
    {
        app()->setLocale('vi');

        $attributeValue = new AttributeValue([
            'id' => 21,
            'attribute_id' => 3,
            'image' => null,
            'color' => '#00ff00',
            'order' => 4,
        ]);

        $attributeValue->setRelation('translations', collect([
            new AttributeValueTranslation([
                'locale' => 'vi',
                'value' => 'Xanh lá',
            ]),
        ]));

        $payload = (new AttributeValueResource($attributeValue))->toArray(new Request);

        $this->assertSame('Xanh lá', $payload['name']);
        $this->assertSame('Xanh lá', $payload['value']);
        $this->assertSame('#00ff00', $payload['color']);
        $this->assertSame(4, $payload['order']);
    }

    public function test_attribute_resources_keep_nested_media_paths_intact(): void
    {
        app()->setLocale('en');

        $attribute = new ProductAttribute([
            'id' => 2,
            'code' => 'brand',
            'type' => 'image',
            'status' => 1,
            'order' => 0,
        ]);

        $attribute->setRelation('translations', collect());

        $value = new AttributeValue([
            'id' => 11,
            'attribute_id' => 2,
            'image' => 'media/editor/attributes/sachs-logo.png',
            'order' => 0,
        ]);

        $value->setRelation('translations', collect());

        $attribute->setRelation('values', collect([$value]));

        $payload = (new AttributeResource($attribute))->toArray(new Request);

        $this->assertSame('/media/editor/attributes/sachs-logo.png', $payload['values_preview'][0]['image_url']);

        $valuePayload = (new AttributeValueResource($value))->toArray(new Request);

        $this->assertSame('/media/editor/attributes/sachs-logo.png', $valuePayload['image_url']);
    }

    public function test_attribute_resource_prefers_session_locale_over_app_locale(): void
    {
        app()->setLocale('vi');

        $attribute = new ProductAttribute([
            'id' => 3,
            'code' => 'brand',
            'type' => 'text',
            'status' => 1,
            'order' => 0,
        ]);

        $attribute->setRelation('translations', collect([
            new ProductAttributeTranslation([
                'locale' => 'vi',
                'name' => 'Thương hiệu',
            ]),
            new ProductAttributeTranslation([
                'locale' => 'ja',
                'name' => 'ブランド',
            ]),
        ]));

        $value = new AttributeValue([
            'id' => 31,
            'attribute_id' => 3,
            'value' => 'Hương Thị',
            'order' => 0,
        ]);

        $value->setRelation('translations', collect([
            new AttributeValueTranslation([
                'locale' => 'vi',
                'value' => 'Hương Thị',
            ]),
            new AttributeValueTranslation([
                'locale' => 'ja',
                'value' => 'ブランド値',
            ]),
        ]));

        $attribute->setRelation('values', collect([$value]));

        $request = Request::create('/');
        $request->setLaravelSession(app('session.store'));
        $request->session()->put('locale', 'ja');

        $payload = (new AttributeResource($attribute))->toArray($request);

        $this->assertSame('ブランド', $payload['name']);
        $this->assertSame('ブランド値', $payload['values'][0]['name']);
        $this->assertSame('ブランド値', $payload['values'][0]['value']);
    }
}
