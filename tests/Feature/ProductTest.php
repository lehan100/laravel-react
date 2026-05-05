<?php

namespace Tests\Feature;

use App\Http\Requests\Catalog\ProductRequest;
use App\Http\Resources\Catalog\ProductVariantResource;
use App\Models\Catalog\AttributeValue;
use App\Models\Catalog\ProductAttribute;
use App\Repositories\Product\ProductEloquentRepository;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();

        config(['translatable.locales' => ['vi', 'en', 'ja']]);
        app()->setLocale('vi');
    }

    #[Test]
    public function it_accepts_the_product_create_and_update_payloads(): void
    {
        $attributeValueId = $this->createVariantAttributeValueId();

        $payload = $this->basePayload([
            'default_photo_id' => 'product-default.webp',
            'photos' => ['product-default.webp', 'product-gallery.webp'],
            'variants' => [
                [
                    'sku' => 'PRD-BASE-VAR',
                    'price' => 100000,
                    'stock' => 1,
                    'translations' => [
                        'vi' => [
                            'name' => 'Biến thể cơ bản',
                        ],
                        'en' => [
                            'name' => 'Base variant',
                        ],
                        'ja' => [
                            'name' => '基本バリアント',
                        ],
                    ],
                    'attribute_value_ids' => [$attributeValueId],
                ],
            ],
        ]);

        $validator = Validator::make($payload, (new ProductRequest)->rules());

        $this->assertTrue($validator->passes(), $validator->errors()->first() ?? 'Product validation failed.');
    }

    #[Test]
    public function it_can_create_a_product_with_translations_photos_and_default_photo(): void
    {
        $repo = app(ProductEloquentRepository::class);
        $attributeValueId = $this->createVariantAttributeValueId();

        $product = $repo->save($this->basePayload([
            'sku' => 'PRD-001',
            'price' => 125000,
            'quantity' => 12,
            'weight' => 3,
            'status' => 1,
            'is_stock' => 1,
            'is_coupon' => 0,
            'order' => 7,
            'default_photo_id' => 'product-gallery.webp',
            'photos' => ['product-main.webp', 'product-gallery.webp'],
            'variants' => [
                [
                    'sku' => 'PRD-001-VAR-1',
                    'price' => 125000,
                    'stock' => 8,
                    'translations' => [
                        'vi' => [
                            'name' => 'Áo thun đỏ',
                        ],
                        'en' => [
                            'name' => 'Red T-Shirt',
                        ],
                        'ja' => [
                            'name' => '赤いTシャツ',
                        ],
                    ],
                    'attribute_value_ids' => [$attributeValueId],
                ],
            ],
            'translations' => [
                'vi' => [
                    'name' => 'Đồ gia dụng',
                    'slug' => 'do-gia-dung',
                    'description' => 'Mô tả tiếng Việt',
                    'content' => '<p>Nội dung tiếng Việt</p>',
                    'seo_title' => 'Đồ gia dụng',
                    'seo_keyword' => 'do gia dung',
                    'seo_description' => 'Mô tả SEO tiếng Việt',
                ],
                'en' => [
                    'name' => 'Home Appliances',
                    'slug' => 'home-appliances',
                    'description' => 'English description',
                    'content' => '<p>English content</p>',
                    'seo_title' => 'Home Appliances',
                    'seo_keyword' => 'home appliances',
                    'seo_description' => 'English SEO description',
                ],
            ],
        ]), ['task' => 'add-item']);

        $this->assertNotNull($product);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'sku' => 'PRD-001',
            'status' => 1,
            'order' => 7,
        ]);

        $this->assertDatabaseHas('product_translations', [
            'product_id' => $product->id,
            'locale' => 'vi',
            'name' => 'Đồ gia dụng',
            'deleted_at' => null,
        ]);

        $this->assertDatabaseHas('product_translations', [
            'product_id' => $product->id,
            'locale' => 'en',
            'name' => 'Home Appliances',
            'deleted_at' => null,
        ]);

        $this->assertDatabaseHas('product_photos', [
            'product_id' => $product->id,
            'filename' => 'product-main.webp',
            'order' => 0,
            'is_default' => 0,
        ]);

        $this->assertDatabaseHas('product_photos', [
            'product_id' => $product->id,
            'filename' => 'product-gallery.webp',
            'order' => 1,
            'is_default' => 1,
        ]);

        $this->assertDatabaseHas('slugs', [
            'slug' => 'do-gia-dung',
            'locale' => 'vi',
            'is_default' => 1,
            'redirect_to' => null,
        ]);

        $variant = $product->fresh()->variants()->first();
        $this->assertNotNull($variant);
        $this->assertDatabaseHas('variant_translations', [
            'product_variant_id' => $variant->id,
            'locale' => 'vi',
            'name' => 'Áo thun đỏ',
        ]);
        $this->assertDatabaseHas('variant_translations', [
            'product_variant_id' => $variant->id,
            'locale' => 'en',
            'name' => 'Red T-Shirt',
        ]);
        $this->assertSame('Áo thun đỏ', $variant->name);
    }

    #[Test]
    public function it_moves_variant_images_from_temp_to_final_storage_and_normalizes_the_cover_image(): void
    {
        $repo = app(ProductEloquentRepository::class);
        $attributeValueId = $this->createVariantAttributeValueId();
        $fileName = 'variant-cover.webp';
        $tempFilePath = public_path('var/temp/'.$fileName);
        $finalFilePath = public_path('media/product/'.$fileName);

        File::makeDirectory(dirname($tempFilePath), 0755, true, true);
        File::put($tempFilePath, 'fake-image-content');

        try {
            $product = $repo->save($this->basePayload([
                'sku' => 'PRD-IMG',
                'price' => 175000,
                'quantity' => 9,
                'weight' => 2,
                'status' => 1,
                'is_stock' => 1,
                'is_coupon' => 0,
                'order' => 5,
                'variants' => [
                    [
                        'sku' => 'PRD-IMG-VAR-1',
                        'price' => 175000,
                        'stock' => 3,
                        'translations' => [
                            'vi' => [
                                'name' => 'Biến thể ảnh',
                            ],
                            'en' => [
                                'name' => 'Image variant',
                            ],
                            'ja' => [
                                'name' => '画像バリアント',
                            ],
                        ],
                        'image' => 'var/temp/'.$fileName,
                        'images' => [],
                        'attribute_value_ids' => [$attributeValueId],
                    ],
                ],
            ]), ['task' => 'add-item']);

            $this->assertNotNull($product);

            $variant = $product->fresh()->variants()->first();
            $this->assertNotNull($variant);
            $this->assertSame($fileName, $variant->image);
            $this->assertSame([$fileName], $variant->images);
            $this->assertFileExists($finalFilePath);
            $this->assertFileDoesNotExist($tempFilePath);

            $resource = (new ProductVariantResource($variant->fresh()->load('translations', 'attributeValues')))->toArray(request());

            $this->assertSame(url('/').'/media/product/'.$fileName, $resource['image_url']);
            $this->assertSame([$fileName], collect($resource['images'])->all());
            $this->assertSame(url('/').'/media/product/'.$fileName, collect($resource['image_urls'])->first());
        } finally {
            File::delete($tempFilePath);
            File::delete($finalFilePath);
        }
    }

    #[Test]
    public function it_can_update_slug_history_and_reorder_product_photos(): void
    {
        $repo = app(ProductEloquentRepository::class);
        $attributeValueId = $this->createVariantAttributeValueId();

        $product = $repo->save($this->basePayload([
            'sku' => 'PRD-002',
            'price' => 200000,
            'quantity' => 5,
            'weight' => 2,
            'status' => 1,
            'is_stock' => 1,
            'is_coupon' => 1,
            'order' => 2,
            'default_photo_id' => 'product-old-default.webp',
            'photos' => ['product-old-default.webp', 'product-old-gallery.webp'],
            'variants' => [
                [
                    'sku' => 'PRD-002-VAR-1',
                    'price' => 200000,
                    'stock' => 4,
                    'translations' => [
                        'vi' => [
                            'name' => 'Biến thể cũ',
                        ],
                        'en' => [
                            'name' => 'Old variant',
                        ],
                        'ja' => [
                            'name' => '古いバリアント',
                        ],
                    ],
                    'attribute_value_ids' => [$attributeValueId],
                ],
            ],
            'translations' => [
                'vi' => [
                    'name' => 'Thiết bị bếp',
                    'slug' => 'thiet-bi-bep',
                    'description' => 'Mô tả cũ',
                    'content' => '<p>Nội dung cũ</p>',
                    'seo_title' => 'Thiết bị bếp',
                    'seo_keyword' => 'thiet bi bep',
                    'seo_description' => 'SEO cũ',
                ],
            ],
        ]), ['task' => 'add-item']);

        $photos = $product->fresh()->photos()->orderBy('order')->orderBy('id')->get();
        $firstPhotoId = $photos[0]->id;
        $secondPhotoId = $photos[1]->id;

        $repo->save($this->basePayload([
            'id' => $product->id,
            'sku' => 'PRD-002',
            'price' => 210000,
            'quantity' => 6,
            'weight' => 4,
            'status' => 1,
            'is_stock' => 0,
            'is_coupon' => 1,
            'order' => 2,
            'default_photo_id' => $firstPhotoId,
            'photo_orders' => [$secondPhotoId, $firstPhotoId],
            'delete_photo_ids' => [],
            'photos' => [],
            'variants' => [
                [
                    'id' => $product->fresh()->variants()->first()->id,
                    'sku' => 'PRD-002-VAR-1',
                    'price' => 210000,
                    'stock' => 6,
                    'translations' => [
                        'vi' => [
                            'name' => 'Biến thể cũ đã cập nhật',
                        ],
                        'en' => [
                            'name' => 'Updated old variant',
                        ],
                        'ja' => [
                            'name' => '更新された古いバリアント',
                        ],
                    ],
                    'attribute_value_ids' => [$attributeValueId],
                ],
            ],
            'translations' => [
                'vi' => [
                    'name' => 'Thiết bị bếp mới',
                    'slug' => 'thiet-bi-bep-moi',
                    'description' => 'Mô tả mới',
                    'content' => '<p>Nội dung mới</p>',
                    'seo_title' => 'Thiết bị bếp mới',
                    'seo_keyword' => 'thiet bi bep moi',
                    'seo_description' => 'SEO mới',
                ],
            ],
        ]), ['task' => 'edit-item']);

        $this->assertDatabaseHas('slugs', [
            'slug' => 'thiet-bi-bep',
            'locale' => 'vi',
            'is_default' => 0,
            'redirect_to' => 'thiet-bi-bep-moi',
        ]);

        $this->assertDatabaseHas('slugs', [
            'slug' => 'thiet-bi-bep-moi',
            'locale' => 'vi',
            'is_default' => 1,
            'redirect_to' => null,
        ]);

        $this->assertDatabaseHas('product_photos', [
            'id' => $firstPhotoId,
            'product_id' => $product->id,
            'order' => 1,
            'is_default' => 1,
        ]);

        $this->assertDatabaseHas('product_photos', [
            'id' => $secondPhotoId,
            'product_id' => $product->id,
            'order' => 0,
            'is_default' => 0,
        ]);

        $updatedVariant = $product->fresh()->variants()->first();
        $this->assertNotNull($updatedVariant);
        $this->assertDatabaseHas('variant_translations', [
            'product_variant_id' => $updatedVariant->id,
            'locale' => 'vi',
            'name' => 'Biến thể cũ đã cập nhật',
        ]);
        $this->assertSame('Biến thể cũ đã cập nhật', $updatedVariant->name);
    }

    private function basePayload(array $overrides = []): array
    {
        return array_merge([
            'sku' => 'PRD-BASE',
            'quantity' => 1,
            'weight' => 1,
            'price' => 100000,
            'status' => 1,
            'is_stock' => 1,
            'is_coupon' => 0,
            'order' => 1,
            'undo' => 0,
            'category_ids' => [],
            'default_photo_id' => null,
            'photo_orders' => [],
            'delete_photo_ids' => [],
            'photos' => [],
            'translations' => [
                'vi' => [
                    'name' => 'Đồ gia dụng',
                    'slug' => 'do-gia-dung',
                    'description' => 'Mô tả tiếng Việt',
                    'content' => '<p>Nội dung tiếng Việt</p>',
                    'seo_title' => 'Đồ gia dụng',
                    'seo_keyword' => 'do gia dung',
                    'seo_description' => 'Mô tả SEO tiếng Việt',
                ],
            ],
        ], $overrides);
    }

    private function createVariantAttributeValueId(): int
    {
        $attribute = ProductAttribute::query()->create([
            'name' => 'Color',
        ]);

        return AttributeValue::query()->create([
            'attribute_id' => $attribute->id,
            'value' => 'Red',
        ])->id;
    }
}
