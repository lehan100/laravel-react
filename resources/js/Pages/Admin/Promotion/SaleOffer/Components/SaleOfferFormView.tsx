import AdminFormHeader from '@/Components/Common/AdminFormHeader';
import AdminSideTabsLayout from '@/Components/Common/AdminSideTabsLayout';
import ProductPickerModal from '@/Components/Common/ProductPickerModal';
import SelectedProductsTable from '@/Components/Common/SelectedProductsTable';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import Card from '@/Components/Main/Card';
import StatusSwitch from '@/Components/Status/StatusSwitch';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import axios from 'axios';
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

  useEffect(() => {
    const map = new Map<number, any>();
    productRows.forEach((row: any) => {
      map.set(row.id, row);
    });
    setKnownProducts(map);
  }, [itemsSelectedProducts]);

  const selectedProductRows = useMemo(
    () => selectedProductIds.map((id: number) => knownProducts.get(id)).filter(Boolean),
    [selectedProductIds, knownProducts]
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

  const modalPageProducts = modalProducts;

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
    const infoErrorFields = ['code', 'name', 'description', 'discount_type', 'discount_value', 'max_discount_amount'];
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
        const response = await axios.get(route('saleoffer.products-picker'), {
          params: {
            search: productSearch,
            category_id: productCategoryFilter,
            page: productModalPage,
            per_page: modalPageSize,
          },
        });

        const responseData:any = response?.data?.data || [];
        const meta:any = response?.data?.meta || {};

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

  const inputClass = (fieldName: string): any =>
    `w-full border rounded-md p-2 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
    }`;

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
      return ['code', 'name', 'description', 'discount_type', 'discount_value', 'max_discount_amount'].some((field) => !!errors[field]);
    }
    if (tab === 'scope') {
      return ['product_ids'].some((field) => !!errors[field]);
    }
    return ['starts_at', 'ends_at', 'priority'].some((field) => !!errors[field]);
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
        isOpen={isProductModalOpen}
        search={productSearch}
        categoryFilter={productCategoryFilter}
        categoryOptions={categoryOptions}
        rows={modalPageProducts}
        loading={modalLoading}
        currentPage={modalCurrentPage}
        totalPages={modalTotalPages}
        selectedIds={tempSelectedProductIds}
        onClose={() => setIsProductModalOpen(false)}
        onConfirm={confirmProductSelection}
        onSearchChange={setProductSearch}
        onCategoryFilterChange={setProductCategoryFilter}
        onToggleProduct={toggleTempProduct}
        onPreviousPage={() => setProductModalPage((prev) => Math.max(1, prev - 1))}
        onNextPage={() => setProductModalPage((prev) => Math.min(modalTotalPages, prev + 1))}
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
