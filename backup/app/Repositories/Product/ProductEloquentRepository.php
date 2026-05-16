<?php

namespace App\Repositories\Product;

use App\Models\Catalog\Product;
use App\Models\Catalog\ProductAttribute;
use App\Models\Catalog\ProductVariant;
use App\Models\Sales\InventoryAdjustmentHistory;
use App\Pipelines\HandleSlugHistory;
use App\Repositories\EloquentRepository;
use Carbon\Carbon;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ProductEloquentRepository extends EloquentRepository implements ProductRepositoryInterface
{
    private $FIELDSELECT = [
        'id',
        'sku',
        'quantity',
        'weight',
        'price',
        'is_coupon',
        'is_stock',
        'status',
        'order',
        'hit_viewer',
        'hit_order',
        'created_at',
    ];

    protected $configPath;

    public function __construct()
    {
        parent::__construct();
        $this->configPath = config('image.path.product');
    }

    public function getModel()
    {
        return Product::class;
    }

    public function getAttributeRows(): Collection
    {
        return ProductAttribute::query()
            ->with([
                'translations',
                'values' => function ($query) {
                    $query->orderBy('order', 'asc')
                        ->orderBy('id', 'asc')
                        ->with('translations');
                },
            ])
            ->orderBy('order', 'asc')
            ->orderBy('id', 'asc')
            ->get();
    }

    public function lists($params = null, $options = null)
    {
        $currentLocale = app()->getLocale();
        $task = $options['task'] ?? null;

        // Gom 2 task admin vào một luồng xử lý duy nhất
        if (in_array($task, ['admin-list-items', 'admin-list-items-active'])) {

            $query = $this->_model->with([
                // 1. Bản dịch sản phẩm (Cần product_id để map)
                'translations' => function ($q) use ($currentLocale) {
                    $q->select(['id', 'product_id', 'locale', 'name'])
                        ->where('locale', $currentLocale);
                },
                // 2. Tối ưu: Lấy danh mục kèm bản dịch của chính danh mục đó theo locale
                'categories' => function ($q) use ($currentLocale) {
                    $q->select(['categories.id'])
                        ->with(['translations' => function ($sq) use ($currentLocale) {
                            $sq->select(['id', 'category_id', 'locale', 'name'])
                                ->where('locale', $currentLocale);
                        }]);
                },
                // 3. Ảnh đại diện (Cần disk để hiển thị URL)
                'photos' => function ($q) {
                    $q->select(['id', 'product_id', 'filename', 'disk', 'order', 'is_default']);
                },
                'variants.translations',
                'variants.attributeValues.attribute',
            ]);

            // Áp dụng các cột cần lấy và sắp xếp
            $query->select($this->FIELDSELECT)->orderBy('order', 'asc');

            // Nếu là task active thì thêm filter status = 1
            if ($task == 'admin-list-items-active') {
                $query->where('status', 1);
            }

            return $query->get();
        }

        return null;
    }

    public function get($params = null, $options = null)
    {
        if ($options['task'] == 'get-item') {
            $currentLocale = app()->getLocale();

            return $this->_model->with([
                'photos',
                'translations',
                'slugs',
                'categories' => function ($q) use ($currentLocale) {
                    $q->select(['categories.id'])
                        ->with(['translations' => function ($sq) use ($currentLocale) {
                            $sq->select(['id', 'category_id', 'locale', 'name'])
                                ->where('locale', $currentLocale);
                        }]);
                },
                'variants.translations',
                'variants.attributeValues.attribute',
                'attributeValues',
            ])->find($params['id']);
        }

        return null;
    }

    public function save($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (! $task) {
            return false;
        }
        if ($options['task'] == 'admin-update-multi-status') {
            $ids = $params['aid'] ?? [];
            if (empty($ids)) {
                return false;
            }

            return $this->_model->whereIn('id', $ids)->get()->each(function ($item) use ($params) {
                $item->update(['status' => $params['value']]);
            });
        }

        if ($task == 'change-status') {
            $item = $this->_model->find($params['id']);
            if ($item) {
                $item->status = ($item->status == 0) ? 1 : 0;

                return $item->save();
            }

            return false;
        }
        DB::beginTransaction();
        try {
            // 1. Khởi tạo hoặc tìm sản phẩm
            $item = ($options['task'] == 'add-item')
                ? new $this->_model
                : $this->_model->find($params['id']);

            if (! $item) {
                DB::rollBack();

                return false;
            }
            // 2. Lưu thông tin cơ bản (Bảng products)
            $item->sku = $params['sku'] ?? $item->sku;
            $item->price = $params['price'] ?? $item->price ?? 0;
            $item->quantity = $params['quantity'] ?? 0;
            $item->weight = $params['weight'] ?? 0;
            $item->brand = $params['brand'] ?? $item->brand;
            $item->status = $params['status'] ?? 0;
            $item->is_stock = $params['is_stock'] ?? 0;
            $item->is_coupon = $params['is_coupon'] ?? 0;
            $item->order = $params['order'] ?? 0;
            $item->save();
            // 3. Lưu Bản dịch (Product Translations)
            $translationsData = $params['translations'] ?? [];
            foreach ($translationsData as $locale => $data) {
                $translation = $item->translateOrNew($locale);
                // Loại bỏ slug/is_default để Pipeline xử lý riêng cho bảng slugs
                $translation->fill(Arr::except($data, ['slug', 'is_default']));
                $translation->save();
            }
            // 4. Lưu quan hệ Categories (Many-to-Many)
            if (isset($params['category_ids'])) {
                $item->categories()->sync($params['category_ids']);
            }

            // Sync product-level attribute values
            if (isset($params['attribute_value_ids'])) {
                $item->attributeValues()->sync($params['attribute_value_ids']);
            }

            // 5. Xử lý nhiều ảnh (Product Photos)
            // Giả sử $params['photos'] chứa mảng các file upload mới
            if ($options['task'] == 'edit-item' && isset($params['delete_photo_ids'])) {
                $item->photos()->whereIn('id', $params['delete_photo_ids'])->get()->each->delete();
            }

            if (isset($params['photo_orders']) && is_array($params['photo_orders'])) {
                foreach (array_values($params['photo_orders']) as $index => $photoId) {
                    $item->photos()->where('id', $photoId)->update(['order' => $index]);
                }
            }

            if (isset($params['photos']) && is_array($params['photos'])) {
                $existingCount = $item->photos()->count();
                $hasDefaultPhoto = $item->photos()->where('is_default', true)->exists();
                $defaultPhotoTarget = $params['default_photo_id'] ?? null;
                $newDefaultPhotoId = null;
                foreach ($params['photos'] as $index => $photoFile) {
                    if (! is_string($photoFile) || trim($photoFile) === '') {
                        continue;
                    }

                    $isDefaultPhoto = false;
                    if (is_string($defaultPhotoTarget)) {
                        $isDefaultPhoto = $defaultPhotoTarget === $photoFile;
                    } elseif (! $hasDefaultPhoto && $index === 0) {
                        $isDefaultPhoto = true;
                    }

                    $createdPhoto = $item->photos()->create([
                        'filename' => $photoFile,
                        'disk' => 'public',
                        'is_default' => $isDefaultPhoto,
                        'order' => $existingCount + $index,
                    ]);
                    if ($isDefaultPhoto) {
                        $hasDefaultPhoto = true;
                        $newDefaultPhotoId = $createdPhoto->id;
                    }
                }
                if ($newDefaultPhotoId) {
                    $item->photos()->update(['is_default' => false]);
                    $item->photos()->where('id', $newDefaultPhotoId)->update(['is_default' => true]);
                    $hasDefaultPhoto = true;
                }
            }
            if (! empty($params['default_photo_id']) && is_numeric($params['default_photo_id'])) {
                $defaultPhotoTarget = $params['default_photo_id'];
                $item->photos()->update(['is_default' => false]);
                $item->photos()->where('id', $defaultPhotoTarget)->update(['is_default' => true]);
            }
            if (! $item->photos()->where('is_default', true)->exists()) {
                $firstPhoto = $item->photos()->orderBy('order')->orderBy('id')->first();
                if ($firstPhoto) {
                    $firstPhoto->update(['is_default' => true]);
                }
            }
            // 6. Lưu biến thể sản phẩm và các giá trị thuộc tính đi kèm.
            if (array_key_exists('variants', $params)) {
                $this->syncVariants($item, $params['variants'] ?? []);
            }
            if ($item->variants()->exists()) {
                $this->syncQuantityFromVariants($item);
            }
            // 6. Xử lý Slugs qua Pipeline (Unicode, History, Redirects)
            app(Pipeline::class)
                ->send([
                    'item' => $item,
                    'translations' => $translationsData,
                ])
                ->through([
                    HandleSlugHistory::class,
                ])
                ->thenReturn();
            DB::commit();

            return $item;
        } catch (\Exception $e) {
            DB::rollBack();
            logger('Error save product: '.$e->getMessage());

            return false;
        }
    }

    private function syncVariants(Product $product, array $variants): void
    {
        $keptVariantIds = [];

        foreach ($variants as $variantData) {
            $variant = null;
            if (! empty($variantData['id'])) {
                $variant = $product->variants()->whereKey($variantData['id'])->first();
            }

            $variant ??= $product->variants()->make();
            $images = $this->syncVariantImageFiles($variantData);
            $coverImage = $this->normalizeVariantImageName($variantData['image'] ?? null) ?? ($images[0] ?? null);
            $variant->fill([
                'sku' => $variantData['sku'],
                'price' => $variantData['price'],
                'stock' => $variantData['stock'],
                'image' => $coverImage,
                'images' => $images,
            ]);
            $variant->save();
            $this->syncVariantTranslations($variant, is_array($variantData['translations'] ?? null) ? $variantData['translations'] : []);
            $variant->attributeValues()->sync($variantData['attribute_value_ids'] ?? []);

            $keptVariantIds[] = $variant->id;
        }

        $product->variants()
            ->when($keptVariantIds !== [], fn ($query) => $query->whereNotIn('id', $keptVariantIds))
            ->delete();
    }

    private function syncQuantityFromVariants(Product $product): void
    {
        $product->loadMissing('variants');

        if ($product->variants->isEmpty()) {
            return;
        }

        $totalStock = (int) $product->variants->sum('stock');

        $product->quantity = $totalStock;
        $product->is_stock = $totalStock > 0;
        $product->saveQuietly();
    }

    private function syncVariantTranslations(ProductVariant $variant, array $translations): void
    {
        $keptLocales = [];

        foreach ($translations as $locale => $translationData) {
            $name = trim((string) ($translationData['name'] ?? ''));

            if ($name === '') {
                continue;
            }

            $variant->translations()->updateOrCreate(
                ['locale' => (string) $locale],
                ['name' => $name]
            );

            $keptLocales[] = (string) $locale;
        }

        $variant->translations()
            ->when($keptLocales !== [], fn ($query) => $query->whereNotIn('locale', $keptLocales))
            ->delete();
    }

    private function syncVariantImageFiles(array $variantData): array
    {
        $configPath = config('image.path.product');
        $tempDir = $configPath['temp'] ?? 'var/temp';
        $mainDir = $configPath['path'] ?? 'media/product';
        $tempPath = public_path(trim($tempDir, '/'));
        $mainPath = public_path(trim($mainDir, '/'));

        if (! File::exists($mainPath)) {
            File::makeDirectory($mainPath, 0755, true);
        }

        $normalizedImages = [];
        $candidateImages = array_merge(
            is_array($variantData['images'] ?? null) ? $variantData['images'] : [],
            [$variantData['image'] ?? null]
        );

        foreach ($candidateImages as $fileName) {
            $normalizedFileName = $this->normalizeVariantImageName($fileName);

            if (! $normalizedFileName) {
                continue;
            }

            $normalizedImages[] = $normalizedFileName;

            $sourceFile = rtrim($tempPath, '/').'/'.$normalizedFileName;
            $destinationFile = rtrim($mainPath, '/').'/'.$normalizedFileName;

            if (File::exists($sourceFile) && ! File::exists($destinationFile)) {
                File::copy($sourceFile, $destinationFile);
                File::delete($sourceFile);
            }
        }

        return array_values(array_unique($normalizedImages));
    }

    private function normalizeVariantImageName(mixed $image): ?string
    {
        if (! is_string($image)) {
            return null;
        }

        $image = trim($image);

        if ($image === '') {
            return null;
        }

        $path = parse_url($image, PHP_URL_PATH);
        $path = is_string($path) && $path !== '' ? $path : $image;
        $fileName = basename($path);

        return $fileName !== '' ? $fileName : null;
    }

    public function delete($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (! $task) {
            return false;
        }
        if ($options['task'] == 'delete-item') {
            $item = $this->_model->find($params['id']);
            if ($item) {
                return $item->delete();
            }
        }

        if ($options['task'] == 'delete-items') {
            $ids = is_array($params['ids']) ? $params['ids'] : explode(',', $params['ids']);

            return $this->_model->whereIn('id', $ids)->get()->each(function ($item) {
                $item->delete();
            });
        }
        if ($task == 'force-delete-item') {
            $item = $this->_model->withTrashed()->find($params['id']);
            if ($item) {
                return $item->forceDelete();
            }
        }

        return false;
    }

    public function getProductsForUpdate(array $productIds): Collection
    {
        return $this->_model->query()
            ->whereIn('id', $productIds)
            ->lockForUpdate()
            ->get();
    }

    public function getVariantsForUpdate(array $variantIds): Collection
    {
        return ProductVariant::query()
            ->whereIn('id', $variantIds)
            ->lockForUpdate()
            ->get();
    }

    public function getProductsForInventoryReport(): Collection
    {
        return $this->_model->query()
            ->with(['translations' => fn ($query) => $query->whereIn('locale', ['vi', app()->getLocale()])])
            ->withCount('variants')
            ->withSum('variants', 'stock')
            ->get();
    }

    public function getInventoryAdjustmentsByDateRange(Carbon $startDate, Carbon $endDate): Collection
    {
        return InventoryAdjustmentHistory::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();
    }

    public function createInventoryAdjustment(array $payload): InventoryAdjustmentHistory
    {
        return InventoryAdjustmentHistory::query()->create($payload);
    }
}
