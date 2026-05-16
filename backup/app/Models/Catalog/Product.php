<?php

namespace App\Models\Catalog;

use App\Models\Promotion\PromotionBuyToGiftRuleStockAllocation;
use App\Models\Promotion\PromotionCampaign;
use App\Models\Sales\InventoryAdjustmentHistory;
use App\Models\Slug;
use Astrotomic\Translatable\Contracts\Translatable as TranslatableContract;
use Astrotomic\Translatable\Translatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model implements TranslatableContract
{
    use HasFactory, SoftDeletes, Translatable;

    protected $table = 'products';

    protected $fillable = [
        'sku',
        'quantity',
        'sold_quantity',
        'weight',
        'brand',
        'price',
        'status',
        'is_coupon',
        'is_stock',
        'order',
        'hit_viewer',
        'hit_order',
    ];

    public $translatedAttributes = [
        'name',
        'description',
        'content',
        'seo_title',
        'seo_keyword',
        'seo_description',
    ];

    protected $casts = [
        'is_coupon' => 'boolean',
        'is_stock' => 'boolean',
        'sold_quantity' => 'integer',
        'price' => 'decimal:2',
    ];

    public function photos(): HasMany
    {
        return $this->hasMany(ProductPhoto::class, 'product_id')->orderBy('order');
    }

    public function defaultPhoto()
    {
        return $this->hasOne(ProductPhoto::class, 'product_id')->where('is_default', true);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_product');
    }

    public function promotionCampaigns(): BelongsToMany
    {
        return $this->belongsToMany(PromotionCampaign::class, 'promotion_campaign_products', 'product_id', 'promotion_campaign_id')
            ->withTimestamps();
    }

    public function adjustmentHistories(): HasMany
    {
        return $this->hasMany(InventoryAdjustmentHistory::class, 'product_id');
    }

    public function buyToGiftStockAllocations(): HasMany
    {
        return $this->hasMany(PromotionBuyToGiftRuleStockAllocation::class, 'product_id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
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

    public function attributeValues(): BelongsToMany
    {
        return $this->belongsToMany(
            AttributeValue::class,
            'product_attribute_values',
            'product_id',
            'attribute_value_id'
        )->withTimestamps();
    }
}
