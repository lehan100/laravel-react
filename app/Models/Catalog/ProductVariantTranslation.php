<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariantTranslation extends Model
{
    use HasFactory;

    protected $table = 'variant_translations';

    protected $fillable = [
        'product_variant_id',
        'locale',
        'name',
    ];

    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
