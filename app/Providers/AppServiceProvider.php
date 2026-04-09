<?php

namespace App\Providers;

use App\Models\Catalog\Category;
use App\Models\Media\MediaBanner;
use App\Models\Media\MediaBannerTranslation;
use App\Models\Catalog\Post;
use App\Models\Catalog\Product;
use App\Models\Catalog\ProductPhoto;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionCoupon;
use App\Models\Promotion\PromotionSaleOffer;
use App\Observers\CategoryObserver;
use App\Observers\ImageFileObserver;
use App\Observers\MediaBannerObserver;
use App\Observers\PromotionBuyToGiftObserver;
use App\Observers\PostObserver;
use App\Observers\PromotionCouponObserver;
use App\Observers\PromotionSaleOfferObserver;
use App\Observers\ProductObserver;
use Illuminate\Support\Facades\Schema;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
class AppServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/';

    /**
     * Register any application services.
     */
    public function register(): void
    {
        Model::unguard();
        //User
        $this->app->singleton(
            \App\Repositories\User\UserRepositoryInterface::class,
            \App\Repositories\User\UserEloquentRepository::class
        );
        //Language
        $this->app->singleton(
            \App\Repositories\Language\LanguageRepositoryInterface::class,
            \App\Repositories\Language\LanguageEloquentRepository::class
        );
        //Media
        $this->app->singleton(
            \App\Repositories\Media\MediaBannerRepositoryInterface::class,
            \App\Repositories\Media\MediaBannerEloquentRepository::class
        );
        $this->app->singleton(
            \App\Repositories\Media\MediaPositionRepositoryInterface::class,
            \App\Repositories\Media\MediaPositionEloquentRepository::class
        );
        $this->app->singleton(
            \App\Repositories\Category\CategoryRepositoryInterface::class,
            \App\Repositories\Category\CategoryEloquentRepository::class
        );
        $this->app->singleton(
            \App\Repositories\Product\ProductRepositoryInterface::class,
            \App\Repositories\Product\ProductEloquentRepository::class
        );
        $this->app->singleton(
            \App\Repositories\Post\PostRepositoryInterface::class,
            \App\Repositories\Post\PostEloquentRepository::class
        );
        $this->app->singleton(
            \App\Repositories\Coupon\CouponRepositoryInterface::class,
            \App\Repositories\Coupon\CouponEloquentRepository::class
        );
        $this->app->singleton(
            \App\Repositories\SaleOffer\SaleOfferRepositoryInterface::class,
            \App\Repositories\SaleOffer\SaleOfferEloquentRepository::class
        );
        $this->app->singleton(
            \App\Repositories\BuyToGift\BuyToGiftRepositoryInterface::class,
            \App\Repositories\BuyToGift\BuyToGiftEloquentRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // $this->app->useLangPath(base_path('lang'));
        //$this->app->instance('path.lang', base_path('lang'));
        JsonResource::withoutWrapping();
        Schema::defaultStringLength(535);
        $this->bootRoute();
        // ------
        MediaBanner::observe(MediaBannerObserver::class);
        MediaBannerTranslation::observe(ImageFileObserver::class);
        // -------
        Category::observe(CategoryObserver::class);
        Category::observe(ImageFileObserver::class);
        // -------
        ProductPhoto::observe(ImageFileObserver::class);
        Product::observe(ProductObserver::class);
        // -------
        Post::observe(PostObserver::class);
        Post::observe(ImageFileObserver::class);
        // -------
        PromotionCoupon::observe(PromotionCouponObserver::class);
        PromotionSaleOffer::observe(PromotionSaleOfferObserver::class);
        PromotionBuyToGiftOffer::observe(PromotionBuyToGiftObserver::class);
        //Login Api
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip())->response(function (Request $request, array $headers) {
                $seconds = $headers['Retry-After'] ?? 60;
                return response()->json([
                    'status' => 'sweet_error',
                   'message' => "Too many attempts! Please take a break and try again in {$seconds} seconds. ⏳",
                    'retry_after' => $headers['Retry-After'] ?? 60
                ], 429, $headers);
            });
        });
    }

    public function bootRoute(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
