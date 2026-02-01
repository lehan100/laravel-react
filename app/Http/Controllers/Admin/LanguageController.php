<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\MainController;
use App\Http\Resources\LanguageCollection;
use Illuminate\Support\Facades\Request;
use App\Repositories\Language\LanguageRepositoryInterface as RepositoryInterface;
use App\Models\Languages;
use Inertia\Inertia;
use Inertia\Response;

class LanguageController extends MainController
{
    protected $controllerView = 'Admin/Language/';
    protected $controllerName = 'language';
    protected $mainModel;
    public function __construct(RepositoryInterface $repository)
    {
        $this->mainModel = $repository;
    }
    /**
     * Display a listing of the resource.
     */

    public function index(): Response
    {
        $this->params = array_merge(Request::all(), $this->params);
        $items =  $this->mainModel->lists($this->params, ['task' => 'admin-list-items']);
        return Inertia::render($this->controllerView . 'Index', [
            'items' => new LanguageCollection($items)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render($this->controllerView . 'Created', [
        ]);
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
