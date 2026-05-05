<?php

namespace App\Http\Controllers\Admin\Users;

use App\Http\Controllers\MainController;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Spatie\Permission\Models\Permission;

class PermissionsController extends MainController
{
    protected string $controllerView = 'admin.pages.permissions.';

    protected string $controllerName = 'permissions';

    public function __construct()
    {
        parent::__construct();
        $this->metaTitle = 'Permissions Admin Control Panel';
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $permissions = Permission::all();

        return view($this->controllerView.'index', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show form for creating permissions
     *
     * @return Response
     */
    public function create()
    {
        return view($this->controllerView.'create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:users,name',
        ]);

        Permission::create($request->only('name'));

        return redirect()->route($this->controllerView.'index')
            ->withSuccess(__('Permission created successfully.'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  Permission  $post
     * @return Response
     */
    public function edit(Permission $permission)
    {
        return view($this->controllerView.'edit', [
            'permission' => $permission,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @return Response
     */
    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|unique:permissions,name,'.$permission->id,
        ]);

        $permission->update($request->only('name'));

        return redirect()->route($this->controllerView.'index')
            ->withSuccess(__('Permission updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  Post  $post
     * @return Response
     */
    public function destroy(Permission $permission)
    {
        $permission->delete();

        return redirect()->route($this->controllerView.'index')
            ->withSuccess(__('Permission deleted successfully.'));
    }
}
