<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*

|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------

|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which

| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/**
 * Public Routes
 * These routes do not require authentication tokens.
 */
Route::post('/login', [AuthController::class, 'login'])->name('api.login')->middleware('throttle:login');

/**
 * Protected Routes
 * Authentication is required via Laravel Sanctum (Bearer Token).
 */
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::get('/me', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
            'roles' => $request->user()->getRoleNames(),
            'permissions' => $request->user()->getAllPermissions()->pluck('name'),
        ]);
    });
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.logout');
});

/**
 * Fallback Route
 * Handles undefined API endpoints with a JSON response.
 */
Route::fallback(function () {
    return response()->json([
        'message' => 'API Endpoint not found or unauthorized.'
    ], 404);
});
