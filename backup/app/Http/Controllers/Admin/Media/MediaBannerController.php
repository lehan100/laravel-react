<?php

namespace App\Http\Controllers\Admin\Media;

use App\Http\Controllers\MainController;
use App\Http\Requests\Media\MediaBannerRequest;
use App\Http\Resources\Media\MediaBannerCollection;
use App\Http\Resources\Media\MediaBannerResource;
use App\Http\Resources\Media\MediaPositionCollection;
use App\Models\Media\MediaBanner;
use App\Repositories\Media\MediaBannerRepositoryInterface as RepositoryInterface;
use App\Repositories\Media\MediaPositionRepositoryInterface;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\RedirectResponse;

class MediaBannerController extends MainController
{
    protected string $controllerView = 'Admin/MediaBanner/';

    protected string $routeName = 'media-banner.';

    protected RepositoryInterface $mainModel;

    protected MediaPositionRepositoryInterface $mediaPosition;

    public function __construct(RepositoryInterface $repository, MediaPositionRepositoryInterface $mediaPosition)
    {
        parent::__construct();
        $this->mainModel = $repository;
        $this->mediaPosition = $mediaPosition;
        $configPath = config('image.path.photo');
        $itemPositions = $this->mediaPosition->lists(null, ['task' => 'admin-list-items-active']);
        Inertia::share(['config_path' => $configPath, 'positions' => new MediaPositionCollection($itemPositions)]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $items = $this->mainModel->lists($this->params, ['task' => 'admin-list-items']);

        return Inertia::render($this->controllerView.'Index', [
            'items' => new MediaBannerCollection($items),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $itemPositions = $this->mediaPosition->lists(null, ['task' => 'admin-list-items-active']);

        return Inertia::render($this->controllerView.'Created', []);
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
                return Redirect::to(route($this->routeName.'index'))->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.media.banner.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $banner->id)->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.media.banner.name'))]));
        } catch (\Throwable $th) {
            // throw $th;
            return Redirect::back()->with('error', __('hancms.message.error.created', ['name' => mb_strtolower(__('hancms.media.banner.name'))]));
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
    public function edit(MediaBanner $mediaBanner)
    {
        //
        return Inertia::render($this->controllerView.'Edit', [
            'item' => new MediaBannerResource($mediaBanner),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MediaBannerRequest $request, string $id)
    {
        //
        try {
            $params = $request->all();
            $params['id'] = $id;
            $banner = $this->mainModel->save($params, ['task' => 'edit-item']);
            if ($params['undo'] == 1) {
                return Redirect::to(route($this->routeName.'index'))->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.media.banner.name'))]));
            }

            return Redirect::route($this->routeName.'edit', $banner->id)->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.media.banner.name'))]));
        } catch (\Throwable $th) {
            // throw $th;
            return Redirect::back()->with('error', __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.media.banner.name'))]));
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        try {
            $params['id'] = $id;
            $this->mainModel->delete($params, ['task' => 'delete-item']);

            return Redirect::back()->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.media.banner.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        try {
            $params = $request::all();
            $this->mainModel->delete($params, ['task' => 'delete-items']);

            return Redirect::route($this->routeName.'index')->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.media.banner.name'))]));
        } catch (\Throwable $th) {
            return Redirect::route($this->routeName.'index')->with('error', __('hancms.message.error.deleted'));
        }
    }
}
