<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\MainController;
use App\Http\Resources\Users\PermissionCollection;
use App\Http\Resources\Users\RolesCollection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends MainController
{
    protected string $controllerView = 'Admin/Roles/';

    protected string $controllerName = 'roles';

    /**
     * Display the login view.
     */
    public function index(): Response
    {
        $roles = Role::orderBy('name', 'ASC')->paginate(10);

        return Inertia::render($this->controllerView.'Index', [
            'roles' => new RolesCollection($roles),
        ]);
    }

    public function create()
    {
        $permissions = Permission::orderBy('name', 'ASC')->paginate(2000);

        return Inertia::render($this->controllerView.'Create', [
            'permissions' => new PermissionCollection($permissions),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->validate($request, [
            'name' => 'required|unique:roles,name',
            'permissions' => 'required',
        ]);
        $params = $request->all();
        $getPermissions = Permission::whereIn('id', explode(',', $params['permissions']))->get();
        $mapped = Arr::mapWithKeys($getPermissions->toArray(), function (array $item, int $key) {
            return [$item['name'] => $item['name']];
        });
        $role = Role::create(['name' => $params['name']]);
        $role->syncPermissions($mapped);
        if ($params['undo'] == 1) {
            return Redirect::to(route('roles.index'))->with('success', __('hancms.message.success.created', ['name' => __('hancms.roles.name')]));
        }

        // return Redirect::back()->with('success', 'Role created successfully.');
        return Redirect::route('roles.edit', $role->id)->with('success', __('hancms.message.success.created', ['name' => __('hancms.roles.name')]));
    }

    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();

        return Redirect::back()->with('success', __('hancms.message.success.deleted', ['name' => __('hancms.roles.name')]));
    }

    public function edit(Role $role): Response
    {
        $role = $role;
        $rolePermissions = $role->permissions->pluck('id')->toArray();
        $permissions = Permission::where('guard_name', $role->guard_name)->orderBy('name', 'ASC')->paginate(2000);

        return Inertia::render($this->controllerView.'Edit', [
            'permissions' => new PermissionCollection($permissions),
            'rolePermissions' => $rolePermissions,
            'role' => $role,
        ]);
    }

    public function update(Role $role, Request $request)
    {
        $params = $request->all();
        $this->validate($request, [
            'name' => 'required',
            'permissions' => 'required',
        ]);

        $getPermissions = Permission::whereIn('id', explode(',', $params['permissions']))->get();
        $mapped = Arr::mapWithKeys($getPermissions->toArray(), function (array $item, int $key) {
            return [$item['name'] => $item['name']];
        });
        $role->update($request->only('name'));
        $role->syncPermissions($mapped);
        if ($params['undo'] == 1) {
            return Redirect::to(route('roles.index'))->with('success', __('hancms.message.success.edit', ['name' => __('hancms.roles.name')]));
        }

        return Redirect::back()->with('success', __('hancms.message.success.edit', ['name' => __('hancms.roles.name')]));
    }

    public function destroyMany(Request $request): RedirectResponse
    {
        try {
            $params = $request->all();
            $ids = explode(',', $params['ids']);
            Role::whereIn('id', $ids)->delete();

            return Redirect::back()->with('success', __('hancms.message.success.deleted', ['name' => __('hancms.roles.name')]));
        } catch (\Throwable $th) {
            // throw $th;
            return Redirect::back()->with('error', __('hancms.message.error.deleted'));
        }
    }

    public function permissions(Request $request)
    {
        try {
            $role = Role::where('id', $request->id)->with('permissions')->first();

            return response()->json(['status' => true, 'role' => $role]);
        } catch (\Throwable $th) {
            // throw $th;
            return response()->json(['status' => false]);
        }
    }
}
