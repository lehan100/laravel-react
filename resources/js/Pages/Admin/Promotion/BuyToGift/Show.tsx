import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import BackButton from '@/Components/Button/BackButton';
import Card from '@/Components/Main/Card';
import StatusBadge from '@/Components/Status/StatusBadge';
import { ArrowRight, Gift, Layers3, PackageCheck, ShoppingBag } from 'lucide-react';
import {
  formatProductPrice,
  getLanguageByLocale,
  getLocaleCode,
  getProductCurrencyFromLocale,
  loadProductCurrency,
  type ProductCurrency,
} from '../../Product/productUtils';

export default function ShowPage() {
  const { trans } = useTrans();
  const { locale, langs, item, itemsSelectedBuyProducts, itemsSelectedGiftProducts }: any = usePage().props;
  const currentLocale = getLocaleCode(locale || 'vi');
  const uiLocale = currentLocale === 'vi' ? 'vi-VN' : currentLocale === 'ja' ? 'ja-JP' : currentLocale === 'en' ? 'en-US' : currentLocale;
  const langList = langs?.data || (Array.isArray(langs) ? langs : Object.values(langs || {}));
  const currentLanguage = getLanguageByLocale(langList, currentLocale);
  const [resolvedCurrency, setResolvedCurrency] = useState<ProductCurrency>(() => getProductCurrencyFromLocale(currentLocale, currentLanguage));
  const buyRows = Array.isArray(itemsSelectedBuyProducts) ? itemsSelectedBuyProducts : [];
  const giftRows = Array.isArray(itemsSelectedGiftProducts) ? itemsSelectedGiftProducts : [];
  const allRowsMap = new Map<number, any>([...buyRows, ...giftRows].map((row: any) => [Number(row.id), row]));
  const rules = Array.isArray(item?.rules) ? item.rules : [];
  const enabledRulesCount = rules.filter((rule: any) => rule?.is_active !== false).length;
  const uniqueBuyProductsCount = new Set(rules.flatMap((rule: any) => rule?.buy_product_ids || [])).size;
  const uniqueGiftProductsCount = new Set(rules.flatMap((rule: any) => rule?.gift_product_ids || [])).size;

  const formatDateTimeByLocale = (value?: string | null) => {
    if (!value) return '---';
    const normalized = value.includes('T') ? value : value.replace(' ', 'T');
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(uiLocale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  useEffect(() => {
    let mounted = true;

    loadProductCurrency(currentLanguage, currentLocale).then((currency) => {
      if (!mounted) return;
      setResolvedCurrency(currency);
    });

    return () => {
      mounted = false;
    };
  }, [currentLocale, currentLanguage?.code, currentLanguage?.currency]);

  const renderProductTable = (rows: any[], tone: 'buy' | 'gift') => (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className={`flex items-center justify-between border-b border-slate-200 px-3 py-2 ${tone === 'buy' ? 'bg-cyan-50/70' : 'bg-emerald-50/70'}`}>
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {tone === 'buy' ? <PackageCheck size={15} className="text-cyan-700" /> : <Gift size={15} className="text-emerald-700" />}
          {tone === 'buy' ? trans('hancms.promotion.buytogift.fields.buy_products') : trans('hancms.promotion.buytogift.fields.gift_products')}
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${tone === 'buy' ? 'bg-cyan-100 text-cyan-800' : 'bg-emerald-100 text-emerald-800'}`}>
          {rows.length}
        </span>
      </div>
      <div className="max-h-[360px] overflow-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">ID</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.sku')}</th>
              <th className="min-w-[220px] px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.name')}</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.price')}</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-slate-400">
                  {trans('hancms.placeholder.select')}
                </td>
              </tr>
            ) : (
              rows.map((row: any) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-slate-500">{row.id}</td>
                  <td className="px-3 py-2 font-medium text-slate-800">{row.sku}</td>
                  <td className="px-3 py-2 text-slate-700">{row.name}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-800">{formatProductPrice(row.price, resolvedCurrency)}</td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <StatusBadge
                      value={row.status}
                      activeLabel={trans('hancms.status.active')}
                      inactiveLabel={trans('hancms.status.inactive')}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRuleProducts = (ids: number[]) => ids.map((id: number) => allRowsMap.get(Number(id))).filter(Boolean);

  return (
    <div className="p-4 lg:p-6">
      <HeaderToolbar
        title={
          <>
            {trans('hancms.button.view')} {trans('hancms.promotion.buytogift.name')}
            {item?.code ? <span className="text-cyan-600">: {item.code}</span> : null}
          </>
        }
      >
        <BackButton href={route('buytogift.index')}>{trans('hancms.button.back')}</BackButton>
      </HeaderToolbar>

      <div className="mt-4 grid gap-3 md:grid-cols-4 mb-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{trans('hancms.column.status')}</div>
          <div className="mt-2">
            <StatusBadge
              value={item?.is_active ? 1 : 0}
              activeLabel={trans('hancms.status.active')}
              inactiveLabel={trans('hancms.status.inactive')}
            />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Layers3 size={15} />
            Rules
          </div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{enabledRulesCount}/{rules.length}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <ShoppingBag size={15} />
            {trans('hancms.promotion.buytogift.fields.buy_products')}
          </div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{uniqueBuyProductsCount}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <Gift size={15} />
            {trans('hancms.promotion.buytogift.fields.gift_products')}
          </div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{uniqueGiftProductsCount}</div>
        </div>
      </div>

      <Card>
        <div className="mt-4 space-y-5 p-4 lg:p-5">
          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{trans('hancms.column.code')}</div>
              <div className="mt-1 font-semibold text-slate-800">{item?.code || '---'}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{trans('hancms.column.name')}</div>
              <div className="mt-1 font-semibold text-slate-800">{item?.name || '---'}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{trans('hancms.promotion.buytogift.fields.starts_at')}</div>
              <div className="mt-1 font-semibold text-slate-800">{formatDateTimeByLocale(item?.starts_at)}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{trans('hancms.promotion.buytogift.fields.ends_at')}</div>
              <div className="mt-1 font-semibold text-slate-800">{formatDateTimeByLocale(item?.ends_at)}</div>
            </div>
          </div>

          {item?.description ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              {item.description}
            </div>
          ) : null}

          <div className="space-y-4">
            {rules.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">---</div>
            ) : (
              rules.map((rule: any, index: number) => (
                <div key={rule.id || index} className="overflow-hidden rounded-xl border border-slate-200 border-l-4 border-l-cyan-600 bg-white shadow-md shadow-slate-200/70">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-gradient-to-r from-cyan-50 via-white to-white px-4 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="rounded-lg bg-cyan-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm">Rule #{index + 1}</div>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        {rule.condition_type === 'order_amount'
                          ? trans('hancms.promotion.buytogift.options.order_amount')
                          : trans('hancms.promotion.buytogift.options.buy_product')}
                      </span>
                      <StatusBadge
                        value={rule.is_active ? 1 : 0}
                        activeLabel={trans('hancms.status.active')}
                        inactiveLabel={trans('hancms.status.inactive')}
                      />
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200">
                      <span className="text-cyan-700">{rule.buy_qty || 1} {trans('hancms.promotion.buytogift.fields.buy_qty')}</span>
                      <ArrowRight size={15} className="text-slate-400" />
                      <span className="text-emerald-700">{rule.gift_qty || 1} {trans('hancms.promotion.buytogift.fields.gift_qty')}</span>
                    </div>
                  </div>

                  <div className="space-y-4 bg-slate-50/40 p-4">
                    <div className="grid gap-3 rounded-lg bg-slate-50 p-3 text-sm md:grid-cols-2">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{trans('hancms.promotion.buytogift.fields.min_order_amount')}</div>
                        <div className="mt-1 font-semibold text-slate-800">
                          {rule?.min_order_amount ? formatProductPrice(rule.min_order_amount, resolvedCurrency) : '---'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{trans('hancms.promotion.buytogift.fields.max_sets_per_order')}</div>
                        <div className="mt-1 font-semibold text-slate-800">{rule?.max_sets_per_order || '---'}</div>
                      </div>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-2">
                      {renderProductTable(renderRuleProducts(rule.buy_product_ids || []), 'buy')}
                      {renderProductTable(renderRuleProducts(rule.gift_product_ids || []), 'gift')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

ShowPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.promotion.buytogift.name" children={page} />
);
