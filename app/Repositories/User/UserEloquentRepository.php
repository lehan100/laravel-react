<?php

namespace App\Repositories\User;

use App\Repositories\EloquentRepository;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

class UserEloquentRepository extends EloquentRepository implements UserRepositoryInterface
{

    private $FIELDSELECT = array('id', 'first_name', 'last_name', 'email',  'status', 'owner', 'photo','group');
    private $USER_GROUP;

    /**
     * get model
     * @return string
     */
    public function __construct()
    {
        parent::__construct();
        $this->USER_GROUP = config('configs.user_group_name');
    }

    public function getModel()
    {
        return \App\Models\User::class;
    }

    public function lists($params = null, $options = null)
    {
        $data = null;
        if ($options['task'] == "admin-list-items") {
            $query = $this->_model->select($this->FIELDSELECT)
                ->orderBy('id', 'desc');
            $data = $query->paginate($params['pagination']['totalItemsPerPage']);
        }
        return $data;
    }

    // @Override
    public function get($params = null, $options = null)
    {
        $result = null;
        if ($options['task'] == 'user-auth-login') {
            $password = md5($params['password']);
            $result = $this->_model->select($this->FIELDSELECT)->where([
                ['status', "=", 1],
                ['owner', "=", 1],
                ['email', "=", $params['email']],
                ['password', "=", $password],
            ])->first();
        }
        if ($options['task'] == 'get-item') {
            array_push($this->FIELDSELECT, "password");
            $result = $this->_model->select($this->FIELDSELECT)->where('id', $params['id'])->first()->toArray();
        }
        return $result;
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
            $row->name = $this->USER_GROUP[$params['group']];
            $row->first_name = $params['first_name'];
            $row->last_name = $params['last_name'];
            $row->email = $params['email'];
            $row->owner = $params['group'];
            $row->password = ($params['password']) ? bcrypt($params['password']) : $params['password_old'];
            $row->status = isset($params['status']) ? 1 : 0;
            $row->save();
            $result = $row->id;
            $role = Role::firstOrCreate(['name' => $this->USER_GROUP[$params['group']]]);
            foreach ((new Role())->pluck('name')->toArray() as $roleName) {
                $row->removeRole($roleName);
            }
            $row->assignRole([$role->id]);
            DB::commit();
            return ($result > 0) ? $result : FALSE;
        } catch (\Exception $e) {
            DB::rollBack();
            return FALSE;
        }
    }

    // @Override
    public function delete($params = null, $options = null)
    {
        $result = 0;
        if ($options['task'] == 'delete-item-multi') {
            if (isset($params['aid']) && count($params['aid']) > 0) {
                $result = $this->_model->whereIn('id', $params['aid'])->delete();
            }
        }
        if ($options['task'] == 'delete-item') {
            if (isset($params['id'])) {
                $result = $this->_model->where('id', $params['id'])->delete();
            }
        }
        return ($result > 0) ? TRUE : FALSE;
    }
}
