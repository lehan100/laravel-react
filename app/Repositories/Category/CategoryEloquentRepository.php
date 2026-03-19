<?php

namespace App\Repositories\Category;

use Illuminate\Pipeline\Pipeline;
use App\Pipelines\SortCategoriesByHierarchy;
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
        if ($options['task'] == "admin-list-items") {
            return $this->_model->with([
                'translations' => function ($q) use ($currentLocale) {
                    $q->select(['id', 'category_id', 'locale', 'name'])
                        ->where('locale', $currentLocale);
                }
            ])
                ->select($this->FIELDSELECT)
                ->orderBy('order', 'asc')
                ->get();
        }


        if ($options['task'] == "admin-list-items-active") {
            $categories = $this->_model->with([
                'translations' => function ($q) use ($currentLocale) {
                    $q->select(['id', 'category_id', 'locale', 'name'])
                        ->where('locale', $currentLocale);
                }
            ])
                ->select($this->FIELDSELECT)
                ->where("status", 1)
                ->orderBy('order', 'asc')
                ->get();
            return app(Pipeline::class)
                ->send($categories)
                ->through([
                    SortCategoriesByHierarchy::class,
                ])
                ->thenReturn();
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
        // DB::beginTransaction();
        // try {
        $item = ($options['task'] == 'add-item')
            ? new $this->_model
            : $this->_model->find($params['id']);

        if (!$item) return false;

        $item->status = $params['status'] ?? 0;
        $item->order  = $params['order'] ?? 0;
        $item->photo  = $params['photo'] ?? null;
        $item->parent_id  = ($params['parent_id'] == 0 || empty($params['parent_id'])) ? null : $params['parent_id'];;
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
                if (isset($data['slug']) && !empty($data['slug'])) {
                    $newSlug = preg_replace('/\s+/u', '-', trim($data['slug']));
                    $item->slugs()->updateOrCreate(
                        [
                            'locale'         => $locale,
                            'is_default'     => true,
                        ],
                        [
                            'slug' => $newSlug
                        ]
                    );
                }
            }
        }

        // DB::commit();
        return $item;
        // } catch (\Exception $e) {
        //     DB::rollBack();
        //     logger("Error save category: " . $e->getMessage());
        //     return false;
        // }
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
