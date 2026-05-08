<?php

namespace Tests\Unit;

use App\Http\Resources\Catalog\AttributeResource;
use App\Models\Catalog\AttributeValue;
use App\Models\Catalog\AttributeValueTranslation;
use App\Models\Catalog\ProductAttribute;
use App\Models\Catalog\ProductAttributeTranslation;
use App\Repositories\Attribute\AttributeEloquentRepository;
use Illuminate\Http\Request;
use PHPUnit\Framework\Attributes\Test;
use ReflectionClass;
use Tests\TestCase;

class AttributeIndexLocaleTest extends TestCase
{
    #[Test]
    public function it_uses_the_session_locale_when_rendering_attribute_index_data(): void
    {
        app()->setLocale('vi');

        $attribute = new ProductAttribute([
            'id' => 1,
            'code' => 'brand',
            'type' => 'image',
            'status' => 1,
            'order' => 0,
        ]);

        $attribute->setRelation('translations', collect([
            new ProductAttributeTranslation([
                'locale' => '0',
                'name' => 'Thương hiệu',
            ]),
            new ProductAttributeTranslation([
                'locale' => '1',
                'name' => 'Brand',
            ]),
            new ProductAttributeTranslation([
                'locale' => '2',
                'name' => 'ブランド',
            ]),
        ]));

        $value = new AttributeValue([
            'id' => 1,
            'attribute_id' => 1,
            'value' => 'Hương Thị',
            'image' => '/media/editor/sachs-logo-9905-1778210684.png',
            'color' => '#9F2D2D',
            'order' => 0,
        ]);

        $value->setRelation('translations', collect([
            new AttributeValueTranslation([
                'locale' => '0',
                'value' => 'Hương Thị',
            ]),
            new AttributeValueTranslation([
                'locale' => '1',
                'value' => 'Huong Thi',
            ]),
            new AttributeValueTranslation([
                'locale' => '2',
                'value' => 'ホアンティ',
            ]),
        ]));

        $attribute->setRelation('values', collect([$value]));

        $repository = app(AttributeEloquentRepository::class);
        $reflection = new ReflectionClass($repository);
        $method = $reflection->getMethod('normalizeAttributeLocale');
        $method->setAccessible(true);
        $normalizedAttribute = $method->invoke($repository, $attribute, ['vi', 'en', 'ja']);

        $request = Request::create('/');
        $request->setLaravelSession(app('session.store'));
        $request->session()->put('locale', 'ja');

        $payload = (new AttributeResource($normalizedAttribute))->toArray($request);

        $this->assertSame('ブランド', $payload['name']);
        $this->assertSame('ホアンティ', $payload['values_preview'][0]['value']);
    }
}
