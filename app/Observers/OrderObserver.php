<?php

namespace App\Observers;

use App\Models\Sales\Order;
use App\Models\Sales\PaymentMethod;
use App\Models\Users\User;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;

class OrderObserver implements ShouldHandleEventsAfterCommit
{
    public function created(Order $order): void
    {
        $context = request()->attributes->get('order_timeline_context');
        if (! is_array($context) || ($context['action'] ?? null) !== 'created') {
            return;
        }

        $order->timelines()->create([
            'user_id' => auth()->id(),
            'event_type' => 'created',
            'title' => __('hancms.sales.orders.history.event_labels.created'),
            'description' => __('hancms.sales.orders.history.messages.created', [
                'order_status' => $this->statusLabel('order', (string) $order->order_status),
                'payment_status' => $this->statusLabel('payment', (string) $order->payment_status),
                'shipping_status' => $this->statusLabel('shipping', (string) $order->shipping_status),
            ]),
            'new_value' => (string) $order->order_status,
            'meta' => array_merge($this->timelineActorMeta(), [
                'order_status' => (string) $order->order_status,
                'payment_status' => (string) $order->payment_status,
                'shipping_status' => (string) $order->shipping_status,
            ]),
        ]);
    }

    public function updated(Order $order): void
    {
        $context = request()->attributes->get('order_timeline_context');
        if (! is_array($context) || ($context['action'] ?? null) !== 'updated') {
            return;
        }

        $timelineMeta = $this->timelineActorMeta();
        $original = is_array($context['original'] ?? null) ? $context['original'] : [];
        $currentPaymentMethodName = $this->paymentMethodName($order->payment_method_id);
        $nextItemSignature = (string) ($context['next_items_signature'] ?? '');

        $this->appendStateChangeTimeline(
            $order,
            'order_status_changed',
            (string) ($original['order_status'] ?? $order->getOriginal('order_status') ?? ''),
            (string) $order->order_status,
            __('hancms.sales.orders.history.event_labels.order_status_changed'),
            'order'
        );

        $this->appendStateChangeTimeline(
            $order,
            'payment_status_changed',
            (string) ($original['payment_status'] ?? $order->getOriginal('payment_status') ?? ''),
            (string) $order->payment_status,
            __('hancms.sales.orders.history.event_labels.payment_status_changed'),
            'payment'
        );

        $this->appendStateChangeTimeline(
            $order,
            'shipping_status_changed',
            (string) ($original['shipping_status'] ?? $order->getOriginal('shipping_status') ?? ''),
            (string) $order->shipping_status,
            __('hancms.sales.orders.history.event_labels.shipping_status_changed'),
            'shipping'
        );

        $originalPaymentMethodId = $original['payment_method_id'] ?? $order->getOriginal('payment_method_id');
        if ((int) $originalPaymentMethodId !== (int) $order->payment_method_id) {
            $order->timelines()->create([
                'user_id' => auth()->id(),
                'event_type' => 'payment_method_changed',
                'title' => __('hancms.sales.orders.history.event_labels.payment_method_changed'),
                'description' => __('hancms.sales.orders.history.messages.payment_method_changed', [
                    'from' => $this->paymentMethodName($originalPaymentMethodId),
                    'to' => $currentPaymentMethodName,
                ]),
                'old_value' => $this->paymentMethodName($originalPaymentMethodId),
                'new_value' => $currentPaymentMethodName,
                'meta' => $timelineMeta,
            ]);
        }

        $hasGeneralUpdate = $this->hasGeneralUpdate($order, $original, $nextItemSignature);

        if ($hasGeneralUpdate) {
            $order->timelines()->create([
                'user_id' => auth()->id(),
                'event_type' => 'updated',
                'title' => __('hancms.sales.orders.history.event_labels.updated'),
                'description' => __('hancms.sales.orders.history.messages.updated'),
                'meta' => array_merge($timelineMeta, [
                    'order_status' => (string) $order->order_status,
                    'payment_status' => (string) $order->payment_status,
                    'shipping_status' => (string) $order->shipping_status,
                    'total_quantity' => (int) $order->total_quantity,
                    'grand_total' => (float) $order->grand_total,
                ]),
            ]);
        }
    }

