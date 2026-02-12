<?php

namespace App\Repositories\Media;

use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Intervention\Image\Facades\Image;
use App\Models\MediaBanner;
use Inertia\Inertia;

class MediaBannerEloquentRepository extends EloquentRepository implements MediaBannerRepositoryInterface
{
    // Cập nhật 'photo' thay cho 'picture'
    private $FIELDSELECT = ['id', 'photo', 'alias_link', 'status', 'order'];
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
        $query = $this->_model->with('translations')->select($this->FIELDSELECT);

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
            return $this->_model->with(['translations', 'positions'])->find($params['id']);
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
            $sharedLangs = Inertia::getShared('langs');
            $languages = is_callable($sharedLangs) ? $sharedLangs() : $sharedLangs;
            $locales = collect($languages)->map(function ($lang) {
                return is_object($lang) ? $lang->code : $lang['code'];
            })->toArray();

            config(['translatable.locales' => $locales]);
            $item = ($options['task'] == 'add-item') ? new $this->_model : $this->_model->find($params['id']);

            if (!$item) return false;

            $item->alias_link = $params['alias_link'] ?? '';
            $item->status     = $params['status'] ?? 0;
            $item->order      = $params['order'] ?? 0;
            if ($languages) {
                foreach ($languages as $lang) {
                    $locale = is_object($lang) ? $lang->code : $lang['code'];

                    if (isset($params[$locale])) {
                        foreach ($item->translatedAttributes as $attr) {
                            $item->translateOrNew($locale)->$attr = $params[$locale][$attr] ?? null;
                        }
                    }
                }
            }

            if (!empty($params['photo'])) {
                $item->photo = $this->uploadImage($params['photo']);
            }

            $item->save();

            if (isset($params['position_ids'])) {
                $item->positions()->sync($params['position_ids']);
            }

            DB::commit();
            return $item;
        } catch (\Exception $e) {
            DB::rollBack();
            logger("Error save MediaBanner: " . $e->getMessage());
            return false;
        }
    }

    public function delete($params = null, $options = null)
    {
        if ($options['task'] == 'delete-item') {
            $item = $this->_model->find($params['id']);
            if ($item) {
                $this->removeImage($item->photo);
                return $item->delete();
            }
        }

        if ($options['task'] == 'delete-items') {
            $ids = is_array($params['ids']) ? $params['ids'] : explode(",", $params['ids']);
            foreach ($ids as $id) {
                $this->delete(['id' => $id], ['task' => 'delete-item']);
            }
            return true;
        }
        return false;
    }

    private function uploadImage($fileName)
    {
        $pathTmp  = public_path($this->configPath['temp'] . '/' . $fileName);
        $pathMain = public_path($this->configPath['path']);

        if (File::exists($pathTmp)) {
            if (!File::exists($pathMain)) {
                File::makeDirectory($pathMain, 0755, true);
            }

            Image::make($pathTmp)->save($pathMain . '/' . $fileName);
            File::delete($pathTmp);
            return $fileName;
        }

        return $fileName;
    }


    private function removeImage($fileName)
    {
        if (!$fileName) return;
        $fullPath = public_path($this->configPath['path'] . '/' . $fileName);
        if (File::exists($fullPath)) {
            File::delete($fullPath);
        }
    }
}
