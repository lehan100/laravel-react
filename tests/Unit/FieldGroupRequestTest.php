<?php

namespace Tests\Unit;

use App\Http\Requests\StoreFieldGroupRequest;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FieldGroupRequestTest extends TestCase
{
    #[Test]
    public function it_uses_the_name_translation_for_required_field_labels(): void
    {
        app()->setLocale('vi');

        $request = new StoreFieldGroupRequest;

        $validator = Validator::make(
            [
                'title' => '',
                'status' => true,
                'fields' => [
                    [
                        'key' => 'field_1',
                        'label' => '',
                        'type' => 'text',
                        'translatable' => true,
                        'required' => true,
                    ],
                ],
            ],
            $request->rules(),
            [],
            $request->attributes()
        );

        $this->assertFalse($validator->passes());
        $this->assertSame(
            'Trường tên không được bỏ trống.',
            $validator->errors()->first('fields.0.label')
        );
    }
}
