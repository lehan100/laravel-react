<?php

namespace App\Repositories\Product;

use App\Models\Catalog\Product;
use App\Pipelines\HandleSlugHistory;
use App\Repositories\EloquentRepository;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class ProductEloquentRepository extends EloquentRepository implements ProductRepositoryInterface
{
    private $FIELDSELECT = [
        'id',
        'sku',
        'quantity',
        'weight',
        'brand',
        'base_price',
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
                'variants.attributeValues.attribute',
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
            $item->brand = $params['brand'] ?? null;
            $item->base_price = $params['base_price'] ?? ($params['price'] ?? 0);
            $item->price = $params['price'] ?? $item->base_price;
            $item->quantity = $params['quantity'] ?? 0;
            $item->weight = $params['weight'] ?? 0;
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
            $variant->fill([
                'sku' => $variantData['sku'],
                'price' => $variantData['price'],
                'stock' => $variantData['stock'],
                'image' => $variantData['image'] ?? ($variantData['images'][0] ?? null),
                'images' => array_values(array_filter($variantData['images'] ?? [])),
            ]);
            $variant->save();
            $variant->attributeValues()->sync($variantData['attribute_value_ids'] ?? []);

            $keptVariantIds[] = $variant->id;
        }

        $product->variants()
            ->when($keptVariantIds !== [], fn ($query) => $query->whereNotIn('id', $keptVariantIds))
            ->delete();
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
}
