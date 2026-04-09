<?php

namespace App\Models\Promotion;

use App\Models\Catalog\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PromotionBuyToGiftOffer extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'promotion_buytogift_offers';

    protected $fillable = [
        'code',
        'name',
        'description',
        'condition_type',
        'min_order_amount',
        'max_sets_per_order',
        'starts_at',
        'ends_at',
        'priority',
        'is_active',
        'stackable',
    ];

    protected $casts = [
        'min_order_amount' => 'decimal:2',
        'max_sets_per_order' => 'integer',
        'priority' => 'integer',
        'is_active' => 'boolean',
        'stackable' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function buyProducts(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'promotion_buytogift_conditions',
            'promotion_buytogift_id',
            'product_id'
        )->withPivot(['buy_qty'])->withTimestamps();
    }

    public function giftProducts(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'promotion_buytogift_rewards',
            'promotion_buytogift_id',
            'product_id'
        )->withPivot(['gift_qty', 'is_auto_add'])->withTimestamps();
    }
}

