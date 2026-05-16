<?php

namespace App\Models\Promotion;

use App\Models\Catalog\Product;
use App\Models\Catalog\ProductVariant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromotionBuyToGiftRuleStockAllocation extends Model
{
    use HasFactory;

    protected $table = 'promotion_buytogift_rule_stock_allocations';

    protected $fillable = [
        'promotion_buytogift_offer_rule_id',
        'product_id',
        'variant_id',
        'allocated_quantity',
    ];

    protected $casts = [
        'allocated_quantity' => 'integer',
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
