<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\Catalog\AttributeController;
use App\Http\Controllers\Admin\Catalog\CategoryController;
use App\Http\Controllers\Admin\Catalog\PostController;
use App\Http\Controllers\Admin\Catalog\ProductController;
use App\Http\Controllers\Admin\Dashboard\DashboardController;
use App\Http\Controllers\Admin\ExchangeRateController;
use App\Http\Controllers\Admin\Media\MediaBannerController;
use App\Http\Controllers\Admin\Media\MediaPositionController;
use App\Http\Controllers\Admin\Media\TinyMCEController;
use App\Http\Controllers\Admin\PageManager\FieldGroupController;
use App\Http\Controllers\Admin\PageManager\PageController;
use App\Http\Controllers\Admin\Promotion\BuyToGiftController;
use App\Http\Controllers\Admin\Promotion\CouponController;
use App\Http\Controllers\Admin\Promotion\SaleOfferController;
use App\Http\Controllers\Admin\Report\ReportInventoryController;
use App\Http\Controllers\Admin\Report\ReportProductController;
use App\Http\Controllers\Admin\Report\ReportPromotionController;
use App\Http\Controllers\Admin\Report\ReportRevenueController;
use App\Http\Controllers\Admin\Sales\OrderController;
use App\Http\Controllers\Admin\Sales\PaymentMethodController;
use App\Http\Controllers\Admin\Sales\ShippingMethodController;
use App\Http\Controllers\Admin\Sales\WarehouseController;
use App\Http\Controllers\Admin\Settings\HancmsTranslationController;
use App\Http\Controllers\Admin\Settings\LabelController;
use App\Http\Controllers\Admin\Settings\LanguageController;
use App\Http\Controllers\Admin\Settings\LayoutController;
use App\Http\Controllers\Admin\Settings\LocationController;
use App\Http\Controllers\Admin\Users\RoleController;
use App\Http\Controllers\Admin\Users\UserController;
use App\Http\Controllers\Ai\CategoryAiController;
use App\Http\Controllers\Ai\ProductAiController;
use App\Http\Controllers\ImageUploadController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use function Laravel\Ai\agent;

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

Route::post('photo-upload', [ImageUploadController::class, 'storePhoto'])->name('photo.upload');
Route::post('category-upload', [ImageUploadController::class, 'storeCategory'])->name('category.upload');
Route::post('product-upload', [ImageUploadController::class, 'storeProduct'])->name('product.upload');
Route::post('attribute-upload', [ImageUploadController::class, 'storeAttribute'])->name('attribute.upload');
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
    Route::get('/', fn () => redirect()->route('auth.login'));
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
        Route::post('category/ai-suggest-seo', [CategoryAiController::class, 'suggestSeo'])->name('category.ai.suggest-seo');
        /* ----------- Dashboard ----------- */
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        /* ----------- Locations ----------- */
        Route::get('locations', [LocationController::class, 'index'])->name('locations.index');
        Route::get('locations/{province}', [LocationController::class, 'show'])->name('locations.show');
        Route::get('hancms-translations', [HancmsTranslationController::class, 'index'])->name('hancms-translations.index');
        Route::post('hancms-translations', [HancmsTranslationController::class, 'store'])->name('hancms-translations.store');
        /* ----------- Roles ----------- */
        Route::get('roles/permissions/{id}', [RoleController::class, 'permissions'])
            ->where('id', '[0-9]+')->name('roles.permissions');
        /* ----------- Layout  ----------- */
        Route::prefix('layout')->name('layout.')->group(function () {
            Route::get('/', [LayoutController::class, 'index'])->name('index');
            Route::post('store', [LayoutController::class, 'store'])->name('store');
        });
        Route::get('saleoffer/products-picker', [SaleOfferController::class, 'productsPicker'])->name('saleoffer.products-picker');
        Route::get('coupon/products-picker', [CouponController::class, 'productsPicker'])->name('coupon.products-picker');
        Route::get('buytogift/products-picker', [BuyToGiftController::class, 'productsPicker'])->name('buytogift.products-picker');
        Route::get('category/products-picker', [CategoryController::class, 'productsPicker'])->name('category.products-picker');
        Route::post('pages/quick-store', [PageController::class, 'quickStore'])->name('pages.quick-store');
        // Media & Resource
        $resources = [
            'media-position' => MediaPositionController::class,
            'media-banner' => MediaBannerController::class,
            'languages' => LanguageController::class,
            'labels' => LabelController::class,
            'users' => UserController::class,
            'roles' => RoleController::class,
            'category' => CategoryController::class,
            'attribute' => AttributeController::class,
            'product' => ProductController::class,
            'post' => PostController::class,
            'page-schemas' => FieldGroupController::class,
            'saleoffer' => SaleOfferController::class,
            'coupon' => CouponController::class,
            'buytogift' => BuyToGiftController::class,
            'warehouse' => WarehouseController::class,
            'orders' => OrderController::class,
            'payment-methods' => PaymentMethodController::class,
            'shipping-methods' => ShippingMethodController::class,
            'pages' => PageController::class,
        ];
        Route::get('page-values', [PageController::class, 'index'])->name('page-values.index');
        Route::post('attribute/quick-save', [AttributeController::class, 'quickSave'])->name('attribute.quick-save');

        Route::get('report-revenue', [ReportRevenueController::class, 'index'])->name('report-revenue.index');
        Route::post('report-revenue/analyze', [ReportRevenueController::class, 'analyze'])->name('report-revenue.analyze');
        Route::get('report-product', [ReportProductController::class, 'index'])->name('report-product.index');
        Route::post('report-product/analyze', [ReportProductController::class, 'analyze'])->name('report-product.analyze');
        Route::get('report-inventory', [ReportInventoryController::class, 'index'])->name('report-inventory.index');
        Route::post('report-inventory/analyze', [ReportInventoryController::class, 'analyze'])->name('report-inventory.analyze');
        Route::get('report-promotion', [ReportPromotionController::class, 'index'])->name('report-promotion.index');
        Route::post('report-promotion/analyze', [ReportPromotionController::class, 'analyze'])->name('report-promotion.analyze');

        foreach ($resources as $uri => $controller) {
            if ($uri === 'warehouse') {
                Route::put("$uri/{id}/toggle-stock", [$controller, 'toggleStock'])->name("$uri.toggle-stock");
                Route::get("$uri/variants/{variant}/edit", [$controller, 'editVariant'])->name("$uri.variants.edit");
                Route::put("$uri/variants/{variant}", [$controller, 'updateVariant'])->name("$uri.variants.update");
                Route::put("$uri/variants/{variant}/toggle-stock", [$controller, 'toggleVariantStock'])->name("$uri.variants.toggle-stock");
            }

            Route::delete("$uri/destroy-many", [$controller, 'destroyMany'])->name("$uri.destroy-many");
            Route::put("$uri/{id}/toggle-status", [$controller, 'toggleStatus'])->name("$uri.toggle-status");
            $resource = Route::resource($uri, $controller);

            if ($uri === 'page-schemas') {
                $resource->parameters(['page-schemas' => 'field_group']);
            }
        }
    });
});
