<?php

namespace App\Repositories\Language;

use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\DB;

class LanguageEloquentRepository extends EloquentRepository implements LanguageRepositoryInterface
{

    private $FIELDSELECT = array('id', 'name', 'code', 'photo',  'status');

    /**
     * get model
     * @return string
     */
    public function __construct()
    {
        parent::__construct();
    }

    public function getModel()
    {
        return \App\Models\Language::class;
    }

    public function lists($params = null, $options = null)
    {
        $data = null;
        if ($options['task'] == "admin-list-items") {
            $query = $this->_model->select($this->FIELDSELECT);
            $data = $query->orderBy('id', 'desc')->paginate($params['pagination']['totalItemsPerPage']);
        }
        return $data;
    }

    // @Override
    public function get($params = null, $options = null)
    {
        $data = null;
        if ($options['task'] == 'get-item') {
            $data = $this->_model->select($this->FIELDSELECT)->where('id', $params['id'])->first()->toArray();
        }
        return $data;
    }

    // @Override
    public function save($params = null, $options = null)
    {
        $result = 0;
        if ($options['task'] == "admin-update-multi-status") {
            if (isset($params['aid']) && count($params['aid']) > 0) {
                $result = $this->_model->whereIn('id', $params['aid'])->update(['status' => $params['value']]);
            }
        }
        if ($options['task'] == 'change-status') {
            $status = (isset($params['status']) && $params['status'] == 0) ? 1 : 0;
            $result = $this->_model->where('id', $params['id'])->update(['status' => $status]);
        }
        DB::beginTransaction();
        try {
            if ($options['task'] == 'add-item') {
                $row = new $this->_model;
            }

            if ($options['task'] == 'edit-item') {
                $row = $this->_model->where('id', $params['id'])->first();
            }
            $row->name = $params['name'];
            $row->code = $params['code'];
            $row->image = $params['image'];
            $row->status = isset($params['status']) ? 1 : 0;
            $row->save();
            $result = $row->id;
            DB::commit();
            return ($result > 0) ? $result : FALSE;
        } catch (\Exception $e) {
            DB::rollBack();
            return FALSE;
        }
    }

    // @Override
    public function delete($params = null, $options = null) {}
}
