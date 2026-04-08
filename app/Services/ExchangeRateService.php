<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ExchangeRateService
{
    private const PRIMARY_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/%s.json';
    private const FALLBACK_URL = 'https://latest.currency-api.pages.dev/v1/currencies/%s.json';
    private const CACHE_TTL_MINUTES = 60;

    public function rateToVnd(string $currency): float
    {
        $currency = strtoupper(trim($currency));

        if ($currency === 'VND') {
            return 1;
        }

        $cacheKey = "exchange-rate:v2:vnd-to-{$currency}";
        $cached = Cache::get($cacheKey);

        if (is_numeric($cached) && (float) $cached > 0 && (float) $cached !== 1.0) {
            return (float) $cached;
        }

        $rate = $this->fetchRateToVnd($currency);

        if ($rate > 0 && $rate !== 1.0) {
            Cache::put($cacheKey, $rate, now()->addMinutes(self::CACHE_TTL_MINUTES));
        }

        return $rate;
    }

    private function fetchRateToVnd(string $currency): float
    {
        $currency = strtoupper(trim($currency));
        $baseData = $this->fetchBaseCurrencyData('usd');

        if (!is_array($baseData)) {
            return 1;
        }

        $usdToVnd = data_get($baseData, 'usd.vnd', data_get($baseData, 'vnd'));
        $usdToTarget = data_get($baseData, 'usd.' . strtolower($currency), data_get($baseData, strtolower($currency)));

        if (!is_numeric($usdToVnd) || !is_numeric($usdToTarget)) {
            return 1;
        }

        $usdToVnd = (float) $usdToVnd;
        $usdToTarget = (float) $usdToTarget;

        if ($usdToVnd <= 0 || $usdToTarget <= 0) {
            return 1;
        }

        return round($usdToVnd / $usdToTarget, 8);
    }

    private function fetchBaseCurrencyData(string $currency): ?array
    {
        $currency = strtolower($currency);
        $urls = [
            sprintf(self::PRIMARY_URL, $currency),
            sprintf(self::FALLBACK_URL, $currency),
        ];

        foreach ($urls as $url) {
            try {
                $response = Http::timeout(10)->get($url);

                if (!$response->successful()) {
                    continue;
                }

                $json = $response->json();
                if (!is_array($json)) {
                    continue;
                }

                return $json;
            } catch (\Throwable $th) {
                continue;
            }
        }

        return null;
    }
}
