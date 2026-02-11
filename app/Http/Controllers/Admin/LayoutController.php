<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\MainController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Lang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Redirect;
use Intervention\Image\Facades\Image;

class LayoutController extends MainController
{
    //
    protected $controllerView = 'Admin/Layout/';
    protected $controllerName = 'layout';
    protected $configPath = 'layout';

    public function __construct()
    {
        $configPath = config('image.path.photo');
        $this->configPath = $configPath;
        Inertia::share(['config_path' => $configPath]);
    }
    public function index()
    {
        //
        $sharedLangs = Inertia::getShared('langs');
        $languages = is_callable($sharedLangs) ? $sharedLangs() : $sharedLangs;
        foreach ($languages as $lang) {
            $pages[$lang['code']] = is_array(Lang::get('page', [], $lang['code']))
                ? Lang::get('page', [], $lang['code'])
                : Lang::get('page', [], 'en');
        }
        return Inertia::render($this->controllerView . 'Index', [
            'layout_items_home' => config('hancms.layout.items.home'),
            'layout_items_general' => config('hancms.layout.items.general'),
            'pages' => $pages
        ]);
    }
    public function store(Request $request)
    {
        //
        try {
            //code...
            $pages = $request->pages;
            foreach ($pages as $lang => $content) {
                // 1. Xác định đường dẫn thư mục và file
                $dir = lang_path($lang);
                $filePath = "$dir/page.php";

                // 2. Kiểm tra và tạo thư mục nếu chưa có (quyền 0755)
                if (!is_dir($dir)) {
                    mkdir($dir, 0755, true);
                }
                // 3. Chuẩn bị nội dung file PHP
                $content = preg_replace('/^array\s*\(/', '[', $content);
                $content = preg_replace('/\)$/', ']', $content);
                $fileContent = "<?php\n\nreturn " . var_export($content, true) . ";\n";
                // 4. Upload hình vào media
                self::uploadImage($content['logo']);
                self::uploadImage($content['favicon']);
                // 5. Ghi đè vào file label.php
                File::put(lang_path("$lang/page.php"), $fileContent);
            }
            // return Redirect::to(route('label.index'))->with('success',  __('hancms.message.success.edit', ['name' => __('hancms.label.name')]));
        } catch (\Throwable $th) {
            //throw $th;
            return Redirect::to(route('layout'))->with('error',  __('hancms.message.error.edit', ['name' => __('hancms.layout.name')]));
        }
    }

    public function uploadImage($photo)
    {
        if ($photo != '') {
            $filePathTmp = public_path($this->configPath['temp']);
            $filePath = public_path($this->configPath['path']);
            $fileName = $photo;
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
    }
}
