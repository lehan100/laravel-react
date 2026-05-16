<?php

namespace App\Models\Promotion;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PromotionCampaignTranslation extends Model
{
    use HasFactory, SoftDeletes;

    public $timestamps = true;

    protected $table = 'promotion_campaign_translations';

    protected $fillable = [
        'promotion_campaign_id',
        'locale',
        'name',
        'description',
    ];

    public function promotionCampaign(): BelongsTo
    {
        return $this->belongsTo(PromotionCampaign::class, 'promotion_campaign_id');
    }
}
