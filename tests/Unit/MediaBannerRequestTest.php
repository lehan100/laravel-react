<?php

namespace Tests\Unit;

use App\Http\Requests\Media\MediaBannerRequest;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class MediaBannerRequestTest extends TestCase
{
    #[Test]
    public function it_uses_human_readable_labels_for_required_media_banner_errors(): void
    {
        app()->setLocale('vi');

        $request = new MediaBannerRequest;

        $validator = Validator::make(
            [
                'status' => null,
                'position_ids' => [],
                'translations' => [
                    [
                        'name' => '',
                    ],
                ],
            ],
            $request->rules(),
            $request->messages(),
            $request->attributes()
        );

        $this->assertTrue($validator->fails());
        $this->assertSame(
            __('validation.required', ['attribute' => mb_strtolower(__('hancms.column.status'))]),
            $validator->errors()->first('status')
        );
        $this->assertSame(
            __('validation.required', ['attribute' => mb_strtolower(__('hancms.media.position.name'))]),
            $validator->errors()->first('position_ids')
        );
        $this->assertSame(
            __('validation.required', ['attribute' => mb_strtolower(__('hancms.column.name'))]),
            $validator->errors()->first('translations.0.name')
        );
    }
}
