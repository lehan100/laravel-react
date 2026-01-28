<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\MainController;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Arr;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Resources\RolesCollection;
use App\Http\Resources\PermissionCollection;
use Inertia\Inertia;
use Inertia\Response;

class RolesController extends MainController
{
    protected $controllerView = 'Admin/Roles/';
    protected $controllerName = 'roles';
    /**
     * Display the login view.
     */
    public function index(): Response
    {
        $roles = Role::orderBy('name', 'ASC')->paginate(10);
        return Inertia::render($this->controllerView . 'Index', [
            'roles' => new RolesCollection($roles)
        ]);
    }
    public function create()
    {
        $permissions = Permission::orderBy('name', 'ASC')->paginate(2000);
        return Inertia::render($this->controllerView . 'Create', [
            'permissions' => new PermissionCollection($permissions)
        ]);
    }
    public function store(Request $request): RedirectResponse
    {
        $this->validate($request, [
            'name' => 'required|unique:roles,name',
            'permissions' => 'required',
        ]);
        $params = $request->all();
        $getPermissions = Permission::whereIn('id', explode(",", $params['permissions']))->get();
        $mapped = Arr::mapWithKeys($getPermissions->toArray(), function (array $item, int $key) {
            return [$item['name'] => $item['name']];
        });
        $role = Role::create(['name' => $params['name']]);
        $role->syncPermissions($mapped);
        if ($params['undo'] == 1) {
            return Redirect::to(route('roles.index'))->with('success', 'Role created successfully.');
        }
        return Redirect::back()->with('success', 'Role created successfully.');
    }
    public function destroy(Role $role): RedirectResponse
    {
        $role->delete();
        return Redirect::back()->with('success', 'Role deleted successfully.');
    }
    public function edit(Role $role): Response
    {
        $role = $role;
        $rolePermissions = $role->permissions->pluck('id')->toArray();
        $permissions = Permission::orderBy('name', 'ASC')->paginate(2000);
        return Inertia::render($this->controllerView . 'Edit', [
            'permissions' => new PermissionCollection($permissions),
            'rolePermissions' => $rolePermissions,
            'role' => $role
        ]);
    }
    public function update(Role $role, Request $request)
    {
        $params = $request->all();
        $this->validate($request, [
            'name' => 'required',
            'permissions' => 'required',
        ]);

        $getPermissions = Permission::whereIn('id', explode(",", $params['permissions']))->get();
        $mapped = Arr::mapWithKeys($getPermissions->toArray(), function (array $item, int $key) {
            return [$item['name'] => $item['name']];
        });
        $role->update($request->only('name'));
        $role->syncPermissions($mapped);
        if ($params['undo'] == 1) {
            return Redirect::to(route('roles.index'))->with('success', 'Role updated successfully.');
        }
        return Redirect::back()->with('success', 'Role updated successfully.');
    }
    public function destroyMany(Request $request): RedirectResponse
    {
        $params = $request->all();
        $ids = explode(",", $params['ids']);
        Role::whereIn('id', $ids)->delete();
        return Redirect::back()->with('success', 'Role deleted successfully.');
    }
    public function permissions(Request $request)
    {
        try {
            $role = Role::where("id", $request->id)->with('permissions')->first();
            return response()->json(['status' => true, 'role' =>  $role]);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['status' => false]);
        }
    }
}
