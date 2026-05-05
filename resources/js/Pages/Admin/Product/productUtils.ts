import axios from 'axios';

export function getLocaleCode(locale?: string) {
    if (!locale) return 'vi';
    const normalized = String(locale).trim().toLowerCase().replace('_', '-');
    if (normalized === 'vn') return 'vi';
    return normalized.split('-')[0];
}

type LanguageLike = {
    code?: string;
    currency?: string;
    locale?: string;
    intl_locale?: string;
    rate_to_vnd?: number | string;
    rateToVnd?: number | string;
    exchange_rate?: number | string;
    exchangeRate?: number | string;
};

export type ProductCurrency = {
    code: string;
    locale: string;
    rateToVnd: number;
};

type CurrencyLike = LanguageLike | ProductCurrency;

const LOCALE_CONFIG: Record<string, { locale: string; currency: string }> = {
    vi: { locale: 'vi-VN', currency: 'VND' },
    vn: { locale: 'vi-VN', currency: 'VND' },
    en: { locale: 'en-US', currency: 'USD' },
    ja: { locale: 'ja-JP', currency: 'JPY' },
    ko: { locale: 'ko-KR', currency: 'KRW' },
    zh: { locale: 'zh-CN', currency: 'CNY' },
    th: { locale: 'th-TH', currency: 'THB' },
    fr: { locale: 'fr-FR', currency: 'EUR' },
    de: { locale: 'de-DE', currency: 'EUR' },
    es: { locale: 'es-ES', currency: 'EUR' },
    it: { locale: 'it-IT', currency: 'EUR' },
    pt: { locale: 'pt-BR', currency: 'BRL' },
    ru: { locale: 'ru-RU', currency: 'RUB' },
    ar: { locale: 'ar-SA', currency: 'SAR' },
    hi: { locale: 'hi-IN', currency: 'INR' },
    id: { locale: 'id-ID', currency: 'IDR' },
    ms: { locale: 'ms-MY', currency: 'MYR' },
    tr: { locale: 'tr-TR', currency: 'TRY' },
    nl: { locale: 'nl-NL', currency: 'EUR' },
    pl: { locale: 'pl-PL', currency: 'PLN' },
    sv: { locale: 'sv-SE', currency: 'SEK' },
    da: { locale: 'da-DK', currency: 'DKK' },
    no: { locale: 'nb-NO', currency: 'NOK' },
    fi: { locale: 'fi-FI', currency: 'EUR' },
    cs: { locale: 'cs-CZ', currency: 'CZK' },
    hu: { locale: 'hu-HU', currency: 'HUF' },
    ro: { locale: 'ro-RO', currency: 'RON' },
    el: { locale: 'el-GR', currency: 'EUR' },
    he: { locale: 'he-IL', currency: 'ILS' },
    uk: { locale: 'uk-UA', currency: 'UAH' },
    bn: { locale: 'bn-BD', currency: 'BDT' },
    ta: { locale: 'ta-IN', currency: 'INR' },
    ur: { locale: 'ur-PK', currency: 'PKR' },
};

const CURRENCY_FORMATS: Record<string, { symbol: string; prefix?: boolean }> = {
    VND: { symbol: '₫' },
    USD: { symbol: '$' },
    JPY: { symbol: '￥', prefix: true },
    KRW: { symbol: '₩', prefix: true },
    CNY: { symbol: '¥', prefix: true },
    THB: { symbol: '฿', prefix: true },
    EUR: { symbol: '€', prefix: true },
    BRL: { symbol: 'R$', prefix: true },
    RUB: { symbol: '₽', prefix: true },
    SAR: { symbol: '﷼', prefix: true },
    INR: { symbol: '₹', prefix: true },
    IDR: { symbol: 'Rp', prefix: true },
    MYR: { symbol: 'RM', prefix: true },
    TRY: { symbol: '₺', prefix: true },
    PLN: { symbol: 'zł', prefix: true },
    SEK: { symbol: 'kr', prefix: true },
    DKK: { symbol: 'kr', prefix: true },
    NOK: { symbol: 'kr', prefix: true },
    CZK: { symbol: 'Kč', prefix: true },
    HUF: { symbol: 'Ft', prefix: true },
    RON: { symbol: 'lei', prefix: true },
    ILS: { symbol: '₪', prefix: true },
    UAH: { symbol: '₴', prefix: true },
    BDT: { symbol: '৳', prefix: true },
    PKR: { symbol: 'Rs', prefix: true },
};

