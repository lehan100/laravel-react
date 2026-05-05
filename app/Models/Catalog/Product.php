<?php

namespace App\Models\Catalog;

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
        'weight',
        'brand',
        'base_price',
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
        'base_price' => 'decimal:2',
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

    public function adjustmentHistories(): HasMany
    {
        return $this->hasMany(InventoryAdjustmentHistory::class, 'product_id');
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
}
