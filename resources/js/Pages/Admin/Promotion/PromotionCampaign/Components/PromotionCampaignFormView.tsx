import AdminFormHeader from '@/Components/Common/AdminFormHeader';
import AdminSideTabsLayout from '@/Components/Common/AdminSideTabsLayout';
import ProductPickerModal from '@/Components/Common/ProductPickerModal';
import SelectedProductsTable from '@/Components/Common/SelectedProductsTable';
import { useProductPickerModal } from '@/Components/Common/useProductPickerModal';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import Card from '@/Components/Main/Card';
import StatusSwitch from '@/Components/Status/StatusSwitch';
import { Lock, LockOpen, Sparkles } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { formatProductPrice, getLanguageByLocale, getLocaleCode, getProductCurrencyFromLocale, loadProductCurrency, type ProductCurrency } from '../../../Product/productUtils';
import { translate as translateLocaleFields } from '@/actions/App/Http/Controllers/Ai/LocaleTranslateController';
import AiButton from '@/Components/Button/AiButton';

type PromotionCampaignFormViewProps = {
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

export default function PromotionCampaignFormView({
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
}: PromotionCampaignFormViewProps) {
  const { props }: any = usePage();
  const locale = getLocaleCode(props.locale || 'vi');
  const langList = props?.langs?.data || (Array.isArray(props?.langs) ? props.langs : Object.values(props?.langs || {}));
  const currentLanguage = getLanguageByLocale(langList, locale);
  const [resolvedCurrency, setResolvedCurrency] = useState<ProductCurrency>(() => getProductCurrencyFromLocale(locale, currentLanguage));
  const [activeLocale, setActiveLocale] = useState<string>(langList?.[0]?.code || locale || 'vi');
  const [slugLocks, setSlugLocks] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'info' | 'scope' | 'schedule'>('info');
  const productPicker = useProductPickerModal({ routeName: 'promotion-campaign.products-picker' });
  const [knownProducts, setKnownProducts] = useState<Map<number, any>>(new Map());
  const [aiTranslating, setAiTranslating] = useState(false);
  const [aiTranslateError, setAiTranslateError] = useState('');

  const selectedProductIds = useMemo(
    () => (Array.isArray(data.product_ids) ? data.product_ids.map((id: any) => Number(id)).filter((id: number) => !Number.isNaN(id)) : []),
    [data.product_ids]
  );

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

  useEffect(() => {
    if (!langList?.some((lang: any) => lang.code === activeLocale) && langList?.[0]?.code) {
      setActiveLocale(langList[0].code);
    }
  }, [activeLocale, langList]);

  useEffect(() => {
    setSlugLocks((current) => {
      const next = { ...current };
      let changed = false;

      (langList || []).forEach((lang: any) => {
        if (typeof next[lang.code] === 'undefined') {
          next[lang.code] = true;
          changed = true;
        }
      });

      return changed ? next : current;
    });
  }, [langList]);

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
    const infoErrorFields: string[] = [];
    const scopeErrorFields = ['product_ids'];
    const scheduleErrorFields = ['starts_at', 'ends_at', 'priority'];

    if (Object.keys(errors || {}).some((key) => key.startsWith('translations.')) || infoErrorFields.some((field) => !!errors[field])) {
      setActiveTab('info');
      return;
    }
    if (scopeErrorFields.some((field) => !!errors[field])) {
      setActiveTab('scope');
      return;
    }
    if (scheduleErrorFields.some((field) => !!errors[field])) {
      setActiveTab('schedule');
    }
  }, [errors]);

  const inputClass = (fieldName: string): any =>
    `w-full border rounded-md p-2 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
    }`;

  const updateTranslation = (translationLocale: string, field: 'name' | 'slug' | 'description', value: string) => {
    (setData as any)((previous: any) => {
      const currentTranslation = previous.translations?.[translationLocale] || {};
      const nextTranslation = {
        ...currentTranslation,
        [field]: value,
      };

      if (field === 'name' && slugLocks[translationLocale] !== false) {
        nextTranslation.slug = value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[đĐ]/g, 'd')
          .replace(/[^\p{L}\p{N}\s-]/gu, '')
          .replace(/(\s+)/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      return {
        ...previous,
        translations: {
          ...(previous.translations || {}),
          [translationLocale]: nextTranslation,
        },
      };
    });
  };

  const toggleSlugLock = (translationLocale: string) => {
    setSlugLocks((current) => ({
      ...current,
      [translationLocale]: !current[translationLocale],
    }));
  };

  const applyAiTranslations = (translations: Record<string, any>) => {
    (setData as any)((previous: any) => {
      const nextTranslations = { ...(previous.translations || {}) };

      Object.entries(translations).forEach(([translationLocale, fields]) => {
        const translatedFields = fields as Record<string, any>;
        const translatedName = String(translatedFields.name || '').trim();
        const currentTranslation = nextTranslations[translationLocale] || {};
        const nextTranslation = {
          ...currentTranslation,
          ...Object.fromEntries(
            ['name', 'description']
              .map((field) => {
                const value = String(translatedFields[field] || '').trim();
                return value !== '' ? [field, value] : null;
              })
              .filter((entry): entry is [string, string] => entry !== null)
          ),
        };

        if (translatedName !== '') {
          nextTranslation.slug = translatedName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^\p{L}\p{N}\s-]/gu, '')
            .replace(/(\s+)/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
        }

        nextTranslations[translationLocale] = nextTranslation;
      });

      return {
        ...previous,
        translations: nextTranslations,
      };
    });
  };

  const handleAiTranslate = async () => {
    const sourceTranslation = data.translations?.[activeLocale] || {};
    const targetLocales = langList
      .map((lang: any) => lang.code)
      .filter((code: string) => code !== activeLocale);

    setAiTranslateError('');

    if (!targetLocales.length) {
      setAiTranslateError(trans('hancms.promotion.campaign.ai.no_target_languages') || 'No target languages available.');
      return;
    }

    const hasSourceContent = ['name', 'description'].some((field) => String(sourceTranslation?.[field] || '').trim() !== '');

    if (!hasSourceContent) {
      setAiTranslateError(trans('hancms.promotion.campaign.ai.missing_input') || 'Please enter content in the current language first.');
      return;
    }

    setAiTranslating(true);

    try {
      const response = await axios.request({
        ...translateLocaleFields(),
        data: {
          module: 'promotion-campaign',
          source_locale: activeLocale,
          target_locales: targetLocales,
          fields: {
            name: sourceTranslation.name || '',
            description: sourceTranslation.description || '',
          },
        },
      });

      const translations = response?.data?.translations || {};

      if (!Object.keys(translations).length) {
        setAiTranslateError(trans('hancms.promotion.campaign.ai.empty_response') || 'AI did not return translations.');
        return;
      }

      applyAiTranslations(translations);
    } catch (error: any) {
      setAiTranslateError(error?.response?.data?.message || trans('hancms.promotion.campaign.ai.failed') || 'Unable to translate promotion campaign content right now.');
    } finally {
      setAiTranslating(false);
    }
  };

  const activeTranslation = data.translations?.[activeLocale] || {};
  const activeNameError = errors?.[`translations.${activeLocale}.name`];
  const activeSlugError = errors?.[`translations.${activeLocale}.slug`];
  const activeDescriptionError = errors?.[`translations.${activeLocale}.description`];
  const hasInfoTabError = Object.keys(errors || {}).some((key) => key.startsWith('translations.'));

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

  const hasTabError = (tab: 'info' | 'scope' | 'schedule') => {
    if (tab === 'info') {
      return hasInfoTabError;
    }
    if (tab === 'scope') {
      return ['product_ids'].some((field) => !!errors[field]);
    }
    return ['starts_at', 'ends_at', 'priority'].some((field) => !!errors[field]);
  };

  const promotionTabs = [
    { id: 'info' as const, label: trans('hancms.title.infomation') },
    { id: 'scope' as const, label: trans('hancms.promotion.campaign.scope') },
    { id: 'schedule' as const, label: trans('hancms.promotion.campaign.schedule') },
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

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50/80 p-3">
                <div className="flex flex-wrap gap-2">
                  {langList.map((lang: any) => {
                  const active = activeLocale === lang.code;
                  const errorInTab = Object.keys(errors || {}).some((key) => key.startsWith(`translations.${lang.code}.`));

                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setActiveLocale(lang.code)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${
                        active
                          ? 'bg-slate-900 text-white shadow'
                          : errorInTab
                            ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                            : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lang.name}
                    </button>
                  );
                  })}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <AiButton
                    type="button"
                    onClick={handleAiTranslate}
                    disabled={aiTranslating || langList.length < 2}
                    
                  >
                    
                    {aiTranslating ? (trans('hancms.promotion.campaign.ai.generating') || 'Generating...') : 'AI dịch tự động'}
                  </AiButton>
                  {aiTranslateError && (
                    <div className="max-w-[20rem] text-right text-xs text-rose-600">
                      {aiTranslateError}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-5 p-5">
                <InputGroup label={trans('hancms.column.name')}>
                  <input
                    type="text"
                    required
                    className={inputClass(`translations.${activeLocale}.name`)}
                    value={activeTranslation.name || ''}
                    onChange={(e) => updateTranslation(activeLocale, 'name', e.target.value)}
                  />
                  {activeNameError && <MessageError>{activeNameError}</MessageError>}
                </InputGroup>

                <InputGroup label={trans('hancms.promotion.campaign.fields.slug')}>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      readOnly={slugLocks[activeLocale] !== false}
                      className={`${inputClass(`translations.${activeLocale}.slug`)} pr-12 ${slugLocks[activeLocale] !== false ? 'bg-slate-50' : ''}`}
                      value={activeTranslation.slug || ''}
                      onChange={(e) => updateTranslation(activeLocale, 'slug', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => toggleSlugLock(activeLocale)}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 transition-all ${
                        slugLocks[activeLocale] !== false
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title={slugLocks[activeLocale] !== false ? trans('hancms.tooltip.locked') : trans('hancms.tooltip.unlocked')}
                    >
                      {slugLocks[activeLocale] !== false ? <Lock size={14} /> : <LockOpen size={14} />}
                    </button>
                  </div>
                  {activeSlugError && <MessageError>{activeSlugError}</MessageError>}
                </InputGroup>

                <InputGroup label={trans('hancms.column.description')}>
                  <textarea
                    className={inputClass(`translations.${activeLocale}.description`)}
                    value={activeTranslation.description || ''}
                    onChange={(e) => updateTranslation(activeLocale, 'description', e.target.value)}
                    rows={5}
                  />
                  {activeDescriptionError && <MessageError>{activeDescriptionError}</MessageError>}
                </InputGroup>
              </div>
            </div>

          </div>
        </Card>
      );
    }

    if (activeTab === 'scope') {
      return (
        <Card title={trans('hancms.promotion.campaign.fields.apply_products')}>
          <div className="p-6">
            <SelectedProductsTable
              rows={selectedProductRows}
              emptyLabel={trans('hancms.promotion.campaign.no_products')}
              addLabel={trans('hancms.promotion.campaign.fields.apply_products')}
              countLabel={trans('hancms.promotion.campaign.count_products')}
              onOpenPicker={openProductModal}
              onRemove={removeSelectedProduct}
              formatPrice={(price) => formatProductPrice(price, resolvedCurrency)}
              trans={trans}
            />
          </div>
        </Card>
      );
    }

    return (
      <Card title={trans('hancms.promotion.campaign.schedule')}>
        <div className="p-6 space-y-5">
          <InputGroup label={trans('hancms.promotion.campaign.fields.starts_at')}>
            <input type="datetime-local" className={inputClass('starts_at')} value={data.starts_at} onChange={(e) => setData('starts_at', e.target.value)} />
            {errors.starts_at && <MessageError>{errors.starts_at}</MessageError>}
          </InputGroup>

          <InputGroup label={trans('hancms.promotion.campaign.fields.ends_at')}>
            <input type="datetime-local" required className={inputClass('ends_at')} value={data.ends_at} onChange={(e) => setData('ends_at', e.target.value)} />
            {errors.ends_at && <MessageError>{errors.ends_at}</MessageError>}
          </InputGroup>

          <InputGroup label={trans('hancms.promotion.campaign.fields.priority')}>
            <input type="number" min="0" className={inputClass('priority')} value={data.priority} onChange={(e) => setData('priority', e.target.value)} />
            {errors.priority && <MessageError>{errors.priority}</MessageError>}
          </InputGroup>
        </div>
      </Card>
    );
  };

  return (
    <form id="my-form" onSubmit={onSubmit}>
      <AdminFormHeader
        title={title}
        backHref={backHref}
        submitLabel={submitLabel}
        processing={processing}
        undo={undo}
        handleUndo={handleUndo}
        trans={trans}
      />

      <AdminSideTabsLayout
        title={title}
        activeTab={activeTab}
        tabs={promotionTabs}
        onTabChange={setActiveTab}
        hasTabError={hasTabError}
        trans={trans}
      >
        {renderTabContent()}
      </AdminSideTabsLayout>

      <ProductPickerModal
        title={trans('hancms.promotion.campaign.fields.apply_products')}
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
        onPreviousPage={() => productPicker.setPage((page) => Math.max(1, page - 1))}
        onNextPage={() => productPicker.setPage((page) => page + 1)}
        formatPrice={(price) => formatProductPrice(price, resolvedCurrency)}
        trans={trans}
        allCategoriesLabel={trans('hancms.filter.all_categories')}
        showCampaigns
      />
    </form>
  );
}
