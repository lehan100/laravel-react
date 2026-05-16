<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductTranslation extends Model
{
    use HasFactory, SoftDeletes;

    public $timestamps = true;

    protected $table = 'product_translations';

    protected $fillable = [
        'product_id',
        'locale',
        'name',
        'description',
        'content',
        'seo_title',
        'seo_keyword',
        'seo_description',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
