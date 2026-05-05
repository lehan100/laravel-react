<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('orders')
            ->select([
                'id',
                'price_snapshot',
                'subtotal',
                'discount_total',
                'shipping_total',
                'grand_total',
                'placed_at',
                'created_at',
            ])
            ->orderBy('id')
            ->chunkById(100, function ($orders): void {
                foreach ($orders as $order) {
                    $snapshot = $this->normalizeSnapshot($order);
                    if ($snapshot === null) {
                        continue;
                    }

                    DB::table('orders')
                        ->where('id', $order->id)
                        ->update([
                            'price_snapshot' => json_encode($snapshot, JSON_UNESCAPED_UNICODE),
                        ]);
                }
            }, 'id');
    }

    public function down(): void
    {
        // Backfill migration is intentionally not reversed.
    }

    private function normalizeSnapshot(object $order): ?array
    {
        $snapshot = $this->decodeSnapshot($order->price_snapshot);
        $currencyCode = strtoupper(trim((string) ($snapshot['currency_code'] ?? 'VND'))) ?: 'VND';
        $exchangeRateToVnd = $this->normalizeRate($snapshot['exchange_rate_to_vnd'] ?? 1);
        $locale = $this->resolveLocale($snapshot['locale'] ?? null, $currencyCode);

        return [[
            'locale' => $this->resolveLocaleKey($locale),
            'currency_code' => $currencyCode,
            'currency_symbol' => $this->currencySymbol($currencyCode),
            'exchange_rate_to_vnd' => $exchangeRateToVnd,
        ]];
    }

    private function decodeSnapshot(mixed $snapshot): array
    {
        if (is_array($snapshot)) {
            return $snapshot;
        }

        if (! is_string($snapshot) || trim($snapshot) === '') {
            return [];
        }

        $decoded = json_decode($snapshot, true);

        return is_array($decoded) ? $decoded : [];
    }

    private function normalizeRate(mixed $value): float
    {
        $rate = round((float) $value, 8);

        return $rate > 0 ? $rate : 1;
    }

    private function resolveLocale(?string $locale, string $currencyCode): string
    {
        $normalized = trim((string) $locale);
        if ($normalized !== '') {
            return $normalized;
        }

        return match ($currencyCode) {
            'USD' => 'en-US',
            'JPY' => 'ja-JP',
            default => 'vi-VN',
        };
    }

    private function resolveLocaleKey(string $locale): string
    {
        $normalized = strtolower(trim($locale));

        return $normalized === '' ? 'vi' : explode('-', $normalized)[0];
    }

    private function currencySymbol(string $currencyCode): string
    {
        return match (strtoupper($currencyCode)) {
            'USD' => '$',
            'JPY' => '¥',
            'VND' => '₫',
            'EUR' => '€',
            'KRW' => '₩',
            'CNY' => '¥',
            'GBP' => '£',
            'AUD' => 'A$',
            'CAD' => 'C$',
            default => strtoupper($currencyCode),
        };
    }
};
