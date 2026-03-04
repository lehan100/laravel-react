<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\MainController;
use App\Http\Resources\MediaPositionCollection;
use App\Repositories\Media\MediaPositionRepositoryInterface as RepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
class MediaPositionController extends MainController
{
    protected $controllerView = 'Admin/MediaPosition/';
    protected $controllerName = 'label';
    protected $mainModel;
    /**
     * Display a listing of the resource.
     */
    public function __construct(RepositoryInterface $repository)
    {
        $this->mainModel = $repository;
        $configPath = config('image.path.photo');
        Inertia::share(['config_path' => $configPath]);
    }
    public function index()
    {
        //
        $items = $this->mainModel->lists($this->params, ['task' => 'admin-list-items']);
        return Inertia::render($this->controllerView . 'Index', [
            'items' => new MediaPositionCollection($items)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
         return Inertia::render($this->controllerView . 'Created', []);
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
