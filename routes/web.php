<?php

use Inertia\Inertia;
use function Laravel\Ai\agent;
use App\Http\Controllers\Ai\ProductAiController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\LanguageController;
use App\Http\Controllers\Admin\LabelController;
use App\Http\Controllers\Admin\LayoutController;
use App\Http\Controllers\Admin\MediaPositionController;
use App\Http\Controllers\Admin\MediaBannerController;
use App\Http\Controllers\Admin\ExchangeRateController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\TinyMCEController;
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
// Begin Test AI
Route::get('/check-ai', function () {
    return agent()->prompt('Chào bạn, tôi là Gemini và tôi đã sẵn sàng!');
});
// End Test AI

Route::post('photo-upload', [App\Http\Controllers\ImageUploadController::class, 'storePhoto'])->name('photo.upload');
Route::post('category-upload', [App\Http\Controllers\ImageUploadController::class, 'storeCategory'])->name('category.upload');
Route::post('product-upload', [App\Http\Controllers\ImageUploadController::class, 'storeProduct'])->name('product.upload');
$prefixAdmin = config('configs.prefix.admin', 'admin');
Route::prefix($prefixAdmin)->group(function () {
    Route::get('lang/{locale}', function ($locale) {
        $sharedLangs = Inertia::getShared('langs');

        $languages = is_callable($sharedLangs) ? $sharedLangs() : $sharedLangs;

        $availableCodes = collect($languages->resource->items())->map(function ($lang) {
            return $lang->code;
        })->toArray();

        // 3. Kiểm tra và lưu Session
        if (in_array($locale, $availableCodes)) {
            session()->put('locale', $locale);
            session()->save();
        }

        return redirect()->back();
    })->name('lang.switch');
    Route::get('/', fn() => redirect()->route('auth.login'));
    /* -----------LOGIN--------------- */
    Route::prefix('auth')->name('auth.')->controller(AuthController::class)->group(function () {
        Route::get('login', 'login')->name('login')->middleware('check.login');
        Route::post('post-login', 'postLogin')->name('post-login')->middleware(['check.login', 'throttle:login']);
        Route::get('logout', 'logout')->name('logout');
    });


    Route::middleware(['auth', 'permission'])->group(function () {
        Route::post('category/reorder', [CategoryController::class, 'reorder'])->name('category.reorder');
        Route::post('upload-tinymce', [TinyMCEController::class, 'uploadTinyMCE'])->name('media.upload.tinymce');
        Route::get('media-get-images', [TinyMCEController::class, 'getImages'])->name('media.get.images');
        Route::post('media-create-folder', [TinyMCEController::class, 'createFolder'])->name('media.create.folder');
        Route::post('media-move-file', [TinyMCEController::class, 'moveFile'])->name('media.move.file');
        Route::post('media-rename', [TinyMCEController::class, 'rename'])->name('media.rename');
        Route::post('media-delete', [TinyMCEController::class, 'delete'])->name('media.delete');
        /* ----------- Exchange Rate ----------- */ 
        Route::get('exchange-rates/{currency?}', [ExchangeRateController::class, 'show'])->name('exchange-rates.show');
       /* ----------- Product AI ----------- */
        Route::post('product/ai-suggest-content', [ProductAiController::class, 'suggestContent'])->name('product.ai.suggest-content');
        Route::post('product/ai-suggest-seo', [ProductAiController::class, 'suggestSeo'])->name('product.ai.suggest-seo');
        /* ----------- Dashboard ----------- */
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        /* ----------- Roles ----------- */
        Route::get('roles/permissions/{id}', [RoleController::class, 'permissions'])
            ->where('id', '[0-9]+')->name('roles.permissions');
        /* ----------- Layout  ----------- */
        Route::prefix('layout')->name('layout.')->group(function () {
            Route::get('/', [LayoutController::class, 'index'])->name('index');
            Route::post('store', [LayoutController::class, 'store'])->name('store');
        });
        // Media & Resource
        $resources = [
            'media-position' => MediaPositionController::class,
            'media-banner'   => MediaBannerController::class,
            'languages'      => LanguageController::class,
            'labels'         => LabelController::class,
            'users'         => UserController::class,
            'roles'         => RoleController::class,
            'category'         => CategoryController::class,
            'product'         => ProductController::class,
        ];

        foreach ($resources as $uri => $controller) {
            Route::delete("$uri/destroy-many", [$controller, 'destroyMany'])->name("$uri.destroy-many");
            Route::resource($uri, $controller);
        }
    });
});
