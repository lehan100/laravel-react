<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\MediaBanner;
use App\Models\MediaBannerTranslation;
use App\Observers\CategoryObserver;
use App\Observers\MediaBannerObserver;
use App\Observers\MediaBannerTranslationObserver;
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
        MediaBannerTranslation::observe(\App\Observers\ImageFileObserver::class);
        //MediaBannerTranslation::observe(MediaBannerTranslationObserver::class);
        Category::observe(CategoryObserver::class);
        Category::observe(\App\Observers\ImageFileObserver::class);
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
