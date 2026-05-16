<?php

namespace App\Http\Controllers\Admin\Catalog;

use App\Http\Controllers\MainController;
use App\Http\Requests\Catalog\AttributeRequest;
use App\Http\Resources\Catalog\AttributeCollection;
use App\Http\Resources\Catalog\AttributeResource;
use App\Repositories\Attribute\AttributeRepositoryInterface as RepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AttributeController extends MainController
{
    protected string $controllerView = 'Admin/Attribute/';

    protected string $routeName = 'attribute.';

    protected RepositoryInterface $mainModel;

    private string $translationPath = 'hancms.catalog.attribute.messages.';

    public function __construct(RepositoryInterface $repository)
    {
        parent::__construct();
        $this->mainModel = $repository;

        $this->middleware(function ($request, $next) {
            $configPath = config('image.path.attribute');
            $languageConfigPath = config('image.path.photo');

            Inertia::share([
                'config_path' => $configPath,
                'languageConfigPath' => $languageConfigPath,
            ]);

            return $next($request);
        });
    }

    public function index()
    {
        $items = $this->mainModel->lists(null, [
            'task' => 'admin-list-items',
        ]);

        return Inertia::render($this->controllerView.'Index', [
            'items' => new AttributeCollection($items),
        ]);
    }

    public function create()
    {
        return Inertia::render($this->controllerView.'Created', [
            'item' => null,
        ]);
    }

    public function store(AttributeRequest $request)
    {
        try {
            $params = $request->validated();
            $attribute = $this->mainModel->save($params, ['task' => 'add-item']);
            $attribute->load(['translations', 'values.translations']);

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => __($this->translationPath.'created'),
                    'attribute' => new AttributeResource($attribute),
                ]);
            }

            if (($params['undo'] ?? 0) == 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __($this->translationPath.'created'));
            }

            return Redirect::route($this->routeName.'edit', $attribute->id)
                ->with('success', __($this->translationPath.'created'));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __($this->translationPath.'create_failed'));
        }
    }

    public function edit(string $id)
    {
        $item = $this->mainModel->get(['id' => $id], ['task' => 'get-item']);

        // echo "<pre>" ; print_r($item);die;
        return Inertia::render($this->controllerView.'Edit', [
            'item' => new AttributeResource($item),
        ]);
    }

    public function update(AttributeRequest $request, string $id)
    {
        try {
            $params = $request->validated();
            $params['id'] = $id;
            $attribute = $this->mainModel->save($params, ['task' => 'edit-item']);
            $attribute->load(['translations', 'values.translations']);

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => __($this->translationPath.'updated'),
                    'attribute' => new AttributeResource($attribute),
                ]);
            }

            if (($params['undo'] ?? 0) == 1) {
                return Redirect::to(route($this->routeName.'index'))
                    ->with('success', __($this->translationPath.'updated'));
            }

            return Redirect::route($this->routeName.'edit', $attribute->id)
                ->with('success', __($this->translationPath.'updated'));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __($this->translationPath.'update_failed'));
        }
    }

    public function quickSave(AttributeRequest $request): JsonResponse
    {
        try {
            $params = $request->validated();
            $attribute = $this->mainModel->save($params, ['task' => isset($params['id']) ? 'edit-item' : 'add-item']);
            $attribute->load(['translations', 'values.translations']);

            return response()->json([
                'message' => isset($params['id'])
                    ? __($this->translationPath.'updated')
                    : __($this->translationPath.'created'),
                'attribute' => new AttributeResource($attribute),
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => __($this->translationPath.'save_failed'),
            ], 422);
        }
    }

    public function destroy(string $id): RedirectResponse
    {
        try {
            $this->mainModel->delete(['id' => $id], ['task' => 'delete-item']);

            return Redirect::to(route($this->routeName.'index'))
                ->with('success', __($this->translationPath.'deleted'));
        } catch (\Throwable $th) {
            return Redirect::back()->with('error', __($this->translationPath.'delete_failed'));
        }
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        try {
            $this->mainModel->delete($request->all(), ['task' => 'delete-items']);

            return Redirect::route($this->routeName.'index')
                ->with('success', __($this->translationPath.'deleted'));
        } catch (\Throwable $th) {
            return Redirect::route($this->routeName.'index')
                ->with('error', __($this->translationPath.'delete_failed'));
        }
    }
}
