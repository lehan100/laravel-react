<?php

namespace App\Models\Catalog;

use App\Traits\HasImageFile;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductPhoto extends Model
{
    use HasFactory, HasImageFile, SoftDeletes;

    public $timestamps = true;

    protected $table = 'product_photos';

    protected $fillable = ['product_id', 'filename', 'disk', 'alt', 'order', 'is_default'];

    protected $imageColumn = 'filename';

    public function getImagePath()
    {
        return config('image.path.product', null);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
