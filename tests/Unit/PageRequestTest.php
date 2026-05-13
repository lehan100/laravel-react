<?php

namespace Tests\Unit;

use App\Http\Requests\StorePageRequest;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PageRequestTest extends TestCase
{
    #[Test]
    public function it_uses_the_name_translation_for_required_page_title_errors(): void
    {
        app()->setLocale('vi');
        $this->ensureFieldGroupsTableExists();

        $request = new StorePageRequest;

        $validator = Validator::make([
            'title' => '',
            'field_group_id' => 1,
            'translations' => [
                'vi' => [
                    'title' => '',
                    'slug' => 'trang-chu',
                ],
            ],
        ], $request->rules(), [], $request->attributes());

        $this->assertFalse($validator->passes());
        $this->assertSame(
            __('validation.required_with', [
                'attribute' => mb_strtolower(__('hancms.column.name')),
                'values' => 'translations',
            ]),
            $validator->errors()->first('translations.vi.title')
        );
    }

    private function ensureFieldGroupsTableExists(): void
    {
        Schema::dropIfExists('field_groups');

        Schema::create('field_groups', function (Blueprint $table): void {
            $table->id();
            $table->string('title');
            $table->timestamps();
        });

        DB::table('field_groups')->insert([
            'id' => 1,
            'title' => 'Landing Fields',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