const PRODUCT_CURRENCY_CACHE_TTL_MS = 60 * 60 * 1000;
const PRODUCT_CURRENCY_STORAGE_PREFIX = 'product-currency-cache:v2:';
const PRICE_DECIMALS = 3;

function getCurrencyCodeFromLanguage(language?: LanguageLike) {
    const explicitCurrency = String(language?.currency || '').trim().toUpperCase();
    return explicitCurrency || 'VND';
}

function getCurrencyCodeFromLocale(locale?: string) {
    const normalized = getLocaleCode(locale);
    return LOCALE_CONFIG[normalized]?.currency || 'VND';
}

function getEffectiveCurrencyCode(locale?: string, language?: LanguageLike) {
    const localeCurrency = getCurrencyCodeFromLocale(locale);
    const languageCurrency = String(language?.currency || '').trim().toUpperCase();

    if (!languageCurrency) {
        return localeCurrency;
    }

    return languageCurrency === localeCurrency ? languageCurrency : localeCurrency;
}

function getLocaleFromLanguage(language?: LanguageLike) {
    const explicitLocale = String(language?.locale || language?.intl_locale || '').trim();
    if (explicitLocale) return explicitLocale;

    const languageCode = getLocaleCode(language?.code);
    return LOCALE_CONFIG[languageCode]?.locale || languageCode || 'vi-VN';
}

function getRateToVndFromLanguage(language?: LanguageLike) {
    const explicitRate =
        language?.rate_to_vnd ??
        language?.rateToVnd ??
        language?.exchange_rate ??
        language?.exchangeRate;
    const parsedRate = Number(explicitRate);
    return Number.isFinite(parsedRate) && parsedRate > 0 ? parsedRate : 1;
}

function normalizeProductCurrency(currency?: CurrencyLike): ProductCurrency {
    if (!currency) {
        return {
            code: 'VND',
            locale: 'vi-VN',
            rateToVnd: 1,
        };
    }

    if ('rateToVnd' in currency && typeof currency.rateToVnd === 'number') {
        return {
            code: String(currency.code || 'VND').toUpperCase(),
            locale: currency.locale || 'vi-VN',
            rateToVnd: currency.rateToVnd > 0 ? currency.rateToVnd : 1,
        };
    }

    const code = getCurrencyCodeFromLanguage(currency);
    return {
        code,
        locale: getLocaleFromLanguage(currency),
        rateToVnd: getRateToVndFromLanguage(currency),
    };
}

export function getCurrencySymbol(currencyCode?: string) {
    const code = String(currencyCode || 'VND').toUpperCase();
    return CURRENCY_FORMATS[code]?.symbol || code;
}

export function getLanguageByLocale(langList: any[] = [], locale?: string) {
    const normalized = getLocaleCode(locale);
    return langList.find((lang: any) => getLocaleCode(lang.code) === normalized) || langList[0] || null;
}

export function getProductCurrencyFromLanguage(language?: LanguageLike) {
    const currency = getCurrencyCodeFromLanguage(language);
    return {
        code: currency,
        locale: getLocaleFromLanguage(language),
        rateToVnd: getRateToVndFromLanguage(language),
    } satisfies ProductCurrency;
}

