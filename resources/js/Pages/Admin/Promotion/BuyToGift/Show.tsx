import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import BackButton from '@/Components/Button/BackButton';
import Card from '@/Components/Main/Card';
import StatusBadge from '@/Components/Status/StatusBadge';
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

  const renderProductTable = (rows: any[]) => (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">ID</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">{trans('hancms.column.sku')}</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">{trans('hancms.column.name')}</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">{trans('hancms.column.price')}</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">{trans('hancms.column.status')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                {trans('hancms.placeholder.select')}
              </td>
            </tr>
          ) : (
            rows.map((row: any) => (
              <tr key={row.id}>
                <td className="px-4 py-3">{row.id}</td>
                <td className="px-4 py-3">{row.sku}</td>
                <td className="px-4 py-3">{row.name}</td>
                <td className="px-4 py-3">{formatProductPrice(row.price, resolvedCurrency)}</td>
                <td className="px-4 py-3">
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
  );

  const renderRuleProducts = (ids: number[]) => ids.map((id: number) => allRowsMap.get(Number(id))).filter(Boolean);

  return (
    <div className="p-6">
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

      <Card>
        <div className="space-y-6 p-6">
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm md:grid-cols-2 lg:grid-cols-3">
            <div>
            <div className="text-xs text-slate-500">{trans('hancms.promotion.buytogift.fields.condition_type')}</div>
            <div className="font-semibold text-slate-800">
              {item?.condition_type === 'order_amount'
                ? trans('hancms.promotion.buytogift.options.order_amount')
                : trans('hancms.promotion.buytogift.options.buy_product')}
            </div>
            </div>
            <div>
            <div className="text-xs text-slate-500">{trans('hancms.promotion.buytogift.fields.buy_qty')}</div>
            <div className="font-semibold text-slate-800">{item?.buy_qty || 1}</div>
            </div>
            <div>
            <div className="text-xs text-slate-500">{trans('hancms.promotion.buytogift.fields.gift_qty')}</div>
            <div className="font-semibold text-slate-800">{item?.gift_qty || 1}</div>
            </div>
            <div>
            <div className="text-xs text-slate-500">{trans('hancms.promotion.buytogift.fields.min_order_amount')}</div>
            <div className="font-semibold text-slate-800">
              {item?.min_order_amount ? formatProductPrice(item.min_order_amount, resolvedCurrency) : '---'}
            </div>
            </div>
            <div>
            <div className="text-xs text-slate-500">{trans('hancms.promotion.buytogift.fields.starts_at')}</div>
            <div className="font-semibold text-slate-800">{formatDateTimeByLocale(item?.starts_at)}</div>
            </div>
            <div>
            <div className="text-xs text-slate-500">{trans('hancms.promotion.buytogift.fields.ends_at')}</div>
            <div className="font-semibold text-slate-800">{formatDateTimeByLocale(item?.ends_at)}</div>
            </div>
          </div>

          <div className="space-y-6">
            {rules.length === 0 ? (
              <div className="text-sm text-slate-500">---</div>
            ) : (
              rules.map((rule: any, index: number) => (
                <div key={rule.id || index} className="space-y-4 rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">Rule #{index + 1}</div>
                    <div className="text-xs text-slate-500">
                      {rule.condition_type === 'order_amount'
                        ? trans('hancms.promotion.buytogift.options.order_amount')
                        : trans('hancms.promotion.buytogift.options.buy_product')}
                    </div>
                  </div>
                  <div className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm md:grid-cols-3">
                    <div>
                      <div className="text-xs text-slate-500">{trans('hancms.promotion.buytogift.fields.buy_qty')}</div>
                      <div className="font-semibold text-slate-800">{rule.buy_qty || 1}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">{trans('hancms.promotion.buytogift.fields.gift_qty')}</div>
                      <div className="font-semibold text-slate-800">{rule.gift_qty || 1}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">{trans('hancms.promotion.buytogift.fields.min_order_amount')}</div>
                      <div className="font-semibold text-slate-800">
                        {rule?.min_order_amount ? formatProductPrice(rule.min_order_amount, resolvedCurrency) : '---'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-slate-900">{trans('hancms.promotion.buytogift.fields.buy_products')}</h3>
                    {renderProductTable(renderRuleProducts(rule.buy_product_ids || []))}
                  </div>
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-slate-900">{trans('hancms.promotion.buytogift.fields.gift_products')}</h3>
                    {renderProductTable(renderRuleProducts(rule.gift_product_ids || []))}
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
