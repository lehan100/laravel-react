<?php

namespace App\Models\Promotion;

use App\Models\Catalog\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PromotionBuyToGiftOfferRule extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'promotion_buytogift_offer_rules';

    protected $fillable = [
        'promotion_buytogift_offer_id',
        'condition_type',
        'min_order_amount',
        'max_sets_per_order',
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
    ];

    public function offer(): BelongsTo
    {
        return $this->belongsTo(PromotionBuyToGiftOffer::class, 'promotion_buytogift_offer_id');
    }

    public function buyProducts(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'promotion_buytogift_rule_buy_items',
            'promotion_buytogift_rule_id',
            'product_id'
        )->withPivot(['buy_qty'])->withTimestamps();
    }

    public function giftProducts(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'promotion_buytogift_rule_gift_items',
            'promotion_buytogift_rule_id',
            'product_id'
        )->withPivot(['gift_qty', 'is_auto_add'])->withTimestamps();
    }
}
