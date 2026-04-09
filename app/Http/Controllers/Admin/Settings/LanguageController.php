<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\MainController;
use App\Http\Requests\Settings\LanguageStoreRequest;
use App\Http\Requests\Settings\LanguageUpdateRequest;
use App\Http\Resources\Settings\LanguageCollection;
use App\Http\Resources\Settings\LanguageResource;
use App\Models\Settings\Language;
use Illuminate\Support\Facades\Request;
use App\Repositories\Language\LanguageRepositoryInterface as RepositoryInterface;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class LanguageController extends MainController
{
    protected $controllerView = 'Admin/Language/';
    protected $controllerName = 'language';
    protected $mainModel;
    public function __construct(RepositoryInterface $repository)
    {
        $this->mainModel = $repository;
        $configPath = config('image.path.photo');
        Inertia::share(['config_path' => $configPath]);
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
        return Inertia::render($this->controllerView . 'Created', []);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(LanguageStoreRequest $request): RedirectResponse
    {
        //
        try {
            $params = $request->all();
            $language = $this->mainModel->save($params, ['task' => 'add-item']);
            if ($params['undo'] == 1) {
                return Redirect::to(route('languages.index'))->with('success', __('hancms.message.success.created', ['name' => __('hancms.languages.name')]));
            }
            return Redirect::route('languages.edit', $language->id)->with('success', __('hancms.message.success.created', ['name' => __('hancms.languages.name')]));
        } catch (\Throwable $th) {
            //throw $th;
            return Redirect::back()->with('error',  __('hancms.message.error.created', ['name' => __('hancms.languages.name')]));
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
    public function edit(Language $language)
    {
        return Inertia::render($this->controllerView . 'Edit', [
            'item' => new LanguageResource($language),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(LanguageUpdateRequest $request, string $id)
    {
        //
        try {
            $params = $request->all();
            $params['id'] = $id;
            $language = $this->mainModel->save($params, ['task' => 'edit-item']);
            if ($params['undo'] == 1) {
                return Redirect::to(route('languages.index'))->with('success', __('hancms.message.success.edit', ['name' => __('hancms.languages.name')]));
            }
            return Redirect::route('languages.edit', $language->id)->with('success', __('hancms.message.success.edit', ['name' => __('hancms.languages.name')]));
        } catch (\Throwable $th) {
            //throw $th;
            return Redirect::back()->with('error',  __('hancms.message.error.edit', ['name' => __('hancms.languages.name')]));
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        try {
            $params['id'] = $id;
            $this->mainModel->delete($params, ['task' => 'delete-item']);
            return Redirect::back()->with('success', __('hancms.message.success.deleted', ['name' => __('hancms.languages.name')]));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }
    public function destroyMany(Request $request): RedirectResponse
    {
        try {
            $params = $request::all();
            $this->mainModel->delete($params, ['task' => 'delete-items']);
            return Redirect::route('languages.index')->with('success', __('hancms.message.success.deleted', ['name' => __('hancms.languages.name')]));
        } catch (\Throwable $th) {
            return Redirect::route('languages.index')->with('error', __('hancms.message.error.deleted'));
        }
    }
}
