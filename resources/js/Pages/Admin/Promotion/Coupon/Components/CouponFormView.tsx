import BackButton from '@/Components/Button/BackButton';
import SaveButton from '@/Components/Button/SaveButton';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import Card from '@/Components/Main/Card';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import StatusBadge from '@/Components/Status/StatusBadge';
import StatusSwitch from '@/Components/Status/StatusSwitch';
import CategoryMultiSelect from '../../../Product/Components/CategoryMultiSelect';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import axios from 'axios';
import { formatPriceInput, formatProductPrice, getLanguageByLocale, getLocaleCode, getProductCurrencyFromLocale, loadProductCurrency, parsePriceInput, type ProductCurrency } from '../../../Product/productUtils';

type CouponFormViewProps = {
  title: string;
  backHref: string;
  submitLabel: string;
  data: any;
  setData: (key: string, value: any) => void;
  errors: Record<string, string>;
  processing: boolean;
  itemsCategoryActive: any[];
  itemsSelectedProducts: any[];
  undo: number;
  handleUndo: (status: number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  trans: (key: string, params?: Record<string, any>) => string;
};

export default function CouponFormView({
  title,
  backHref,
  submitLabel,
  data,
  setData,
  errors,
  processing,
  itemsCategoryActive = [],
  itemsSelectedProducts = [],
  undo,
  handleUndo,
  onSubmit,
  trans,
}: CouponFormViewProps) {
  const { props }: any = usePage();
  const locale = getLocaleCode(props.locale || 'vi');
  const langList = props?.langs?.data || (Array.isArray(props?.langs) ? props.langs : Object.values(props?.langs || {}));
  const currentLanguage = getLanguageByLocale(langList, locale);
  const discountCurrency = getProductCurrencyFromLocale(locale);
  const [resolvedCurrency, setResolvedCurrency] = useState<ProductCurrency>(() => getProductCurrencyFromLocale(locale, currentLanguage));
  const [discountType, setDiscountType] = useState(data.discount_type || 'percent');
  const [discountValueInput, setDiscountValueInput] = useState(() =>
    (data.discount_type || 'percent') === 'fixed'
      ? formatPriceInput(data.discount_value ?? 0, discountCurrency)
      : String(data.discount_value ?? '')
  );
  const [discountValueFocused, setDiscountValueFocused] = useState(false);
  const [maxDiscountAmountInput, setMaxDiscountAmountInput] = useState(() =>
    data.max_discount_amount === '' || data.max_discount_amount === null || data.max_discount_amount === undefined
      ? ''
      : formatPriceInput(data.max_discount_amount, discountCurrency)
  );
  const [minOrderAmountInput, setMinOrderAmountInput] = useState(() =>
    data.min_order_amount === '' || data.min_order_amount === null || data.min_order_amount === undefined
      ? ''
      : formatPriceInput(data.min_order_amount, discountCurrency)
  );
  const [maxOrderAmountInput, setMaxOrderAmountInput] = useState(() =>
    data.max_order_amount === '' || data.max_order_amount === null || data.max_order_amount === undefined
      ? ''
      : formatPriceInput(data.max_order_amount, discountCurrency)
  );
  const [maxDiscountAmountFocused, setMaxDiscountAmountFocused] = useState(false);
  const [minOrderAmountFocused, setMinOrderAmountFocused] = useState(false);
  const [maxOrderAmountFocused, setMaxOrderAmountFocused] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'scope' | 'conditions'>('info');
  const selectedCategoryIds = Array.isArray(data.category_ids) ? data.category_ids : [];
  const selectedProductIds = useMemo(
    () => (Array.isArray(data.product_ids) ? data.product_ids.map((id: any) => Number(id)).filter((id: number) => !Number.isNaN(id)) : []),
    [data.product_ids]
  );
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productModalPage, setProductModalPage] = useState(1);
  const [tempSelectedProductIds, setTempSelectedProductIds] = useState<number[]>([]);
  const [modalProducts, setModalProducts] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTotalPages, setModalTotalPages] = useState(1);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [knownProducts, setKnownProducts] = useState<Map<number, any>>(new Map());
  const modalPageSize = 10;

  const productRows = useMemo(
    () => (Array.isArray(itemsSelectedProducts) ? itemsSelectedProducts : []).map((item: any) => ({
      id: Number(item.id),
      sku: item.sku || `#${item.id}`,
      name: item.name || item.sku || `#${item.id}`,
      price: item?.price ?? 0,
      status: Number(item?.status || 0),
      category_ids: Array.isArray(item?.category_ids)
        ? item.category_ids.map((id: any) => Number(id)).filter((id: number) => !Number.isNaN(id))
        : [],
    })),
    [itemsSelectedProducts]
  );

  const categoryOptions = useMemo(
    () => (Array.isArray(itemsCategoryActive) ? itemsCategoryActive : []).map((category: any) => ({
      id: String(category.id),
      name: category.name_with_depth || category.name || `#${category.id}`,
    })),
    [itemsCategoryActive]
  );

  const selectedProductRows = useMemo(
    () => selectedProductIds.map((id: number) => knownProducts.get(id)).filter(Boolean),
    [selectedProductIds, knownProducts]
  );

  useEffect(() => {
    setDiscountType(data.discount_type || 'percent');
  }, [data.discount_type]);

  useEffect(() => {
    const map = new Map<number, any>();
    productRows.forEach((row: any) => {
      map.set(row.id, row);
    });
    setKnownProducts(map);
  }, [productRows]);

  useEffect(() => {
    let mounted = true;

    loadProductCurrency(currentLanguage, locale).then((currency) => {
      if (!mounted) return;
      setResolvedCurrency(currency);
    });

    return () => {
      mounted = false;
    };
  }, [locale, currentLanguage?.code, currentLanguage?.currency]);

  useEffect(() => {
    if (discountType === 'fixed') {
      if (!discountValueFocused) {
        setDiscountValueInput(formatPriceInput(data.discount_value ?? 0, discountCurrency));
      }
      return;
    }

    setDiscountValueInput(String(data.discount_value ?? ''));
  }, [discountType, data.discount_value, discountCurrency.code, discountCurrency.locale, discountValueFocused]);

  useEffect(() => {
    if (!maxDiscountAmountFocused) {
      setMaxDiscountAmountInput(
        data.max_discount_amount === '' || data.max_discount_amount === null || data.max_discount_amount === undefined
          ? ''
          : formatPriceInput(data.max_discount_amount, discountCurrency)
      );
    }
    if (!minOrderAmountFocused) {
      setMinOrderAmountInput(
        data.min_order_amount === '' || data.min_order_amount === null || data.min_order_amount === undefined
          ? ''
          : formatPriceInput(data.min_order_amount, discountCurrency)
      );
    }
    if (!maxOrderAmountFocused) {
      setMaxOrderAmountInput(
        data.max_order_amount === '' || data.max_order_amount === null || data.max_order_amount === undefined
          ? ''
          : formatPriceInput(data.max_order_amount, discountCurrency)
      );
    }
  }, [
    data.max_discount_amount,
    data.min_order_amount,
    data.max_order_amount,
    discountCurrency.code,
    discountCurrency.locale,
    maxDiscountAmountFocused,
    minOrderAmountFocused,
    maxOrderAmountFocused,
  ]);

  useEffect(() => {
    const infoErrorFields = ['code', 'name', 'description', 'discount_type', 'discount_value', 'max_discount_amount'];
    const scopeErrorFields = ['category_ids', 'product_ids'];
    const conditionErrorFields = [
      'min_order_amount',
      'max_order_amount',
      'usage_limit_total',
      'usage_limit_per_user',
      'starts_at',
      'ends_at',
      'first_order_only',
      'is_public',
      'stackable',
    ];

    const hasInfoError = infoErrorFields.some((field) => !!errors[field]);
    const hasScopeError = scopeErrorFields.some((field) => !!errors[field]);
    const hasConditionError = conditionErrorFields.some((field) => !!errors[field]);

    if (hasInfoError) {
      setActiveTab('info');
      return;
    }
    if (hasScopeError) {
      setActiveTab('scope');
      return;
    }
    if (hasConditionError) {
      setActiveTab('conditions');
    }
  }, [errors]);

  useEffect(() => {
    setProductModalPage(1);
  }, [productSearch, productCategoryFilter]);

  useEffect(() => {
    if (!isProductModalOpen) {
      return;
    }

    const timeout = setTimeout(async () => {
      setModalLoading(true);
      try {
        const response = await axios.get(route('coupon.products-picker'), {
          params: {
            search: productSearch,
            category_id: productCategoryFilter,
            page: productModalPage,
            per_page: modalPageSize,
          },
        });

        const responseData = response?.data?.data || [];
        const meta = response?.data?.meta || {};
        const rows = Array.isArray(responseData) ? responseData : [];

        setModalProducts(rows);
        setModalCurrentPage(Number(meta.current_page || 1));
        setModalTotalPages(Number(meta.last_page || 1));
        setKnownProducts((prev) => {
          const map = new Map(prev);
          rows.forEach((row: any) => {
            map.set(Number(row.id), row);
          });
          return map;
        });
      } catch (_error) {
        setModalProducts([]);
        setModalCurrentPage(1);
        setModalTotalPages(1);
      } finally {
        setModalLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [isProductModalOpen, productSearch, productCategoryFilter, productModalPage]);

  const inputClass = (fieldName: string) =>
    `w-full border rounded-md p-2 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
    }`;

  const handleDiscountTypeChange = (value: string) => {
    setDiscountType(value);
    setData('discount_type', value);
    setData('discount_value', 0);
    setDiscountValueFocused(false);
    setDiscountValueInput(value === 'fixed' ? formatPriceInput(0, discountCurrency) : '0');
  };

  const handleDiscountValueChange = (value: string) => {
    if (discountType === 'fixed') {
      setDiscountValueInput(value);
      setData('discount_value', parsePriceInput(value));
      return;
    }

    if (value === '') {
      setDiscountValueInput('');
      setData('discount_value', '');
      return;
    }

    const nextValue = Math.min(100, Number(value));
    if (Number.isNaN(nextValue)) {
      setDiscountValueInput('');
      setData('discount_value', '');
      return;
    }

    setDiscountValueInput(String(nextValue));
    setData('discount_value', nextValue);
  };

  const handleCurrencyFieldChange = (field: 'max_discount_amount' | 'min_order_amount' | 'max_order_amount', value: string) => {
    if (field === 'max_discount_amount') {
      setMaxDiscountAmountInput(value);
    }
    if (field === 'min_order_amount') {
      setMinOrderAmountInput(value);
    }
    if (field === 'max_order_amount') {
      setMaxOrderAmountInput(value);
    }

    if (value === '') {
      setData(field, '');
      return;
    }

    setData(field, parsePriceInput(value));
  };

  const hasTabError = (tab: 'info' | 'scope' | 'conditions') => {
    if (tab === 'info') {
      return ['code', 'name', 'description', 'discount_type', 'discount_value', 'max_discount_amount'].some((field) => !!errors[field]);
    }
    if (tab === 'scope') {
      return ['category_ids', 'product_ids'].some((field) => !!errors[field]);
    }
    return ['min_order_amount', 'max_order_amount', 'usage_limit_total', 'usage_limit_per_user', 'starts_at', 'ends_at'].some((field) => !!errors[field]);
  };

  const openProductModal = () => {
    setTempSelectedProductIds(selectedProductIds);
    setProductSearch('');
    setProductCategoryFilter('all');
    setProductModalPage(1);
    setIsProductModalOpen(true);
  };

  const toggleTempProduct = (productId: number) => {
    setTempSelectedProductIds((prev) => (
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    ));
  };

  const removeSelectedProduct = (productId: number) => {
    setData('product_ids', selectedProductIds.filter((id: number) => id !== productId));
  };

  const confirmProductSelection = () => {
    setData('product_ids', tempSelectedProductIds);
    setIsProductModalOpen(false);
  };

  const renderTabContent = () => {
    if (activeTab === 'info') {
      return (
        <Card title={trans('hancms.title.infomation')}>
          <div className="p-6 space-y-5">
            <StatusSwitch
              value={data.is_active}
              onChange={(value) => setData('is_active', value)}
              activeLabel={trans('hancms.status.active')}
              inactiveLabel={trans('hancms.status.inactive')}
            />

            <InputGroup label={trans('hancms.column.code')}>
              <input
                type="text"
                required
                className={inputClass('code')}
                value={data.code}
                onChange={(e) => setData('code', e.target.value)}
              />
              {errors.code && <MessageError>{errors.code}</MessageError>}
            </InputGroup>

            <InputGroup label={trans('hancms.column.name')}>
              <input
                type="text"
                className={inputClass('name')}
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
              />
              {errors.name && <MessageError>{errors.name}</MessageError>}
            </InputGroup>

            <InputGroup label={trans('hancms.column.description')}>
              <textarea
                rows={4}
                className={inputClass('description')}
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
              />
              {errors.description && <MessageError>{errors.description}</MessageError>}
            </InputGroup>

            <InputGroup label={trans('hancms.promotion.coupon.fields.discount_type')}>
              <select
                className={inputClass('discount_type')}
                value={discountType}
                onChange={(e) => {
                  handleDiscountTypeChange(e.target.value);
                }}
              >
                <option value="percent">{trans('hancms.promotion.coupon.options.percent')}</option>
                <option value="fixed">{trans('hancms.promotion.coupon.options.fixed')}</option>
              </select>
              {errors.discount_type && <MessageError>{errors.discount_type}</MessageError>}
            </InputGroup>

            <InputGroup label={trans('hancms.promotion.coupon.fields.discount_value')}>
              {discountType === 'fixed' ? (
                <input
                  type="text"
                  inputMode="decimal"
                  className={inputClass('discount_value')}
                  value={discountValueInput}
                  onFocus={() => {
                    setDiscountValueFocused(true);
                    setDiscountValueInput(String(parsePriceInput(data.discount_value ?? 0)));
                  }}
                  onBlur={() => {
                    setDiscountValueFocused(false);
                    setDiscountValueInput(formatPriceInput(data.discount_value ?? 0, discountCurrency));
                  }}
                  onChange={(e) => handleDiscountValueChange(e.target.value)}
                />
              ) : (
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.01"
                  className={inputClass('discount_value')}
                  value={discountValueInput}
                  onChange={(e) => handleDiscountValueChange(e.target.value)}
                />
              )}
              {errors.discount_value && <MessageError>{errors.discount_value}</MessageError>}
            </InputGroup>

            <InputGroup label={trans('hancms.promotion.coupon.fields.max_discount_amount')}>
              <input
                type="text"
                inputMode="decimal"
                className={inputClass('max_discount_amount')}
                value={maxDiscountAmountInput}
                onFocus={() => {
                  setMaxDiscountAmountFocused(true);
                  setMaxDiscountAmountInput(
                    data.max_discount_amount === '' || data.max_discount_amount === null || data.max_discount_amount === undefined
                      ? ''
                      : String(parsePriceInput(data.max_discount_amount))
                  );
                }}
                onBlur={() => {
                  setMaxDiscountAmountFocused(false);
                  setMaxDiscountAmountInput(
                    data.max_discount_amount === '' || data.max_discount_amount === null || data.max_discount_amount === undefined
                      ? ''
                      : formatPriceInput(data.max_discount_amount, discountCurrency)
                  );
                }}
                onChange={(e) => handleCurrencyFieldChange('max_discount_amount', e.target.value)}
              />
              {errors.max_discount_amount && <MessageError>{errors.max_discount_amount}</MessageError>}
            </InputGroup>
          </div>
        </Card>
      );
    }

    if (activeTab === 'scope') {
      return (
        <Card title={trans('hancms.promotion.coupon.apply_scope')}>
          <div className="p-6 space-y-5">
            <p className="text-xs text-slate-500">
              {trans('hancms.promotion.coupon.apply_scope_hint')}
            </p>

            <InputGroup label={trans('hancms.promotion.coupon.fields.apply_categories')}>
              <CategoryMultiSelect
                data={itemsCategoryActive}
                value={selectedCategoryIds}
                onChange={(ids) => setData('category_ids', ids)}
                trans={trans}
                error={errors?.category_ids}
              />
              {errors.category_ids && <MessageError>{errors.category_ids}</MessageError>}
            </InputGroup>

            <InputGroup label={trans('hancms.promotion.coupon.fields.apply_products')}>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-500">
                    {selectedProductRows.length} {trans('hancms.catalog.category.type.options.product')}
                  </span>
                  <button
                    type="button"
                    onClick={openProductModal}
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    + {trans('hancms.button.created')}
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">ID</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.sku')}</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.name')}</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.price')}</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.status')}</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.action')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {selectedProductRows.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-3 py-6 text-center text-slate-400">
                            {trans('hancms.placeholder.select')}
                          </td>
                        </tr>
                      ) : (
                        selectedProductRows.map((row: any) => (
                          <tr key={row.id}>
                            <td className="px-3 py-2">{row.id}</td>
                            <td className="px-3 py-2">{row.sku}</td>
                            <td className="px-3 py-2">{row.name}</td>
                            <td className="px-3 py-2">{formatProductPrice(row.price, resolvedCurrency)}</td>
                            <td className="px-3 py-2">
                              <StatusBadge
                                value={row.status}
                                activeLabel={trans('hancms.status.active')}
                                inactiveLabel={trans('hancms.status.inactive')}
                              />
                            </td>
                            <td className="px-3 py-2">
                              <button
                                type="button"
                                onClick={() => removeSelectedProduct(row.id)}
                                className="rounded-md border border-rose-300 px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                              >
                                {trans('hancms.button.delete')}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {errors.product_ids && <MessageError>{errors.product_ids}</MessageError>}
            </InputGroup>
          </div>
        </Card>
      );
    }

    return (
      <Card title={trans('hancms.promotion.coupon.conditions')}>
        <div className="p-6 space-y-5">
          <InputGroup label={trans('hancms.promotion.coupon.fields.min_order_amount')}>
            <input
              type="text"
              inputMode="decimal"
              className={inputClass('min_order_amount')}
              value={minOrderAmountInput}
              onFocus={() => {
                setMinOrderAmountFocused(true);
                setMinOrderAmountInput(
                  data.min_order_amount === '' || data.min_order_amount === null || data.min_order_amount === undefined
                    ? ''
                    : String(parsePriceInput(data.min_order_amount))
                );
              }}
              onBlur={() => {
                setMinOrderAmountFocused(false);
                setMinOrderAmountInput(
                  data.min_order_amount === '' || data.min_order_amount === null || data.min_order_amount === undefined
                    ? ''
                    : formatPriceInput(data.min_order_amount, discountCurrency)
                );
              }}
              onChange={(e) => handleCurrencyFieldChange('min_order_amount', e.target.value)}
            />
            {errors.min_order_amount && <MessageError>{errors.min_order_amount}</MessageError>}
          </InputGroup>

          <InputGroup label={trans('hancms.promotion.coupon.fields.max_order_amount')}>
            <input
              type="text"
              inputMode="decimal"
              className={inputClass('max_order_amount')}
              value={maxOrderAmountInput}
              onFocus={() => {
                setMaxOrderAmountFocused(true);
                setMaxOrderAmountInput(
                  data.max_order_amount === '' || data.max_order_amount === null || data.max_order_amount === undefined
                    ? ''
                    : String(parsePriceInput(data.max_order_amount))
                );
              }}
              onBlur={() => {
                setMaxOrderAmountFocused(false);
                setMaxOrderAmountInput(
                  data.max_order_amount === '' || data.max_order_amount === null || data.max_order_amount === undefined
                    ? ''
                    : formatPriceInput(data.max_order_amount, discountCurrency)
                );
              }}
              onChange={(e) => handleCurrencyFieldChange('max_order_amount', e.target.value)}
            />
            {errors.max_order_amount && <MessageError>{errors.max_order_amount}</MessageError>}
          </InputGroup>

          <InputGroup label={trans('hancms.promotion.coupon.fields.usage_limit_total')}>
            <input
              type="number"
              className={inputClass('usage_limit_total')}
              value={data.usage_limit_total}
              onChange={(e) => setData('usage_limit_total', e.target.value)}
            />
            {errors.usage_limit_total && <MessageError>{errors.usage_limit_total}</MessageError>}
          </InputGroup>

          <InputGroup label={trans('hancms.promotion.coupon.fields.usage_limit_per_user')}>
            <input
              type="number"
              className={inputClass('usage_limit_per_user')}
              value={data.usage_limit_per_user}
              onChange={(e) => setData('usage_limit_per_user', e.target.value)}
            />
            {errors.usage_limit_per_user && <MessageError>{errors.usage_limit_per_user}</MessageError>}
          </InputGroup>

          <InputGroup label={trans('hancms.promotion.coupon.fields.starts_at')}>
            <input
              type="datetime-local"
              className={inputClass('starts_at')}
              value={data.starts_at}
              onChange={(e) => setData('starts_at', e.target.value)}
            />
            {errors.starts_at && <MessageError>{errors.starts_at}</MessageError>}
          </InputGroup>

          <InputGroup label={trans('hancms.promotion.coupon.fields.ends_at')}>
            <input
              type="datetime-local"
              className={inputClass('ends_at')}
              value={data.ends_at}
              onChange={(e) => setData('ends_at', e.target.value)}
            />
            {errors.ends_at && <MessageError>{errors.ends_at}</MessageError>}
          </InputGroup>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={!!data.first_order_only}
              onChange={(e) => setData('first_order_only', e.target.checked)}
            />
            {trans('hancms.promotion.coupon.fields.first_order_only')}
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={!!data.is_public}
              onChange={(e) => setData('is_public', e.target.checked)}
            />
            {trans('hancms.promotion.coupon.fields.is_public')}
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={!!data.stackable}
              onChange={(e) => setData('stackable', e.target.checked)}
            />
            {trans('hancms.promotion.coupon.fields.stackable')}
          </label>
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6">
      <HeaderToolbar
        title={
          <>
            {title}
            {data.code && <span className="text-cyan-600">: {data.code}</span>}
          </>
        }
      >
        <SaveButton
          loading={processing}
          undo={undo}
          icon={<Save size={20} />}
          sendDataStatusUndo={handleUndo}
          form="my-form"
        >
          {submitLabel}
        </SaveButton>
        <BackButton href={backHref}>{trans('hancms.button.back')}</BackButton>
      </HeaderToolbar>

      <form id="my-form" noValidate onSubmit={onSubmit} className="text-sm">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]">
          <div className="flex flex-col md:flex-row">
            <div className="border-b border-slate-200 bg-gradient-to-b from-slate-950/[0.03] to-white p-3 md:w-64 md:border-b-0 md:border-r md:p-4">
              <div className="mb-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{trans('hancms.tabs')}</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{trans('hancms.promotion.coupon.name')}</div>
              </div>
              <div className="flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible" role="tablist">
                {[
                  { id: 'info' as const, label: trans('hancms.title.infomation') },
                  { id: 'scope' as const, label: trans('hancms.promotion.coupon.apply_scope') },
                  { id: 'conditions' as const, label: trans('hancms.promotion.coupon.conditions') },
                ].map((tab) => {
                  const active = activeTab === tab.id;
                  const errorInTab = hasTabError(tab.id);
                  return (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group flex min-w-[170px] items-center justify-between rounded-2xl border p-4 text-left transition-all duration-200 md:min-w-0 ${
                        active
                          ? 'border-slate-950 bg-slate-950 text-white shadow-[0_18px_45px_-24px_rgba(15,23,42,0.7)]'
                          : errorInTab
                            ? 'border-rose-200 bg-rose-50/60 text-rose-700 hover:border-rose-300'
                            : 'border-slate-200 bg-white/90 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="mt-1 text-sm font-semibold">{tab.label}</span>
                      </div>
                      <span className={`ml-3 text-xs font-semibold ${
                        active
                          ? 'text-cyan-200'
                          : errorInTab
                            ? 'text-rose-500'
                            : 'text-slate-300 group-hover:text-slate-500'
                      }`}>
                        {active ? trans('hancms.open') : trans('hancms.view')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-w-0 flex-1 bg-gradient-to-b from-white to-slate-50/70">
              <div className="border-b border-slate-200/80 bg-white/80 px-5 py-4 backdrop-blur sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">{trans('hancms.current_tab')}</div>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      {activeTab === 'info'
                        ? trans('hancms.title.infomation')
                        : activeTab === 'scope'
                          ? trans('hancms.promotion.coupon.apply_scope')
                          : trans('hancms.promotion.coupon.conditions')}
                    </h2>
                  </div>
                  <div className={`hidden rounded-full border px-3 py-1 text-xs font-medium sm:inline-flex ${
                    hasTabError(activeTab)
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-slate-200 bg-white text-slate-500'
                  }`}>
                    {hasTabError(activeTab) ? trans('hancms.needs_attention') : trans('hancms.ready')}
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </form>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <h3 className="text-base font-semibold text-slate-900">{trans('hancms.promotion.coupon.fields.apply_products')}</h3>
              <button type="button" className="text-slate-500 hover:text-slate-700" onClick={() => setIsProductModalOpen(false)}>✕</button>
            </div>

            <div className="space-y-3 p-5">
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder={trans('hancms.filter.search')}
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
                <select
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                >
                  <option value="all">Tất cả danh mục</option>
                  {categoryOptions.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="w-14 px-3 py-2 text-left font-semibold text-slate-600">#</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">ID</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.sku')}</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.name')}</th>
                      <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.price')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {modalLoading ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-slate-400">Đang tải...</td>
                      </tr>
                    ) : modalProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-slate-400">Không có dữ liệu</td>
                      </tr>
                    ) : (
                      modalProducts.map((row: any) => (
                        <tr key={row.id}>
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={tempSelectedProductIds.includes(row.id)}
                              onChange={() => toggleTempProduct(row.id)}
                            />
                          </td>
                          <td className="px-3 py-2">{row.id}</td>
                          <td className="px-3 py-2">{row.sku}</td>
                          <td className="px-3 py-2">{row.name}</td>
                          <td className="px-3 py-2">{formatProductPrice(row.price, resolvedCurrency)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">Trang {modalCurrentPage}/{modalTotalPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={modalCurrentPage <= 1}
                    onClick={() => setProductModalPage((prev) => Math.max(1, prev - 1))}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={modalCurrentPage >= modalTotalPages}
                    onClick={() => setProductModalPage((prev) => Math.min(modalTotalPages, prev + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {trans('hancms.button.cancel')}
              </button>
              <button
                type="button"
                onClick={confirmProductSelection}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                {trans('hancms.button.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
