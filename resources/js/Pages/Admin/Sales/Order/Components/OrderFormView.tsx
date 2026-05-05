import BackButton from '@/Components/Button/BackButton';
import SaveButton from '@/Components/Button/SaveButton';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import Card from '@/Components/Main/Card';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import { Save, Trash2 } from 'lucide-react';
import { convertPriceToBase, convertPriceToDisplay, formatProductPrice, type ProductCurrency } from '@/Pages/Admin/Product/productUtils';

type Option = {
  value: string;
  label: string;
};

type ProductOption = {
  id: number;
  sku: string | null;
  name: string;
  price: number;
  quantity: number;
  is_stock: boolean;
};

type PaymentMethodOption = {
  id: number;
  code: string;
  name: string;
  label?: string;
};

type ProvinceOption = {
  code: string;
  name: string;
  name_en?: string;
  full_name?: string;
  full_name_en?: string;
};

type WardOption = {
  code: string;
  name: string;
  name_en?: string;
  full_name?: string;
  full_name_en?: string;
  province_code?: string;
};

type OrderItem = {
  product_id: number | '';
  quantity: number;
  unit_price: number;
};

type OrderFormViewProps = {
  title: string;
  backHref: string;
  submitLabel: string;
  locale?: string;
  data: any;
  setData: any;
  errors: Record<string, string>;
  processing: boolean;
  undo: number;
  handleUndo: (status: number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  trans: (key: string, params?: Record<string, any>) => string;
  formOptions: {
    products: ProductOption[];
    payment_methods: PaymentMethodOption[];
    provinces: ProvinceOption[];
    wards: WardOption[];
  };
  statusOptions: {
    order: Option[];
    payment: Option[];
    shipping: Option[];
  };
  timelines?: Array<{
    id: number;
    event_type: string;
    title: string;
    description: string | null;
    created_at: string | null;
    user_name: string | null;
  }>;
  currency: ProductCurrency;
};

export default function OrderFormView({
  title,
  backHref,
  submitLabel,
  locale = '',
  data,
  setData,
  errors,
  processing,
  undo,
  handleUndo,
  onSubmit,
  trans,
  formOptions,
  statusOptions,
  timelines = [],
  currency,
}: OrderFormViewProps) {
  const products = formOptions?.products || [];
  const paymentMethods = formOptions?.payment_methods || [];
  const provinces = formOptions?.provinces || [];
  const wards = formOptions?.wards || [];
  const items: OrderItem[] = data.items || [];
  const useEnglishLocationNames = !String(locale || '').trim().toLowerCase().startsWith('vi');
  const selectedProvinceCode = String(data.province_code || wards.find((ward) => ward.code === data.ward_code)?.province_code || '').trim();
  const wardOptions = selectedProvinceCode ? wards.filter((ward) => ward.province_code === selectedProvinceCode) : [];
  const getProvinceLabel = (province: ProvinceOption) => {
    if (useEnglishLocationNames) {
      return province.full_name_en || province.name_en || province.full_name || province.name;
    }

    return province.full_name || province.name || province.full_name_en || province.name_en;
  };
  const getWardLabel = (ward: WardOption) => {
    if (useEnglishLocationNames) {
      return ward.full_name_en || ward.name_en || ward.full_name || ward.name;
    }

    return ward.full_name || ward.name || ward.full_name_en || ward.name_en;
  };

  const inputClass = (fieldName: string) =>
    `w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-slate-400 ${
      errors[fieldName] ? 'border-rose-500 bg-rose-50' : 'border-slate-300 bg-white'
    }`;

  const setItems = (nextItems: OrderItem[]) => {
    setData('items', nextItems);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        product_id: '',
        quantity: 1,
        unit_price: 0,
      },
    ]);
  };

  const updateItem = (index: number, patch: Partial<OrderItem>) => {
    const nextItems = items.map((item, itemIndex) => {
      if (itemIndex !== index) {
        return item;
      }

      return {
        ...item,
        ...patch,
      };
    });

    setItems(nextItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const selectedProduct = (productId: number | '') => {
    return products.find((product) => product.id === Number(productId));
  };

  const subtotal = items.reduce((carry, item) => carry + Number(item.quantity || 0) * Number(item.unit_price || 0), 0);
  const discountTotal = Number(data.discount_total || 0);
  const shippingTotal = Number(data.shipping_total || 0);
  const grandTotal = subtotal - discountTotal + shippingTotal;
  const formatFromDisplay = (displayPrice: number) => formatProductPrice(convertPriceToBase(displayPrice, currency), currency);

  return (
    <div className="space-y-6">
      <HeaderToolbar title={title}>
        <SaveButton
          loading={processing}
          undo={undo}
          icon={<Save size={18} />}
          sendDataStatusUndo={handleUndo}
          form="order-form"
        >
          {submitLabel}
        </SaveButton>
        <BackButton href={backHref}>{trans('hancms.button.back')}</BackButton>
      </HeaderToolbar>

      <form id="order-form" onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card title={trans('hancms.sales.orders.sections.customer')}>
            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
              <InputGroup label={trans('hancms.sales.orders.fields.order_number')}>
                <input
                  type="text"
                  className={inputClass('order_number')}
                  value={data.order_number || ''}
                  onChange={(event) => setData('order_number', event.target.value)}
                  placeholder={trans('hancms.sales.orders.placeholders.order_number')}
                />
                {errors.order_number && <MessageError>{errors.order_number}</MessageError>}
              </InputGroup>

              <InputGroup label={trans('hancms.sales.orders.fields.placed_at')}>
                <input
                  type="datetime-local"
                  className={inputClass('placed_at')}
                  value={data.placed_at || ''}
                  onChange={(event) => setData('placed_at', event.target.value)}
                />
                {errors.placed_at && <MessageError>{errors.placed_at}</MessageError>}
              </InputGroup>

              <InputGroup label={trans('hancms.sales.orders.fields.customer_name')}>
                <input
                  type="text"
                  className={inputClass('customer_name')}
                  value={data.customer_name || ''}
                  onChange={(event) => setData('customer_name', event.target.value)}
                />
                {errors.customer_name && <MessageError>{errors.customer_name}</MessageError>}
              </InputGroup>

              <InputGroup label={trans('hancms.sales.orders.fields.customer_phone')}>
                <input
                  type="text"
                  className={inputClass('customer_phone')}
                  value={data.customer_phone || ''}
                  onChange={(event) => setData('customer_phone', event.target.value)}
                />
                {errors.customer_phone && <MessageError>{errors.customer_phone}</MessageError>}
              </InputGroup>

              <InputGroup label={trans('hancms.sales.orders.fields.customer_email')}>
                <input
                  type="email"
                  className={inputClass('customer_email')}
                  value={data.customer_email || ''}
                  onChange={(event) => setData('customer_email', event.target.value)}
                />
                {errors.customer_email && <MessageError>{errors.customer_email}</MessageError>}
              </InputGroup>

              <InputGroup label={trans('hancms.sales.orders.fields.payment_method')}>
                <select
                  className={inputClass('payment_method_id')}
                  value={data.payment_method_id ?? ''}
                  onChange={(event) => setData('payment_method_id', event.target.value ? Number(event.target.value) : '')}
                >
                  <option value="">{trans('hancms.filter.all')}</option>
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.label || method.name}
                    </option>
                  ))}
                </select>
                {errors.payment_method_id && <MessageError>{errors.payment_method_id}</MessageError>}
              </InputGroup>

              <InputGroup label={trans('hancms.sales.orders.fields.province')}>
                <select
                  className={inputClass('province_code')}
                  value={data.province_code || ''}
                  onChange={(event) => {
                    setData({
                      ...data,
                      province_code: event.target.value,
                      ward_code: '',
                    });
                  }}
                >
                  <option value="">{trans('hancms.placeholder.select')}</option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                      {getProvinceLabel(province)}
                    </option>
                  ))}
                </select>
                {errors.province_code && <MessageError>{errors.province_code}</MessageError>}
              </InputGroup>

              <InputGroup label={trans('hancms.sales.orders.fields.ward')}>
                <select
                  className={inputClass('ward_code')}
                  value={data.ward_code || ''}
                  onChange={(event) => setData('ward_code', event.target.value)}
                  disabled={!selectedProvinceCode}
                >
                  <option value="">
                    {selectedProvinceCode
                      ? trans('hancms.placeholder.select')
                      : trans('hancms.sales.orders.placeholders.province_first')}
                  </option>
                  {wardOptions.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                      {getWardLabel(ward)}
                    </option>
                  ))}
                </select>
                {errors.ward_code && <MessageError>{errors.ward_code}</MessageError>}
              </InputGroup>

              <InputGroup label={trans('hancms.sales.orders.fields.customer_address')} className="md:col-span-2">
                <input
                  type="text"
                  className={inputClass('customer_address')}
                  value={data.customer_address || ''}
                  onChange={(event) => setData('customer_address', event.target.value)}
                />
                {errors.customer_address && <MessageError>{errors.customer_address}</MessageError>}
              </InputGroup>

              <InputGroup label={trans('hancms.sales.orders.fields.note')} className="md:col-span-2">
                <textarea
                  rows={4}
                  className={inputClass('note')}
                  value={data.note || ''}
                  onChange={(event) => setData('note', event.target.value)}
                />
                {errors.note && <MessageError>{errors.note}</MessageError>}
              </InputGroup>
            </div>
          </Card>

          <Card title={trans('hancms.sales.orders.sections.status')}>
            <div className="space-y-4 p-6">
              <InputGroup stacked label={trans('hancms.sales.orders.fields.order_status')}>
                <select className={inputClass('order_status')} value={data.order_status} onChange={(event) => setData('order_status', event.target.value)}>
                  {statusOptions.order.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.order_status && <MessageError>{errors.order_status}</MessageError>}
              </InputGroup>

              <InputGroup stacked label={trans('hancms.sales.orders.fields.payment_status')}>
                <select className={inputClass('payment_status')} value={data.payment_status} onChange={(event) => setData('payment_status', event.target.value)}>
                  {statusOptions.payment.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.payment_status && <MessageError>{errors.payment_status}</MessageError>}
              </InputGroup>

              <InputGroup stacked label={trans('hancms.sales.orders.fields.shipping_status')}>
                <select className={inputClass('shipping_status')} value={data.shipping_status} onChange={(event) => setData('shipping_status', event.target.value)}>
                  {statusOptions.shipping.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.shipping_status && <MessageError>{errors.shipping_status}</MessageError>}
              </InputGroup>

              <div className="grid grid-cols-1 gap-4">
                <InputGroup stacked label={trans('hancms.sales.orders.fields.discount_total')}>
                  <input
                    type="number"
                    min={0}
                    step="0.001"
                    className={inputClass('discount_total')}
                    value={data.discount_total ?? 0}
                    onChange={(event) => setData('discount_total', Number(event.target.value || 0))}
                  />
                  {errors.discount_total && <MessageError>{errors.discount_total}</MessageError>}
                </InputGroup>

                <InputGroup stacked label={trans('hancms.sales.orders.fields.shipping_total')}>
                  <input
                    type="number"
                    min={0}
                    step="0.001"
                    className={inputClass('shipping_total')}
                    value={data.shipping_total ?? 0}
                    onChange={(event) => setData('shipping_total', Number(event.target.value || 0))}
                  />
                  {errors.shipping_total && <MessageError>{errors.shipping_total}</MessageError>}
                </InputGroup>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <div className="flex items-center justify-between py-1">
                  <span>{trans('hancms.sales.orders.fields.subtotal')}</span>
                  <strong>{formatFromDisplay(subtotal)}</strong>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>{trans('hancms.sales.orders.fields.discount_total')}</span>
                  <strong>{formatFromDisplay(discountTotal)}</strong>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>{trans('hancms.sales.orders.fields.shipping_total')}</span>
                  <strong>{formatFromDisplay(shippingTotal)}</strong>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-3 text-base">
                  <span>{trans('hancms.sales.orders.fields.grand_total')}</span>
                  <strong>{formatFromDisplay(grandTotal)}</strong>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card title={trans('hancms.sales.orders.sections.items')}>
          <div className="space-y-4 p-6">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addItemRow}
                className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white"
              >
                {trans('hancms.sales.orders.actions.add_item')}
              </button>
            </div>

            {errors.items && <MessageError>{errors.items}</MessageError>}

            {items.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                {trans('hancms.sales.orders.empty_items')}
              </div>
            ) : (
              items.map((item, index) => {
                const product = selectedProduct(item.product_id);
                const lineTotal = Number(item.quantity || 0) * Number(item.unit_price || 0);

                return (
                  <div key={`${index}-${item.product_id || 'new'}`} className="rounded-xl border border-slate-200 p-4">
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,150px)_minmax(0,180px)_minmax(0,190px)_auto] xl:items-start">
                      <InputGroup stacked label={trans('hancms.sales.orders.fields.product')}>
                          <select
                            className={inputClass(`items.${index}.product_id`)}
                            value={item.product_id}
                            onChange={(event) => {
                              const nextProduct = products.find((entry) => entry.id === Number(event.target.value));
                              updateItem(index, {
                                product_id: event.target.value ? Number(event.target.value) : '',
                                unit_price: convertPriceToDisplay(nextProduct?.price ?? 0, currency),
                              });
                            }}
                          >
                            <option value="">{trans('hancms.sales.orders.placeholders.product')}</option>
                            {products.map((entry) => (
                              <option key={entry.id} value={entry.id} disabled={Number(entry.quantity ?? 0) <= 0}>
                                {entry.name} {entry.sku ? `(${entry.sku})` : ''}{Number(entry.quantity ?? 0) <= 0 ? ' - Hết hàng' : ''}
                              </option>
                            ))}
                          </select>
                          {errors[`items.${index}.product_id`] && <MessageError>{errors[`items.${index}.product_id`]}</MessageError>}
                          {product && (
                            <div className="mt-3 text-xs text-slate-500">
                              {product.sku || 'N/A'} · {trans('hancms.sales.orders.fields.available_stock')}: {product.quantity}
                            </div>
                          )}
                      </InputGroup>

                      <InputGroup stacked label={trans('hancms.sales.orders.fields.quantity')}>
                        <input
                          type="number"
                          min={1}
                          className={inputClass(`items.${index}.quantity`)}
                          value={item.quantity}
                          onChange={(event) => updateItem(index, { quantity: Number(event.target.value || 1) })}
                        />
                        {errors[`items.${index}.quantity`] && <MessageError>{errors[`items.${index}.quantity`]}</MessageError>}
                      </InputGroup>

                      <InputGroup stacked label={trans('hancms.sales.orders.fields.unit_price')}>
                        <input
                          type="number"
                          min={0}
                          step="0.001"
                          className={inputClass(`items.${index}.unit_price`)}
                          value={item.unit_price}
                          onChange={(event) => updateItem(index, { unit_price: Number(event.target.value || 0) })}
                        />
                        {errors[`items.${index}.unit_price`] && <MessageError>{errors[`items.${index}.unit_price`]}</MessageError>}
                      </InputGroup>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">{trans('hancms.sales.orders.fields.line_total')}</label>
                        <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-right text-sm font-semibold whitespace-nowrap tabular-nums">
                          {formatFromDisplay(lineTotal)}
                        </div>
                      </div>

                      <div className="flex items-start pt-7">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-rose-900/15 transition hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-900/20"
                        >
                          <Trash2 size={16} />
                          {trans('hancms.button.delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card title={trans('hancms.sales.orders.sections.history')}>
          <div className="max-h-[560px] overflow-auto p-4">
            {timelines.length > 0 ? (
              <div className="space-y-3">
                {timelines.map((timeline) => (
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
        </Card>
      </form>
    </div>
  );
}
