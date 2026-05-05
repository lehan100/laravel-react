<?php

namespace Tests\Unit;

use App\Models\Catalog\Product;
use Illuminate\Database\Eloquent\Relations\HasMany;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ProductAdjustmentHistoriesRelationTest extends TestCase
{
    #[Test]
    public function it_defines_the_adjustment_histories_relation_on_product(): void
    {
        $relation = (new Product)->adjustmentHistories();

        $this->assertInstanceOf(HasMany::class, $relation);
        $this->assertSame('product_id', $relation->getForeignKeyName());
        $this->assertSame('id', $relation->getLocalKeyName());
    }
}
