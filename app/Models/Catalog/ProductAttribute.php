<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductAttribute extends Model
{
    use HasFactory;

    protected $table = 'attributes';

    protected $fillable = [
        'name',
    ];

    public function values(): HasMany
    {
        return $this->hasMany(AttributeValue::class, 'attribute_id');
    }
}
