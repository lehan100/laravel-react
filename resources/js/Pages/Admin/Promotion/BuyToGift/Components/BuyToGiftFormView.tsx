import BackButton from '@/Components/Button/BackButton';
import SaveButton from '@/Components/Button/SaveButton';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import Card from '@/Components/Main/Card';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import StatusBadge from '@/Components/Status/StatusBadge';
import StatusSwitch from '@/Components/Status/StatusSwitch';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import axios from 'axios';
import {
  formatProductPrice,
  getLanguageByLocale,
  getLocaleCode,
  getProductCurrencyFromLocale,
  loadProductCurrency,
  type ProductCurrency,
} from '../../../Product/productUtils';

type BuyToGiftRule = {
  id?: number | null;
  condition_type: 'order_amount' | 'buy_product';
  min_order_amount?: number | string | null;
  max_sets_per_order?: number | string | null;
  buy_product_ids: number[];
  buy_qty?: number | string | null;
  gift_product_ids: number[];
  gift_qty?: number | string | null;
  is_active?: boolean;
  stackable?: boolean;
  priority?: number | string | null;
};

type BuyToGiftFormViewProps = {
  title: string;
  backHref: string;
  submitLabel: string;
  data: any;
  setData: (key: string, value: any) => void;
  errors: Record<string, string>;
  processing: boolean;
  itemsCategoryActive: any[];
  itemsSelectedBuyProducts: any[];
  itemsSelectedGiftProducts: any[];
  undo: number;
  handleUndo: (status: number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  trans: (key: string, params?: Record<string, any>) => string;
};

const newRule = (priority: number): BuyToGiftRule => ({
  id: null,
  condition_type: 'order_amount',
  min_order_amount: '',
  max_sets_per_order: '',
  buy_product_ids: [],
  buy_qty: 1,
  gift_product_ids: [],
  gift_qty: 1,
  is_active: true,
  stackable: false,
  priority,
});

export default function BuyToGiftFormView({
  title,
  backHref,
  submitLabel,
  data,
  setData,
  errors,
  processing,
  itemsCategoryActive = [],
  itemsSelectedBuyProducts = [],
  itemsSelectedGiftProducts = [],
  undo,
  handleUndo,
  onSubmit,
  trans,
}: BuyToGiftFormViewProps) {
  const { props }: any = usePage();
  const locale = getLocaleCode(props.locale || 'vi');
  const langList = props?.langs?.data || (Array.isArray(props?.langs) ? props.langs : Object.values(props?.langs || {}));
  const currentLanguage = getLanguageByLocale(langList, locale);
  const [resolvedCurrency, setResolvedCurrency] = useState<ProductCurrency>(() => getProductCurrencyFromLocale(locale, currentLanguage));
  const [activeTab, setActiveTab] = useState<'info' | 'rules'>('info');
  const [activeRuleIndex, setActiveRuleIndex] = useState(0);

  const [knownProducts, setKnownProducts] = useState<Map<number, any>>(new Map());
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<'buy' | 'gift'>('buy');
  const [modalRuleIndex, setModalRuleIndex] = useState(0);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productModalPage, setProductModalPage] = useState(1);
  const [tempSelectedProductIds, setTempSelectedProductIds] = useState<number[]>([]);
  const [modalProducts, setModalProducts] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTotalPages, setModalTotalPages] = useState(1);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const modalPageSize = 10;

  const rules: BuyToGiftRule[] = useMemo(() => {
    return Array.isArray(data.rules) && data.rules.length > 0 ? data.rules : [newRule(Number(data.priority || 100))];
  }, [data.rules, data.priority]);

  useEffect(() => {
    if (!Array.isArray(data.rules) || data.rules.length === 0) {
      setData('rules', rules);
    }
  }, [data.rules, rules, setData]);

  useEffect(() => {
    if (activeRuleIndex > rules.length - 1) {
      setActiveRuleIndex(Math.max(0, rules.length - 1));
    }
  }, [activeRuleIndex, rules.length]);

  const categoryOptions = useMemo(
    () => (Array.isArray(itemsCategoryActive) ? itemsCategoryActive : []).map((category: any) => ({
      id: String(category.id),
      name: category.name_with_depth || category.name || `#${category.id}`,
    })),
    [itemsCategoryActive]
  );

  const mapRows = (items: any[]) =>
    (Array.isArray(items) ? items : []).map((item: any) => ({
      id: Number(item.id),
      sku: item.sku || `#${item.id}`,
      name: item.name || item.sku || `#${item.id}`,
      price: item?.price ?? 0,
      status: Number(item?.status || 0),
    }));

  useEffect(() => {
    const map = new Map<number, any>();
    [...mapRows(itemsSelectedBuyProducts), ...mapRows(itemsSelectedGiftProducts)].forEach((row: any) => {
      map.set(row.id, row);
    });
    setKnownProducts(map);
  }, [itemsSelectedBuyProducts, itemsSelectedGiftProducts]);

  useEffect(() => {
    let mounted = true;
    loadProductCurrency(currentLanguage, locale).then((nextCurrency) => {
      if (!mounted) return;
      setResolvedCurrency(nextCurrency);
    });
    return () => {
      mounted = false;
    };
  }, [locale, currentLanguage?.code, currentLanguage?.currency]);

  useEffect(() => {
    setProductModalPage(1);
  }, [productSearch, productCategoryFilter]);

  useEffect(() => {
    if (!isProductModalOpen) return;
    const timeout = setTimeout(async () => {
      setModalLoading(true);
      try {
        const response = await axios.get(route('buytogift.products-picker'), {
          params: {
            search: productSearch,
            category_id: productCategoryFilter,
            page: productModalPage,
            per_page: modalPageSize,
          },
        });
        const rows = Array.isArray(response?.data?.data) ? response.data.data : [];
        const meta = response?.data?.meta || {};
        setModalProducts(rows);
        setModalCurrentPage(Number(meta.current_page || 1));
        setModalTotalPages(Number(meta.last_page || 1));
        setKnownProducts((prev) => {
          const map = new Map(prev);
          rows.forEach((row: any) => map.set(Number(row.id), row));
          return map;
        });
      } catch (_error) {
        setModalProducts([]);
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

  const updateRules = (nextRules: BuyToGiftRule[]) => setData('rules', nextRules);

  const updateRule = (index: number, patch: Partial<BuyToGiftRule>) => {
    const next = [...rules];
    next[index] = { ...next[index], ...patch };
    updateRules(next);
  };

  const addRule = () => {
    const nextPriority = Number(data.priority || 100) + rules.length;
    updateRules([...rules, newRule(nextPriority)]);
    setActiveRuleIndex(rules.length);
    setActiveTab('rules');
  };

  const removeRule = (index: number) => {
    if (rules.length <= 1) return;
    const next = rules.filter((_, i) => i !== index);
    updateRules(next);
    setActiveRuleIndex(Math.max(0, index - 1));
  };

  const getRuleError = (index: number, field: string) => {
    return errors[`rules.${index}.${field}`] || '';
  };

  const selectedRowsByIds = (ids: number[]) => ids.map((id) => knownProducts.get(id)).filter(Boolean);

  const openProductModal = (ruleIndex: number, target: 'buy' | 'gift') => {
    setModalRuleIndex(ruleIndex);
    setModalTarget(target);
    setTempSelectedProductIds(target === 'buy' ? (rules[ruleIndex]?.buy_product_ids || []) : (rules[ruleIndex]?.gift_product_ids || []));
    setProductSearch('');
    setProductCategoryFilter('all');
    setProductModalPage(1);
    setIsProductModalOpen(true);
  };

  const toggleTempProduct = (productId: number) => {
    setTempSelectedProductIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  };

  const confirmProductSelection = () => {
    const rule = rules[modalRuleIndex];
    if (!rule) return;
    if (modalTarget === 'buy') {
      updateRule(modalRuleIndex, { buy_product_ids: tempSelectedProductIds });
    } else {
      updateRule(modalRuleIndex, { gift_product_ids: tempSelectedProductIds });
    }
    setIsProductModalOpen(false);
  };

  const removeSelectedProduct = (ruleIndex: number, target: 'buy' | 'gift', productId: number) => {
    const rule = rules[ruleIndex];
    if (!rule) return;
    if (target === 'buy') {
      updateRule(ruleIndex, { buy_product_ids: (rule.buy_product_ids || []).filter((id) => id !== productId) });
    } else {
      updateRule(ruleIndex, { gift_product_ids: (rule.gift_product_ids || []).filter((id) => id !== productId) });
    }
  };

  const renderSelectedProductTable = (ruleIndex: number, target: 'buy' | 'gift', rows: any[]) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500">{rows.length} {trans('hancms.catalog.category.type.options.product')}</span>
        <button
          type="button"
          onClick={() => openProductModal(ruleIndex, target)}
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
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-slate-400">{trans('hancms.placeholder.select')}</td></tr>
            ) : (
              rows.map((row: any) => (
                <tr key={row.id}>
                  <td className="px-3 py-2">{row.id}</td>
                  <td className="px-3 py-2">{row.sku}</td>
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2">{formatProductPrice(row.price, resolvedCurrency)}</td>
                  <td className="px-3 py-2">
                    <StatusBadge value={row.status} activeLabel={trans('hancms.status.active')} inactiveLabel={trans('hancms.status.inactive')} />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removeSelectedProduct(ruleIndex, target, row.id)}
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
  );

  const activeRule = rules[activeRuleIndex] || rules[0];

  return (
    <div className="p-6">
      <HeaderToolbar title={<>{title}{data.code && <span className="text-cyan-600">: {data.code}</span>}</>}>
        <SaveButton loading={processing} undo={undo} icon={<Save size={20} />} sendDataStatusUndo={handleUndo} form="my-form">{submitLabel}</SaveButton>
        <BackButton href={backHref}>{trans('hancms.button.back')}</BackButton>
      </HeaderToolbar>

      <form id="my-form" noValidate onSubmit={onSubmit} className="text-sm space-y-6">
        <Card>
          <div className="p-6 space-y-5">
            <div className="flex gap-2">
              <button type="button" onClick={() => setActiveTab('info')} className={`rounded-xl px-4 py-2 font-semibold ${activeTab === 'info' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>{trans('hancms.title.infomation')}</button>
              <button type="button" onClick={() => setActiveTab('rules')} className={`rounded-xl px-4 py-2 font-semibold ${activeTab === 'rules' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>{trans('hancms.promotion.buytogift.conditions')}</button>
            </div>

            {activeTab === 'info' && (
              <div className="space-y-5">
                <StatusSwitch value={data.is_active} onChange={(value) => setData('is_active', value)} activeLabel={trans('hancms.status.active')} inactiveLabel={trans('hancms.status.inactive')} />
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InputGroup label={trans('hancms.promotion.buytogift.fields.starts_at')}>
                    <input type="datetime-local" className={inputClass('starts_at')} value={data.starts_at || ''} onChange={(e) => setData('starts_at', e.target.value)} />
                    {errors.starts_at && <MessageError>{errors.starts_at}</MessageError>}
                  </InputGroup>
                  <InputGroup label={trans('hancms.promotion.buytogift.fields.ends_at')}>
                    <input type="datetime-local" className={inputClass('ends_at')} value={data.ends_at || ''} onChange={(e) => setData('ends_at', e.target.value)} />
                    {errors.ends_at && <MessageError>{errors.ends_at}</MessageError>}
                  </InputGroup>
                </div>
                <InputGroup label={trans('hancms.promotion.buytogift.fields.priority')}>
                  <input type="number" min={0} className={inputClass('priority')} value={data.priority || 100} onChange={(e) => setData('priority', e.target.value === '' ? '' : Number(e.target.value))} />
                  {errors.priority && <MessageError>{errors.priority}</MessageError>}
                </InputGroup>
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
                <div className="space-y-3">
                  <button type="button" onClick={addRule} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    + {trans('hancms.button.created')}
                  </button>
                  <div className="space-y-2">
                    {rules.map((rule, index) => (
                      <div key={`${rule.id ?? 'new'}-${index}`} className={`rounded-xl border p-3 ${activeRuleIndex === index ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white'}`}>
                        <button type="button" onClick={() => setActiveRuleIndex(index)} className="w-full text-left">
                          <div className="text-xs text-slate-500">Rule #{index + 1}</div>
                          <div className="text-sm font-semibold text-slate-900">
                            {rule.condition_type === 'order_amount' ? trans('hancms.promotion.buytogift.options.order_amount') : trans('hancms.promotion.buytogift.options.buy_product')}
                          </div>
                        </button>
                        {rules.length > 1 && (
                          <button type="button" onClick={() => removeRule(index)} className="mt-2 text-xs font-semibold text-rose-600 hover:underline">{trans('hancms.button.delete')}</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {activeRule && (
                  <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <InputGroup label={trans('hancms.promotion.buytogift.fields.condition_type')}>
                        <select className={inputClass(`rules.${activeRuleIndex}.condition_type`)} value={activeRule.condition_type} onChange={(e) => updateRule(activeRuleIndex, { condition_type: e.target.value as any })}>
                          <option value="order_amount">{trans('hancms.promotion.buytogift.options.order_amount')}</option>
                          <option value="buy_product">{trans('hancms.promotion.buytogift.options.buy_product')}</option>
                        </select>
                        {getRuleError(activeRuleIndex, 'condition_type') && <MessageError>{getRuleError(activeRuleIndex, 'condition_type')}</MessageError>}
                      </InputGroup>
                      <InputGroup label={trans('hancms.promotion.buytogift.fields.min_order_amount')}>
                        <input type="number" min={0} step="0.01" className={inputClass(`rules.${activeRuleIndex}.min_order_amount`)} value={activeRule.min_order_amount ?? ''} onChange={(e) => updateRule(activeRuleIndex, { min_order_amount: e.target.value })} />
                        {getRuleError(activeRuleIndex, 'min_order_amount') && <MessageError>{getRuleError(activeRuleIndex, 'min_order_amount')}</MessageError>}
                      </InputGroup>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <InputGroup label={trans('hancms.promotion.buytogift.fields.buy_qty')}>
                        <input type="number" min={1} className={inputClass(`rules.${activeRuleIndex}.buy_qty`)} value={activeRule.buy_qty ?? 1} onChange={(e) => updateRule(activeRuleIndex, { buy_qty: e.target.value })} />
                        {getRuleError(activeRuleIndex, 'buy_qty') && <MessageError>{getRuleError(activeRuleIndex, 'buy_qty')}</MessageError>}
                      </InputGroup>
                      <InputGroup label={trans('hancms.promotion.buytogift.fields.gift_qty')}>
                        <input type="number" min={1} className={inputClass(`rules.${activeRuleIndex}.gift_qty`)} value={activeRule.gift_qty ?? 1} onChange={(e) => updateRule(activeRuleIndex, { gift_qty: e.target.value })} />
                        {getRuleError(activeRuleIndex, 'gift_qty') && <MessageError>{getRuleError(activeRuleIndex, 'gift_qty')}</MessageError>}
                      </InputGroup>
                      <InputGroup label={trans('hancms.promotion.buytogift.fields.max_sets_per_order')}>
                        <input type="number" min={1} className={inputClass(`rules.${activeRuleIndex}.max_sets_per_order`)} value={activeRule.max_sets_per_order ?? ''} onChange={(e) => updateRule(activeRuleIndex, { max_sets_per_order: e.target.value })} />
                        {getRuleError(activeRuleIndex, 'max_sets_per_order') && <MessageError>{getRuleError(activeRuleIndex, 'max_sets_per_order')}</MessageError>}
                      </InputGroup>
                    </div>

                    <InputGroup label={trans('hancms.promotion.buytogift.fields.buy_products')}>
                      {renderSelectedProductTable(activeRuleIndex, 'buy', selectedRowsByIds(activeRule.buy_product_ids || []))}
                      {getRuleError(activeRuleIndex, 'buy_product_ids') && <MessageError>{getRuleError(activeRuleIndex, 'buy_product_ids')}</MessageError>}
                    </InputGroup>
                    <InputGroup label={trans('hancms.promotion.buytogift.fields.gift_products')}>
                      {renderSelectedProductTable(activeRuleIndex, 'gift', selectedRowsByIds(activeRule.gift_product_ids || []))}
                      {getRuleError(activeRuleIndex, 'gift_product_ids') && <MessageError>{getRuleError(activeRuleIndex, 'gift_product_ids')}</MessageError>}
                    </InputGroup>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </form>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
              <h3 className="text-base font-semibold text-slate-900">
                {modalTarget === 'buy' ? trans('hancms.promotion.buytogift.fields.buy_products') : trans('hancms.promotion.buytogift.fields.gift_products')}
              </h3>
              <button type="button" className="text-slate-500 hover:text-slate-700" onClick={() => setIsProductModalOpen(false)}>✕</button>
            </div>
            <div className="space-y-3 p-5">
              <div className="grid gap-3 md:grid-cols-2">
                <input type="text" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" placeholder={trans('hancms.filter.search')} value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
                <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" value={productCategoryFilter} onChange={(e) => setProductCategoryFilter(e.target.value)}>
                  <option value="all">Tất cả danh mục</option>
                  {categoryOptions.map((category: any) => <option key={category.id} value={category.id}>{category.name}</option>)}
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
                      <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-400">Đang tải...</td></tr>
                    ) : modalProducts.length === 0 ? (
                      <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-400">Không có dữ liệu</td></tr>
                    ) : (
                      modalProducts.map((row: any) => (
                        <tr key={row.id}>
                          <td className="px-3 py-2"><input type="checkbox" checked={tempSelectedProductIds.includes(row.id)} onChange={() => toggleTempProduct(row.id)} /></td>
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
                  <button type="button" className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={modalCurrentPage <= 1} onClick={() => setProductModalPage((prev) => Math.max(1, prev - 1))}>Prev</button>
                  <button type="button" className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={modalCurrentPage >= modalTotalPages} onClick={() => setProductModalPage((prev) => Math.min(modalTotalPages, prev + 1))}>Next</button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
              <button type="button" onClick={() => setIsProductModalOpen(false)} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">{trans('hancms.button.cancel')}</button>
              <button type="button" onClick={confirmProductSelection} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">{trans('hancms.button.confirm')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
