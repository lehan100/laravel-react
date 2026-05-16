<?php

namespace App\Models\Promotion;

use App\Models\Catalog\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PromotionSaleOffer extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'promotion_saleoffers';

    protected $fillable = [
        'code',
        'name',
        'description',
        'campaign_id',
        'discount_type',
        'discount_value',
        'max_discount_amount',
        'starts_at',
        'ends_at',
        'priority',
        'is_active',
        'stackable',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'max_discount_amount' => 'decimal:2',
        'priority' => 'integer',
        'is_active' => 'boolean',
        'stackable' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(PromotionCampaign::class, 'campaign_id');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'saleoffer_products', 'promotion_saleoffer_id', 'product_id')
            ->withTimestamps();
    }
}
