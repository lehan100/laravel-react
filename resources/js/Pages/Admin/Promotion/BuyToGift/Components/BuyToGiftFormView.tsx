import AdminFormHeader from '@/Components/Common/AdminFormHeader';
import ProductPickerModal from '@/Components/Common/ProductPickerModal';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import StatusBadge from '@/Components/Status/StatusBadge';
import StatusSwitch from '@/Components/Status/StatusSwitch';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Gift, PackageCheck, Plus, Save, Trash2 } from 'lucide-react';
import { useProductPickerModal } from '@/Components/Common/useProductPickerModal';
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
  itemsCampaignActive: any[];
  itemsSelectedBuyProducts: any[];
  itemsSelectedGiftProducts: any[];
  undo: number;
  handleUndo: (status: number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  trans: (key: string, params?: Record<string, any>) => string;
};

const newRule = (): BuyToGiftRule => ({
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
  itemsCampaignActive = [],
  itemsSelectedBuyProducts = [],
  itemsSelectedGiftProducts = [],
  undo,
  handleUndo,
  onSubmit,
  trans,
}: BuyToGiftFormViewProps) {
  const { props }: any = usePage();
  const locale = getLocaleCode(props.locale || 'vi');
  const uiLocale = locale === 'vi' ? 'vi-VN' : locale === 'ja' ? 'ja-JP' : locale === 'en' ? 'en-US' : locale;
  const langList = props?.langs?.data || (Array.isArray(props?.langs) ? props.langs : Object.values(props?.langs || {}));
  const currentLanguage = getLanguageByLocale(langList, locale);
  const [resolvedCurrency, setResolvedCurrency] = useState<ProductCurrency>(() => getProductCurrencyFromLocale(locale, currentLanguage));
  const [activeTab, setActiveTab] = useState<'info' | 'rules'>('info');
  const [activeRuleIndex, setActiveRuleIndex] = useState(0);

  const [knownProducts, setKnownProducts] = useState<Map<number, any>>(new Map());
  const productPicker = useProductPickerModal({ routeName: 'buytogift.products-picker' });
  const [modalTarget, setModalTarget] = useState<'buy' | 'gift'>('buy');
  const [modalRuleIndex, setModalRuleIndex] = useState(0);

  const rules: BuyToGiftRule[] = useMemo(() => {
    return Array.isArray(data.rules) && data.rules.length > 0 ? data.rules : [newRule()];
  }, [data.rules]);

  const campaignOptions = useMemo(
    () => (Array.isArray(itemsCampaignActive) ? itemsCampaignActive : []).map((campaign: any) => ({
      id: Number(campaign.id),
      name: campaign.name || `#${campaign.id}`,
      ends_at: campaign.ends_at || '',
    })),
    [itemsCampaignActive]
  );

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

  useEffect(() => {
    const selectedCampaign = campaignOptions.find((campaign: any) => String(campaign.id) === String(data.campaign_id));
    if (selectedCampaign?.ends_at && data.ends_at !== selectedCampaign.ends_at) {
      setData('ends_at', selectedCampaign.ends_at);
    }
  }, [campaignOptions, data.campaign_id, data.ends_at, setData]);

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
    loadProductCurrency(currentLanguage, locale).then((nextCurrency) => {
      if (!mounted) return;
      setResolvedCurrency(nextCurrency);
    });
    return () => {
      mounted = false;
    };
  }, [locale, currentLanguage?.code, currentLanguage?.currency]);

  const inputClass = (fieldName: string) =>
    `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 ${
      errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-cyan-600'
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

  const renderField = (
    label: string,
    content: React.ReactNode,
    error?: string,
    className = ''
  ) => (
    <div className={className}>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      {content}
      {error && <MessageError>{error}</MessageError>}
    </div>
  );

  const updateRules = (nextRules: BuyToGiftRule[]) => setData('rules', nextRules);

  const updateRule = (index: number, patch: Partial<BuyToGiftRule>) => {
    const next = [...rules];
    next[index] = { ...next[index], ...patch };
    updateRules(next);
  };

  const addRule = () => {
    updateRules([...rules, newRule()]);
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
    productPicker.open(target === 'buy' ? (rules[ruleIndex]?.buy_product_ids || []) : (rules[ruleIndex]?.gift_product_ids || []));
  };

  const toggleTempProduct = (productId: number) => {
    const product = productPicker.rows.find((row: any) => Number(row.id) === Number(productId));
    if (product && Number(product.quantity ?? 0) <= 0) {
      return;
    }

    productPicker.toggleSelected(productId);
  };

  const confirmProductSelection = () => {
    const rule = rules[modalRuleIndex];
    if (!rule) return;
    if (modalTarget === 'buy') {
      updateRule(modalRuleIndex, { buy_product_ids: productPicker.selectedIds });
    } else {
      updateRule(modalRuleIndex, { gift_product_ids: productPicker.selectedIds });
    }
    productPicker.close();
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
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
          {target === 'buy' ? <PackageCheck size={15} className="text-cyan-600" /> : <Gift size={15} className="text-emerald-600" />}
          {rows.length} {trans('hancms.catalog.category.type.options.product')}
        </span>
        <button
          type="button"
          onClick={() => openProductModal(ruleIndex, target)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          <Plus size={14} />
          {trans('hancms.button.created')}
        </button>
      </div>
      <div className="max-h-[320px] overflow-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">ID</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.sku')}</th>
              <th className="min-w-[220px] px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.name')}</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.price')}</th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.status')}</th>
              <th className="w-12 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-slate-400">{trans('hancms.placeholder.select')}</td></tr>
            ) : (
              rows.map((row: any) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-slate-500">{row.id}</td>
                  <td className="px-3 py-2 font-medium text-slate-800">{row.sku}</td>
                  <td className="px-3 py-2 text-slate-700">{row.name}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-slate-800">{formatProductPrice(row.price, resolvedCurrency)}</td>
                  <td className="px-3 py-2">
                    <StatusBadge value={row.status} activeLabel={trans('hancms.status.active')} inactiveLabel={trans('hancms.status.inactive')} />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => removeSelectedProduct(ruleIndex, target, row.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50"
                      title={trans('hancms.button.delete')}
                    >
                      <Trash2 size={15} />
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
  const activeRuleBuyRows = activeRule ? selectedRowsByIds(activeRule.buy_product_ids || []) : [];
  const activeRuleGiftRows = activeRule ? selectedRowsByIds(activeRule.gift_product_ids || []) : [];
  const enabledRuleCount = rules.filter((rule) => rule.is_active !== false).length;
  const selectedBuyCount = new Set(rules.flatMap((rule) => rule.buy_product_ids || [])).size;
  const selectedGiftCount = new Set(rules.flatMap((rule) => rule.gift_product_ids || [])).size;

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 lg:p-6">
      <AdminFormHeader
        title={<>{title}{data.code && <span className="text-cyan-600">: {data.code}</span>}</>}
        backHref={backHref}
        submitLabel={submitLabel}
        processing={processing}
        undo={undo}
        handleUndo={handleUndo}
        trans={trans}
        icon={<Save size={20} />}
      />

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{trans('hancms.column.status')}</div>
          <div className="mt-2">
            <StatusBadge value={data.is_active ? 1 : 0} activeLabel={trans('hancms.status.active')} inactiveLabel={trans('hancms.status.inactive')} />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Rules</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{enabledRuleCount}/{rules.length}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{trans('hancms.promotion.buytogift.fields.buy_products')}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{selectedBuyCount}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{trans('hancms.promotion.buytogift.fields.gift_products')}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">{selectedGiftCount}</div>
        </div>
      </div>

      <form id="my-form" noValidate onSubmit={onSubmit} className="mt-4 space-y-5 text-sm">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-white px-4 py-3 lg:px-5">
            <div className="inline-flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  activeTab === 'info' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {trans('hancms.title.infomation')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('rules')}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  activeTab === 'rules' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {trans('hancms.promotion.buytogift.conditions')}
              </button>
            </div>
          </div>

          <div className="p-4 lg:p-5">

            {activeTab === 'info' && (
              <div className="space-y-5">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <StatusSwitch
                    value={data.is_active}
                    onChange={(value) => setData('is_active', value)}
                    activeLabel={trans('hancms.status.active')}
                    inactiveLabel={trans('hancms.status.inactive')}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
                  <div className="space-y-5">
                    <InputGroup label={trans('hancms.column.code')}>
                      <input type="text" required className={inputClass('code')} value={data.code} onChange={(e) => setData('code', e.target.value)} />
                      {errors.code && <MessageError>{errors.code}</MessageError>}
                    </InputGroup>
                    <InputGroup label={trans('hancms.column.name')}>
                      <input type="text" className={inputClass('name')} value={data.name} onChange={(e) => setData('name', e.target.value)} />
                      {errors.name && <MessageError>{errors.name}</MessageError>}
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
                    <div className="space-y-5">
                      <InputGroup label={trans('hancms.promotion.buytogift.fields.starts_at')}>
                        <input type="datetime-local" className={inputClass('starts_at')} value={data.starts_at || ''} onChange={(e) => setData('starts_at', e.target.value)} />
                        {errors.starts_at && <MessageError>{errors.starts_at}</MessageError>}
                      </InputGroup>
                      <InputGroup label={trans('hancms.promotion.buytogift.fields.ends_at')}>
                        <input type="datetime-local" readOnly={!!data.campaign_id} className={inputClass('ends_at')} value={data.ends_at || ''} onChange={(e) => setData('ends_at', e.target.value)} />
                        {errors.ends_at && <MessageError>{errors.ends_at}</MessageError>}
                      </InputGroup>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.description')}</label>
                    <textarea
                      rows={10}
                      placeholder={trans('hancms.column.description')}
                      className={`${inputClass('description')} min-h-[228px] resize-y`}
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                    />
                    {errors.description && <MessageError>{errors.description}</MessageError>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rules' && (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
                <div className="space-y-3">
                  <button type="button" onClick={addRule} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">
                    <Plus size={16} />
                    {trans('hancms.button.created')}
                  </button>
                  <div className="space-y-2">
                    {rules.map((rule, index) => (
                      <div key={`${rule.id ?? 'new'}-${index}`} className={`rounded-xl border p-3 transition ${activeRuleIndex === index ? 'border-cyan-600 bg-cyan-50/60 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                        <button type="button" onClick={() => setActiveRuleIndex(index)} className="w-full text-left">
                          <div className="flex items-start justify-between gap-2">
                            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              {rule.is_active !== false && <CheckCircle2 size={14} className="text-emerald-600" />}
                              Rule #{index + 1}
                            </div>
                            <div className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">
                              {rule.condition_type === 'order_amount' ? trans('hancms.promotion.buytogift.options.order_amount') : trans('hancms.promotion.buytogift.options.buy_product')}
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                            <span>{Number(rule.buy_qty || 1)} {trans('hancms.promotion.buytogift.fields.buy_qty')}</span>
                            <ArrowRight size={15} className="text-slate-400" />
                            <span>{Number(rule.gift_qty || 1)} {trans('hancms.promotion.buytogift.fields.gift_qty')}</span>
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {(rule.buy_product_ids || []).length} buy products · {(rule.gift_product_ids || []).length} gift products
                          </div>
                        </button>
                        {rules.length > 1 && (
                          <button type="button" onClick={() => removeRule(index)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700">
                            <Trash2 size={13} />
                            {trans('hancms.button.delete')}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {activeRule && (
                  <div className="space-y-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Rule #{activeRuleIndex + 1}</div>
                        <div className="mt-1 text-base font-semibold text-slate-900">
                          {activeRule.condition_type === 'order_amount'
                            ? trans('hancms.promotion.buytogift.options.order_amount')
                            : trans('hancms.promotion.buytogift.options.buy_product')}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-700 ring-1 ring-cyan-100">{Number(activeRule.buy_qty ?? 1)} buy</span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-100">{Number(activeRule.gift_qty ?? 1)} gift</span>
                        <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">{activeRule.max_sets_per_order ? `${activeRule.max_sets_per_order} sets max` : 'Unlimited sets'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {renderField(
                        trans('hancms.promotion.buytogift.fields.condition_type'),
                        <select
                          className={inputClass(`rules.${activeRuleIndex}.condition_type`)}
                          value={activeRule.condition_type}
                          onChange={(e) => updateRule(activeRuleIndex, { condition_type: e.target.value as any })}
                        >
                          <option value="order_amount">{trans('hancms.promotion.buytogift.options.order_amount')}</option>
                          <option value="buy_product">{trans('hancms.promotion.buytogift.options.buy_product')}</option>
                        </select>,
                        getRuleError(activeRuleIndex, 'condition_type')
                      )}
                      {renderField(
                        trans('hancms.promotion.buytogift.fields.min_order_amount'),
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          className={inputClass(`rules.${activeRuleIndex}.min_order_amount`)}
                          value={activeRule.min_order_amount ?? ''}
                          onChange={(e) => updateRule(activeRuleIndex, { min_order_amount: e.target.value })}
                        />,
                        getRuleError(activeRuleIndex, 'min_order_amount')
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {renderField(
                        trans('hancms.promotion.buytogift.fields.buy_qty'),
                        <input
                          type="number"
                          min={1}
                          className={inputClass(`rules.${activeRuleIndex}.buy_qty`)}
                          value={activeRule.buy_qty ?? 1}
                          onChange={(e) => updateRule(activeRuleIndex, { buy_qty: e.target.value })}
                        />,
                        getRuleError(activeRuleIndex, 'buy_qty')
                      )}
                      {renderField(
                        trans('hancms.promotion.buytogift.fields.gift_qty'),
                        <input
                          type="number"
                          min={1}
                          className={inputClass(`rules.${activeRuleIndex}.gift_qty`)}
                          value={activeRule.gift_qty ?? 1}
                          onChange={(e) => updateRule(activeRuleIndex, { gift_qty: e.target.value })}
                        />,
                        getRuleError(activeRuleIndex, 'gift_qty')
                      )}
                      {renderField(
                        trans('hancms.promotion.buytogift.fields.max_sets_per_order'),
                        <input
                          type="number"
                          min={1}
                          className={inputClass(`rules.${activeRuleIndex}.max_sets_per_order`)}
                          value={activeRule.max_sets_per_order ?? ''}
                          onChange={(e) => updateRule(activeRuleIndex, { max_sets_per_order: e.target.value })}
                        />,
                        getRuleError(activeRuleIndex, 'max_sets_per_order')
                      )}
                    </div>

                    <div className="space-y-4">
                      <InputGroup stacked label={trans('hancms.promotion.buytogift.fields.buy_products')}>
                        {renderSelectedProductTable(activeRuleIndex, 'buy', activeRuleBuyRows)}
                        {getRuleError(activeRuleIndex, 'buy_product_ids') && <MessageError>{getRuleError(activeRuleIndex, 'buy_product_ids')}</MessageError>}
                      </InputGroup>
                      <InputGroup stacked label={trans('hancms.promotion.buytogift.fields.gift_products')}>
                        {renderSelectedProductTable(activeRuleIndex, 'gift', activeRuleGiftRows)}
                        {getRuleError(activeRuleIndex, 'gift_product_ids') && <MessageError>{getRuleError(activeRuleIndex, 'gift_product_ids')}</MessageError>}
                      </InputGroup>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </form>

      <ProductPickerModal
        title={modalTarget === 'buy' ? trans('hancms.promotion.buytogift.fields.buy_products') : trans('hancms.promotion.buytogift.fields.gift_products')}
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
