<?php

namespace App\Providers;

use App\Jobs\Settings\EnsureFrontendTranslationBundles;
use App\Models\Catalog\AttributeValue;
use App\Models\Catalog\Category;
use App\Models\Catalog\Post;
use App\Models\Catalog\Product;
use App\Models\Catalog\ProductAttribute;
use App\Models\Catalog\ProductPhoto;
use App\Models\FieldGroup;
use App\Models\Media\MediaBanner;
use App\Models\Media\MediaBannerTranslation;
use App\Models\Page;
use App\Models\Promotion\PromotionBuyToGiftOffer;
use App\Models\Promotion\PromotionCampaign;
use App\Models\Promotion\PromotionCoupon;
use App\Models\Promotion\PromotionSaleOffer;
use App\Models\Sales\Order;
use App\Observers\AttributeObserver;
use App\Observers\AttributeValueObserver;
use App\Observers\CategoryObserver;
use App\Observers\FieldGroupObserver;
use App\Observers\ImageFileObserver;
use App\Observers\MediaBannerObserver;
use App\Observers\OrderObserver;
use App\Observers\PageObserver;
use App\Observers\PostObserver;
use App\Observers\ProductObserver;
use App\Observers\PromotionBuyToGiftObserver;
use App\Observers\PromotionCampaignObserver;
use App\Observers\PromotionCouponObserver;
use App\Observers\PromotionSaleOfferObserver;
use App\Repositories\Attribute\AttributeEloquentRepository;
use App\Repositories\Attribute\AttributeRepositoryInterface;
use App\Repositories\BuyToGift\BuyToGiftEloquentRepository;
use App\Repositories\BuyToGift\BuyToGiftRepositoryInterface;
use App\Repositories\Category\CategoryEloquentRepository;
use App\Repositories\Category\CategoryRepositoryInterface;
use App\Repositories\Coupon\CouponEloquentRepository;
use App\Repositories\Coupon\CouponRepositoryInterface;
use App\Repositories\Dashboard\DashboardEloquentRepository;
use App\Repositories\Dashboard\DashboardRepositoryInterface;
use App\Repositories\FieldGroup\FieldGroupEloquentRepository;
use App\Repositories\FieldGroup\FieldGroupRepositoryInterface;
use App\Repositories\Language\LanguageEloquentRepository;
use App\Repositories\Language\LanguageRepositoryInterface;
use App\Repositories\Location\LocationEloquentRepository;
use App\Repositories\Location\LocationRepositoryInterface;
use App\Repositories\Media\MediaBannerEloquentRepository;
use App\Repositories\Media\MediaBannerRepositoryInterface;
use App\Repositories\Media\MediaPositionEloquentRepository;
use App\Repositories\Media\MediaPositionRepositoryInterface;
use App\Repositories\Order\OrderEloquentRepository;
use App\Repositories\Order\OrderRepositoryInterface;
use App\Repositories\Page\PageEloquentRepository;
use App\Repositories\Page\PageRepositoryInterface;
use App\Repositories\PaymentMethod\PaymentMethodEloquentRepository;
use App\Repositories\PaymentMethod\PaymentMethodRepositoryInterface;
use App\Repositories\Post\PostEloquentRepository;
use App\Repositories\Post\PostRepositoryInterface;
use App\Repositories\Product\ProductEloquentRepository;
use App\Repositories\Product\ProductRepositoryInterface;
use App\Repositories\PromotionCampaign\PromotionCampaignEloquentRepository;
use App\Repositories\PromotionCampaign\PromotionCampaignRepositoryInterface;
use App\Repositories\SaleOffer\SaleOfferEloquentRepository;
use App\Repositories\SaleOffer\SaleOfferRepositoryInterface;
use App\Repositories\ShippingMethod\ShippingMethodEloquentRepository;
use App\Repositories\ShippingMethod\ShippingMethodRepositoryInterface;
use App\Repositories\User\UserEloquentRepository;
use App\Repositories\User\UserRepositoryInterface;
use App\Repositories\Warehouse\WarehouseEloquentRepository;
use App\Repositories\Warehouse\WarehouseRepositoryInterface;
use App\Services\Settings\FrontendTranslationBundleService;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Schema;
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
        // User
        $this->app->singleton(
            UserRepositoryInterface::class,
            UserEloquentRepository::class
        );
        // Language
        $this->app->singleton(
            LanguageRepositoryInterface::class,
            LanguageEloquentRepository::class
        );
        // Media
        $this->app->singleton(
            MediaBannerRepositoryInterface::class,
            MediaBannerEloquentRepository::class
        );
        $this->app->singleton(
            MediaPositionRepositoryInterface::class,
            MediaPositionEloquentRepository::class
        );
        $this->app->singleton(
            CategoryRepositoryInterface::class,
            CategoryEloquentRepository::class
        );
        $this->app->singleton(
            AttributeRepositoryInterface::class,
            AttributeEloquentRepository::class
        );
        $this->app->singleton(
            ProductRepositoryInterface::class,
            ProductEloquentRepository::class
        );
        $this->app->singleton(
            PostRepositoryInterface::class,
            PostEloquentRepository::class
        );
        $this->app->singleton(
            CouponRepositoryInterface::class,
            CouponEloquentRepository::class
        );
        $this->app->singleton(
            PromotionCampaignRepositoryInterface::class,
            PromotionCampaignEloquentRepository::class
        );
        $this->app->singleton(
            SaleOfferRepositoryInterface::class,
            SaleOfferEloquentRepository::class
        );
        $this->app->singleton(
            BuyToGiftRepositoryInterface::class,
            BuyToGiftEloquentRepository::class
        );
        $this->app->singleton(
            WarehouseRepositoryInterface::class,
            WarehouseEloquentRepository::class
        );
        $this->app->singleton(
            OrderRepositoryInterface::class,
            OrderEloquentRepository::class
        );
        $this->app->singleton(
            PaymentMethodRepositoryInterface::class,
            PaymentMethodEloquentRepository::class
        );
        $this->app->singleton(
            ShippingMethodRepositoryInterface::class,
            ShippingMethodEloquentRepository::class
        );
        $this->app->singleton(
            LocationRepositoryInterface::class,
            LocationEloquentRepository::class
        );
        $this->app->singleton(
            DashboardRepositoryInterface::class,
            DashboardEloquentRepository::class
        );
        $this->app->singleton(
            PageRepositoryInterface::class,
            PageEloquentRepository::class
        );
        $this->app->singleton(
            FieldGroupRepositoryInterface::class,
            FieldGroupEloquentRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // $this->app->useLangPath(base_path('lang'));
        // $this->app->instance('path.lang', base_path('lang'));
        JsonResource::withoutWrapping();
        Schema::defaultStringLength(535);
        $this->bootRoute();
        $this->ensureFrontendTranslationBundles();
        // ------
        MediaBanner::observe(MediaBannerObserver::class);
        MediaBannerTranslation::observe(ImageFileObserver::class);
        // -------
        Category::observe(CategoryObserver::class);
        Category::observe(ImageFileObserver::class);
        // -------
        ProductPhoto::observe(ImageFileObserver::class);
        Product::observe(ProductObserver::class);
        ProductAttribute::observe(AttributeObserver::class);
        AttributeValue::observe(AttributeValueObserver::class);
        Order::observe(OrderObserver::class);
        // -------
        Post::observe(PostObserver::class);
        Post::observe(ImageFileObserver::class);
        // -------
        PromotionCoupon::observe(PromotionCouponObserver::class);
        PromotionSaleOffer::observe(PromotionSaleOfferObserver::class);
        PromotionBuyToGiftOffer::observe(PromotionBuyToGiftObserver::class);
        PromotionCampaign::observe(PromotionCampaignObserver::class);
        Page::observe(PageObserver::class);
        FieldGroup::observe(FieldGroupObserver::class);
        // Login Api
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip())->response(function (Request $request, array $headers) {
                $seconds = $headers['Retry-After'] ?? 60;
                $message = "Too many attempts! Please take a break and try again in {$seconds} seconds.";

                return redirect()
                    ->back()
                    ->withInput($request->except('password'))
                    ->withErrors(['email' => $message])
                    ->with('message', $message);
            });
        });
    }

    /**
     * Dispatch a queue job to rebuild frontend translation bundles when they are missing.
     */
    private function ensureFrontendTranslationBundles(): void
    {
        if ($this->app->runningInConsole() || $this->app->runningUnitTests()) {
            return;
        }

        $service = $this->app->make(FrontendTranslationBundleService::class);

        if ($service->missingGeneratedBundles() === []) {
            return;
        }

        EnsureFrontendTranslationBundles::dispatchAfterResponse();
    }

    public function bootRoute(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
