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
                ['name' => 'Color'],
            ],
            'values' => [
                [
                    'translations' => [
                        ['value' => 'Red'],
                    ],
                ],
            ],
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('code', $validator->errors()->toArray());
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
        ], $request->rules());

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
