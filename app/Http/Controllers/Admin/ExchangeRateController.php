<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class ExchangeRateController extends Controller
{
    private const PRIMARY_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/%s.json';
    private const FALLBACK_URL = 'https://latest.currency-api.pages.dev/v1/currencies/%s.json';
    private const CACHE_TTL_MINUTES = 60;

    public function show(string $currency = 'VND'): JsonResponse
    {
        $currency = strtoupper(trim($currency));
        $cacheKey = "exchange-rate:v2:vnd-to-{$currency}";
        $cached = Cache::get($cacheKey);
        $payload = null;

        if (is_array($cached)) {
            $cachedRate = (float) ($cached['rateToVnd'] ?? 0);

            if ($cachedRate > 0 && $cachedRate !== 1.0) {
                $payload = $cached;
            }
        }

        if (!$payload) {
            $payload = $this->fetchRatePayload($currency);

            if ($payload && (float) ($payload['rateToVnd'] ?? 0) > 0 && (float) ($payload['rateToVnd'] ?? 0) !== 1.0) {
                Cache::put($cacheKey, $payload, now()->addMinutes(self::CACHE_TTL_MINUTES));
            }
        }

        if (!$payload) {
            return response()->json([
                'code' => $currency,
                'rateToVnd' => 1,
                'source' => 'fallback',
            ], 200);
        }

        return response()->json($payload);
    }

    private function fetchRatePayload(string $currency): ?array
    {
        $baseData = $this->fetchBaseCurrencyData('usd');

        if (!is_array($baseData)) {
            return null;
        }

        if ($currency === 'VND') {
            return [
                'code' => 'VND',
                'rateToVnd' => 1,
                'source' => $baseData['source'] ?? 'currency-api',
                'baseCurrency' => 'USD',
                'updatedAt' => $baseData['date'] ?? null,
            ];
        }

        $usdToVnd = data_get($baseData, 'usd.vnd', data_get($baseData, 'vnd'));
        $usdToTarget = data_get($baseData, 'usd.' . strtolower($currency), data_get($baseData, strtolower($currency)));

        if (!is_numeric($usdToVnd) || (float) $usdToVnd <= 0) {
            return null;
        }

        if (!is_numeric($usdToTarget) || (float) $usdToTarget <= 0) {
            return null;
        }

        return [
            'code' => $currency,
            'rateToVnd' => round(((float) $usdToVnd) / ((float) $usdToTarget), 8),
            'source' => $baseData['source'] ?? 'currency-api',
            'baseCurrency' => 'USD',
            'updatedAt' => $baseData['date'] ?? null,
        ];
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
