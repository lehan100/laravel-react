import { useEffect, useMemo, useRef, useState } from 'react';
import BackButton from '@/Components/Button/BackButton';
import SaveButton from '@/Components/Button/SaveButton';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import Card from '@/Components/Main/Card';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import { ChevronDown, Save, Search, Trash2 } from 'lucide-react';
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
  has_variants?: boolean;
  available_quantity?: number;
  variants?: Array<{
    id: number;
    sku: string | null;
    label: string;
    price: number;
    stock: number;
  }>;
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

type SearchableSelectOption = {
  value: string;
  label: string;
};

type OrderItem = {
  product_id: number | '';
  variant_id?: number | '';
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

type SearchableSelectProps = {
  value: string;
  options: SearchableSelectOption[];
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
};

function SearchableSelect({
  value,
  options,
  placeholder,
  searchPlaceholder,
  emptyText,
  disabled = false,
  error,
  onChange,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery('');
    }
  }, [open]);

  const triggerClass = `flex min-h-[42px] w-full items-center justify-between gap-3 rounded-md border px-3 py-2 text-left text-sm outline-none transition focus:ring-2 focus:ring-slate-400 ${
    error ? 'border-rose-500 bg-rose-50' : 'border-slate-300 bg-white'
  } ${disabled ? 'cursor-not-allowed bg-slate-100 text-slate-400' : 'cursor-pointer hover:border-slate-400'}`;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className={triggerClass}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen((current) => !current);
          }
        }}
      >
        <span className={`min-w-0 flex-1 truncate ${selectedOption ? 'text-slate-900' : 'text-slate-400'}`}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && !disabled && (
        <div className="absolute left-0 top-full z-30 mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              autoFocus
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div className="mt-3 max-h-60 overflow-auto pr-1">
            {filteredOptions.length > 0 ? (
              <div className="space-y-1">
                {filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                      option.value === value ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    {option.value === value && <span className="ml-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-600">Selected</span>}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-6 text-sm text-slate-500">{emptyText}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
      return province.full_name_en || province.name_en || province.full_name || province.name || '';
    }

    return province.full_name || province.name || province.full_name_en || province.name_en || '';
  };
  const getWardLabel = (ward: WardOption) => {
    if (useEnglishLocationNames) {
      return ward.full_name_en || ward.name_en || ward.full_name || ward.name || '';
    }

    return ward.full_name || ward.name || ward.full_name_en || ward.name_en || '';
  };
  const provinceSelectOptions = useMemo<SearchableSelectOption[]>(
    () => provinces.map((province) => ({ value: province.code, label: getProvinceLabel(province) })),
    [provinces, useEnglishLocationNames],
  );
  const wardSelectOptions = useMemo<SearchableSelectOption[]>(
    () => wardOptions.map((ward) => ({ value: ward.code, label: getWardLabel(ward) })),
    [wardOptions, useEnglishLocationNames],
  );

  useEffect(() => {
    if (!data.province_code && selectedProvinceCode) {
      setData({
        ...data,
        province_code: selectedProvinceCode,
      });
    }
  }, [data, data.province_code, selectedProvinceCode, setData]);

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
        variant_id: '',
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
  const selectedVariant = (product: ProductOption | undefined, variantId: number | '' | undefined) => {
    return product?.variants?.find((variant) => variant.id === Number(variantId));
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
          <Card title={trans('hancms.sales.orders.sections.customer')} overflow="visible" contentOverflow="visible">
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
                <SearchableSelect
                  value={data.province_code || ''}
                  options={provinceSelectOptions}
                  placeholder={trans('hancms.placeholder.select')}
                  searchPlaceholder={trans('hancms.sales.orders.placeholders.search')}
                  emptyText={trans('hancms.message.empty')}
                  error={errors.province_code}
                  onChange={(nextProvinceCode) => {
                    setData({
                      ...data,
                      province_code: nextProvinceCode,
                      ward_code: '',
                    });
                  }}
                />
                {errors.province_code && <MessageError>{errors.province_code}</MessageError>}
              </InputGroup>

              <InputGroup label={trans('hancms.sales.orders.fields.ward')}>
                <SearchableSelect
                  value={data.ward_code || ''}
                  options={wardSelectOptions}
                  placeholder={selectedProvinceCode ? trans('hancms.placeholder.select') : trans('hancms.sales.orders.placeholders.province_first')}
                  searchPlaceholder={trans('hancms.sales.orders.placeholders.search')}
                  emptyText={selectedProvinceCode ? trans('hancms.message.empty') : trans('hancms.sales.orders.placeholders.province_first')}
                  disabled={!selectedProvinceCode}
                  error={errors.ward_code}
                  onChange={(nextWardCode) => {
                    const selectedWard = wards.find((ward) => ward.code === nextWardCode);

                    setData({
                      ...data,
                      ward_code: nextWardCode,
                      province_code: selectedWard?.province_code || data.province_code || '',
                    });
                  }}
                />
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
                const variants = product?.variants || [];
                const variant = selectedVariant(product, item.variant_id);
                const availableQuantity = variants.length > 0
                  ? (variant?.stock ?? 0)
                  : (product?.quantity ?? 0);
                const lineTotal = Number(item.quantity || 0) * Number(item.unit_price || 0);

                return (
                  <div key={`${index}-${item.product_id || 'new'}`} className="rounded-xl border border-slate-200 p-4">
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1.5fr)_minmax(0,120px)_minmax(0,160px)_minmax(0,180px)_auto] xl:items-start">
                      <InputGroup stacked label={trans('hancms.sales.orders.fields.product')}>
                          <select
                            className={inputClass(`items.${index}.product_id`)}
                            value={item.product_id}
                            onChange={(event) => {
                              const nextProduct = products.find((entry) => entry.id === Number(event.target.value));
                              updateItem(index, {
                                product_id: event.target.value ? Number(event.target.value) : '',
                                variant_id: '',
                                unit_price: convertPriceToDisplay(nextProduct?.price ?? 0, currency),
                              });
                            }}
                          >
                            <option value="">{trans('hancms.sales.orders.placeholders.product')}</option>
                            {products.map((entry) => (
                              <option key={entry.id} value={entry.id} disabled={Number(entry.available_quantity ?? entry.quantity ?? 0) <= 0}>
                                {entry.name} {entry.sku ? `(${entry.sku})` : ''}{Number(entry.available_quantity ?? entry.quantity ?? 0) <= 0 ? ' - Hết hàng' : ''}
                              </option>
                            ))}
                          </select>
                          {errors[`items.${index}.product_id`] && <MessageError>{errors[`items.${index}.product_id`]}</MessageError>}
                          {product && (
                            <div className="mt-3 text-xs text-slate-500">
                              {product.sku || 'N/A'} · {trans('hancms.sales.orders.fields.available_stock')}: {availableQuantity}
                            </div>
                          )}
                      </InputGroup>

                      <InputGroup stacked label={trans('hancms.sales.orders.fields.variant') || 'Variant'}>
                        <select
                          className={inputClass(`items.${index}.variant_id`)}
                          value={item.variant_id ?? ''}
                          onChange={(event) => {
                            const nextVariant = variants.find((entry) => entry.id === Number(event.target.value));
                            updateItem(index, {
                              variant_id: event.target.value ? Number(event.target.value) : '',
                              unit_price: nextVariant
                                ? convertPriceToDisplay(nextVariant.price ?? 0, currency)
                                : item.unit_price,
                            });
                          }}
                          disabled={!product || variants.length === 0}
                        >
                          <option value="">
                            {variants.length > 0 ? trans('hancms.placeholder.select') : trans('hancms.sales.orders.fields.no_variant') || 'No variant'}
                          </option>
                          {variants.map((entry) => (
                            <option key={entry.id} value={entry.id} disabled={Number(entry.stock ?? 0) <= 0}>
                              {entry.label} {entry.sku ? `(${entry.sku})` : ''}{Number(entry.stock ?? 0) <= 0 ? ' - Hết hàng' : ''}
                            </option>
                          ))}
                        </select>
                        {errors[`items.${index}.variant_id`] && <MessageError>{errors[`items.${index}.variant_id`]}</MessageError>}
                      </InputGroup>

                      <InputGroup stacked label={trans('hancms.sales.orders.fields.quantity')}>
                        <input
                          type="number"
                          min={1}
                          max={availableQuantity || undefined}
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
