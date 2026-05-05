<?php

namespace Tests\Unit;

use App\Models\Catalog\AttributeValue;
use App\Models\Catalog\Product;
use App\Models\Catalog\ProductAttribute;
use App\Models\Catalog\ProductVariant;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Tests\TestCase;

class ProductVariantRelationshipTest extends TestCase
{
    public function test_product_has_many_variants(): void
    {
        $relation = (new Product)->variants();

        $this->assertInstanceOf(HasMany::class, $relation);
        $this->assertSame('product_id', $relation->getForeignKeyName());
    }

    public function test_attribute_has_many_values(): void
    {
        $relation = (new ProductAttribute)->values();

        $this->assertInstanceOf(HasMany::class, $relation);
        $this->assertSame('attribute_id', $relation->getForeignKeyName());
    }

    public function test_variant_belongs_to_product_and_attribute_values(): void
    {
        $variant = new ProductVariant;

        $this->assertInstanceOf(BelongsTo::class, $variant->product());
        $this->assertInstanceOf(BelongsToMany::class, $variant->attributeValues());
        $this->assertSame('variant_attribute_values', $variant->attributeValues()->getTable());
    }

    public function test_attribute_value_belongs_to_attribute_and_variants(): void
    {
        $attributeValue = new AttributeValue;

        $this->assertInstanceOf(BelongsTo::class, $attributeValue->attribute());
        $this->assertInstanceOf(BelongsToMany::class, $attributeValue->variants());
        $this->assertSame('variant_attribute_values', $attributeValue->variants()->getTable());
    }
}
