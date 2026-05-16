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
  priority?: number | string | null;
  max_sets_per_order?: number | string | null;
  max_gift_qty?: number | string | null;
  sold_quantity?: number | string | null;
  reserved_quantity?: number | string | null;
  allocated_stock?: number | string | null;
  allocations_map?: Record<string, number>;
  allocations_total_map?: Record<string, number>;
  buy_items: BuyToGiftRuleItem[];
  buy_product_ids: number[];
  buy_qty?: number | string | null;
  gift_items: BuyToGiftRuleItem[];
  gift_product_ids: number[];
  gift_qty?: number | string | null;
  gift_variant_options: BuyToGiftGiftVariantOption[];
  is_active?: boolean;
  stackable?: boolean;
  stock_scope?: 'all' | 'limited';
  stock_limit?: number | string | null;
};

type BuyToGiftRuleItem = {
  product_id: number;
  variant_id?: number | string | null;
};

type BuyToGiftGiftVariantOption = {
  product_id: number;
  variant_id: number;
  reserve_qty?: number | string | null;
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
  priority: 100,
  max_sets_per_order: '',
  max_gift_qty: '',
  buy_items: [],
  buy_product_ids: [],
  buy_qty: 1,
  gift_items: [],
  gift_product_ids: [],
  gift_qty: 1,
  gift_variant_options: [],
  is_active: true,
  stackable: false,
  stock_scope: 'all',
  stock_limit: '',
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
      quantity: Number(item.quantity ?? 0),
      price: item?.price ?? 0,
      status: Number(item?.status || 0),
      has_variants: Boolean(item?.has_variants),
      variants: Array.isArray(item?.variants)
        ? item.variants.map((variant: any) => ({
            id: Number(variant.id),
            sku: variant.sku || `#${variant.id}`,
            name: variant.name || variant.label || variant.sku || `#${variant.id}`,
            label: variant.label || variant.name || variant.sku || `#${variant.id}`,
            price: variant?.price ?? 0,
            stock: Number(variant?.stock ?? 0),
          }))
        : [],
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

  const getRuleItems = (rule: BuyToGiftRule | undefined, target: 'buy' | 'gift'): BuyToGiftRuleItem[] => {
    if (!rule) {
      return [];
    }

    return target === 'buy'
      ? (Array.isArray(rule.buy_items) ? rule.buy_items : [])
      : (Array.isArray(rule.gift_items) ? rule.gift_items : []);
  };

  const getRuleGiftVariantOptions = (rule: BuyToGiftRule | undefined): BuyToGiftGiftVariantOption[] => {
    if (!rule) {
      return [];
    }

    return Array.isArray(rule.gift_variant_options) ? rule.gift_variant_options : [];
  };

  const getRuleProductIds = (rule: BuyToGiftRule | undefined, target: 'buy' | 'gift'): number[] => {
    const baseIds = getRuleItems(rule, target).map((item) => Number(item.product_id)).filter((id) => id > 0);
    if (target === 'gift') {
      const variantIds = getRuleGiftVariantOptions(rule).map((item) => Number(item.product_id)).filter((id) => id > 0);
      return [...new Set([...baseIds, ...variantIds])];
    }

    return baseIds;
  };

  const selectedRowsByItems = (items: BuyToGiftRuleItem[]) =>
    items
      .map((item) => {
        const product = knownProducts.get(Number(item.product_id));
        if (!product) {
          return null;
        }

        const selectedVariant = resolveVariant(product, item.variant_id);

        return {
          ...product,
          price: selectedVariant?.price ?? product.price,
          quantity: selectedVariant?.stock ?? (product?.has_variants ? 0 : product.quantity),
          variant_id: item.variant_id !== null && item.variant_id !== undefined && item.variant_id !== '' ? Number(item.variant_id) : null,
          selected_variant: selectedVariant,
        };
      })
      .filter(Boolean);

  const variantLabel = (variant: any) => variant?.label || variant?.name || variant?.sku || `#${variant?.id}`;

  const resolveVariant = (product: any, variantId?: number | string | null) => {
    const variantList = Array.isArray(product?.variants) ? product.variants : [];
    if (variantList.length === 0) {
      return null;
    }

    const normalizedVariantId = variantId !== null && variantId !== undefined && variantId !== '' ? Number(variantId) : null;
    if (normalizedVariantId !== null) {
      const selected = variantList.find((variant: any) => Number(variant.id) === normalizedVariantId);
      if (selected) {
        return selected;
      }
    }

    return variantList.length === 1 ? variantList[0] : null;
  };

  const getProductVariants = (product: any) => (Array.isArray(product?.variants) ? product.variants : []);

  const sumRowQuantity = (rows: any[]) => rows.reduce((total, row) => total + Math.max(0, Number(row?.quantity ?? 0)), 0);
  const shouldShowInventoryColumns = (rows: any[]) =>
    rows.some((row: any) => Number(row?.sold_quantity ?? 0) > 0 || Number(row?.reserved_quantity ?? 0) > 0);

  const getRulePreview = (rule: BuyToGiftRule | undefined, buyRows: any[], giftRows: any[]) => {
    if (!rule) {
      return null;
    }

    const buyQty = Math.max(1, Number(rule.buy_qty ?? 1));
    const giftQty = Math.max(1, Number(rule.gift_qty ?? 1));
    const stockLimit = rule.stock_scope === 'limited' && rule.stock_limit !== '' && rule.stock_limit !== null
      ? Math.max(0, Number(rule.stock_limit || 0))
      : null;
    const isBuyProductCondition = rule.condition_type === 'buy_product' && getRuleItems(rule, 'buy').length > 0;
    const slotDivisor = isBuyProductCondition ? buyQty : giftQty;
    const stockLimitSlots = stockLimit !== null ? Math.floor(stockLimit / slotDivisor) : null;
    const buyStockQuantity = sumRowQuantity(buyRows);
    const giftStockQuantity = sumRowQuantity(giftRows);
    const stockBasedSlots = isBuyProductCondition
      ? Math.min(Math.floor(buyStockQuantity / buyQty), Math.floor(giftStockQuantity / giftQty))
      : Math.floor(giftStockQuantity / giftQty);
    const maxGiftSlots = rule.max_gift_qty !== '' && rule.max_gift_qty !== null
      ? Math.floor(Number(rule.max_gift_qty || 0) / giftQty)
      : null;
    const availableSlots = maxGiftSlots !== null 
      ? maxGiftSlots 
      : (stockLimitSlots !== null ? stockLimitSlots : stockBasedSlots);

    const stockReferenceSlots = stockLimitSlots !== null ? stockLimitSlots : stockBasedSlots;

    return {
      buyQty,
      giftQty,
      availableSlots,
      stockCapSlots: stockLimitSlots,
      maxGiftSlots,
      shortageByGiftCap: maxGiftSlots !== null ? Math.max(0, stockReferenceSlots - maxGiftSlots) : 0,
      wastedStock: stockLimit !== null
        ? Math.max(0, stockLimit - (availableSlots * slotDivisor))
        : 0,
    };
  };

  const openProductModal = (ruleIndex: number, target: 'buy' | 'gift') => {
    setModalRuleIndex(ruleIndex);
    setModalTarget(target);
    const rule = rules[ruleIndex];
    productPicker.open(getRuleProductIds(rule, target));
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

    const currentItems = [...getRuleItems(rule, modalTarget)];
    const currentProductIds = new Set(currentItems.map((item) => Number(item.product_id)));
    if (modalTarget === 'gift') {
      getRuleGiftVariantOptions(rule).forEach((item) => currentProductIds.add(Number(item.product_id)));
    }
    const nextItems = [...currentItems];
    const nextVariantOptions = [...getRuleGiftVariantOptions(rule)];

    productPicker.selectedIds.forEach((productId) => {
      if (currentProductIds.has(Number(productId))) {
        return;
      }

      const product = knownProducts.get(Number(productId));
      const variants = getProductVariants(product);
      const initialVariant = variants.length === 1 ? variants[0]?.id ?? null : null;

      if (modalTarget === 'gift' && variants.length > 0) {
        if (!nextItems.some((item) => Number(item.product_id) === Number(productId))) {
          nextItems.push({
            product_id: Number(productId),
            variant_id: null,
          });
        }

        variants.forEach((variant: any) => {
          const variantExists = nextVariantOptions.some((option) => (
            Number(option.product_id) === Number(productId) && Number(option.variant_id) === Number(variant.id)
          ));

          if (!variantExists) {
            nextVariantOptions.push({
              product_id: Number(productId),
              variant_id: Number(variant.id),
              reserve_qty: 0,
            });
          }
        });

        return;
      }

      nextItems.push({
        product_id: Number(productId),
        variant_id: initialVariant,
      });
    });

    if (modalTarget === 'buy') {
      updateRule(modalRuleIndex, {
        buy_items: nextItems,
        buy_product_ids: nextItems.map((item) => Number(item.product_id)),
      });
    } else {
      updateRule(modalRuleIndex, {
        gift_items: nextItems,
        gift_product_ids: nextItems.map((item) => Number(item.product_id)),
        gift_variant_options: nextVariantOptions,
      });
    }
    productPicker.close();
  };

  const removeSelectedProduct = (ruleIndex: number, target: 'buy' | 'gift', productId: number) => {
    const rule = rules[ruleIndex];
    if (!rule) return;
    if (target === 'buy') {
      const nextItems = getRuleItems(rule, target).filter((item) => Number(item.product_id) !== productId);
      updateRule(ruleIndex, {
        buy_items: nextItems,
        buy_product_ids: nextItems.map((item) => Number(item.product_id)),
      });
    } else {
      const nextItems = getRuleItems(rule, target).filter((item) => Number(item.product_id) !== productId);
      const nextVariantOptions = getRuleGiftVariantOptions(rule).filter((item) => Number(item.product_id) !== productId);
      updateRule(ruleIndex, {
        gift_items: nextItems,
        gift_product_ids: nextItems.map((item) => Number(item.product_id)),
        gift_variant_options: nextVariantOptions,
      });
    }
  };

  const updateGiftVariantOption = (
    ruleIndex: number,
    productId: number,
    variantId: number,
    patch: Partial<BuyToGiftGiftVariantOption>
  ) => {
    const rule = rules[ruleIndex];
    if (!rule) return;

    const nextOptions = getRuleGiftVariantOptions(rule).map((item) => (
      Number(item.product_id) === productId && Number(item.variant_id) === variantId
        ? { ...item, ...patch }
        : item
    ));

    updateRule(ruleIndex, {
      gift_variant_options: nextOptions,
    });
  };

  const updateSelectedItem = (ruleIndex: number, target: 'buy' | 'gift', productId: number, patch: Partial<BuyToGiftRuleItem>) => {
    const rule = rules[ruleIndex];
    if (!rule) return;

    const nextItems = getRuleItems(rule, target).map((item) => (
      Number(item.product_id) === productId
        ? { ...item, ...patch }
        : item
    ));

    if (target === 'buy') {
      updateRule(ruleIndex, {
        buy_items: nextItems,
        buy_product_ids: nextItems.map((item) => Number(item.product_id)),
      });
    } else {
      updateRule(ruleIndex, {
        gift_items: nextItems,
        gift_product_ids: nextItems.map((item) => Number(item.product_id)),
      });
    }
  };

  const renderSelectedProductTable = (ruleIndex: number, target: 'buy' | 'gift', rows: any[]) => {
    const ruleItems = getRuleItems(rules[ruleIndex], target);
    const showInventoryColumns = shouldShowInventoryColumns(rows);
    const showVariantColumn = target === 'buy' && rows.some((row: any) => Array.isArray(row.variants) && row.variants.length > 0);
    const emptyColSpan = 7 + (showVariantColumn ? 1 : 0) + (showInventoryColumns ? 2 : 0);

    return (
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
                {showVariantColumn && <th className="min-w-[200px] px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.sales.orders.fields.variant') || 'Variant'}</th>}
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.quantity')}</th>
                {showInventoryColumns && <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.sold_quantity')}</th>}
                {showInventoryColumns && <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.reserved_quantity')}</th>}
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.price')}</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.status')}</th>
                <th className="w-12 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rows.length === 0 ? (
              <tr>
                <td colSpan={emptyColSpan} className="px-3 py-8 text-center text-slate-400">
                  {trans('hancms.placeholder.select')}
                </td>
              </tr>
            ) : (
                rows.map((row: any) => {
                  const itemIndex = ruleItems.findIndex((entry) => Number(entry.product_id) === Number(row.id));
                  const item = itemIndex >= 0 ? ruleItems[itemIndex] : null;
                  const selectedVariant = resolveVariant(row, item?.variant_id);
                  const variantOptions = getProductVariants(row);
                  const reservationKey = `${row.id}:${selectedVariant?.id ?? 0}`;

                  return (
                    <tr key={`${row.id}-${selectedVariant?.id ?? 'default'}`} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-slate-500">{row.id}</td>
                    <td className="px-3 py-2 font-medium text-slate-800">{row.sku}</td>
                    <td className="px-3 py-2 text-slate-700">
                      <div className="font-medium text-slate-800">{row.name}</div>
                      {selectedVariant && (
                        <div className="mt-1 text-xs text-slate-500">
                          {variantLabel(selectedVariant)}
                        </div>
                      )}
                    </td>
                    {showVariantColumn && (
                      <td className="px-3 py-2">
                        {variantOptions.length > 0 ? (
                          <select
                            className={inputClass(`rules.${ruleIndex}.${target}_items.${Math.max(itemIndex, 0)}.variant_id`)}
                            value={selectedVariant?.id ?? item?.variant_id ?? ''}
                            onChange={(event) => updateSelectedItem(ruleIndex, target, Number(row.id), {
                              variant_id: event.target.value ? Number(event.target.value) : null,
                            })}
                          >
                            <option value="">{trans('hancms.placeholder.select')}</option>
                            {variantOptions.map((variant: any) => (
                              <option key={variant.id} value={variant.id} disabled={Number(variant.stock ?? 0) <= 0}>
                                {variantLabel(variant)}{variant.sku ? ` (${variant.sku})` : ''}{Number(variant.stock ?? 0) <= 0 ? ' - Hết hàng' : ''}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-xs text-slate-400">{trans('hancms.no_data')}</span>
                        )}
                      </td>
                    )}
                    <td className="px-3 py-2">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                        Number(row.quantity ?? 0) <= 0
                          ? 'bg-rose-50 text-rose-700 ring-rose-100'
                          : Number(row.quantity ?? 0) <= 5
                            ? 'bg-amber-50 text-amber-700 ring-amber-100'
                            : 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                      }`}>
                        {Number(row.quantity ?? 0)}
                      </span>
                    </td>
                    {showInventoryColumns && (
                      <td className="px-3 py-2">
                        <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                          {Number(row.sold_quantity ?? 0)}
                        </span>
                      </td>
                    )}
                    {showInventoryColumns && (
                      <td className="px-3 py-2">
                        <span className="inline-flex rounded-full bg-fuchsia-50 px-2.5 py-1 text-xs font-semibold text-fuchsia-700 ring-1 ring-fuchsia-100">
                          {Number(rules[ruleIndex]?.allocations_total_map?.[row.id] ?? rules[ruleIndex]?.allocations_map?.[reservationKey] ?? 0)}
                        </span>
                      </td>
                    )}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderGiftVariantOptionsTable = (ruleIndex: number) => {
    const rule = rules[ruleIndex];
    const options = getRuleGiftVariantOptions(rule);

    if (!rule || options.length === 0) {
      return null;
    }

    return (
      <div className="space-y-3 rounded-xl border border-cyan-200 bg-cyan-50/60 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-700">
            <Gift size={15} className="text-cyan-600" />
            Free theo màu
          </span>
          <span className="text-xs text-cyan-700/80">
            Từng màu có thể reserve riêng
          </span>
        </div>
        <div className="max-h-[320px] overflow-auto rounded-lg border border-cyan-200 bg-white">
          <table className="min-w-full divide-y divide-cyan-100 text-sm">
            <thead className="bg-cyan-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-cyan-700">Sản phẩm</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-cyan-700">Biến thể</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-cyan-700">Tồn hiện tại</th>
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-cyan-700">Tạm giữ</th>
                <th className="w-12 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-cyan-700">Xóa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-100 bg-white">
              {options.map((option: any) => {
                const product = knownProducts.get(Number(option.product_id));
                const variant = resolveVariant(product, option.variant_id);

                return (
                  <tr key={`${option.product_id}-${option.variant_id}`}>
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-800">{product?.name || product?.sku || `#${option.product_id}`}</div>
                      <div className="text-xs text-slate-500">{product?.sku || ''}</div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-800">{variantLabel(variant)}</div>
                      {variant?.sku && <div className="text-xs text-slate-500">{variant.sku}</div>}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                        Number(variant?.stock ?? 0) <= 0
                          ? 'bg-rose-50 text-rose-700 ring-rose-100'
                          : Number(variant?.stock ?? 0) <= 5
                            ? 'bg-amber-50 text-amber-700 ring-amber-100'
                            : 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                      }`}>
                        {Number(variant?.stock ?? 0)}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        className={inputClass(`rules.${ruleIndex}.gift_variant_options.${options.findIndex((item: any) => Number(item.product_id) === Number(option.product_id) && Number(item.variant_id) === Number(option.variant_id))}.reserve_qty`)}
                        value={option.reserve_qty ?? 0}
                        onChange={(e) => updateGiftVariantOption(ruleIndex, Number(option.product_id), Number(option.variant_id), {
                          reserve_qty: e.target.value,
                        })}
                      />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const nextOptions = getRuleGiftVariantOptions(rule).filter((item) => !(
                            Number(item.product_id) === Number(option.product_id) && Number(item.variant_id) === Number(option.variant_id)
                          ));
                          updateRule(ruleIndex, {
                            gift_variant_options: nextOptions,
                          });
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50"
                        title={trans('hancms.button.delete')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const activeRule = rules[activeRuleIndex] || rules[0];
  const activeRuleBuyRows = activeRule ? selectedRowsByItems(getRuleItems(activeRule, 'buy')) : [];
  const activeRuleGiftRows = activeRule ? selectedRowsByItems(getRuleItems(activeRule, 'gift')) : [];
  const activeRuleGiftVariantOptions = activeRule ? getRuleGiftVariantOptions(activeRule) : [];
  const activeRulePreview = getRulePreview(activeRule, activeRuleBuyRows, activeRuleGiftRows);
  const enabledRuleCount = rules.filter((rule) => rule.is_active !== false).length;
  const selectedBuyCount = rules.flatMap((rule) => getRuleItems(rule, 'buy')).length;
  const selectedGiftCount = rules.flatMap((rule) => getRuleItems(rule, 'gift')).length
    + rules.flatMap((rule) => getRuleGiftVariantOptions(rule)).length;

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
                            {(getRuleItems(rule as BuyToGiftRule, 'buy') || []).length} {trans('hancms.promotion.buytogift.summary.buy_products_count')} · {(getRuleItems(rule as BuyToGiftRule, 'gift') || []).length} {trans('hancms.promotion.buytogift.summary.gift_products_count')} · {
                              rule.stock_scope === 'limited'
                                ? `${Number(rule.stock_limit || 0)} ${trans('hancms.promotion.buytogift.summary.stock_limit')}`
                                : trans('hancms.promotion.buytogift.summary.stock_all')
                            }
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
                        <span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-700 ring-1 ring-cyan-100">
                          {Number(activeRule.buy_qty ?? 1)} {trans('hancms.promotion.buytogift.summary.buy')}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-100">
                          {Number(activeRule.gift_qty ?? 1)} {trans('hancms.promotion.buytogift.summary.gift')}
                        </span>
                        <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-fuchsia-700 ring-1 ring-fuchsia-100">
                          {activeRule.max_gift_qty
                            ? `${Number(activeRule.max_gift_qty)} ${trans('hancms.promotion.buytogift.summary.max_gift_qty')}`
                            : trans('hancms.promotion.buytogift.summary.no_gift_cap')}
                        </span>
                        <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                          {activeRule.max_sets_per_order
                            ? `${Number(activeRule.max_sets_per_order)} ${trans('hancms.promotion.buytogift.summary.max_sets_per_order')}`
                            : trans('hancms.promotion.buytogift.summary.unlimited_sets')}
                        </span>
                        <span className={`rounded-full px-3 py-1 ring-1 ${activeRule.stock_scope === 'limited' ? 'bg-amber-50 text-amber-700 ring-amber-100' : 'bg-slate-50 text-slate-600 ring-slate-200'}`}>
                          {activeRule.stock_scope === 'limited'
                            ? `${Number(activeRule.stock_limit || 0)} ${trans('hancms.promotion.buytogift.summary.stock_limit')}`
                            : trans('hancms.promotion.buytogift.summary.stock_all')}
                        </span>
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700 ring-1 ring-sky-100">
                          {trans('hancms.promotion.buytogift.summary.sold_quantity')}: {Number(activeRule.sold_quantity ?? 0)}
                        </span>
                        <span className="rounded-full bg-fuchsia-50 px-3 py-1 text-fuchsia-700 ring-1 ring-fuchsia-100">
                          {trans('hancms.promotion.buytogift.summary.reserved_quantity')}: {Number(activeRule.reserved_quantity ?? activeRule.allocated_stock ?? 0)}
                        </span>
                      </div>
                    </div>

                    {activeRulePreview && activeRulePreview.shortageByGiftCap > 0 && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <div className="font-semibold uppercase tracking-wide">{trans('hancms.promotion.buytogift.summary.warning_title')}</div>
                        <div className="mt-1">
                          {trans('hancms.promotion.buytogift.summary.warning_max_gift_cap', {
                            slots: activeRulePreview.maxGiftSlots ?? 0,
                            shortage: activeRulePreview.shortageByGiftCap,
                          })}
                        </div>
                      </div>
                    )}

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
                      {renderField(
                        trans('hancms.promotion.buytogift.fields.priority'),
                        <input
                          type="number"
                          min={0}
                          className={inputClass(`rules.${activeRuleIndex}.priority`)}
                          value={activeRule.priority ?? 100}
                          onChange={(e) => updateRule(activeRuleIndex, { priority: e.target.value })}
                        />,
                        getRuleError(activeRuleIndex, 'priority')
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
                        trans('hancms.promotion.buytogift.fields.max_gift_qty') || 'Max gift qty',
                        <input
                          type="number"
                          min={1}
                          className={inputClass(`rules.${activeRuleIndex}.max_gift_qty`)}
                          value={activeRule.max_gift_qty ?? ''}
                          onChange={(e) => updateRule(activeRuleIndex, { max_gift_qty: e.target.value })}
                        />,
                        getRuleError(activeRuleIndex, 'max_gift_qty')
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

                    <div className="hidden">
                      {/* Phạm vi tồn kho và Số lượng tồn kho áp dụng đã được ẩn theo yêu cầu */}
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
                      {activeRuleGiftVariantOptions.length > 0 && renderGiftVariantOptionsTable(activeRuleIndex)}
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
