<?php

namespace App\Models\Promotion;

use App\Models\Catalog\Product;
use App\Models\Catalog\ProductVariant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromotionBuyToGiftRuleGiftVariantOption extends Model
{
    use HasFactory;

    protected $table = 'promotion_buytogift_rule_gift_variant_options';

    protected $fillable = [
        'promotion_buytogift_offer_rule_id',
        'product_id',
        'variant_id',
        'reserve_qty',
    ];

    protected $casts = [
        'reserve_qty' => 'integer',
    ];

    public function rule(): BelongsTo
    {
        return $this->belongsTo(PromotionBuyToGiftOfferRule::class, 'promotion_buytogift_offer_rule_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }
}
