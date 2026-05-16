import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import BackButton from '@/Components/Button/BackButton';
import Card from '@/Components/Main/Card';
import Pagination from '@/Components/Pagination/Pagination';
import StatusBadge from '@/Components/Status/StatusBadge';
import { formatProductPrice, getLanguageByLocale, getLocaleCode, getProductCurrencyFromLocale, loadProductCurrency, type ProductCurrency } from '../../Product/productUtils';

export default function ShowPage() {
  const { trans } = useTrans();
  const { locale, langs, item, itemsProductsApplied }: any = usePage().props;
  const currentLocale = getLocaleCode(locale || 'vi');
  const uiLocale = currentLocale === 'vi' ? 'vi-VN' : currentLocale === 'ja' ? 'ja-JP' : currentLocale === 'en' ? 'en-US' : currentLocale;
  const langList = langs?.data || (Array.isArray(langs) ? langs : Object.values(langs || {}));
  const currentLanguage = getLanguageByLocale(langList, currentLocale);
  const [resolvedCurrency, setResolvedCurrency] = useState<ProductCurrency>(() => getProductCurrencyFromLocale(currentLocale, currentLanguage));
  const rows = itemsProductsApplied?.data || [];
  const links = itemsProductsApplied?.links || [];
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

  return (
    <div>
      <HeaderToolbar
        title={
          <>
            {trans('hancms.button.view')} {trans('hancms.promotion.saleoffer.name')}
            {item?.code ? <span className="text-cyan-600">: {item.code}</span> : null}
          </>
        }
      >
        <BackButton href={route('saleoffer.index')}>{trans('hancms.button.back')}</BackButton>
      </HeaderToolbar>

      <Card>
        <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm md:grid-cols-2">
          <div>
            <div className="text-xs text-slate-500">{trans('hancms.promotion.saleoffer.fields.starts_at')}</div>
            <div className="font-semibold text-slate-800">{formatDateTimeByLocale(item?.starts_at)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">{trans('hancms.promotion.saleoffer.fields.ends_at')}</div>
            <div className="font-semibold text-slate-800">{formatDateTimeByLocale(item?.ends_at)}</div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">ID</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.sku')}</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.name')}</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.price')}</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Giảm</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">Giá sau giảm</th>
                <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-slate-400">
                    {trans('hancms.placeholder.select')}
                  </td>
                </tr>
              ) : (
                rows.map((row: any) => (
                  <tr key={row.id}>
                    <td className="px-3 py-2">{row.id}</td>
                    <td className="px-3 py-2">{row.sku}</td>
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{formatProductPrice(row.price, resolvedCurrency)}</td>
                    <td className="px-3 py-2 text-rose-600">{formatProductPrice(row.discount_amount, resolvedCurrency)}</td>
                    <td className="px-3 py-2 font-semibold text-emerald-700">{formatProductPrice(row.final_price, resolvedCurrency)}</td>
                    <td className="px-3 py-2">
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

        <Pagination links={links} />
      </Card>
    </div>
  );
}

ShowPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.promotion.saleoffer.name" children={page} />
);
