<?php

namespace App\Repositories\Media;

use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class MediaPositionEloquentRepository extends EloquentRepository implements MediaPositionRepositoryInterface
{

    private $FIELDSELECT = array('id', 'name', 'code',  'status');
    public $configPath;
    /**
     * get model
     * @return string
     */
    public function __construct()
    {
        parent::__construct();
        $this->configPath = config('image.path.photo');
    }

    public function getModel()
    {
        return \App\Models\MediaPosition::class;
    }

    public function lists($params = null, $options = null)
    {
        $data = null;
        if ($options['task'] == "admin-list-items") {
            $query = $this->_model->select($this->FIELDSELECT);
            $data = $query->orderBy('id', 'desc')->paginate($params['pagination']['totalItemsPerPage']);
        }
        if ($options['task'] == "admin-list-items-active") {
            $query = $this->_model->select($this->FIELDSELECT);
            $data = $query->where("status", 1)->orderBy('id', 'desc')->paginate();
        }
        return $data;
    }

    // @Override
    public function get($params = null, $options = null)
    {
        if ($options['task'] == 'get-item') {
            return $this->_model->select($this->FIELDSELECT)->find($params['id']);
        }
        return null;
    }

    // @Override
    public function save($params = null, $options = null)
    {
        $result = 0;
        if ($options['task'] == "admin-update-multi-status") {
            return $this->_model->whereIn('id', $params['aid'])->update(['status' => $params['value']]);
        }

        if ($options['task'] == 'change-status') {
            $status = ($params['status'] == 0) ? 1 : 0;
            return $this->_model->where('id', $params['id'])->update(['status' => $status]);
        }
        DB::beginTransaction();
        try {
            $item = ($options['task'] == 'add-item') ? new $this->_model : $this->_model->find($params['id']);

            if (!$item) return false;

            $item->fill([
                'name'   => $params['name'] ?? '',
                'code'   => $params['code'] ?? '',
                'status' => $params['status'] ?? 0,
            ]);

            $item->save();
            DB::commit();
            return $item;
        } catch (\Exception $e) {
            DB::rollBack();
            logger($e->getMessage());
            return false;
        }
    }

    // @Override
    public function delete($params = null, $options = null)
    {
        if ($options['task'] == 'delete-item') {
            $item = $this->_model->find($params['id']);
            if (!$item) return false;

            if (isset($item->picture) && !empty($item->picture)) {
                $filePath = public_path($this->configPath . '/' . $item->picture);
                if (File::exists($filePath)) File::delete($filePath);
            }

            return $item->delete();
        }
        if ($options['task'] == 'delete-items') {
            $ids = is_array($params['ids']) ? $params['ids'] : explode(",", $params['ids']);

            if (empty($ids)) return false;
            try {
                return $this->_model->whereIn('id', $ids)->delete();
            } catch (\Throwable $th) {
                return false;
            }
        }
        return false;
    }
}
