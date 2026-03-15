<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\MainController;
use App\Http\Requests\MediaPositionStoreRequest;
use App\Http\Requests\MediaPositionUpdateRequest;
use App\Http\Resources\MediaPositionCollection;
use App\Http\Resources\MediaPositionResource;
use App\Models\MediaPosition;
use App\Repositories\Media\MediaPositionRepositoryInterface as RepositoryInterface;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpFoundation\RedirectResponse;

class MediaPositionController extends MainController
{
    protected $controllerView = 'Admin/MediaPosition/';
    protected $routeName = 'media-position.';
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
    public function store(MediaPositionStoreRequest $request)
    {
        //
        try {
            $params = $request->all();
            $language = $this->mainModel->save($params, ['task' => 'add-item']);
            if ($params['undo'] == 1) {
                return Redirect::to(route($this->routeName . 'index'))->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.media.position.name'))]));
            }
            return Redirect::route($this->routeName . 'edit', $language->id)->with('success', __('hancms.message.success.created', ['name' => mb_strtolower(__('hancms.media.position.name'))]));
        } catch (\Throwable $th) {
            //throw $th;
            return Redirect::back()->with('error',  __('hancms.message.error.created', ['name' => mb_strtolower(__('hancms.media.position.name'))]));
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
    public function edit(MediaPosition $mediaPosition)
    {
        //
        return Inertia::render($this->controllerView . 'Edit', [
            'item' => new MediaPositionResource($mediaPosition),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(MediaPositionUpdateRequest $request, string $id)
    {
        //
        try {
            $params = $request->all();
            $params['id'] = $id;
            $language = $this->mainModel->save($params, ['task' => 'edit-item']);
            if ($params['undo'] == 1) {
                return Redirect::to(route($this->routeName . 'index'))->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.media.position.name'))]));
            }
            return Redirect::route($this->routeName . 'edit', $language->id)->with('success', __('hancms.message.success.edit', ['name' => mb_strtolower(__('hancms.media.position.name'))]));
        } catch (\Throwable $th) {
            //throw $th;
            return Redirect::back()->with('error',  __('hancms.message.error.edit', ['name' => mb_strtolower(__('hancms.media.position.name'))]));
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
            return Redirect::back()->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.media.position.name'))]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }
    public function destroyMany(Request $request): RedirectResponse
    {
        try {
            $params = $request::all();
            $this->mainModel->delete($params, ['task' => 'delete-items']);
            return Redirect::route($this->routeName . 'index')->with('success', __('hancms.message.success.deleted', ['name' => mb_strtolower(__('hancms.media.position.name'))]));
        } catch (\Throwable $th) {
            return Redirect::route($this->routeName . 'index')->with('error', __('hancms.message.error.deleted'));
        }
    }
}
