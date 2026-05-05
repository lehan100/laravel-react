<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\MainController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class LabelController extends MainController
{
    protected string $controllerView = 'Admin/Label/';

    protected string $controllerName = 'label';

    public function __construct()
    {
        parent::__construct();
        $configPath = config('image.path.photo');
        Inertia::share(['config_path' => $configPath]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $sharedLangs = Inertia::getShared('langs');
        $languages = is_callable($sharedLangs) ? $sharedLangs() : $sharedLangs;
        foreach ($languages as $lang) {
            $labels[$lang['code']] = is_array(Lang::get('label', [], $lang['code']))
                ? Lang::get('label', [], $lang['code'])
                : Lang::get('label', [], 'en');
        }

        return Inertia::render($this->controllerView.'Index', [
            'labels' => $labels,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        try {
            // code...
            $labels = $request->labels;
            foreach ($labels as $lang => $content) {
                // 1. Xác định đường dẫn thư mục và file
                $dir = lang_path($lang);
                $filePath = "$dir/label.php";

                // 2. Kiểm tra và tạo thư mục nếu chưa có (quyền 0755)
                if (! is_dir($dir)) {
                    mkdir($dir, 0755, true);
                }
                // 3. Chuẩn bị nội dung file PHP
                $content = preg_replace('/^array\s*\(/', '[', $content);
                $content = preg_replace('/\)$/', ']', $content);
                $fileContent = "<?php\n\nreturn ".var_export($content, true).";\n";

                // 4. Ghi đè vào file label.php
                File::put(lang_path("$lang/label.php"), $fileContent);
            }
            // return Redirect::to(route('label.index'))->with('success',  __('hancms.message.success.edit', ['name' => __('hancms.label.name')]));
        } catch (\Throwable $th) {
            // throw $th;
            return Redirect::to(route('label.index'))->with('error', __('hancms.message.error.edit', ['name' => __('hancms.label.name')]));
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
