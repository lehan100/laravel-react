<?php

namespace App\Models\Promotion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PromotionBuyToGiftOffer extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'promotion_buytogift_offers';

    protected $fillable = [
        'code',
        'name',
        'description',
        'starts_at',
        'ends_at',
        'priority',
        'is_active',
        'stackable',
    ];

    protected $casts = [
        'priority' => 'integer',
        'is_active' => 'boolean',
        'stackable' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function rules(): HasMany
    {
        return $this->hasMany(PromotionBuyToGiftOfferRule::class, 'promotion_buytogift_offer_id');
    }

    public function activeRules(): HasMany
    {
        return $this->rules()->where('is_active', true);
    }
}
