import { Head } from '@inertiajs/react';
import BackButton from '@/Components/Button/BackButton';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import StatusBadge from '@/Components/Status/StatusBadge';
import MainLayout from '@/Layouts/MainLayout';
import { formatProductPrice, getLanguageByLocale, getLocaleCode, getProductCurrencyFromLocale, type ProductCurrency } from '@/Pages/Admin/Product/productUtils';
import { usePage } from '@inertiajs/react';
import { Printer } from 'lucide-react';
import { useMemo } from 'react';
import { useTrans } from '@/Hooks/useTrans';
import { resolveOrderCurrencyWithFallback, resolveOrderLanguageList } from './orderCurrency';

export default function ShowPage() {
  const { trans } = useTrans();
  const { item, status_options, locale, langs, all_langs, auth, layout_info, page_title }: any = usePage().props;

  const currentLocale = getLocaleCode(locale);
  const langList = resolveOrderLanguageList(langs, all_langs);
  const currentLanguage = getLanguageByLocale(langList, currentLocale);
  const resolvedCurrency = useMemo<ProductCurrency>(
    () => getProductCurrencyFromLocale(currentLocale, currentLanguage),
    [currentLocale, currentLanguage?.code, currentLanguage?.currency]
  );

  const orderCurrency = resolveOrderCurrencyWithFallback(item, currentLocale, currentLanguage, resolvedCurrency);

  const orderStatusLabels = useMemo(
    () => Object.fromEntries((status_options?.order || []).map((option: any) => [option.value, option.label])),
    [status_options?.order]
  );
  const paymentStatusLabels = useMemo(
    () => Object.fromEntries((status_options?.payment || []).map((option: any) => [option.value, option.label])),
    [status_options?.payment]
  );
  const shippingStatusLabels = useMemo(
    () => Object.fromEntries((status_options?.shipping || []).map((option: any) => [option.value, option.label])),
    [status_options?.shipping]
  );

  const formatMoney = (amount: number) => formatProductPrice(amount, orderCurrency);
  const formatDateTime = (dateStr?: string): string => {
    if (!dateStr) return '---';
    try {
      const date = new Date(dateStr.replace(/-/g, '/'));
      if (isNaN(date.getTime())) return dateStr;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    } catch (e) {
      return dateStr;
    }
  };
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '---';
    try {
      const date = new Date(dateStr.replace(/-/g, '/'));
      if (isNaN(date.getTime())) return dateStr;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };
  const signatureDate = new Date();
  const preparedBy = [auth?.user?.first_name, auth?.user?.last_name].filter(Boolean).join(' ').trim() || auth?.user?.name || '................................';
  const orderItems = Array.isArray(item?.items) ? item.items : [];
  const layoutCompany = layout_info?.company || 'HAN CMS';
  const layoutPhone = layout_info?.phone || '0903 612 795';
  const layoutAddress = layout_info?.address || '86 Nguyen Du, P. Ben Nghe, Quan 1, HCM';
  const layoutWebsite = layout_info?.website
    ? String(layout_info.website).replace(/^https?:\/\//, '')
    : 'ukimua-dev.com';
  const paymentMethodName = String(item?.payment_method_name || '').trim();
  const displayPaymentMethodName = /cod/i.test(paymentMethodName)
    ? trans('hancms.sales.orders.payment_methods.cod_label')
    : (paymentMethodName || '---');
  const provinceVal = currentLocale.startsWith('ja')
    ? (item?.province_name_en || item?.province_name)
    : (item?.province_name || item?.province_name_en);
  const wardVal = currentLocale.startsWith('ja')
    ? (item?.ward_name_en || item?.ward_name)
    : (item?.ward_name || item?.ward_name_en);

  const displayProvinceName = provinceVal || '---';
  const displayWardName = wardVal || '---';

  const printAddressParts = [
    item?.customer_address,
    wardVal,
    provinceVal
  ].filter((p) => p && String(p).trim() !== '' && p !== '---');
  const printAddress = printAddressParts.length > 0
    ? printAddressParts.join(', ')
    : (item?.customer_address || '................................');
  const rawAppliedPromotions = Array.isArray(item?.applied_promotions) ? item.applied_promotions : [];
  const promotionTypeLabels = {
    coupon: trans('hancms.sales.orders.promotions.types.coupon'),
    sale_offer: trans('hancms.sales.orders.promotions.types.sale_offer'),
    buy_to_gift: trans('hancms.sales.orders.promotions.types.buy_to_gift'),
  };
  const formatPromotionType = (type: string): string => {
    return promotionTypeLabels[type as keyof typeof promotionTypeLabels] || type || '---';
  };

  const appliedPromotions = useMemo(() => {
    const groups: Record<string, any> = {};
    rawAppliedPromotions.forEach((promotion: any) => {
      const key = `${promotion.type || 'promotion'}-${promotion.id || ''}-${promotion.code || ''}`;
      if (!groups[key]) {
        groups[key] = { ...promotion };
      } else {
        if (promotion.gift_quantity !== undefined) {
          groups[key].gift_quantity = (groups[key].gift_quantity || 0) + (promotion.gift_quantity || 0);
        }
        if (promotion.discount_amount !== undefined) {
          groups[key].discount_amount = (groups[key].discount_amount || 0) + (promotion.discount_amount || 0);
        }
      }
    });
    return Object.values(groups);
  }, [rawAppliedPromotions]);

  const promotionSummaryRows = appliedPromotions.map((promotion: any, index: number) => ({
    key: `${promotion.type || 'promotion'}-${promotion.id || index}`,
    label: promotion.type === 'coupon' && promotion.code
      ? `Coupon ${promotion.code}`
      : `${promotion.name || formatPromotionType(String(promotion.type || ''))}`,
    amount: promotion.type === 'buy_to_gift'
      ? `x${promotion.gift_quantity ?? 1}`
      : promotion.discount_amount !== undefined
        ? formatMoney(Number(promotion.discount_amount || 0))
        : '---',
  }));


  return (
    <>
      <Head title={page_title} />
      <style>{`
        .print-only-sheet {
          display: none;
        }

        .print-signature {
          display: none;
        }

        @media print {
          @page {
            margin: 4mm 12mm 10mm;
          }

          body {
            background: #ffffff !important;
          }

          body * {
            visibility: hidden;
          }

          #print-order-print,
          #print-order-print * {
            visibility: visible;
          }

          #print-order-print {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
          }

          .screen-only {
            display: none !important;
          }
        }
      `}</style>

      <div className="space-y-6">
        <div className="screen-only print:hidden">
          <HeaderToolbar title={page_title}>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-base font-semibold text-white shadow-xl shadow-amber-950/10 ring-1 ring-amber-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-amber-400 hover:to-orange-400 hover:shadow-2xl hover:shadow-amber-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
            >
              <Printer size={18} />
              <span>{trans('hancms.button.print')}</span>
            </button>
            <BackButton href={route('orders.index')}>{trans('hancms.button.back')}</BackButton>
          </HeaderToolbar>
        </div>

        <div
          id="print-order"
          className="screen-only overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] print:rounded-none print:border-0 print:shadow-none"
        >
          <div>
            <div className="print-header relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_35%),linear-gradient(135deg,#0f172a,#111827_58%,#1d4ed8)] px-8 py-8 text-white print:bg-white print:px-0 print:py-0 print:text-slate-900">
              <div className="print-header-overlay absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.08),transparent)] print:hidden" />
              <div className="print-header-inner relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan-200 print:text-slate-500">
                    {trans('hancms.sales.orders.name')}
                  </div>
                  <h1 className="print-header-title mt-3 text-3xl font-semibold tracking-tight print:mt-1 print:text-2xl">
                    {item?.order_number || `#${item?.id}`}
                  </h1>
                  <p className="print-header-subtitle mt-3 max-w-2xl text-sm text-slate-200/90 print:mt-2 print:text-slate-600">
                    {trans('hancms.sales.orders.fields.customer_name')}: {item?.customer_name || '---'}
                  </p>
                </div>

                <div className="print-summary-card grid gap-3 rounded-3xl bg-white/10 p-5 backdrop-blur print:min-w-[280px] print:rounded-2xl print:border print:border-slate-200 print:bg-slate-50">
                  <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                    <span className="text-slate-300 print:text-slate-500">{trans('hancms.sales.orders.fields.placed_at')}</span>
                    <span className="font-medium text-white print:text-slate-900">{formatDateTime(item?.placed_at)}</span>
                    <span className="text-slate-300 print:text-slate-500">{trans('hancms.sales.orders.fields.payment_method')}</span>
                    <span className="font-medium text-white print:text-slate-900">{displayPaymentMethodName}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="print-body grid grid-cols-1 gap-6 px-8 py-8 print:grid-cols-1 print:gap-5 print:px-0 print:py-6">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px] print:grid-cols-1">
                <section className="print-section-avoid rounded-3xl border border-slate-200 bg-slate-50/70 p-6 print:rounded-2xl print:bg-white">
                  <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {trans('hancms.sales.orders.sections.customer')}
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 print:gap-x-6 print:gap-y-4">
                    <div className="space-y-4">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{trans('hancms.sales.orders.fields.customer_name')}</div>
                        <div className="mt-1 text-sm font-medium text-slate-900">{item?.customer_name || '---'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{trans('hancms.sales.orders.fields.customer_phone')}</div>
                        <div className="mt-1 text-sm font-medium text-slate-900">{item?.customer_phone || '---'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{trans('hancms.sales.orders.fields.customer_email')}</div>
                        <div className="mt-1 text-sm font-medium text-slate-900">{item?.customer_email || '---'}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{trans('hancms.sales.orders.fields.payment_method')}</div>
                        <div className="mt-1 text-sm font-medium text-slate-900">{displayPaymentMethodName}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{trans('hancms.sales.orders.fields.province')}</div>
                        <div className="mt-1 text-sm text-slate-700">{displayProvinceName}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{trans('hancms.sales.orders.fields.ward')}</div>
                        <div className="mt-1 text-sm text-slate-700">{displayWardName}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{trans('hancms.sales.orders.fields.customer_address')}</div>
                        <div className="mt-1 text-sm text-slate-700">{item?.customer_address || '---'}</div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm print:rounded-2xl print:shadow-none">
                  <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {trans('hancms.sales.orders.sections.status')}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{trans('hancms.sales.orders.fields.order_status')}</div>
                      <StatusBadge value={item?.order_status === 'completed' ? 1 : 0} activeLabel={orderStatusLabels[item?.order_status] || item?.order_status} inactiveLabel={orderStatusLabels[item?.order_status] || item?.order_status} />
                    </div>
                    <div>
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{trans('hancms.sales.orders.fields.payment_status')}</div>
                      <StatusBadge value={item?.payment_status === 'paid' ? 1 : 0} activeLabel={paymentStatusLabels[item?.payment_status] || item?.payment_status} inactiveLabel={paymentStatusLabels[item?.payment_status] || item?.payment_status} />
                    </div>
                    <div>
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{trans('hancms.sales.orders.fields.shipping_status')}</div>
                      <StatusBadge value={item?.shipping_status === 'delivered' ? 1 : 0} activeLabel={shippingStatusLabels[item?.shipping_status] || item?.shipping_status} inactiveLabel={shippingStatusLabels[item?.shipping_status] || item?.shipping_status} />
                    </div>
                  </div>
                </section>

              </div>

              <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white print:rounded-2xl">
                <div className="border-b border-slate-200 px-6 py-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {trans('hancms.sales.orders.sections.items')}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      <tr>
                        <th className="px-6 py-4">{trans('hancms.sales.orders.fields.product')}</th>
                        <th className="px-6 py-4">{trans('hancms.column.sku')}</th>
                        <th className="px-6 py-4 text-right">{trans('hancms.sales.orders.fields.quantity')}</th>
                        <th className="px-6 py-4 text-right">{trans('hancms.sales.orders.fields.unit_price')}</th>
                        <th className="px-6 py-4 text-right">{trans('hancms.sales.orders.fields.line_total')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(item?.items || []).map((orderItem: any, index: number) => (
                        <tr key={orderItem.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">{orderItem.product_name}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{orderItem.product_sku || '---'}</td>
                          <td className="px-6 py-4 text-right text-slate-700">{orderItem.quantity}</td>
                          <td className="px-6 py-4 text-right text-slate-700">{formatMoney(Number(orderItem.unit_price || 0))}</td>
                          <td className="px-6 py-4 text-right font-semibold text-slate-900">{formatMoney(Number(orderItem.line_total || 0))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px] print:grid-cols-[minmax(0,1fr)_280px]">
                <section className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 print:rounded-2xl print:bg-white">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {trans('hancms.sales.orders.fields.note')}
                  </div>
                  <div className="mt-4 min-h-24 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {item?.note || '---'}
                  </div>
                </section>

                <section className="print-section-avoid rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-lg shadow-slate-950/10 print:rounded-2xl print:border-slate-200 print:bg-white print:text-slate-900 print:shadow-none">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200 print:text-slate-400">
                    {trans('hancms.sales.orders.fields.grand_total')}
                  </div>
                  <div className="mt-5 space-y-3 text-sm">
                    {promotionSummaryRows.map((row) => (
                      <div key={row.key} className="flex items-center justify-between gap-4">
                        <span className="text-slate-300 print:text-slate-500">{row.label}</span>
                        <strong>{row.amount}</strong>
                      </div>
                    ))}
                    {promotionSummaryRows.length > 0 ? (
                      <div className="border-b border-white/10 pb-3 print:border-slate-200" />
                    ) : null}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 print:text-slate-500">{trans('hancms.sales.orders.fields.subtotal')}</span>
                      <strong>{formatMoney(Number(item?.subtotal || 0))}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 print:text-slate-500">{trans('hancms.sales.orders.fields.discount_total')}</span>
                      <strong>{formatMoney(Number(item?.discount_total || 0))}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 print:text-slate-500">{trans('hancms.sales.orders.fields.shipping_total')}</span>
                      <strong>{formatMoney(Number(item?.shipping_total || 0))}</strong>
                    </div>
                    <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-4 text-lg print:border-slate-200">
                      <span className="font-medium">{trans('hancms.sales.orders.fields.grand_total')}</span>
                      <span className="text-2xl font-semibold tracking-tight">{formatMoney(Number(item?.grand_total || 0))}</span>
                    </div>
                  </div>
                </section>
              </div>

            </div>
          </div>

          <section className="print-signature rounded-3xl border border-slate-200 bg-white p-6 print:mt-8 print:rounded-none print:border-0 print:px-0 print:py-8">
            <div className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {trans('hancms.sales.orders.name')} · {item?.order_number || `#${item?.id}`}
            </div>

            <div className="text-center">
              <h2 className="text-xl font-semibold uppercase tracking-[0.22em] text-slate-900">
                {trans('hancms.sales.orders.print.confirmation_title')}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {trans('hancms.sales.orders.print.confirmation_note')}
              </p>
            </div>

            <div className="mt-10 flex justify-end">
              <div className="text-sm italic text-slate-600">
                {trans('hancms.sales.orders.print.date_line', {
                  day: signatureDate.getDate(),
                  month: signatureDate.getMonth() + 1,
                  year: signatureDate.getFullYear(),
                })}
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                  {trans('hancms.sales.orders.print.customer_sign')}
                </div>
                <div className="text-xs text-slate-500">
                  {trans('hancms.sales.orders.print.sign_hint')}
                </div>
                <div className="h-20" />
                <div className="border-t border-dashed border-slate-300 pt-3 text-sm text-slate-500">
                  {item?.customer_name || '................................'}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                  {trans('hancms.sales.orders.print.prepared_by')}
                </div>
                <div className="text-xs text-slate-500">
                  {trans('hancms.sales.orders.print.sign_hint')}
                </div>
                <div className="h-20" />
                <div className="border-t border-dashed border-slate-300 pt-3 text-sm text-slate-500">
                  {preparedBy}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                  {trans('hancms.sales.orders.print.store_sign')}
                </div>
                <div className="text-xs text-slate-500">
                  {trans('hancms.sales.orders.print.sign_hint')}
                </div>
                <div className="h-20" />
                <div className="border-t border-dashed border-slate-300 pt-3 text-sm text-slate-500">
                  ................................
                </div>
              </div>
            </div>
          </section>

          <section className="hidden rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center text-xs uppercase tracking-[0.28em] text-slate-500 print:hidden">
            {trans('hancms.sales.orders.name')} · {item?.order_number || `#${item?.id}`}
          </section>
        </div>

        <section
          id="print-order-print"
          className="print-only-sheet mx-auto w-full max-w-[780px] bg-white px-8 py-6 text-slate-900"
        >
          <div className="border border-slate-300">
            <div className="flex items-start justify-between gap-8 border-b border-slate-300 px-5 py-4">
              <div className="w-48 text-xs leading-5">
                <div className="text-sm font-semibold uppercase tracking-[0.18em]">{layoutCompany}</div>
                <div className="mt-2">{trans('hancms.sales.orders.print.labels.hotline')}: {layoutPhone}</div>
                <div>{trans('hancms.sales.orders.print.labels.website')}: {layoutWebsite}</div>
                <div>{trans('hancms.sales.orders.print.labels.address')}: {layoutAddress}</div>
              </div>

              <div className="flex-1 text-center">
                <div className="text-[26px] font-bold uppercase tracking-[0.08em]">
                  {trans('hancms.sales.orders.name')}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                  {trans('hancms.sales.orders.print.confirmation_document')}
                </div>
              </div>

              <div className="w-52 border border-slate-300 text-sm">
                <div className="grid grid-cols-[72px_1fr] border-b border-slate-300">
                  <div className="border-r border-slate-300 bg-slate-50 px-3 py-2 font-semibold">{trans('hancms.sales.orders.print.labels.number')}</div>
                  <div className="px-3 py-2 text-right font-semibold text-rose-600">{item?.order_number || `#${item?.id}`}</div>
                </div>
                <div className="grid grid-cols-[72px_1fr]">
                  <div className="border-r border-slate-300 bg-slate-50 px-3 py-2 font-semibold">{trans('hancms.sales.orders.print.labels.date')}</div>
                  <div className="px-3 py-2 text-right">
                    {signatureDate.getDate()}/{signatureDate.getMonth() + 1}/{signatureDate.getFullYear()}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 border-b border-slate-300 px-5 py-4 text-sm">
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{trans('hancms.sales.orders.sections.customer')}</div>
                <div><span className="font-semibold">{trans('hancms.sales.orders.print.labels.name')}:</span> {item?.customer_name || '................................'}</div>
                <div><span className="font-semibold">{trans('hancms.sales.orders.print.labels.phone_short')}:</span> {item?.customer_phone || '................................'}</div>
                <div><span className="font-semibold">{trans('hancms.sales.orders.fields.customer_email')}:</span> {item?.customer_email || '................................'}</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{trans('hancms.sales.orders.print.sections.fulfillment')}</div>
                <div><span className="font-semibold">{trans('hancms.sales.orders.fields.placed_at')}:</span> {formatDateTime(item?.placed_at)}</div>
                <div><span className="font-semibold">{trans('hancms.sales.orders.fields.payment_method')}:</span> {displayPaymentMethodName}</div>
                <div><span className="font-semibold">{trans('hancms.sales.orders.fields.customer_address')}:</span> {printAddress}</div>
              </div>
            </div>

            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-400 px-2 py-2 text-center font-semibold">{trans('hancms.sales.orders.print.labels.no')}</th>
                  <th className="border border-slate-400 px-2 py-2 text-left font-semibold">{trans('hancms.sales.orders.fields.product')}</th>
                  {/* <th className="border border-slate-400 px-2 py-2 text-center font-semibold">{trans('hancms.sales.orders.print.labels.unit')}</th> */}
                  <th className="border border-slate-400 px-2 py-2 text-center font-semibold">{trans('hancms.sales.orders.fields.quantity')}</th>
                  <th className="border border-slate-400 px-2 py-2 text-right font-semibold">{trans('hancms.sales.orders.fields.unit_price')}</th>
                  <th className="border border-slate-400 px-2 py-2 text-right font-semibold">{trans('hancms.sales.orders.fields.line_total')}</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((orderItem: any, index: number) => (
                  <tr key={orderItem.id || index}>
                    <td className="border border-slate-300 px-2 py-2 text-center">{index + 1}</td>
                    <td className="border border-slate-300 px-2 py-2">{orderItem.product_name}</td>
                    {/* <td className="border border-slate-300 px-2 py-2 text-center">{trans('hancms.sales.orders.print.labels.item_unit')}</td> */}
                    <td className="border border-slate-300 px-2 py-2 text-center">{orderItem.quantity}</td>
                    <td className="border border-slate-300 px-2 py-2 text-right whitespace-nowrap tabular-nums">
                      {formatMoney(Number(orderItem.unit_price || 0))}
                    </td>
                    <td className="border border-slate-300 px-2 py-2 text-right font-semibold whitespace-nowrap tabular-nums">
                      {formatMoney(Number(orderItem.line_total || 0))}
                    </td>
                  </tr>
                ))}
                {Array.from({ length: Math.max(0, 5 - orderItems.length) }).map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td className="border border-slate-300 px-2 py-5" />
                    <td className="border border-slate-300 px-2 py-5" />
                    <td className="border border-slate-300 px-2 py-5" />
                    {/* <td className="border border-slate-300 px-2 py-5" /> */}
                    <td className="border border-slate-300 px-2 py-5" />
                    <td className="border border-slate-300 px-2 py-5" />
                  </tr>
                ))}
                <tr>
                  <td className="border border-slate-400 bg-slate-50 px-2 py-2 text-center font-semibold" colSpan={4}>{trans('hancms.sales.orders.fields.subtotal')}</td>
                  <td className="border border-slate-400 bg-slate-50 px-2 py-2 text-right font-semibold whitespace-nowrap tabular-nums">
                    {formatMoney(Number(item?.subtotal || 0))}
                  </td>
                </tr>
                {promotionSummaryRows.map((row) => (
                  <tr key={`print-promotion-${row.key}`}>
                    <td className="border border-slate-400 bg-slate-50 px-2 py-2 text-center font-semibold" colSpan={4}>
                      {row.label}
                    </td>
                    <td className="border border-slate-400 bg-slate-50 px-2 py-2 text-right whitespace-nowrap tabular-nums">
                      {row.amount}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="border border-slate-400 px-2 py-2 text-center font-semibold" colSpan={4}>Tổng giảm giá</td>
                  <td className="border border-slate-400 px-2 py-2 text-right whitespace-nowrap tabular-nums">
                    {formatMoney(Number(item?.discount_total || 0))}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-400 px-2 py-2 text-center font-semibold" colSpan={4}>{trans('hancms.sales.orders.fields.shipping_total')}</td>
                  <td className="border border-slate-400 px-2 py-2 text-right whitespace-nowrap tabular-nums">
                    {formatMoney(Number(item?.shipping_total || 0))}
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-400 bg-slate-100 px-2 py-2 text-center font-semibold uppercase" colSpan={4}>{trans('hancms.sales.orders.fields.grand_total')}</td>
                  <td className="border border-slate-400 bg-slate-100 px-2 py-2 text-right text-base font-bold whitespace-nowrap tabular-nums">
                    {formatMoney(Number(item?.grand_total || 0))}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="border-t border-slate-300 px-5 py-3 text-sm">
              <div className="text-sm leading-6">
                <span className="font-semibold">{trans('hancms.sales.orders.fields.note')}:</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-10 border-t border-slate-300 px-5 py-6 text-center text-sm">
              <div className="space-y-2">
                <div className="font-semibold">{trans('hancms.sales.orders.print.prepared_by')}</div>
                <div className="text-xs text-slate-500">{trans('hancms.sales.orders.print.sign_hint')}</div><br />
                <div className="mt-16 border-t border-dashed border-slate-400 pt-2">{preparedBy}</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">{trans('hancms.sales.orders.print.stock_keeper')}</div>
                <div className="text-xs text-slate-500">{trans('hancms.sales.orders.print.sign_hint')}</div><br />
                <div className="mt-16 border-t border-dashed border-slate-400 pt-2">................................</div>
              </div>
              <div className="space-y-2">
                <div className="font-semibold">{trans('hancms.sales.orders.print.customer_label')}</div>
                <div className="text-xs text-slate-500">{trans('hancms.sales.orders.print.sign_hint')}</div><br />
                <div className="mt-16 border-t border-dashed border-slate-400 pt-2">{item?.customer_name || '................................'}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="screen-only print:hidden">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)]">
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-900 px-5 py-4 text-white">
              <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/80">{trans('hancms.section')}</div>
              <div className="mt-1 text-sm font-semibold tracking-wide">{trans('hancms.sales.orders.sections.history')}</div>
            </div>
            <div className="max-h-[560px] overflow-auto p-4">
              {Array.isArray(item?.timelines) && item.timelines.length > 0 ? (
                <div className="space-y-3">
                  {item.timelines.map((timeline: any) => (
                    <div key={timeline.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                      <div className="font-semibold text-slate-800">{timeline.title}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {timeline.created_at} · {timeline.user_name || trans('hancms.sales.orders.history.system_user')}
                      </div>
                      {timeline.description && <div className="mt-2 text-sm text-slate-700">{timeline.description}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-500">{trans('hancms.sales.orders.empty_history')}</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

ShowPage.layout = (page: React.ReactNode) => <MainLayout title="hancms.sales.orders.name" children={page} />;
