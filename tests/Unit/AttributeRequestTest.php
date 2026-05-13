<?php

namespace Tests\Unit;

use App\Http\Requests\Catalog\AttributeRequest;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class AttributeRequestTest extends TestCase
{
    public function test_attribute_request_requires_code_and_status_switch_value(): void
    {
        $this->ensureAttributesTableExists();
        $request = new AttributeRequest;

        $validator = Validator::make([
            'status' => 1,
            'type' => 'text',
            'translations' => [
                ['name' => ''],
            ],
            'values' => [
                [
                    'translations' => [
                        ['value' => 'Red'],
                    ],
                ],
            ],
        ], $request->rules(), $request->messages(), $request->attributes());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('code', $validator->errors()->toArray());
        $this->assertSame(
            __('validation.required', ['attribute' => mb_strtolower(__('hancms.catalog.attribute.fields.name'))]),
            $validator->errors()->first('translations.0.name')
        );
    }

    public function test_attribute_request_accepts_a_valid_code_payload(): void
    {
        $this->ensureAttributesTableExists();
        $request = new AttributeRequest;

        $validator = Validator::make([
            'status' => 1,
            'code' => 'brand',
            'type' => 'text',
            'translations' => [
                ['name' => 'Brand'],
            ],
            'values' => [
                [
                    'translations' => [
                        ['value' => 'Nike'],
                    ],
                ],
            ],
        ], $request->rules(), $request->messages(), $request->attributes());

        $this->assertFalse($validator->fails());
    }

    private function ensureAttributesTableExists(): void
    {
        Schema::dropIfExists('attributes');

        Schema::create('attributes', function (Blueprint $table): void {
            $table->id();
            $table->string('code')->nullable();
            $table->timestamps();
        });
    }
}
