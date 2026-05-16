import { getProductCurrencyFromLanguage, getProductCurrencyFromLocale, type ProductCurrency } from '../../Product/productUtils';

type OrderCurrencyLike = {
  currency_code?: string | null;
  exchange_rate_to_vnd?: number | string | null;
  price_snapshot?: Array<{
    locale?: string | null;
    currency_code?: string | null;
    currency_symbol?: string | null;
    exchange_rate_to_vnd?: number | string | null;
  }> | null;
};

type OrderPriceSnapshot = {
  locale: string;
  currency_code: string;
  currency_symbol: string;
  exchange_rate_to_vnd: number;
};

type OrderPriceSnapshotBundle = OrderPriceSnapshot[];

export function resolveOrderLanguageList(langs?: any, allLangs?: any): any[] {
  if (allLangs?.data) {
    return allLangs.data;
  }

  if (langs?.data) {
    return langs.data;
  }

  if (Array.isArray(allLangs)) {
    return allLangs;
  }

  if (Array.isArray(langs)) {
    return langs;
  }

  return Object.values(allLangs || langs || {});
}

function getSnapshotKey(currentLocale?: string, language?: any, fallback?: string): string {
  const candidate = String(currentLocale || language?.code || fallback || '').trim();
  return candidate ? candidate.toLowerCase().split('-')[0] : 'vi';
}

function getCurrencySymbol(currencyCode: string): string {
  switch (currencyCode.toUpperCase()) {
    case 'USD':
      return '$';
    case 'JPY':
      return '¥';
    case 'VND':
      return '₫';
    case 'EUR':
      return '€';
    case 'KRW':
      return '₩';
    case 'CNY':
      return '¥';
    case 'GBP':
      return '£';
    case 'AUD':
      return 'A$';
    case 'CAD':
      return 'C$';
    default:
      return currencyCode.toUpperCase();
  }
}

export function resolveOrderCurrency(order?: OrderCurrencyLike, currentLocale?: string, language?: any): ProductCurrency {
  const fallback = getProductCurrencyFromLocale(currentLocale, language);
  return resolveCurrencyFromSnapshot(order, currentLocale, language, fallback);
}

export function resolveOrderCurrencyWithFallback(
  order?: OrderCurrencyLike,
  currentLocale?: string,
  language?: any,
  fallbackCurrency?: ProductCurrency
): ProductCurrency {
  const fallback = fallbackCurrency || getProductCurrencyFromLocale(currentLocale, language);
  return resolveCurrencyFromSnapshot(order, currentLocale, language, fallback);
}

function resolveCurrencyFromSnapshot(
  order: OrderCurrencyLike | undefined,
  currentLocale: string | undefined,
  language: any,
  fallback: ProductCurrency
): ProductCurrency {
  const snapshot = resolveOrderSnapshot(order);
  const snapshotKey = getSnapshotKey(currentLocale, language, currentLocale || language?.code || fallback.locale);
  const currencyMeta = Array.isArray(snapshot)
    ? snapshot.find((entry) => getSnapshotKey(entry?.locale, entry, entry?.locale) === snapshotKey)
    : null;
  const code = String(currencyMeta?.currency_code || order?.currency_code || '').trim().toUpperCase();
  const rateToVnd = Number(currencyMeta?.exchange_rate_to_vnd ?? order?.exchange_rate_to_vnd ?? 0);

  if (!code || !Number.isFinite(rateToVnd) || rateToVnd <= 0) {
    return fallback;
  }

  return {
    code,
    locale: String(currencyMeta?.locale || fallback.locale || 'vi-VN'),
    rateToVnd,
  };
}

export function resolveOrderSnapshot(order?: OrderCurrencyLike): OrderPriceSnapshotBundle {
  const rawSnapshot = order?.price_snapshot;
  const snapshot = Array.isArray(rawSnapshot)
    ? rawSnapshot
    : Array.isArray((rawSnapshot as any)?.currencies)
      ? (rawSnapshot as any).currencies
      : rawSnapshot && typeof rawSnapshot === 'object' && (rawSnapshot as any).currency_code
        ? [rawSnapshot as any]
        : [];

  return snapshot
    .filter((entry: any) => entry && typeof entry === 'object')
    .map((entry : any) => ({
      locale: String(entry.locale || '').trim().toLowerCase().split('-')[0] || 'vi',
      currency_code: String(entry.currency_code || 'VND').trim().toUpperCase(),
      currency_symbol: String(entry.currency_symbol || '').trim() || getCurrencySymbol(String(entry.currency_code || 'VND')),
      exchange_rate_to_vnd: Number(entry.exchange_rate_to_vnd || 1) > 0 ? Number(entry.exchange_rate_to_vnd || 1) : 1,
    }));
}

export function buildOrderPriceSnapshotBundle(
  languages: any[] = [],
  activeLanguage?: any,
  existingSnapshot?: Array<{
    locale?: string | null;
    currency_code?: string | null;
    currency_symbol?: string | null;
    exchange_rate_to_vnd?: number | string | null;
  }> | null
): OrderPriceSnapshotBundle {
  const normalizedLanguages = (languages.length > 0 ? languages : [activeLanguage].filter(Boolean)) as any[];
  const currencies = normalizedLanguages.reduce((carry: OrderPriceSnapshotBundle, language) => {
    const currency = getProductCurrencyFromLanguage(language);
    const key = getSnapshotKey(language?.code, language, currency.locale);
    const existingEntry = Array.isArray(existingSnapshot) ? existingSnapshot.find((entry: any) => getSnapshotKey(entry?.locale, entry, entry?.locale) === key) : null;

    carry.push({
      locale: key,
      currency_code: currency.code,
      currency_symbol: getCurrencySymbol(currency.code),
      exchange_rate_to_vnd: currency.rateToVnd,
    });

    if (existingEntry && typeof existingEntry === 'object') {
      const nextEntry = {
        locale: String(existingEntry.locale || key),
        currency_code: String(existingEntry.currency_code || currency.code).toUpperCase(),
        currency_symbol: String(existingEntry.currency_symbol || getCurrencySymbol(currency.code)),
        exchange_rate_to_vnd: Number(existingEntry.exchange_rate_to_vnd || currency.rateToVnd || 1) > 0 ? Number(existingEntry.exchange_rate_to_vnd || currency.rateToVnd || 1) : 1,
      };

      carry[carry.length - 1] = nextEntry;
    }

    return carry;
  }, []);

  return currencies.length > 0 ? currencies : [{
    locale: getSnapshotKey(activeLanguage?.code, activeLanguage, activeLanguage?.code),
    currency_code: getProductCurrencyFromLanguage(activeLanguage).code,
    currency_symbol: getCurrencySymbol(getProductCurrencyFromLanguage(activeLanguage).code),
    exchange_rate_to_vnd: getProductCurrencyFromLanguage(activeLanguage).rateToVnd,
  }];
}
