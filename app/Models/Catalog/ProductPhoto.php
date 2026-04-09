<?php

namespace App\Models\Catalog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\HasImageFile;

class ProductPhoto extends Model
{
    use SoftDeletes, HasFactory, HasImageFile;
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
