<?php

namespace App\Models\Sales;

use App\Models\Settings\Province;
use App\Models\Settings\Ward;
use App\Models\Users\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    public const ORDER_STATUSES = [
        'pending',
        'confirmed',
        'processing',
        'completed',
        'cancelled',
    ];

    public const PAYMENT_STATUSES = [
        'unpaid',
        'paid',
        'refunded',
        'failed',
    ];

    public const SHIPPING_STATUSES = [
        'pending',
        'ready_to_ship',
        'shipping',
        'delivered',
        'returned',
    ];

    protected $table = 'orders';

    protected $fillable = [
        'order_number',
        'user_id',
        'payment_method_id',
        'price_snapshot',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'province_code',
        'ward_code',
        'note',
        'order_status',
        'payment_status',
        'shipping_status',
        'total_quantity',
        'subtotal',
        'discount_total',
        'shipping_total',
        'grand_total',
        'placed_at',
        'coupon_code',
        'applied_promotions',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'payment_method_id' => 'integer',
        'price_snapshot' => 'array',
        'province_code' => 'string',
        'ward_code' => 'string',
        'total_quantity' => 'integer',
        'subtotal' => 'decimal:2',
        'discount_total' => 'decimal:2',
        'shipping_total' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'placed_at' => 'datetime',
        'applied_promotions' => 'array',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function timelines(): HasMany
    {
        return $this->hasMany(OrderTimeline::class, 'order_id')->orderByDesc('id');
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province_code', 'code');
    }

    public function ward(): BelongsTo
    {
        return $this->belongsTo(Ward::class, 'ward_code', 'code');
    }
}
