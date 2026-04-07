<?php

namespace App\Repositories\Product;

use Illuminate\Pipeline\Pipeline;
use App\Pipelines\SortCategoriesByHierarchy;
use App\Pipelines\HandleSlugHistory;
use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use App\Models\Product;
use Illuminate\Support\Arr;
use Inertia\Inertia;

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
        'created_at'
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
        if (in_array($task, ["admin-list-items", "admin-list-items-active"])) {

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
                    $q->select(['id', 'product_id', 'filename', 'disk', 'is_default'])
                        ->where('is_default', true);
                }
            ]);

            // Áp dụng các cột cần lấy và sắp xếp
            $query->select($this->FIELDSELECT)->orderBy('order', 'asc');

            // Nếu là task active thì thêm filter status = 1
            if ($task == "admin-list-items-active") {
                $query->where('status', 1);
            }

            return $query->get();
        }

        return null;
    }

    public function get($params = null, $options = null)
    {
        if ($options['task'] == 'get-item') {
            return $this->_model->with(['photos', 'translations', 'slugs'])->find($params['id']);
        }
        return null;
    }

    public function save($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (!$task) return false;
        if ($options['task'] == "admin-update-multi-status") {
            $ids = $params['aid'] ?? [];
            if (empty($ids)) return false;
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

            if (!$item) return false;
            // 2. Lưu thông tin cơ bản (Bảng products)
            $item->sku        = $params['sku'] ?? $item->sku;
            $item->price      = $params['price'] ?? 0;
            $item->quantity   = $params['quantity'] ?? 0;
            $item->weight     = $params['weight'] ?? 0;
            $item->status     = $params['status'] ?? 0;
            $item->is_stock   = $params['is_stock'] ?? true;
            $item->is_coupon  = $params['is_coupon'] ?? false;
            $item->order      = $params['order'] ?? 0;
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
            if (isset($params['photos']) && is_array($params['photos'])) {
                foreach ($params['photos'] as $index => $photoFile) {
                    if ($photoFile instanceof \Illuminate\Http\UploadedFile) {
                        $item->photos()->create([
                            'filename'   => $photoFile,
                            'disk'       => 'public',
                            'is_default' => ($index === 0 && $options['task'] == 'add-item'),
                            'sort'       => $index,
                        ]);
                    }
                }
            }
            // 6. Xử lý Slugs qua Pipeline (Unicode, History, Redirects)
            app(Pipeline::class)
                ->send([
                    'item' => $item,
                    'translations' => $translationsData
                ])
                ->through([
                    HandleSlugHistory::class,
                ])
                ->thenReturn();
            DB::commit();
            return $item;
        } catch (\Exception $e) {
            DB::rollBack();
            logger("Error save product: " . $e->getMessage());
            return false;
        }
    }

    public function delete($params = null, $options = null)
    {
        $task = $options['task'] ?? null;
        if (!$task) return false;
        if ($options['task'] == 'delete-item') {
            $item = $this->_model->find($params['id']);
            if ($item) {
                return $item->delete();
            }
        }

        if ($options['task'] == 'delete-items') {
            $ids = is_array($params['ids']) ? $params['ids'] : explode(",", $params['ids']);
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
