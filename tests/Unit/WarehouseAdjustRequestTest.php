<?php

namespace Tests\Unit;

use App\Http\Requests\Sales\WarehouseAdjustRequest;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class WarehouseAdjustRequestTest extends TestCase
{
    #[Test]
    public function it_accepts_a_valid_set_stock_payload(): void
    {
        $request = new WarehouseAdjustRequest;
        $request->replace([
            'action' => 'set',
            'set_quantity' => 12,
            'adjust_delta' => 0,
            'reason' => 'Manual sync',
            'undo' => 0,
        ]);

        $validator = Validator::make($request->all(), $request->rules());

        $this->assertTrue($validator->passes());
    }

    #[Test]
    public function it_rejects_invalid_action(): void
    {
        $request = new WarehouseAdjustRequest;
        $request->replace([
            'action' => 'invalid',
            'set_quantity' => 1,
            'adjust_delta' => 1,
        ]);

        $validator = Validator::make($request->all(), $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertArrayHasKey('action', $validator->errors()->messages());
    }
}