    public function deleted(Order $order): void
    {
        $context = request()->attributes->get('order_timeline_context');
        if (! is_array($context) || ($context['action'] ?? null) !== 'deleted') {
            return;
        }

        logger()->info('order.deleted', [
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'title' => __('hancms.sales.orders.history.event_labels.deleted'),
            'description' => __('hancms.sales.orders.history.messages.deleted', [
                'order_number' => $order->order_number ?: ('#'.$order->id),
                'customer_name' => $order->customer_name ?: '-',
            ]),
            'meta' => $this->timelineActorMeta(),
        ]);
    }

    private function appendStateChangeTimeline(
        Order $order,
        string $eventType,
        string $oldValue,
        string $newValue,
        string $title,
        string $statusGroup
    ): void {
        if ($oldValue === $newValue) {
            return;
        }

        $order->timelines()->create([
            'user_id' => auth()->id(),
            'event_type' => $eventType,
            'title' => $title,
            'description' => __('hancms.sales.orders.history.messages.'.$eventType, [
                'from' => $this->statusLabel($statusGroup, $oldValue),
                'to' => $this->statusLabel($statusGroup, $newValue),
            ]),
            'old_value' => $oldValue,
            'new_value' => $newValue,
            'meta' => $this->timelineActorMeta(),
        ]);
    }

    /**
     * @param  array<string, mixed>  $original
     */
    private function hasGeneralUpdate(Order $order, array $original, string $nextItemSignature): bool
    {
        return (string) ($original['customer_name'] ?? $order->getOriginal('customer_name') ?? '') !== (string) $order->customer_name
            || $this->normalizeNullable($original['customer_email'] ?? $order->getOriginal('customer_email')) !== $this->normalizeNullable($order->customer_email)
            || $this->normalizeNullable($original['customer_phone'] ?? $order->getOriginal('customer_phone')) !== $this->normalizeNullable($order->customer_phone)
            || $this->normalizeNullable($original['customer_address'] ?? $order->getOriginal('customer_address')) !== $this->normalizeNullable($order->customer_address)
            || $this->normalizeNullable($original['note'] ?? $order->getOriginal('note')) !== $this->normalizeNullable($order->note)
            || $this->snapshotSignature($original['price_snapshot'] ?? $order->getOriginal('price_snapshot')) !== $this->snapshotSignature($order->price_snapshot)
            || $this->normalizeNullable($original['placed_at'] ?? $this->formatDateTime($order->getOriginal('placed_at'))) !== $this->formatDateTime($order->placed_at)
            || $this->normalizeFloat($original['discount_total'] ?? $order->getOriginal('discount_total')) !== $this->normalizeFloat($order->discount_total)
            || $this->normalizeFloat($original['shipping_total'] ?? $order->getOriginal('shipping_total')) !== $this->normalizeFloat($order->shipping_total)
            || $this->normalizeFloat($original['subtotal'] ?? $order->getOriginal('subtotal')) !== $this->normalizeFloat($order->subtotal)
            || $this->normalizeFloat($original['grand_total'] ?? $order->getOriginal('grand_total')) !== $this->normalizeFloat($order->grand_total)
            || (int) ($original['total_quantity'] ?? $order->getOriginal('total_quantity') ?? 0) !== (int) $order->total_quantity
            || (string) ($original['items_signature'] ?? '') !== $nextItemSignature;
    }

    private function paymentMethodName(mixed $paymentMethodId): string
    {
        if (! $paymentMethodId) {
            return '-';
        }

        return PaymentMethod::query()->whereKey((int) $paymentMethodId)->value('name') ?: '-';
    }

    private function statusLabel(string $group, string $value): string
    {
        $key = 'hancms.sales.orders.statuses.'.$group.'.'.$value;
        $label = __($key);

        return $label === $key ? $value : $label;
    }

    /**
     * @return array<string, mixed>
     */
    private function timelineActorMeta(): array
    {
        $user = auth()->user();

        return [
            'user_name' => $user instanceof User ? $user->name : __('hancms.sales.orders.history.system_user'),
            'user_email' => $user instanceof User ? $user->email : null,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ];
    }

    private function normalizeNullable(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $trimmed = trim((string) $value);

        return $trimmed === '' ? null : $trimmed;
    }

    private function normalizeFloat(mixed $value): float
    {
        return round((float) $value, 2);
    }

    private function formatDateTime(mixed $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d H:i:s');
        }

        return (string) $value;
    }

    private function snapshotSignature(mixed $snapshot): string
    {
        if (! is_array($snapshot)) {
            $snapshot = [];
        }

        return md5(json_encode($snapshot) ?: '[]');
    }
}
