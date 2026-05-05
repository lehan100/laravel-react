<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductAttributeTranslation extends Model
{
    use HasFactory;

    protected $table = 'attribute_translations';

    protected $fillable = [
        'attribute_id',
        'locale',
        'name',
    ];

    public function attribute(): BelongsTo
    {
        return $this->belongsTo(ProductAttribute::class, 'attribute_id');
    }
}
