<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\MainController;
use App\Http\Requests\Users\UserDeleteRequest;
use App\Http\Requests\Users\UserStoreRequest;
use App\Http\Requests\Users\UserUpdateRequest;
use App\Http\Resources\Users\UserCollection;
use App\Http\Resources\Users\UserResource;
use App\Models\Users\User;
use App\Repositories\User\UserRepositoryInterface as RepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends MainController
{
    protected string $controllerView = 'Admin/Users/';

    protected string $controllerName = 'users';

    protected RepositoryInterface $mainModel;

    private array $USER_GROUP;

    public function __construct(RepositoryInterface $repository)
    {
        parent::__construct();
        $this->mainModel = $repository;
        $this->USER_GROUP = config('configs.user_group_name');
    }

    public function index(): Response
    {
        $this->params = array_merge(Request::all(), $this->params);
        $items = $this->mainModel->lists($this->params, ['task' => 'admin-list-items']);

        return Inertia::render($this->controllerView.'Index', [
            'filters' => Request::all('search', 'group'),
            'items' => new UserCollection($items),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render($this->controllerView.'Create');
    }

    public function store(UserStoreRequest $request): RedirectResponse
    {
        $user = Auth::user()->account->users()->create(
            $request->validated()
        );
        $role = Role::firstOrCreate(['name' => $this->USER_GROUP[$request->group]]);
        $user->assignRole([$role->id]);
        if ($request->hasFile('photo')) {
            $user->update([
                'photo' => $request->file('photo')->store('users'),
            ]);
        }

        return Redirect::route('users.edit', $user->id)->with('success', __('hancms.message.success.created', ['name' => __('hancms.users.name')]));
    }

    public function edit(User $user): Response
    {
        return Inertia::render($this->controllerView.'Edit', [
            'item' => new UserResource($user),
        ]);
    }

    public function update(User $user, UserUpdateRequest $request): RedirectResponse
    {
        $params = $request->validated();
        if (empty($params['password'])) {
            unset($params['password']);
        }
        $user->update($params);
        $guard = ($request->group == 4) ? 'api' : 'web';
        $role = Role::firstOrCreate(['name' => $this->USER_GROUP[$request->group], 'guard_name' => $guard]);
        $user->syncRoles([$role]);
        if ($request->hasFile('photo')) {
            $user->update([
                'photo' => $request->file('photo')->store('users'),
            ]);
        }

        return Redirect::back()->with('success', __('hancms.message.success.edit', ['name' => __('hancms.users.name')]));
    }

    public function destroy(User $user, UserDeleteRequest $request): RedirectResponse
    {
        $user->delete();

        return Redirect::back()->with('success', __('hancms.message.success.deleted', ['name' => __('hancms.users.name')]));
    }

    public function restore(User $user): RedirectResponse
    {
        $user->restore();

        return Redirect::back()->with('success', __('hancms.message.success.restored', ['name' => __('hancms.users.name')]));
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        try {
            $params = $request->all();
            $ids = explode(',', $params['ids']);
            User::whereIn('id', $ids)->delete();

            return Redirect::route('users.index')->with('success', __('hancms.message.success.deleted', ['name' => __('hancms.users.name')]));
        } catch (\Throwable $th) {
            return Redirect::route('users.index')->with('error', __('hancms.message.error.deleted'));
        }
    }
}
