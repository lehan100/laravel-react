import AdminFormHeader from '@/Components/Common/AdminFormHeader';
import AdminSideTabsLayout from '@/Components/Common/AdminSideTabsLayout';
import ProductPickerModal from '@/Components/Common/ProductPickerModal';
import SelectedProductsTable from '@/Components/Common/SelectedProductsTable';
import { useProductPickerModal } from '@/Components/Common/useProductPickerModal';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import Card from '@/Components/Main/Card';
import StatusSwitch from '@/Components/Status/StatusSwitch';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import { formatPriceInput, formatProductPrice, getLanguageByLocale, getLocaleCode, getProductCurrencyFromLocale, loadProductCurrency, parsePriceInput, type ProductCurrency } from '../../../Product/productUtils';

type SaleOfferFormViewProps = {
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

export default function SaleOfferFormView({
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
}: SaleOfferFormViewProps) {
  const { props }: any = usePage();
  const locale = getLocaleCode(props.locale || 'vi');
  const uiLocale = locale === 'vi' ? 'vi-VN' : locale === 'ja' ? 'ja-JP' : locale === 'en' ? 'en-US' : locale;
  const langList = props?.langs?.data || (Array.isArray(props?.langs) ? props.langs : Object.values(props?.langs || {}));
  const currentLanguage = getLanguageByLocale(langList, locale);
  const discountCurrency = getProductCurrencyFromLocale(locale);
  const [resolvedCurrency, setResolvedCurrency] = useState<ProductCurrency>(() => getProductCurrencyFromLocale(locale, currentLanguage));
  const [activeTab, setActiveTab] = useState<'info' | 'scope' | 'conditions'>('info');
  const [discountType, setDiscountType] = useState(data.discount_type || 'percent');
  const [discountValueInput, setDiscountValueInput] = useState(() =>
    (data.discount_type || 'percent') === 'fixed'
      ? formatPriceInput(data.discount_value ?? 0, discountCurrency)
      : String(data.discount_value ?? '')
  );
  const [maxDiscountAmountInput, setMaxDiscountAmountInput] = useState(() =>
    data.max_discount_amount === '' || data.max_discount_amount === null || data.max_discount_amount === undefined
      ? ''
      : formatPriceInput(data.max_discount_amount, discountCurrency)
  );
  const [discountValueFocused, setDiscountValueFocused] = useState(false);
  const [maxDiscountAmountFocused, setMaxDiscountAmountFocused] = useState(false);
  const productPicker = useProductPickerModal({ routeName: 'saleoffer.products-picker' });
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

  useEffect(() => {
    const map = new Map<number, any>();
    productRows.forEach((row: any) => {
      map.set(row.id, row);
    });
    setKnownProducts(map);
  }, [itemsSelectedProducts]);

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
    setDiscountType(data.discount_type || 'percent');
  }, [data.discount_type]);

  useEffect(() => {
    if (discountType === 'fixed') {
      if (!discountValueFocused) {
        setDiscountValueInput(formatPriceInput(data.discount_value ?? 0, discountCurrency));
      }
    } else {
      setDiscountValueInput(String(data.discount_value ?? ''));
    }

    if (!maxDiscountAmountFocused) {
      setMaxDiscountAmountInput(
        data.max_discount_amount === '' || data.max_discount_amount === null || data.max_discount_amount === undefined
          ? ''
          : formatPriceInput(data.max_discount_amount, discountCurrency)
      );
    }
  }, [
    discountType,
    data.discount_value,
    data.max_discount_amount,
    discountCurrency.code,
    discountCurrency.locale,
    discountValueFocused,
    maxDiscountAmountFocused,
  ]);

  useEffect(() => {
    const selectedCampaign = campaignOptions.find((campaign: any) => String(campaign.id) === String(data.campaign_id));
    if (selectedCampaign?.ends_at && data.ends_at !== selectedCampaign.ends_at) {
      setData('ends_at', selectedCampaign.ends_at);
    }
  }, [campaignOptions, data.campaign_id, data.ends_at, setData]);

  useEffect(() => {
    const infoErrorFields = ['code', 'name', 'description', 'campaign_id', 'discount_type', 'discount_value', 'max_discount_amount'];
    const scopeErrorFields = ['product_ids'];
    const conditionErrorFields = ['starts_at', 'ends_at', 'priority'];

    if (infoErrorFields.some((field) => !!errors[field])) {
      setActiveTab('info');
      return;
    }
    if (scopeErrorFields.some((field) => !!errors[field])) {
      setActiveTab('scope');
      return;
    }
    if (conditionErrorFields.some((field) => !!errors[field])) {
      setActiveTab('conditions');
    }
  }, [errors]);

  const inputClass = (fieldName: string): any =>
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

  const handleDiscountTypeChange = (value: string):any => {
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

  const hasTabError = (tab: 'info' | 'scope' | 'conditions') => {
    if (tab === 'info') {
      return ['code', 'name', 'description', 'campaign_id', 'discount_type', 'discount_value', 'max_discount_amount'].some((field) => !!errors[field]);
    }
    if (tab === 'scope') {
      return ['product_ids'].some((field) => !!errors[field]);
    }
    return ['starts_at', 'ends_at', 'priority'].some((field) => !!errors[field]);
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
    { id: 'scope' as const, label: trans('hancms.promotion.saleoffer.apply_scope') },
    { id: 'conditions' as const, label: trans('hancms.promotion.saleoffer.conditions') },
  ];

  const renderTabContent = () => {
    if (activeTab === 'info') {
      return (
        <Card title={trans('hancms.title.infomation')} contentClassName="overflow-visible">
          <div className="p-6 space-y-5">
            <StatusSwitch
              value={data.is_active}
              onChange={(value) => setData('is_active', value)}
              activeLabel={trans('hancms.status.active')}
              inactiveLabel={trans('hancms.status.inactive')}
            />

            <InputGroup label={trans('hancms.column.code')}>
              <input type="text" required className={inputClass('code')} value={data.code} onChange={(e) => setData('code', e.target.value)} />
              {errors.code && <MessageError>{errors.code}</MessageError>}
            </InputGroup>

            <InputGroup label={trans('hancms.column.name')}>
              <input type="text" className={inputClass('name')} value={data.name} onChange={(e) => setData('name', e.target.value)} />
              {errors.name && <MessageError>{errors.name}</MessageError>}
            </InputGroup>

            <InputGroup label={trans('hancms.column.description')}>
              <textarea rows={4} className={inputClass('description')} value={data.description} onChange={(e) => setData('description', e.target.value)} />
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

            <InputGroup label={trans('hancms.promotion.saleoffer.fields.discount_type')}>
              <select className={inputClass('discount_type')} value={discountType} onChange={(e) => handleDiscountTypeChange(e.target.value)}>
                <option value="percent">{trans('hancms.promotion.saleoffer.options.percent')}</option>
                <option value="fixed">{trans('hancms.promotion.saleoffer.options.fixed')}</option>
              </select>
              {errors.discount_type && <MessageError>{errors.discount_type}</MessageError>}
            </InputGroup>

            <InputGroup label={trans('hancms.promotion.saleoffer.fields.discount_value')}>
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
                <input type="number" min={0} max={100} step="0.01" className={inputClass('discount_value')} value={discountValueInput} onChange={(e) => handleDiscountValueChange(e.target.value)} />
              )}
              {errors.discount_value && <MessageError>{errors.discount_value}</MessageError>}
            </InputGroup>

            <InputGroup label={trans('hancms.promotion.saleoffer.fields.max_discount_amount')}>
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
                onChange={(e) => {
                  const value = e.target.value;
                  setMaxDiscountAmountInput(value);
                  setData('max_discount_amount', value === '' ? '' : parsePriceInput(value));
                }}
              />
              {errors.max_discount_amount && <MessageError>{errors.max_discount_amount}</MessageError>}
            </InputGroup>
          </div>
        </Card>
      );
    }

    if (activeTab === 'scope') {
      return (
        <Card title={trans('hancms.promotion.saleoffer.apply_scope')} contentClassName="overflow-visible">
          <div className="p-6 space-y-5">
            <p className="text-xs text-slate-500">{trans('hancms.promotion.saleoffer.apply_scope_hint')}</p>
            <div className="space-y-3">
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
            </div>
            {errors.product_ids && <MessageError>{errors.product_ids}</MessageError>}
          </div>
        </Card>
      );
    }

    return (
      <Card title={trans('hancms.promotion.saleoffer.conditions')} contentClassName="overflow-visible">
        <div className="p-6 space-y-5">
          <InputGroup label={trans('hancms.promotion.saleoffer.fields.starts_at')}>
            <input
              type="datetime-local"
              lang={uiLocale}
              className={inputClass('starts_at')}
              value={data.starts_at}
              onChange={(e) => setData('starts_at', e.target.value)}
            />
            {errors.starts_at && <MessageError>{errors.starts_at}</MessageError>}
          </InputGroup>

          <InputGroup label={trans('hancms.promotion.saleoffer.fields.ends_at')}>
            <input
              type="datetime-local"
              lang={uiLocale}
              readOnly={!!data.campaign_id}
              className={inputClass('ends_at')}
              value={data.ends_at}
              onChange={(e) => setData('ends_at', e.target.value)}
            />
            {errors.ends_at && <MessageError>{errors.ends_at}</MessageError>}
          </InputGroup>

          <InputGroup label={trans('hancms.promotion.saleoffer.fields.priority')}>
            <input type="number" min={0} step={1} className={inputClass('priority')} value={data.priority} onChange={(e) => setData('priority', e.target.value)} />
            {errors.priority && <MessageError>{errors.priority}</MessageError>}
          </InputGroup>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={!!data.stackable} onChange={(e) => setData('stackable', e.target.checked)} />
            {trans('hancms.promotion.saleoffer.fields.stackable')}
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
          title={trans('hancms.promotion.saleoffer.name')}
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
        title={trans('hancms.promotion.saleoffer.fields.apply_products')}
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
