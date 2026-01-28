<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\MainController;
use App\Http\Requests\UserDeleteRequest;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Repositories\User\UserRepositoryInterface as RepositoryInterface;

class UsersController extends MainController
{
    protected $controllerView = 'Admin/Users/';
    protected $controllerName = 'users';
    protected $mainModel;
    public function __construct(RepositoryInterface $repository)
    {
        $this->mainModel = $repository;
    }
    public function index(): Response
    {
        $items =  $this->mainModel->lists($this->params, ['task' => 'admin-list-items']);
        return Inertia::render($this->controllerView . 'Index', [
            'items' => new UserCollection($items)
        ]);
    }

    public function create(): Response
    {
        return Inertia::render($this->controllerView . 'Create');
    }

    public function store(UserStoreRequest $request): RedirectResponse
    {
        $user = Auth::user()->account->users()->create(
            $request->validated()
        );

        if ($request->hasFile('photo')) {
            $user->update([
                'photo' => $request->file('photo')->store('users'),
            ]);
        }
        return Redirect::route('users.edit', $user->id)->with('success', 'User created successfully.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render($this->controllerView . 'Edit', [
            'item' => new UserResource($user),
        ]);
    }

    public function update(User $user, UserUpdateRequest $request): RedirectResponse
    {
        // echo "<pre>" ;print_r($request->all());die();
        $user->update(
            $request->validated()
        );

        if ($request->hasFile('photo')) {
            $user->update([
                'photo' => $request->file('photo')->store('users'),
            ]);
        }

        return Redirect::back()->with('success', 'User updated successfully.');
    }

    public function destroy(User $user, UserDeleteRequest $request): RedirectResponse
    {
        $user->delete();

        return Redirect::back()->with('success', 'User deleted successfully.');
    }

    public function restore(User $user): RedirectResponse
    {
        $user->restore();

        return Redirect::back()->with('success', 'User restored successfully.');
    }
    public function destroyMany(Request $request): RedirectResponse
    {
        $params = $request->all();
        $ids = explode(",", $params['ids']);
        User::whereIn('id', $ids)->delete();
        return Redirect::route('users.index')->with('success', 'User deleted successfully.');
    }
}