export function getProductCurrencyFromLocale(locale?: string, language?: LanguageLike) {
    const currency = getEffectiveCurrencyCode(locale, language);
    const languageCurrency = String(language?.currency || '').trim().toUpperCase();
    const languageRate = getRateToVndFromLanguage(language);
    const explicitLocale = String(language?.locale || language?.intl_locale || '').trim();
    return {
        code: currency,
        locale: explicitLocale || LOCALE_CONFIG[getLocaleCode(locale)]?.locale || 'vi-VN',
        rateToVnd: languageCurrency === currency ? languageRate : 1,
    } satisfies ProductCurrency;
}

const productCurrencyCache = new Map<string, ProductCurrency>();

function canUseLocalStorage() {
    try {
        return typeof window !== 'undefined' && !!window.localStorage;
    } catch (_error) {
        return false;
    }
}

function getStoredProductCurrency(cacheKey: string): ProductCurrency | null {
    if (!canUseLocalStorage()) return null;

    try {
        const raw = window.localStorage.getItem(`${PRODUCT_CURRENCY_STORAGE_PREFIX}${cacheKey}`);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        const expiresAt = Number(parsed?.expiresAt || 0);
        const rateToVnd = Number(parsed?.value?.rateToVnd);

        if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
            window.localStorage.removeItem(`${PRODUCT_CURRENCY_STORAGE_PREFIX}${cacheKey}`);
            return null;
        }

        if (!Number.isFinite(rateToVnd) || rateToVnd <= 0 || rateToVnd === 1) {
            return null;
        }

        return {
            code: String(parsed?.value?.code || cacheKey).toUpperCase(),
            locale: String(parsed?.value?.locale || 'vi-VN'),
            rateToVnd,
        };
    } catch (_error) {
        return null;
    }
}

function storeProductCurrency(cacheKey: string, currency: ProductCurrency) {
    if (!canUseLocalStorage() || currency.rateToVnd <= 0 || currency.rateToVnd === 1) return;

    productCurrencyCache.set(cacheKey, currency);

    try {
        window.localStorage.setItem(
            `${PRODUCT_CURRENCY_STORAGE_PREFIX}${cacheKey}`,
            JSON.stringify({
                expiresAt: Date.now() + PRODUCT_CURRENCY_CACHE_TTL_MS,
                value: currency,
            })
        );
    } catch (_error) {
        // Ignore storage quota / access issues.
    }
}

export async function loadProductCurrency(language?: LanguageLike, currentLocale?: string): Promise<ProductCurrency> {
    const baseCurrency = getProductCurrencyFromLocale(currentLocale, language);
    
    if (baseCurrency.rateToVnd > 0 && baseCurrency.rateToVnd !== 1) {
        return baseCurrency;
    }

    const cacheKey = baseCurrency.code.toUpperCase();
    const stored = getStoredProductCurrency(cacheKey);
    if (stored) {
        productCurrencyCache.set(cacheKey, stored);
        return stored;
    }

    const cached = productCurrencyCache.get(cacheKey);
    if (cached && (cached.rateToVnd > 0 && cached.rateToVnd !== 1)) {
        return cached;
    }

    if (cacheKey === 'VND') {
        return baseCurrency;
    }

    try {
        const frankfurterUrl = new URL('https://api.frankfurter.dev/v1/latest');
        frankfurterUrl.searchParams.set('base', 'USD');
        frankfurterUrl.searchParams.set('symbols', `VND,${cacheKey}`);

        const frankfurterResponse = await fetch(frankfurterUrl.toString());
        if (frankfurterResponse.ok) {
            const frankfurterData = await frankfurterResponse.json();
            const usdToVnd = Number(frankfurterData?.rates?.VND);
            const usdToTarget = Number(frankfurterData?.rates?.[cacheKey]);

            if (Number.isFinite(usdToVnd) && Number.isFinite(usdToTarget) && usdToVnd > 0 && usdToTarget > 0) {
                const resolved: ProductCurrency = {
                    code: cacheKey,
                    locale: baseCurrency.locale,
                    rateToVnd: roundMoney(usdToVnd / usdToTarget),
                };

                storeProductCurrency(cacheKey, resolved);
                return resolved;
            }
        }
    } catch (_error) {
        // Fall through to the backend fallback below.
    }

    try {
        const response = await axios.get(route('exchange-rates.show', cacheKey));
        const rateToVnd = Number(response.data?.rateToVnd);
        const resolved: ProductCurrency = {
            code: String(response.data?.code || cacheKey).toUpperCase(),
            locale: baseCurrency.locale,
            rateToVnd: Number.isFinite(rateToVnd) && rateToVnd > 0 ? rateToVnd : 1,
        };

        storeProductCurrency(cacheKey, resolved);
        return resolved;
    } catch (_error) {
        return baseCurrency;
    }
}

