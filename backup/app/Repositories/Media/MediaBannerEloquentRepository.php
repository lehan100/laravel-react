<?php

namespace App\Repositories\Media;

use App\Models\Media\MediaBanner;
use App\Repositories\EloquentRepository;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class MediaBannerEloquentRepository extends EloquentRepository implements MediaBannerRepositoryInterface
{
    // Cập nhật 'photo' thay cho 'picture'
    private $FIELDSELECT = ['id',  'status', 'order'];

    protected $configPath;

    public function __construct()
    {
        parent::__construct();
        $this->configPath = config('image.path.photo');
    }

    public function getModel()
    {
        return MediaBanner::class;
    }

    public function lists($params = null, $options = null)
    {
        $query = $this->_model->with(['translations', 'positions'])->select($this->FIELDSELECT);

        if ($options['task'] == 'admin-list-items') {
            return $query->orderBy('id', 'desc')
                ->paginate($params['pagination']['totalItemsPerPage'] ?? 10);
        }

        if ($options['task'] == 'admin-list-items-active') {
            return $query->where('status', 1)->orderBy('order', 'asc')->get();
        }

        return null;
    }

    public function get($params = null, $options = null)
    {
        if ($options['task'] == 'get-item') {
            return $this->_model->with(['translations', 'positions'])->find($params['id']);
        }

        return null;
    }

    public function save($params = null, $options = null)
    {
        if ($options['task'] == 'admin-update-multi-status') {
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

        if (! $item) {
            return false;
        }

        $item->status = $params['status'] ?? 0;
        $item->order = $params['order'] ?? 0;
        $item->save();
        $translationsData = $params['translations'] ?? [];
        $locales = array_keys($translationsData);
        config(['translatable.locales' => $locales]);

        foreach ($locales as $locale) {
            if (isset($translationsData[$locale])) {
                $data = $translationsData[$locale];
                $translation = $item->translateOrNew($locale);
                // foreach ($item->translatedAttributes as $attr) {
                //     if ($attr !== 'photo') {
                //         $translation->$attr = $data[$attr] ?? null;
                //     }
                // }
                $translation->fill(Arr::except($data, ['photo']));
                if (! empty($data['photo'])) {
                    $translation->photo = $data['photo'];
                }
                $translation->locale = $locale;
                $translation->media_banner_id = $item->id;
                $translation->save();
            }
        }

        if (isset($params['position_ids'])) {
            $item->positions()->sync($params['position_ids']);
        }

        // DB::commit();
        return $item;
        // } catch (\Exception $e) {
        //     DB::rollBack();
        //     logger("Error save MediaBanner: " . $e->getMessage());
        //     return false;
        // }
    }

    public function delete($params = null, $options = null)
    {
        if ($options['task'] == 'delete-item') {
            $item = $this->_model->find($params['id']);
            if ($item) {
                return $item->forceDelete();
            }
        }

        if ($options['task'] == 'delete-items') {
            $ids = is_array($params['ids']) ? $params['ids'] : explode(',', $params['ids']);

            return $this->_model->whereIn('id', $ids)->get()->each->forceDelete();
        }

        return false;
    }
}
