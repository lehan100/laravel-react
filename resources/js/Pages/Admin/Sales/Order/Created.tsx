import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import OrderFormView from './Components/OrderFormView';
import { buildOrderPriceSnapshotBundle, resolveOrderLanguageList } from './orderCurrency';
import { convertPriceToBase, getLanguageByLocale, getLocaleCode, getProductCurrencyFromLocale } from '../../Product/productUtils';

export default function CreatedPage() {
  const { trans } = useTrans();
  const { form_options, status_options, locale, langs, all_langs }: any = usePage().props;
  const currentLocale = getLocaleCode(locale);
  const langList = resolveOrderLanguageList(langs, all_langs);
  const currentLanguage = getLanguageByLocale(langList, currentLocale);
  const orderCurrency = getProductCurrencyFromLocale(currentLocale, currentLanguage);
  const form = useForm({
    order_number: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    province_code: '',
    ward_code: '',
    note: '',
    payment_method_id: '',
    order_status: 'pending',
    payment_status: 'unpaid',
    shipping_status: 'pending',
    price_snapshot: buildOrderPriceSnapshotBundle(langList, currentLanguage),
    discount_total: 0,
    shipping_total: 0,
    placed_at: new Date().toISOString().slice(0, 16),
    items: [],
    coupon_code: '',
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
  const { data, setData, errors, post, processing } = form;

  const [undo, setUndo] = useState(0);

  const handleUndo = (status: number) => {
    setUndo(status);
    setData('undo', status);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    post(route('orders.store'));
  };

  return (
    <OrderFormView
      title={trans('hancms.sales.orders.created')}
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
      timelines={[]}
      currency={orderCurrency}
    />
  );
}

CreatedPage.layout = (page: React.ReactNode) => <MainLayout title="hancms.sales.orders.name" children={page} />;
