import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import BackButton from '@/Components/Button/BackButton';
import Card from '@/Components/Main/Card';
import StatusBadge from '@/Components/Status/StatusBadge';
import { formatProductPrice, getLanguageByLocale, getLocaleCode, getProductCurrencyFromLocale, loadProductCurrency, type ProductCurrency } from '../../Product/productUtils';

export default function ShowPage() {
  const { trans } = useTrans();
  const { locale, langs, item }: any = usePage().props;
  const currentLocale = getLocaleCode(locale || 'vi');
  const uiLocale = currentLocale === 'vi' ? 'vi-VN' : currentLocale === 'ja' ? 'ja-JP' : currentLocale === 'en' ? 'en-US' : currentLocale;
  const langList = langs?.data || (Array.isArray(langs) ? langs : Object.values(langs || {}));
  const currentLanguage = getLanguageByLocale(langList, currentLocale);
  const [resolvedCurrency, setResolvedCurrency] = useState<ProductCurrency>(() => getProductCurrencyFromLocale(currentLocale, currentLanguage));
  const products = Array.isArray(item?.products) ? item.products : [];
  const categories = Array.isArray(item?.categories) ? item.categories : [];

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
            {trans('hancms.button.view')} {trans('hancms.promotion.coupon.name')}
            {item?.code ? <span className="text-cyan-600">: {item.code}</span> : null}
          </>
        }
      >
        <BackButton href={route('coupon.index')}>{trans('hancms.button.back')}</BackButton>
      </HeaderToolbar>

      <Card>
        <div className="space-y-6 p-6">
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm md:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="text-xs text-slate-500">{trans('hancms.column.code')}</div>
              <div className="font-semibold text-slate-800">{item?.code || '---'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">{trans('hancms.column.name')}</div>
              <div className="font-semibold text-slate-800">{item?.name || '---'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">{trans('hancms.column.status')}</div>
              <div className="font-semibold text-slate-800">
                <StatusBadge
                  value={item?.is_active ? 1 : 0}
                  activeLabel={trans('hancms.status.active')}
                  inactiveLabel={trans('hancms.status.inactive')}
                />
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">{trans('hancms.promotion.coupon.fields.priority')}</div>
              <div className="font-semibold text-slate-800">{item?.priority ?? '---'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">{trans('hancms.promotion.coupon.fields.discount_type')}</div>
              <div className="font-semibold text-slate-800">
                {item?.discount_type
                  ? trans(`hancms.promotion.coupon.options.${item.discount_type}`)
                  : '---'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">{trans('hancms.promotion.coupon.fields.discount_value')}</div>
              <div className="font-semibold text-slate-800">
                {item?.discount_type === 'percent'
                  ? `${item?.discount_value ?? 0}%`
                  : formatProductPrice(item?.discount_value ?? 0, resolvedCurrency)}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">{trans('hancms.promotion.coupon.fields.first_order_only')}</div>
              <div className="font-semibold text-slate-800">
                {item?.first_order_only ? trans('actions.yes') : trans('actions.no')}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">{trans('hancms.promotion.coupon.fields.starts_at')}</div>
              <div className="font-semibold text-slate-800">{formatDateTimeByLocale(item?.starts_at)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">{trans('hancms.promotion.coupon.fields.ends_at')}</div>
              <div className="font-semibold text-slate-800">{formatDateTimeByLocale(item?.ends_at)}</div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-900">{trans('hancms.promotion.coupon.fields.apply_categories')}</h3>
                <span className="inline-flex items-center rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200">
                  {categories.length}
                </span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">{trans('hancms.column.name')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-slate-400">
                          {trans('hancms.placeholder.select')}
                        </td>
                      </tr>
                    ) : (
                      categories.map((category: any) => (
                        <tr key={category.id}>
                          <td className="px-4 py-3">{category.id}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span>{category.name}</span>
                              <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
                                {category.products_count ?? 0}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-900">{trans('hancms.promotion.coupon.fields.apply_products')}</h3>
                <span className="inline-flex items-center rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200">
                  {products.length}
                </span>
              </div>
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
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                          {trans('hancms.placeholder.select')}
                        </td>
                      </tr>
                    ) : (
                      products.map((product: any) => (
                        <tr key={product.id}>
                          <td className="px-4 py-3">{product.id}</td>
                          <td className="px-4 py-3">{product.sku}</td>
                          <td className="px-4 py-3">{product.name}</td>
                          <td className="px-4 py-3">{formatProductPrice(product.price, resolvedCurrency)}</td>
                          <td className="px-4 py-3">
                            <StatusBadge
                              value={product.status}
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
          </div>
        </div>
      </Card>
    </div>
  );
}

ShowPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.promotion.coupon.name" children={page} />
);
