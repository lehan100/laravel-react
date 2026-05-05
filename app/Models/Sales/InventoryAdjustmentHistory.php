<?php

namespace App\Models\Sales;

use App\Models\Catalog\Product;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryAdjustmentHistory extends Model
{
    use HasFactory;

    protected $table = 'inventory_adjustment_histories';

    protected $fillable = [
        'product_id',
        'user_id',
        'action',
        'old_quantity',
        'new_quantity',
        'delta',
        'reason',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
