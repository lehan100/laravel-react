<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\MainController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Lang;

class LayoutController extends MainController
{
    //
    protected $controllerView = 'Admin/Layout/';
    protected $controllerName = 'layout';
    public function __construct()
    {
        $configPath = config('image.path.photo');
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
            'layout_items' => config('hancms.layout.items'),
            'pages' => $pages
        ]);
    }
}
