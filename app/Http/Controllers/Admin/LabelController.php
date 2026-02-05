<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\MainController;
use App\Http\Resources\LanguageCollection;
use App\Repositories\Language\LanguageRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Illuminate\Support\Facades\Lang;

class LabelController  extends MainController
{
    protected $controllerView = 'Admin/Label/';
    protected $controllerName = 'label';
    protected $languageModel;
    public function __construct(LanguageRepositoryInterface $languageModel)
    {
        $this->languageModel = $languageModel;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $languages = $this->languageModel->lists($this->params, ['task' => 'admin-list-items']);
        foreach ($languages as $lang) {
            $labels[$lang['code']] = is_array(Lang::get('label', [], $lang['code']))
                ? Lang::get('label', [], $lang['code'])
                : Lang::get('label', [], 'en');
        }
        return Inertia::render($this->controllerView . 'Index', [
            'lang' => new LanguageCollection($languages),
            'labels' => $labels
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