function roundMoney(value: number) {
    return Math.round((value + Number.EPSILON) * 1000) / 1000;
}

function formatCurrencyAmount(amount: number, currency: ProductCurrency) {
    const fractionDigits = currency.code === 'VND' ? 0 : PRICE_DECIMALS;
    const numeric = new Intl.NumberFormat(currency.locale, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    }).format(amount);
    const format = CURRENCY_FORMATS[currency.code];
    const symbol = getCurrencySymbol(currency.code);

    if (currency.code === 'VND') {
        return `${numeric} ${symbol}`;
    }

    if (currency.code === 'USD') {
        return `${numeric} ${symbol}`;
    }

    if (format?.prefix) {
        return `${symbol}${numeric}`;
    }

    return `${numeric} ${symbol}`;
}

function normalizeDecimalInput(value: string) {
    const cleaned = String(value ?? '').replace(/[^\d.,-]/g, '');

    if (!cleaned) return '';

    const lastComma = cleaned.lastIndexOf(',');
    const lastDot = cleaned.lastIndexOf('.');
    const decimalIndex = Math.max(lastComma, lastDot);

    if (decimalIndex === -1) {
        return cleaned.replace(/[^\d-]/g, '');
    }

    const integerPart = cleaned.slice(0, decimalIndex).replace(/[^\d-]/g, '');
    const decimalPart = cleaned.slice(decimalIndex + 1).replace(/[^\d]/g, '');

    if (!decimalPart) {
        return integerPart;
    }

    return `${integerPart || '0'}.${decimalPart}`;
}

export function formatPriceInput(value: any, currency?: CurrencyLike) {
    const normalizedCurrency = normalizeProductCurrency(currency);
    const normalized = normalizeDecimalInput(String(value ?? ''));
    const numeric = Number(normalized);

    if (!Number.isFinite(numeric)) return '';

    return new Intl.NumberFormat(normalizedCurrency.locale, {
        minimumFractionDigits: PRICE_DECIMALS,
        maximumFractionDigits: PRICE_DECIMALS,
    }).format(numeric);
}

export function parsePriceInput(value: any) {
    if (value === null || value === undefined) return 0;

    const normalized = normalizeDecimalInput(String(value));
    return Number(normalized || 0);
}

export function convertPriceToDisplay(basePrice: any, language?: any) {
    const { rateToVnd } = normalizeProductCurrency(language);
    return roundMoney(Number(basePrice || 0) / rateToVnd);
}

export function convertPriceToBase(displayPrice: any, language?: any) {
    const { rateToVnd } = normalizeProductCurrency(language);
    return Math.round(parsePriceInput(displayPrice) * rateToVnd);
}

export function formatProductPrice(basePrice: any, language?: any) {
    const productCurrency = normalizeProductCurrency(language);
    const displayPrice = convertPriceToDisplay(basePrice, language);
    return formatCurrencyAmount(displayPrice, productCurrency);
}

export function buildInitialTranslations(langList: any[] = [], item?: any) {
    return langList.reduce((result: any, lang: any) => {
        const locale = lang.code;
        const existing = item?.translations?.[locale];

        result[locale] = {
            name: existing?.name || '',
            slug: existing?.slug || '',
            description: existing?.description || '',
            content: existing?.content || '',
            seo_title: existing?.seo_title || '',
            seo_keyword: existing?.seo_keyword || '',
            seo_description: existing?.seo_description || '',
        };

        return result;
    }, {});
}
