<?php

namespace App\Http\Resources\Sales;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderTimelineResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $this->relationLoaded('user') ? $this->user : null;

        return [
            'id' => $this->id,
            'event_type' => $this->event_type,
            'title' => $this->translatedTitle(),
            'description' => $this->translatedDescription(),
            'old_value' => $this->old_value,
            'new_value' => $this->new_value,
            'meta' => $this->meta ?? [],
            'created_at' => optional($this->created_at)?->format('Y-m-d H:i:s'),
            'user_name' => $user?->name ?: __('hancms.sales.orders.history.system_user'),
            'user_email' => $user?->email,
        ];
    }

    private function translatedTitle(): string
    {
        $key = match ($this->event_type) {
            'created' => 'hancms.sales.orders.history.event_labels.created',
            'updated' => 'hancms.sales.orders.history.event_labels.updated',
            'deleted' => 'hancms.sales.orders.history.event_labels.deleted',
            'order_status_changed' => 'hancms.sales.orders.history.event_labels.order_status_changed',
            'payment_status_changed' => 'hancms.sales.orders.history.event_labels.payment_status_changed',
            'shipping_status_changed' => 'hancms.sales.orders.history.event_labels.shipping_status_changed',
            'payment_method_changed' => 'hancms.sales.orders.history.event_labels.payment_method_changed',
            default => '',
        };

        if ($key === '') {
            return (string) $this->title;
        }

        return __($key);
    }

    private function translatedDescription(): string
    {
        if ($this->event_type === 'created') {
            $meta = is_array($this->meta ?? null) ? $this->meta : [];
            $hasStatusMeta = filled($meta['order_status'] ?? null) || filled($meta['payment_status'] ?? null) || filled($meta['shipping_status'] ?? null);

            if (! $hasStatusMeta && filled($this->description)) {
                return (string) $this->description;
            }

            return __('hancms.sales.orders.history.messages.created', [
                'order_status' => $this->statusLabel('order', (string) ($meta['order_status'] ?? $this->new_value ?? '')),
                'payment_status' => $this->statusLabel('payment', (string) ($meta['payment_status'] ?? '')),
                'shipping_status' => $this->statusLabel('shipping', (string) ($meta['shipping_status'] ?? '')),
            ]);
        }

        if ($this->event_type === 'updated') {
            return __('hancms.sales.orders.history.messages.updated');
        }

        if ($this->event_type === 'order_status_changed') {
            return __('hancms.sales.orders.history.messages.order_status_changed', [
                'from' => $this->statusLabel('order', (string) $this->old_value),
                'to' => $this->statusLabel('order', (string) $this->new_value),
            ]);
        }

        if ($this->event_type === 'payment_status_changed') {
            return __('hancms.sales.orders.history.messages.payment_status_changed', [
                'from' => $this->statusLabel('payment', (string) $this->old_value),
                'to' => $this->statusLabel('payment', (string) $this->new_value),
            ]);
        }

        if ($this->event_type === 'shipping_status_changed') {
            return __('hancms.sales.orders.history.messages.shipping_status_changed', [
                'from' => $this->statusLabel('shipping', (string) $this->old_value),
                'to' => $this->statusLabel('shipping', (string) $this->new_value),
            ]);
        }

        if ($this->event_type === 'payment_method_changed') {
            return __('hancms.sales.orders.history.messages.payment_method_changed', [
                'from' => (string) ($this->old_value ?: '-'),
                'to' => (string) ($this->new_value ?: '-'),
            ]);
        }

        return (string) ($this->description ?? '');
    }

    private function statusLabel(string $group, string $value): string
    {
        $key = 'hancms.sales.orders.statuses.'.$group.'.'.$value;
        $label = __($key);

        return $label === $key ? $value : $label;
    }
}
