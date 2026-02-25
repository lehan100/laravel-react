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
                $dir = lang_path($lang);
                $filePath = "$dir/page.php";
                $oldContent = file_exists($filePath) ? include($filePath) : [];
                if (!is_dir($dir)) {
                    mkdir($dir, 0755, true);
                }
                $content = preg_replace('/^array\s*\(/', '[', $content);
                $content = preg_replace('/\)$/', ']', $content);
                //$fileContent = "<?php\n\nreturn " . var_export($content, true) . ";\n";
                $this->uploadImage($content['logo'], $oldContent['logo'] ?? null);
                $this->uploadImage($content['favicon'], $oldContent['favicon'] ?? null);
                $fileContent = "<?php\n\nreturn " . var_export($content, true) . ";\n";
                File::put($filePath, $fileContent);
                if (function_exists('opcache_invalidate')) {
                    opcache_invalidate($filePath, true);
                }
            }
            return Redirect::back()->with('success', __('hancms.message.success.edit', ['name' => __('hancms.layout.name')]));
        } catch (\Throwable $th) {
            //throw $th;
            return Redirect::to(route('layout'))->with('error', __('hancms.message.error.edit', ['name' => __('hancms.layout.name')]));
        }
    }

    public function uploadImage($photo, $oldPhoto = null)
    {
        if ($photo != '') {
            $filePathTmp = public_path($this->configPath['temp']);
            $filePath = public_path($this->configPath['path']);
            $fileName = $photo;

            if (!file_exists($filePath)) {
                mkdir($filePath, 0755, true);
            }
            if (file_exists($filePathTmp . '/' . $fileName)) {
                if ($oldPhoto && $oldPhoto !== $photo) {
                    $oldFilePath = $filePath . '/' . $oldPhoto;
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath);
                    }
                }
                Image::make($filePathTmp . '/' . $fileName)->save($filePath . '/' . $fileName);

            }
            if (file_exists($filePathTmp . '/' . $fileName) && file_exists($filePath . '/' . $fileName)) {
                unlink($filePathTmp . '/' . $fileName);

            }
        }
    }
}
