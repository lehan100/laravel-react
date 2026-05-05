<?php

namespace App\Models\Sales;

use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderTimeline extends Model
{
    use HasFactory;

    protected $table = 'order_timelines';

    protected $fillable = [
        'order_id',
        'user_id',
        'event_type',
        'title',
        'description',
        'old_value',
        'new_value',
        'meta',
    ];

    protected $casts = [
        'order_id' => 'integer',
        'user_id' => 'integer',
        'meta' => 'array',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
