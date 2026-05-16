<?php

namespace App\Http\Resources\Sales;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $paymentMethod = $this->relationLoaded('paymentMethod') ? $this->paymentMethod : null;
        $province = $this->relationLoaded('province') ? $this->province : null;
        $ward = $this->relationLoaded('ward') ? $this->ward : null;
        $locale = strtolower((string) app()->getLocale());
        $useEnglishNames = in_array(explode('-', $locale)[0], ['en', 'ja'], true);

        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'user_id' => $this->user_id,
            'payment_method_id' => $this->payment_method_id,
            'payment_method_name' => $paymentMethod?->name ?? $this->payment_method_name ?? null,
            'payment_method_code' => $paymentMethod?->code ?? null,
            'price_snapshot' => $this->price_snapshot ?? [],
            'currency_code' => $this->currencyCodeFromSnapshot(),
            'currency_symbol' => $this->currencySymbolFromSnapshot(),
            'exchange_rate_to_vnd' => $this->exchangeRateFromSnapshot(),
            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'customer_phone' => $this->customer_phone,
            'customer_address' => $this->customer_address,
            'province_code' => $this->province_code,
            'province_name' => $useEnglishNames
                ? ($province?->full_name_en ?? $province?->name_en ?? $province?->full_name ?? $province?->name)
                : ($province?->full_name ?? $province?->name ?? $province?->full_name_en ?? $province?->name_en),
            'province_name_en' => $province?->full_name_en ?? $province?->name_en,
            'ward_code' => $this->ward_code,
            'ward_name' => $useEnglishNames
                ? ($ward?->full_name_en ?? $ward?->name_en ?? $ward?->full_name ?? $ward?->name)
                : ($ward?->full_name ?? $ward?->name ?? $ward?->full_name_en ?? $ward?->name_en),
            'ward_name_en' => $ward?->full_name_en ?? $ward?->name_en,
            'note' => $this->note,
            'order_status' => $this->order_status,
            'payment_status' => $this->payment_status,
            'shipping_status' => $this->shipping_status,
            'total_quantity' => (int) ($this->total_quantity ?? 0),
            'subtotal' => $this->subtotal,
            'discount_total' => $this->discount_total,
            'shipping_total' => $this->shipping_total,
            'grand_total' => $this->grand_total,
            'coupon_code' => $this->coupon_code,
            'applied_promotions' => $this->applied_promotions ?? [],
            'placed_at' => optional($this->placed_at)?->format('Y-m-d H:i:s'),
            'items' => OrderItemResource::collection($this->relationLoaded('items') ? $this->items : collect()),
            'timelines' => OrderTimelineResource::collection($this->relationLoaded('timelines') ? $this->timelines : collect()),
            'created_at' => optional($this->created_at)?->format('Y-m-d H:i:s'),
            'updated_at' => optional($this->updated_at)?->format('Y-m-d H:i:s'),
        ];
    }

    private function currencyCodeFromSnapshot(): ?string
    {
        $snapshot = $this->price_snapshot;

        if (! is_array($snapshot) || $snapshot === []) {
            return null;
        }

        $firstEntry = $snapshot[0] ?? null;
        if (! is_array($firstEntry)) {
            return null;
        }

        return isset($firstEntry['currency_code']) ? strtoupper((string) $firstEntry['currency_code']) : null;
    }

    private function currencySymbolFromSnapshot(): ?string
    {
        $snapshot = $this->price_snapshot;

        if (! is_array($snapshot) || $snapshot === []) {
            return null;
        }

        $firstEntry = $snapshot[0] ?? null;
        if (! is_array($firstEntry)) {
            return null;
        }

        return isset($firstEntry['currency_symbol']) ? (string) $firstEntry['currency_symbol'] : null;
    }

    private function exchangeRateFromSnapshot(): ?float
    {
        $snapshot = $this->price_snapshot;

        if (! is_array($snapshot) || $snapshot === []) {
            return null;
        }

        $firstEntry = $snapshot[0] ?? null;
        if (! is_array($firstEntry)) {
            return null;
        }

        return isset($firstEntry['exchange_rate_to_vnd']) ? (float) $firstEntry['exchange_rate_to_vnd'] : null;
    }
}
