<?php

namespace App\Models\Promotion;

use App\Models\Catalog\Product;
use App\Models\Slug;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Database\Factories\Promotion\PromotionCampaignFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class PromotionCampaign extends Model implements TranslatableContract
{
    /** @use HasFactory<PromotionCampaignFactory> */
    use HasFactory, SoftDeletes, Translatable;

    protected $table = 'promotion_campaigns';

    protected $fillable = [
        'starts_at',
        'ends_at',
        'priority',
        'is_active',
    ];

    public $translatedAttributes = [
        'name',
        'description',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'priority' => 'integer',
        'is_active' => 'boolean',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'promotion_campaign_products', 'promotion_campaign_id', 'product_id')
            ->withTimestamps();
    }

    public function coupons(): HasMany
    {
        return $this->hasMany(PromotionCoupon::class, 'campaign_id');
    }

    public function saleOffers(): HasMany
    {
        return $this->hasMany(PromotionSaleOffer::class, 'campaign_id');
    }

    public function buyToGiftOffers(): HasMany
    {
        return $this->hasMany(PromotionBuyToGiftOffer::class, 'campaign_id');
    }

    public function slugs(): MorphMany
    {
        return $this->morphMany(Slug::class, 'sluggable');
    }

    public function slug(): MorphOne
    {
        return $this->morphOne(Slug::class, 'sluggable')
            ->where('locale', app()->getLocale())
            ->where('is_default', true)
            ->whereNull('redirect_to');
    }
}
