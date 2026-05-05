<?php

namespace Tests\Unit;

use App\Http\Requests\Catalog\CategoryReorderRequest;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CategoryReorderRequestTest extends TestCase
{
    #[Test]
    public function it_defines_the_expected_reorder_rules(): void
    {
        $rules = (new CategoryReorderRequest)->rules();

        $this->assertSame(['required', 'array', 'min:1'], $rules['items']);
        $this->assertSame(['required', 'integer', 'exists:categories,id'], $rules['items.*.id']);
        $this->assertSame(['nullable', 'integer', 'exists:categories,id'], $rules['items.*.parent_id']);
        $this->assertSame(['required', 'integer', 'min:0'], $rules['items.*.order']);
    }
}
