<?php

use App\Http\Controllers\ContactsController;
use App\Http\Controllers\ImagesController;
use App\Http\Controllers\OrganizationsController;
use App\Http\Controllers\ReportsController;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Auth
$prefixAdmin = config('configs.prefix.admin');
Route::group(['prefix' => $prefixAdmin, 'namespace' => 'App\Http\Controllers\Admin'], function () {
    Route::get('/', function () {
        return redirect()->route('auth/login');
    });
    /* -----------LOGIN--------------- */
    $prefix = 'auth';
    $controllerName = 'auth';
    Route::group(['prefix' => $prefix], function () use ($controllerName) {
        $controller = ucfirst($controllerName) . 'Controller@';
        Route::get('/login', ['as' => $controllerName . '/login', 'uses' => $controller . 'login']);
        Route::post('/post-login', ['as' => $controllerName . "/post-login", 'uses' => $controller . 'postlogin']);
        Route::get('/logout', ['as' => $controllerName . '/logout', 'uses' => $controller . 'logout']);
    });
    /* -----------Dashboard--------------- */
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])
        ->name('dashboard')
        ->middleware(['auth', 'permission']);
    /* -----------Role--------------- */
    Route::resource('roles', App\Http\Controllers\Admin\RolesController::class)->middleware('auth');
    Route::delete('/roles-destroy-many', [App\Http\Controllers\Admin\RolesController::class, 'destroyMany'])->name('roles.destroyMany')->middleware('auth');
    Route::get('/roles-permissions/{id}', [App\Http\Controllers\Admin\RolesController::class, 'permissions'])->where('id', '[0-9]+')->name('roles.permissions')->middleware('auth');
    /* -----------User--------------- */
    Route::resource('users', App\Http\Controllers\Admin\UsersController::class)->middleware('auth');
    Route::delete('/users-destroy-many', [App\Http\Controllers\Admin\UsersController::class, 'destroyMany'])->name('users.destroyMany')->middleware('auth');
});
// Route::get('login', [LoginController::class, 'create'])
//     ->name('login')
//     ->middleware('guest');

// Route::post('login', [LoginController::class, 'store'])
//     ->name('login.store')
//     ->middleware('guest');

// Route::delete('logout', [LoginController::class, 'destroy'])
//     ->name('logout');

// Dashboard

// Route::get('/', [DashboardController::class, 'index'])
//     ->name('dashboard')
//     ->middleware('auth');

// Users

// Route::get('users', [UsersController::class, 'index'])
//     ->name('users')
//     ->middleware('auth');

// Route::get('users/create', [UsersController::class, 'create'])
//     ->name('users.create')
//     ->middleware('auth');

// Route::post('users', [UsersController::class, 'store'])
//     ->name('users.store')
//     ->middleware('auth');

// Route::get('users/{user}/edit', [UsersController::class, 'edit'])
//     ->name('users.edit')
//     ->middleware('auth');

// Route::put('users/{user}', [UsersController::class, 'update'])
//     ->name('users.update')
//     ->middleware('auth');

// Route::delete('users/{user}', [UsersController::class, 'destroy'])
//     ->name('users.destroy')
//     ->middleware('auth');

// Route::put('users/{user}/restore', [UsersController::class, 'restore'])
//     ->name('users.restore')
//     ->middleware('auth');

// Organizations

Route::get('organizations', [OrganizationsController::class, 'index'])
    ->name('organizations')
    ->middleware('auth');

Route::get('organizations/create', [OrganizationsController::class, 'create'])
    ->name('organizations.create')
    ->middleware('auth');

Route::post('organizations', [OrganizationsController::class, 'store'])
    ->name('organizations.store')
    ->middleware('auth');

Route::get('organizations/{organization}/edit', [OrganizationsController::class, 'edit'])
    ->name('organizations.edit')
    ->middleware('auth');

Route::put('organizations/{organization}', [OrganizationsController::class, 'update'])
    ->name('organizations.update')
    ->middleware('auth');

Route::delete('organizations/{organization}', [OrganizationsController::class, 'destroy'])
    ->name('organizations.destroy')
    ->middleware('auth');

Route::put('organizations/{organization}/restore', [OrganizationsController::class, 'restore'])
    ->name('organizations.restore')
    ->middleware('auth');

// Contacts

Route::get('contacts', [ContactsController::class, 'index'])
    ->name('contacts')
    ->middleware('auth');

Route::get('contacts/create', [ContactsController::class, 'create'])
    ->name('contacts.create')
    ->middleware('auth');

Route::post('contacts', [ContactsController::class, 'store'])
    ->name('contacts.store')
    ->middleware('auth');

Route::get('contacts/{contact}/edit', [ContactsController::class, 'edit'])
    ->name('contacts.edit')
    ->middleware('auth');

Route::put('contacts/{contact}', [ContactsController::class, 'update'])
    ->name('contacts.update')
    ->middleware('auth');

Route::delete('contacts/{contact}', [ContactsController::class, 'destroy'])
    ->name('contacts.destroy')
    ->middleware('auth');

Route::put('contacts/{contact}/restore', [ContactsController::class, 'restore'])
    ->name('contacts.restore')
    ->middleware('auth');

// Reports

Route::get('reports', [ReportsController::class, 'index'])
    ->name('reports')
    ->middleware('auth');

// Images

Route::get('/img/{path}', [ImagesController::class, 'show'])
    ->where('path', '.*')
    ->name('image');
