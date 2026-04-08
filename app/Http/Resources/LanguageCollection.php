<?php

namespace App\Http\Resources;

use App\Services\ExchangeRateService;
use Illuminate\Http\Resources\Json\ResourceCollection;

class LanguageCollection extends ResourceCollection
{
    private const LANGUAGE_CURRENCY_MAP = [
        'vi' => 'VND',
        'vn' => 'VND',
        'en' => 'USD',
        'ja' => 'JPY',
        'ko' => 'KRW',
        'zh' => 'CNY',
        'th' => 'THB',
        'fr' => 'EUR',
        'de' => 'EUR',
        'es' => 'EUR',
        'it' => 'EUR',
        'pt' => 'BRL',
        'ru' => 'RUB',
        'ar' => 'SAR',
        'hi' => 'INR',
        'id' => 'IDR',
        'ms' => 'MYR',
        'tr' => 'TRY',
        'nl' => 'EUR',
        'pl' => 'PLN',
        'sv' => 'SEK',
        'da' => 'DKK',
        'no' => 'NOK',
        'fi' => 'EUR',
        'cs' => 'CZK',
        'hu' => 'HUF',
        'ro' => 'RON',
        'el' => 'EUR',
        'he' => 'ILS',
        'uk' => 'UAH',
        'bn' => 'BDT',
        'ta' => 'INR',
        'ur' => 'PKR',
    ];

    private function resolveCurrency(array $lang): string
    {
        $currency = strtoupper(trim((string) ($lang['currency'] ?? '')));

        if ($currency !== '') {
            return $currency;
        }

        $code = strtolower(trim((string) ($lang['code'] ?? '')));

        return self::LANGUAGE_CURRENCY_MAP[$code] ?? 'VND';
    }

    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $exchangeRateService = app(ExchangeRateService::class);

        return $this->collection->map->only(
            [
                'id',
                'name',
                'code',
                'currency',
                'photo',
                'status',
            ])->map(function (array $lang) use ($exchangeRateService) {
                $lang['currency'] = $this->resolveCurrency($lang);
                $lang['rate_to_vnd'] = $exchangeRateService->rateToVnd($lang['currency']);
                return $lang;
            })->all();
    }
}
