<?php

namespace App\Models\Promotion;

use App\Models\Catalog\Category;
use App\Models\Catalog\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PromotionCoupon extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'promotion_coupons';

    protected $fillable = [
        'code',
        'name',
        'description',
        'discount_type',
        'discount_value',
        'max_discount_amount',
        'min_order_amount',
        'max_order_amount',
        'first_order_only',
        'usage_limit_total',
        'usage_limit_per_user',
        'used_count',
        'starts_at',
        'ends_at',
        'is_active',
        'is_public',
        'stackable',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'max_discount_amount' => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'max_order_amount' => 'decimal:2',
        'first_order_only' => 'boolean',
        'is_active' => 'boolean',
        'is_public' => 'boolean',
        'stackable' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'coupon_products', 'promotion_coupon_id', 'product_id')
            ->withTimestamps();
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'coupon_categories', 'promotion_coupon_id', 'category_id')
            ->withTimestamps();
    }
}
