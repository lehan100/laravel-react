<?php

namespace App\Repositories\Language;

use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;

class LanguageEloquentRepository extends EloquentRepository implements LanguageRepositoryInterface
{

    private $FIELDSELECT = array('id', 'name', 'code', 'photo',  'status');
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
        return \App\Models\Language::class;
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
            $row->name = isset($params['name']) ? $params['name'] : '';
            $row->code = isset($params['code']) ? $params['code'] : '';
            $row->photo = isset($params['photo']) ? $params['photo'] : '';
            $row->status = isset($params['status']) ? $params['status'] : 0;
            $row->save();
            if ($params['photo']) {
                $filePathTmp = public_path($this->configPath['temp']);
                $filePath = public_path($this->configPath['path']);
                $fileName = $params['photo'];
                if (!file_exists($filePath)) {
                    mkdir($filePath, 0755, true);
                }
                if (file_exists($filePathTmp . '/' . $fileName)) {
                    Image::make($filePathTmp . '/' . $fileName)->save($filePath . '/' . $fileName);
                }
                if (file_exists($filePathTmp . '/' . $fileName) && file_exists($filePath . '/' . $fileName)) {
                    unlink($filePathTmp . '/' . $fileName);
                }
            }
            if ($row) {
                self::duplicateLanguage($params['code']);
            }
            DB::commit();
            return $row;
        } catch (\Exception $e) {
            DB::rollBack();
            return FALSE;
        }
    }

    // @Override
    public function delete($params = null, $options = null)
    {
        if ($options['task'] == 'delete-item') {
            if (isset($params['id'])) {
                $item = self::get($params, ['task' => 'get-item']);

                $delete = $this->_model->where('id', $params['id'])->delete();
                if ($item && $delete) {
                    $filePath = public_path($this->configPath['path']);
                    $fileName = $item['photo'];
                    $photoPath = $filePath . '/' . $fileName;
                    if (File::exists($photoPath)) {

                        File::delete($photoPath);
                    }
                }
                return $delete;
            }
        }
        if ($options['task'] == 'delete-items') {
            if (isset($params['ids'])) {
                try {
                    $params['ids'] = explode(",", $params['ids']);
                    foreach ($params['ids'] as $id) {
                        $delete = self::delete(['id' => $id], ['task' => 'delete-item']);
                    }
                    return true;
                } catch (\Throwable $th) {
                    return false;
                }
            }
        }
        return false;
    }

    public function duplicateLanguage($newLocale = 'en')
    {
        // lang_path() sẽ trỏ tới thư mục /lang ở gốc dự án
        $source = lang_path('en');
        $destination = lang_path($newLocale);

        // 1. Kiểm tra thư mục 'en' có tồn tại không
        if (!File::exists($source)) {
            // Nếu không thấy, có thể do chưa publish. Thử chạy lệnh này:
            Artisan::call('lang:add ' . $newLocale);

            // Nếu vẫn không thấy thì báo lỗi
            if (!File::exists($source)) {
                return response()->json(['error' => 'Thư mục /lang/en không tồn tại.'], 404);
            }
        }

        // 2. Kiểm tra tránh ghi đè ngôn ngữ đã có
        if (File::exists($destination)) {
            return response()->json(['warning' => "Ngôn ngữ [$newLocale] đã tồn tại."]);
        }

        try {
            // 3. Tiến hành copy toàn bộ thư mục
            File::copyDirectory($source, $destination);

            // 4. Copy thêm file en.json nếu có (thường nằm trực tiếp trong /lang)
            $jsonSource = lang_path('en.json');
            if (File::exists($jsonSource)) {
                File::copy($jsonSource, lang_path("$newLocale.json"));
            }
            Artisan::call('lang:add ' . $newLocale);
            return response()->json(['success' => "Đã tạo xong ngôn ngữ $newLocale tại " . lang_path()]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
