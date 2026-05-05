<?php

namespace Tests\Feature;

use App\Models\Catalog\AttributeValue;
use App\Models\Catalog\ProductAttribute;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class AttributeObserverTest extends TestCase
{
    use RefreshDatabase;

    public function test_attribute_value_image_is_moved_from_temp_on_save(): void
    {
        File::ensureDirectoryExists(public_path('var/temp'));
        File::ensureDirectoryExists(public_path('media/attribute'));

        $fileName = 'observer-attribute-value.jpg';
        File::put(public_path('var/temp/'.$fileName), 'image-content');

        $attribute = ProductAttribute::create([
            'name' => 'Brand',
            'code' => 'brand',
            'type' => 'text',
            'status' => true,
            'order' => 0,
        ]);

        $attributeValue = AttributeValue::create([
            'attribute_id' => $attribute->id,
            'value' => 'Brand value',
            'image' => $fileName,
            'color' => null,
            'order' => 0,
        ]);

        $this->assertDatabaseHas('attribute_values', [
            'id' => $attributeValue->id,
            'image' => $fileName,
        ]);
        $this->assertFileDoesNotExist(public_path('var/temp/'.$fileName));
        $this->assertFileExists(public_path('media/attribute/'.$fileName));

        File::delete(public_path('media/attribute/'.$fileName));
    }

    public function test_attribute_delete_soft_deletes_related_values_and_keeps_files(): void
    {
        File::ensureDirectoryExists(public_path('media/attribute'));

        $attribute = ProductAttribute::create([
            'name' => 'Color',
            'code' => 'color',
            'type' => 'text',
            'status' => true,
            'order' => 0,
        ]);

        $fileName = 'observer-delete-attribute-value.jpg';
        File::put(public_path('media/attribute/'.$fileName), 'image-content');

        $value = AttributeValue::create([
            'attribute_id' => $attribute->id,
            'value' => 'Red',
            'image' => $fileName,
            'color' => '#ff0000',
            'order' => 0,
        ]);

        $attribute->delete();

        $this->assertSoftDeleted('attributes', [
            'id' => $attribute->id,
        ]);

        $this->assertSoftDeleted('attribute_values', [
            'id' => $value->id,
        ]);
        $this->assertFileExists(public_path('media/attribute/'.$fileName));

        File::delete(public_path('media/attribute/'.$fileName));
    }

    public function test_force_deleted_attribute_value_removes_image_file(): void
    {
        File::ensureDirectoryExists(public_path('media/attribute'));

        $attribute = ProductAttribute::create([
            'name' => 'Size',
            'code' => 'size',
            'type' => 'text',
            'status' => true,
            'order' => 0,
        ]);

        $fileName = 'observer-force-delete-attribute-value.jpg';
        File::put(public_path('media/attribute/'.$fileName), 'image-content');

        $value = AttributeValue::create([
            'attribute_id' => $attribute->id,
            'value' => 'Large',
            'image' => $fileName,
            'color' => '#00ff00',
            'order' => 0,
        ]);

        $value->forceDelete();

        $this->assertDatabaseMissing('attribute_values', [
            'id' => $value->id,
        ]);
        $this->assertFileDoesNotExist(public_path('media/attribute/'.$fileName));
    }
}
