<?php

namespace App\Repositories\Category;

use Illuminate\Pipeline\Pipeline;
use App\Pipelines\SortCategoriesByHierarchy;
use App\Pipelines\HandleSlugHistory;
use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use App\Models\Category;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryEloquentRepository extends EloquentRepository implements CategoryRepositoryInterface
{
    private $FIELDSELECT = ['id', 'photo', 'parent_id', 'status', 'order'];
    protected $configPath;

    public function __construct()
    {
        parent::__construct();
        $this->configPath = config('image.path.category');
    }


    public function getModel()
    {
        return Category::class;
    }

    public function lists($params = null, $options = null)
    {
        $currentLocale = app()->getLocale();
        $task = $options['task'] ?? null;

        // Kiểm tra nếu là các task quản trị danh mục
        if (in_array($task, ["admin-list-items", "admin-list-items-active"])) {

            $query = $this->_model->with([
                'translations' => function ($q) use ($currentLocale) {
                    // Phải có category_id để Eloquent map được quan hệ
                    $q->select(['id', 'category_id', 'locale', 'name'])
                        ->where('locale', $currentLocale);
                }
            ]);

            // FIELDSELECT bắt buộc phải có 'id' và 'parent_id' để Pipeline hoạt động
            $query->select($this->FIELDSELECT)->orderBy('order', 'asc');

            if ($task == "admin-list-items-active") {
                $categories = $query->where("status", 1)->get();

                // Xử lý phân cấp qua Pipeline
                return app(\Illuminate\Pipeline\Pipeline::class)
                    ->send($categories)
                    ->through([
                        SortCategoriesByHierarchy::class,
                    ])
                    ->thenReturn();
            }

            return $query->get();
        }

        return null;
    }

    public function get($params = null, $options = null)
    {
        if ($options['task'] == 'get-item') {
            return $this->_model->with(['translations', 'slugs'])->find($params['id']);
        }
        return null;
    }

    public function save($params = null, $options = null)
    {
        if ($options['task'] == "admin-update-multi-status") {
            return $this->_model->whereIn('id', $params['aid'])->update(['status' => $params['value']]);
        }

        if ($options['task'] == 'change-status') {
            $status = ($params['status'] == 0) ? 1 : 0;
            return $this->_model->where('id', $params['id'])->update(['status' => $status]);
        }
        DB::beginTransaction();
        try {
            $item = ($options['task'] == 'add-item')
                ? new $this->_model
                : $this->_model->find($params['id']);

            if (!$item) return false;
            // 1. Save Basic Info
            $item->status = $params['status'] ?? 0;
            $item->order  = $params['order'] ?? 0;
            $item->photo  = $params['photo'] ?? null;
            $item->parent_id  = ($params['parent_id'] == 0 || empty($params['parent_id'])) ? null : $params['parent_id'];;
            $item->save();
            // 2. Save Translations (exclude slug/is_default to let Pipe handle it)
            $translationsData = $params['translations'] ?? [];
            foreach ($translationsData as $locale => $data) {
                $translation = $item->translateOrNew($locale);
                $translation->fill(\Illuminate\Support\Arr::except($data, ['slug', 'is_default']));
                $translation->save();
            }
            // 3. Process Slugs via Pipeline
            // This will handle Unicode, History, and Redirects
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
            logger("Error save category: " . $e->getMessage());
            return false;
        }
    }

    public function delete($params = null, $options = null)
    {
        if ($options['task'] == 'delete-item') {
            $item = $this->_model->find($params['id']);
            if ($item) {
                return $item->delete();
            }
        }

        if ($options['task'] == 'delete-items') {
            $ids = is_array($params['ids']) ? $params['ids'] : explode(",", $params['ids']);
            return $this->_model->whereIn('id', $ids)->get()->each->delete();
        }
        return false;
    }
}
