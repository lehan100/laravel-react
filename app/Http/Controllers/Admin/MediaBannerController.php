<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\MainController;
use App\Http\Requests\MediaBannerRequest;
use App\Http\Resources\MediaBannerCollection;
use App\Http\Resources\MediaPositionCollection;
use App\Repositories\Media\MediaBannerRepositoryInterface as RepositoryInterface;
use App\Repositories\Media\MediaPositionRepositoryInterface;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MediaBannerController extends MainController
{
    protected $controllerView = 'Admin/MediaBanner/';
    protected $routeName = 'media-banner.';
    protected $mainModel;
    protected $mediaPosition;
    public function __construct(RepositoryInterface $repository, MediaPositionRepositoryInterface $mediaPosition)
    {
        $this->mainModel = $repository;
        $this->mediaPosition = $mediaPosition;
        $configPath = config('image.path.photo');
        Inertia::share(['config_path' => $configPath]);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $items = $this->mainModel->lists($this->params, ['task' => 'admin-list-items']);
        return Inertia::render($this->controllerView . 'Index', [
            'items'  => new MediaBannerCollection($items)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $itemPositions = $this->mediaPosition->lists(null, ['task' => 'admin-list-items-active']);
        return Inertia::render($this->controllerView . 'Created', [
            'positions' => new MediaPositionCollection($itemPositions)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MediaBannerRequest $request)
    {

        try {
            $params = $request->all();
            $banner = $this->mainModel->save($params, ['task' => 'add-item']);
            if ($params['undo'] == 1) {
                return Redirect::to(route($this->routeName . 'index'))->with('success', __('hancms.message.success.created', ['name' => __('hancms.media.banner.name')]));
            }
            return Redirect::route($this->routeName . 'edit', $banner->id)->with('success', __('hancms.message.success.created', ['name' => __('hancms.media.banner.name')]));
        } catch (\Throwable $th) {
            //throw $th;
            return Redirect::back()->with('error',  __('hancms.message.error.created', ['name' => __('hancms.media.banner.name')]));
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
