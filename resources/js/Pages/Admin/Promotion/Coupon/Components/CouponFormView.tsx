import AdminFormHeader from '@/Components/Common/AdminFormHeader';
import AdminSideTabsLayout from '@/Components/Common/AdminSideTabsLayout';
import ProductPickerModal from '@/Components/Common/ProductPickerModal';
import SelectedProductsTable from '@/Components/Common/SelectedProductsTable';
import { useProductPickerModal } from '@/Components/Common/useProductPickerModal';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import Card from '@/Components/Main/Card';
import StatusSwitch from '@/Components/Status/StatusSwitch';
import CategoryMultiSelect from '../../../Product/Components/CategoryMultiSelect';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';
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
  itemsCampaignActive: any[];
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
  itemsCampaignActive = [],
  itemsSelectedProducts = [],
  undo,
  handleUndo,
  onSubmit,
  trans,
}: CouponFormViewProps) {
  const { props }: any = usePage();
  const locale = getLocaleCode(props.locale || 'vi');
  const uiLocale = locale === 'vi' ? 'vi-VN' : locale === 'ja' ? 'ja-JP' : locale === 'en' ? 'en-US' : locale;
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
  const productPicker = useProductPickerModal({ routeName: 'coupon.products-picker' });
  const selectedCategoryIds = Array.isArray(data.category_ids) ? data.category_ids : [];
  const selectedProductIds = useMemo(
    () => (Array.isArray(data.product_ids) ? data.product_ids.map((id: any) => Number(id)).filter((id: number) => !Number.isNaN(id)) : []),
    [data.product_ids]
  );
  const [knownProducts, setKnownProducts] = useState<Map<number, any>>(new Map());

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

  const campaignOptions = useMemo(
    () => (Array.isArray(itemsCampaignActive) ? itemsCampaignActive : []).map((campaign: any) => ({
      id: Number(campaign.id),
      name: campaign.name || `#${campaign.id}`,
      ends_at: campaign.ends_at || '',
    })),
    [itemsCampaignActive]
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
    if (productPicker.rows.length === 0) {
      return;
    }

    setKnownProducts((prev) => {
      const map = new Map(prev);
      productPicker.rows.forEach((row: any) => {
        map.set(Number(row.id), row);
      });
      return map;
    });
  }, [productPicker.rows]);

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
    const selectedCampaign = campaignOptions.find((campaign: any) => String(campaign.id) === String(data.campaign_id));
    if (selectedCampaign?.ends_at && data.ends_at !== selectedCampaign.ends_at) {
      setData('ends_at', selectedCampaign.ends_at);
    }
  }, [campaignOptions, data.campaign_id, data.ends_at, setData]);

  useEffect(() => {
    const infoErrorFields = ['code', 'name', 'description', 'campaign_id', 'discount_type', 'discount_value', 'max_discount_amount'];
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

  const inputClass = (fieldName: string) =>
    `w-full border rounded-md p-2 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
    }`;

  const formatCampaignEndsAt = (value?: string | null) => {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString(uiLocale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
      return ['code', 'name', 'description', 'campaign_id', 'discount_type', 'discount_value', 'max_discount_amount'].some((field) => !!errors[field]);
    }
    if (tab === 'scope') {
      return ['category_ids', 'product_ids'].some((field) => !!errors[field]);
    }
    return ['min_order_amount', 'max_order_amount', 'usage_limit_total', 'usage_limit_per_user', 'starts_at', 'ends_at'].some((field) => !!errors[field]);
  };

  const openProductModal = () => {
    productPicker.open(selectedProductIds);
  };

  const toggleTempProduct = (productId: number) => {
    productPicker.toggleSelected(productId);
  };

  const removeSelectedProduct = (productId: number) => {
    setData('product_ids', selectedProductIds.filter((id: number) => id !== productId));
  };

  const confirmProductSelection = () => {
    setData('product_ids', productPicker.selectedIds);
    productPicker.close();
  };

  const promotionTabs = [
    { id: 'info' as const, label: trans('hancms.title.infomation') },
    { id: 'scope' as const, label: trans('hancms.promotion.coupon.apply_scope') },
    { id: 'conditions' as const, label: trans('hancms.promotion.coupon.conditions') },
  ];

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

            <InputGroup label={trans('hancms.promotion.campaign.name')}>
              <select
                className={inputClass('campaign_id')}
                value={data.campaign_id || ''}
                onChange={(e) => setData('campaign_id', e.target.value)}
              >
                <option value="">{trans('hancms.placeholder.select')}</option>
                {campaignOptions.map((campaign: any) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}{campaign.ends_at ? ` - ${formatCampaignEndsAt(campaign.ends_at)}` : ''}
                  </option>
                ))}
              </select>
              {errors.campaign_id && <MessageError>{errors.campaign_id}</MessageError>}
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
              <SelectedProductsTable
                rows={selectedProductRows}
                emptyLabel={trans('hancms.placeholder.select')}
                addLabel={trans('hancms.button.created')}
                countLabel={trans('hancms.catalog.category.type.options.product')}
                onOpenPicker={openProductModal}
                onRemove={removeSelectedProduct}
                formatPrice={(price) => formatProductPrice(price, resolvedCurrency)}
                trans={trans}
              />
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
              readOnly={!!data.campaign_id}
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
      <AdminFormHeader
        title={
          <>
            {title}
            {data.code && <span className="text-cyan-600">: {data.code}</span>}
          </>
        }
        backHref={backHref}
        submitLabel={submitLabel}
        processing={processing}
        undo={undo}
        handleUndo={handleUndo}
        trans={trans}
        icon={<Save size={20} />}
      />

      <form id="my-form" noValidate onSubmit={onSubmit} className="text-sm">
        <AdminSideTabsLayout
          title={trans('hancms.promotion.coupon.name')}
          activeTab={activeTab}
          tabs={promotionTabs}
          onTabChange={setActiveTab}
          hasTabError={hasTabError}
          trans={trans}
        >
          {renderTabContent()}
        </AdminSideTabsLayout>
      </form>

      <ProductPickerModal
        title={trans('hancms.promotion.coupon.fields.apply_products')}
        isOpen={productPicker.isOpen}
        search={productPicker.search}
        categoryFilter={productPicker.categoryFilter}
        categoryOptions={categoryOptions}
        rows={productPicker.rows}
        loading={productPicker.loading}
        currentPage={productPicker.currentPage}
        totalPages={productPicker.totalPages}
        selectedIds={productPicker.selectedIds}
        onClose={productPicker.close}
        onConfirm={confirmProductSelection}
        onSearchChange={productPicker.setSearch}
        onCategoryFilterChange={productPicker.setCategoryFilter}
        onToggleProduct={toggleTempProduct}
        onPreviousPage={() => productPicker.setPage((prev) => Math.max(1, prev - 1))}
        onNextPage={() => productPicker.setPage((prev) => Math.min(productPicker.totalPages, prev + 1))}
        formatPrice={(price) => formatProductPrice(price, resolvedCurrency)}
        trans={trans}
        allCategoriesLabel="Tất cả danh mục"
        loadingLabel="Đang tải..."
        emptyLabel="Không có dữ liệu"
        requireStock
      />
    </div>
  );
}
