<?php

namespace App\Http\Resources\Promotion;

use App\Http\Resources\Concerns\ResolvesPromotionStatus;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    use ResolvesPromotionStatus;

    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'discount_type' => $this->discount_type,
            'discount_value' => (float) $this->discount_value,
            'max_discount_amount' => $this->max_discount_amount !== null ? (float) $this->max_discount_amount : null,
            'min_order_amount' => $this->min_order_amount !== null ? (float) $this->min_order_amount : null,
            'max_order_amount' => $this->max_order_amount !== null ? (float) $this->max_order_amount : null,
            'priority' => $this->priority,
            'first_order_only' => (bool) $this->first_order_only,
            'usage_limit_total' => $this->usage_limit_total,
            'usage_limit_per_user' => $this->usage_limit_per_user,
            'used_count' => $this->used_count,
            'starts_at' => optional($this->starts_at)->format('Y-m-d\\TH:i'),
            'ends_at' => optional($this->ends_at)->format('Y-m-d\\TH:i'),
            'campaign_id' => $this->campaign_id,
            'is_active' => (bool) $this->is_active,
            'promotion_status' => $this->resolvePromotionStatus((bool) $this->is_active, $this->starts_at, $this->ends_at),
            'is_public' => (bool) $this->is_public,
            'stackable' => (bool) $this->stackable,
            'category_ids' => $this->whenLoaded('categories', fn () => $this->categories->pluck('id')->values(), []),
            'product_ids' => $this->whenLoaded('products', fn () => $this->products->pluck('id')->values(), []),
            'created_at' => optional($this->created_at)->format('Y-m-d H:i:s'),
        ];
    }
}
