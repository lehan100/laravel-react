<?php

namespace App\Repositories\Category;

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
        $query = $this->_model->with(['translations', 'slugs'])->select($this->FIELDSELECT);

        if ($options['task'] == "admin-list-items") {
            return $query->orderBy('id', 'desc')
                ->paginate($params['pagination']['totalItemsPerPage'] ?? 10);
        }

        if ($options['task'] == "admin-list-items-active") {
            return $query->where("status", 1)->orderBy('order', 'asc')->get();
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

            $item->status = $params['status'] ?? 0;
            $item->order  = $params['order'] ?? 0;
            $item->photo  = $params['photo'] ?? null;
            $item->parent_id  = $params['parent_id'] ?? null;
            $item->save();
            $translationsData = $params['translations'] ?? [];
            $locales = array_keys($translationsData);
            config(['translatable.locales' => $locales]);

            foreach ($locales as $locale) {
                if (isset($translationsData[$locale])) {
                    $data = $translationsData[$locale];
                    $translation = $item->translateOrNew($locale);
                    $translation->fill(\Illuminate\Support\Arr::except($data, ['slug', 'is_default']));
                    $translation->save();
                    if (isset($data['slug'])) {
                        $item->slugs()->updateOrCreate(
                            ['locale' => $locale, 'is_default' => true],
                            ['slug' => Str::slug($data['slug'])]
                        );
                    }
                }
            }

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
