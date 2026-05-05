<?php

namespace Tests\Unit;

use App\Http\Requests\Sales\PaymentMethodRequest;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PaymentMethodRequestTest extends TestCase
{
    #[Test]
    public function it_accepts_a_valid_payment_method_payload(): void
    {
        $request = new PaymentMethodRequest;
        $request->replace([
            'code' => 'momo',
            'provider' => 'momo',
            'name' => 'MoMo',
            'description' => 'Ví điện tử',
            'settings' => [
                'partner_code' => 'MOMO123',
                'access_key' => 'ACCESS123',
                'secret_key' => 'SECRET123',
                'endpoint' => 'https://example.com/momo',
                'return_url' => 'https://example.com/return',
            ],
            'sort_order' => 1,
            'is_active' => true,
            'is_system' => false,
            'undo' => 0,
        ]);

        $validator = Validator::make($request->all(), $request->rules());

        $this->assertTrue($validator->passes());
    }

    #[Test]
    public function it_rejects_invalid_provider_code(): void
    {
        $request = new PaymentMethodRequest;
        $request->replace([
            'code' => 'invalid',
            'provider' => 'invalid',
            'name' => 'Invalid',
        ]);

        $validator = Validator::make($request->all(), $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('code', $validator->errors()->messages());
        $this->assertArrayHasKey('provider', $validator->errors()->messages());
    }
}
