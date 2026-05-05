import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import OrderFormView from './Components/OrderFormView';
import { buildOrderPriceSnapshotBundle, resolveOrderCurrency, resolveOrderLanguageList } from './orderCurrency';
import { convertPriceToBase, convertPriceToDisplay, getLanguageByLocale, getLocaleCode } from '../../Product/productUtils';

export default function EditPage() {
  const { trans } = useTrans();
  const { item, form_options, status_options, locale, langs, all_langs }: any = usePage().props;
  const currentLocale = getLocaleCode(locale);
  const langList = resolveOrderLanguageList(langs, all_langs);
  const currentLanguage = getLanguageByLocale(langList, currentLocale);
  const orderCurrency = resolveOrderCurrency(item, currentLocale, currentLanguage);
  const form = useForm({
    order_number: item?.order_number || '',
    customer_name: item?.customer_name || '',
    customer_email: item?.customer_email || '',
    customer_phone: item?.customer_phone || '',
    customer_address: item?.customer_address || '',
    province_code: item?.province_code || '',
    ward_code: item?.ward_code || '',
    note: item?.note || '',
    payment_method_id: item?.payment_method_id ?? '',
    order_status: item?.order_status || 'pending',
    payment_status: item?.payment_status || 'unpaid',
    shipping_status: item?.shipping_status || 'pending',
    price_snapshot: item?.price_snapshot || buildOrderPriceSnapshotBundle(langList, currentLanguage),
    discount_total: convertPriceToDisplay(item?.discount_total ?? 0, orderCurrency),
    shipping_total: convertPriceToDisplay(item?.shipping_total ?? 0, orderCurrency),
    placed_at: item?.placed_at ? String(item.placed_at).slice(0, 16) : '',
    items: (item?.items || []).map((entry: any) => ({
      product_id: entry.product_id || '',
      quantity: entry.quantity || 1,
      unit_price: convertPriceToDisplay(entry.unit_price || 0, orderCurrency),
    })),
    undo: 0,
  });
  form.transform((payload: any) => ({
    ...payload,
    price_snapshot: buildOrderPriceSnapshotBundle(langList, currentLanguage, payload.price_snapshot),
    discount_total: convertPriceToBase(payload.discount_total, orderCurrency),
    shipping_total: convertPriceToBase(payload.shipping_total, orderCurrency),
    items: (payload.items || []).map((entry: any) => ({
      ...entry,
      unit_price: convertPriceToBase(entry.unit_price, orderCurrency),
    })),
  }));
  const { data, setData, errors, put, processing } = form;

  const [undo, setUndo] = useState(0);

  const handleUndo = (status: number) => {
    setUndo(status);
    setData('undo', status);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    put(route('orders.update', item.id));
  };

  return (
    <OrderFormView
      title={`${trans('hancms.sales.orders.edit')} #${item?.order_number || item?.id}`}
      backHref={route('orders.index')}
      submitLabel={trans('hancms.button.save')}
      data={data}
      setData={setData as any}
      errors={errors as any}
      processing={processing}
      undo={undo}
      handleUndo={handleUndo}
      onSubmit={handleSubmit}
      trans={trans}
      locale={currentLocale}
      formOptions={form_options}
      statusOptions={status_options}
      timelines={item?.timelines || []}
      currency={orderCurrency}
    />
  );
}

EditPage.layout = (page: React.ReactNode) => <MainLayout title="hancms.sales.orders.name" children={page} />;
