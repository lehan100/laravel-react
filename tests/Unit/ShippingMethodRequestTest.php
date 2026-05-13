<?php

namespace Tests\Unit;

use App\Http\Requests\Sales\ShippingMethodRequest;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ShippingMethodRequestTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! Schema::hasTable('shipping_methods')) {
            Schema::create('shipping_methods', function (Blueprint $table): void {
                $table->id();
                $table->string('code', 100)->unique();
                $table->string('provider', 100)->index();
                $table->string('name', 255);
                $table->text('description')->nullable();
                $table->json('settings')->nullable();
                $table->unsignedInteger('sort_order')->default(0);
                $table->boolean('is_active')->default(true)->index();
                $table->boolean('is_system')->default(false)->index();
                $table->timestamps();
            });
        }
    }

    #[Test]
    public function it_accepts_a_valid_ghn_payload(): void
    {
        $request = new ShippingMethodRequest;
        $request->replace([
            'code' => 'ghn',
            'provider' => 'ghn',
        ]);

        $validator = Validator::make([
            'code' => 'ghn',
            'provider' => 'ghn',
            'name' => 'GHN',
            'description' => 'Giao Hàng Nhanh',
            'settings' => [
                'token' => 'token-123',
                'shop_id' => 'shop-123',
                'endpoint' => 'https://api.example.com',
                'webhook_url' => 'https://example.com/webhook',
            ],
            'sort_order' => 0,
            'is_active' => true,
            'undo' => 0,
        ], $request->rules());

        $this->assertTrue($validator->passes());
    }

    #[Test]
    public function it_rejects_invalid_ghn_settings(): void
    {
        $request = new ShippingMethodRequest;
        $request->replace([
            'code' => 'ghn',
            'provider' => 'ghn',
        ]);

        $validator = Validator::make([
            'code' => 'ghn',
            'provider' => 'ghn',
            'name' => 'GHN',
            'settings' => [
                'token' => '',
                'shop_id' => '',
                'endpoint' => 'invalid-url',
            ],
        ], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('settings.token', $validator->errors()->messages());
        $this->assertArrayHasKey('settings.shop_id', $validator->errors()->messages());
        $this->assertArrayHasKey('settings.endpoint', $validator->errors()->messages());
    }

    #[Test]
    public function it_uses_human_readable_labels_for_required_shipping_method_errors(): void
    {
        app()->setLocale('vi');

        $request = new ShippingMethodRequest;
        $request->replace([
            'code' => 'ghn',
            'provider' => 'ghn',
            'name' => '',
            'settings' => [
                'shop_id' => '',
                'endpoint' => 'https://example.com',
            ],
        ]);

        $validator = Validator::make(
            $request->all(),
            $request->rules(),
            $request->messages(),
            $request->attributes()
        );

        $this->assertTrue($validator->fails());
        $this->assertSame(
            __('validation.required', ['attribute' => mb_strtolower(__('hancms.column.name'))]),
            $validator->errors()->first('name')
        );
        $this->assertSame(
            __('validation.required_if', [
                'attribute' => mb_strtolower(__('hancms.sales.shipping_methods.fields.token')),
                'other' => mb_strtolower(__('hancms.sales.shipping_methods.name')),
                'value' => 'ghn',
            ]),
            $validator->errors()->first('settings.token')
        );
    }
}
