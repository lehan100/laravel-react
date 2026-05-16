<?php

namespace App\Traits;

use App\Services\ExchangeRateService;

trait HasCurrencyFormatter
{
    private function money(mixed $value): string
    {
        $amount = (float) $value;
        $currencyCode = $this->reportCurrencyCode();
        $displayAmount = $this->convertToDisplayCurrency($amount, $currencyCode);
        $fractionDigits = $currencyCode === 'VND' ? 0 : 3;
        $numeric = number_format($displayAmount, $fractionDigits, '.', ',');
        $format = $this->currencyFormat($currencyCode);
        $symbol = $format['symbol'];

        if ($currencyCode === 'VND' || $currencyCode === 'USD') {
            return $numeric.' '.$symbol;
        }

        if ($format['prefix']) {
            return $symbol.$numeric;
        }

        return $numeric.' '.$symbol;
    }

    private function reportCurrencyCode(): string
    {
        return match ($this->normalizeLocale(app()->getLocale())) {
            'en' => 'USD',
            'ja' => 'JPY',
            'ko' => 'KRW',
            'zh' => 'CNY',
            'th' => 'THB',
            'fr', 'de', 'es', 'it', 'nl', 'fi', 'el' => 'EUR',
            'pt' => 'BRL',
            'ru' => 'RUB',
            'ar' => 'SAR',
            'hi' => 'INR',
            'id' => 'IDR',
            'ms' => 'MYR',
            'tr' => 'TRY',
            'pl' => 'PLN',
            'sv' => 'SEK',
            'da' => 'DKK',
            'no' => 'NOK',
            'cs' => 'CZK',
            'hu' => 'HUF',
            'ro' => 'RON',
            'he' => 'ILS',
            'uk' => 'UAH',
            'bn' => 'BDT',
            'ta' => 'INR',
            'ur' => 'PKR',
            default => 'VND',
        };
    }

    /**
     * @return array{symbol: string, prefix: bool}
     */
    private function currencyFormat(string $currencyCode): array
    {
        return match (strtoupper($currencyCode)) {
            'VND' => ['symbol' => 'đ', 'prefix' => false],
            'USD' => ['symbol' => '$', 'prefix' => false],
            'JPY' => ['symbol' => '￥', 'prefix' => true],
            'KRW' => ['symbol' => '₩', 'prefix' => true],
            'CNY' => ['symbol' => '¥', 'prefix' => true],
            'THB' => ['symbol' => '฿', 'prefix' => true],
            'EUR' => ['symbol' => '€', 'prefix' => false],
            'BRL' => ['symbol' => 'R$', 'prefix' => true],
            'RUB' => ['symbol' => '₽', 'prefix' => true],
            'SAR' => ['symbol' => '﷼', 'prefix' => true],
            'INR' => ['symbol' => '₹', 'prefix' => true],
            'IDR' => ['symbol' => 'Rp', 'prefix' => true],
            'MYR' => ['symbol' => 'RM', 'prefix' => true],
            'TRY' => ['symbol' => '₺', 'prefix' => true],
            'PLN' => ['symbol' => 'zł', 'prefix' => true],
            'SEK' => ['symbol' => 'kr', 'prefix' => true],
            'DKK' => ['symbol' => 'kr', 'prefix' => true],
            'NOK' => ['symbol' => 'kr', 'prefix' => true],
            'CZK' => ['symbol' => 'Kč', 'prefix' => true],
            'HUF' => ['symbol' => 'Ft', 'prefix' => true],
            'RON' => ['symbol' => 'lei', 'prefix' => true],
            'ILS' => ['symbol' => '₪', 'prefix' => true],
            'UAH' => ['symbol' => '₴', 'prefix' => true],
            'BDT' => ['symbol' => '৳', 'prefix' => true],
            'PKR' => ['symbol' => 'Rs', 'prefix' => true],
            default => ['symbol' => strtoupper($currencyCode), 'prefix' => false],
        };
    }

    private function convertToDisplayCurrency(float $amount, string $currencyCode): float
    {
        if ($currencyCode === 'VND') {
            return $amount;
        }

        $rateToVnd = $this->getExchangeRateService()->rateToVnd($currencyCode);

        if ($rateToVnd <= 0) {
            return $amount;
        }

        return round($amount / $rateToVnd, 3);
    }

    private function normalizeLocale(?string $locale): string
    {
        $normalized = strtolower(trim((string) $locale));

        if ($normalized === 'vn') {
            return 'vi';
        }

        return explode('-', $normalized)[0] ?: 'vi';
    }

    private function getExchangeRateService(): ExchangeRateService
    {
        if (property_exists($this, 'exchangeRateService') && $this->exchangeRateService instanceof ExchangeRateService) {
            return $this->exchangeRateService;
        }

        return app(ExchangeRateService::class);
    }
}
