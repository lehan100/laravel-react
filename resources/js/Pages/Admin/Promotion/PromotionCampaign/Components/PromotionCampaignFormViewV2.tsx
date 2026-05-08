import AdminFormHeader from '@/Components/Common/AdminFormHeader';
import AdminSideTabsLayout from '@/Components/Common/AdminSideTabsLayout';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import Card from '@/Components/Main/Card';
import StatusSwitch from '@/Components/Status/StatusSwitch';
import { Check, Clock3, Lock, LockOpen, Sparkles } from 'lucide-react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { translate as translateLocaleFields } from '@/actions/App/Http/Controllers/Ai/LocaleTranslateController';

type OptionItem = {
  id: number;
  label: string;
  ends_at?: string;
};

type PromotionCampaignFormViewProps = {
  title: string;
  backHref: string;
  submitLabel: string;
  data: any;
  setData: (key: string, value: any) => void;
  errors: Record<string, string>;
  processing: boolean;
  itemsCouponActive: any[];
  itemsSaleOfferActive: any[];
  itemsBuyToGiftActive: any[];
  undo: number;
  handleUndo: (status: number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  trans: (key: string, params?: Record<string, any>) => string;
};

function normalizeOptions(items: any[] = []): OptionItem[] {
  return (Array.isArray(items) ? items : []).map((item: any) => ({
    id: Number(item.id),
    label: item.label || item.name || item.code || `#${item.id}`,
    ends_at: item.ends_at || '',
  }));
}

function formatDateTime(value?: string | null, locale = 'vi-VN'): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getLocaleFlag(locale: string): string {
  switch (locale) {
    case 'vi':
      return '🇻🇳';
    case 'en':
      return '🇬🇧';
    case 'ja':
      return '🇯🇵';
    default:
      return '🌐';
  }
}

export default function PromotionCampaignFormViewV2({
  title,
  backHref,
  submitLabel,
  data,
  setData,
  errors,
  processing,
  itemsCouponActive = [],
  itemsSaleOfferActive = [],
  itemsBuyToGiftActive = [],
  undo,
  handleUndo,
  onSubmit,
  trans,
}: PromotionCampaignFormViewProps) {
  const { props }: any = usePage();
  const locale = String(props.locale || 'vi');
  const uiLocale = locale === 'vi' ? 'vi-VN' : locale === 'ja' ? 'ja-JP' : locale === 'en' ? 'en-US' : locale;
  const langList = props?.langs?.data || (Array.isArray(props?.langs) ? props.langs : Object.values(props?.langs || {}));
  const [activeLocale, setActiveLocale] = useState<string>(langList?.[0]?.code || locale || 'vi');
  const [slugLocks, setSlugLocks] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'info' | 'scope' | 'schedule'>('info');
  const [aiTranslating, setAiTranslating] = useState(false);
  const [aiTranslateError, setAiTranslateError] = useState('');

  const couponOptions = useMemo(() => normalizeOptions(itemsCouponActive), [itemsCouponActive]);
  const saleOfferOptions = useMemo(() => normalizeOptions(itemsSaleOfferActive), [itemsSaleOfferActive]);
  const buyToGiftOptions = useMemo(() => normalizeOptions(itemsBuyToGiftActive), [itemsBuyToGiftActive]);
  const promotionModuleNames = [
    trans('hancms.promotion.coupon.name'),
    trans('hancms.promotion.saleoffer.name'),
    trans('hancms.promotion.buytogift.name'),
  ].join(', ');

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
    const infoErrorFields = ['translations', 'campaign_id'];
    const scopeErrorFields = ['coupon_ids', 'saleoffer_ids', 'buytogift_ids'];
    const scheduleErrorFields = ['starts_at', 'ends_at'];

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

  const inputClass = (fieldName: string): string =>
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

  const hasTabError = (tab: 'info' | 'scope' | 'schedule') => {
    if (tab === 'info') {
      return Object.keys(errors || {}).some((key) => key.startsWith('translations.')) || ['campaign_id'].some((field) => !!errors[field]);
    }
    if (tab === 'scope') {
      return ['coupon_ids', 'saleoffer_ids', 'buytogift_ids'].some((field) => !!errors[field]);
    }
    return ['starts_at', 'ends_at'].some((field) => !!errors[field]);
  };

  const promotionTabs = [
    { id: 'info' as const, label: trans('hancms.title.infomation') },
    { id: 'scope' as const, label: trans('hancms.promotion.campaign.scope') },
    { id: 'schedule' as const, label: trans('hancms.promotion.campaign.schedule') },
  ];

  const syncModuleEndDate = (Boolean(data.sync_module_ends_at) || data.sync_module_ends_at === undefined);

  const renderModuleSelect = (
    label: string,
    options: OptionItem[],
    field: 'coupon_ids' | 'saleoffer_ids' | 'buytogift_ids',
    hint: string,
    accent: string,
  ) => {
    const values = Array.isArray(data[field]) ? data[field].map((id: any) => Number(id)).filter((id: number) => !Number.isNaN(id)) : [];
    const selectedCount = values.length;

    return (
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
        <div className={`flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 ${accent}`}>
          <div>
            <div className="text-sm font-semibold text-slate-900">{label}</div>
          </div>
          <div className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
            {selectedCount}
          </div>
        </div>

        <div className="px-4 py-4">
          {selectedCount > 0 ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {options
                .filter((option) => values.includes(option.id))
                .slice(0, 4)
                .map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setData(
                        field,
                        values.filter((id: number) => id !== option.id),
                      );
                    }}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
                    title={trans('hancms.promotion.campaign.deselect')}
                  >
                    <Check size={12} className="text-emerald-600" />
                    <span className="max-w-[150px] truncate">{option.label}</span>
                  </button>
                ))}
              {selectedCount > 4 ? (
                <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  +{selectedCount - 4}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mb-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Chưa chọn mục nào.
            </div>
          )}

          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {options.map((option) => {
              const checked = values.includes(option.id);

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setData(
                      field,
                      checked ? values.filter((id: number) => id !== option.id) : [...values, option.id],
                    );
                  }}
                  className={`group flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                    checked
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                      checked ? 'border-white bg-white text-emerald-600' : 'border-slate-300 bg-white text-transparent'
                    }`}
                  >
                    <Check size={12} className={checked ? 'opacity-100' : 'opacity-0'} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center justify-between gap-3">
                      <div className="min-w-0 flex-1 truncate text-sm font-semibold whitespace-nowrap">{option.label}</div>
                      {checked ? (
                        <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-200">
                          <Check size={10} className="text-emerald-600" />
                          <span className="whitespace-nowrap">{trans('hancms.promotion.campaign.selected')}</span>
                        </div>
                      ) : null}
                    </div>
                    <div className={`mt-1 flex items-center gap-2 text-xs ${checked ? 'text-white/75' : 'text-slate-500'}`}>
                      <Clock3 size={12} />
                      <span>{option.ends_at ? formatDateTime(option.ends_at, uiLocale) : trans('hancms.promotion.campaign.no_end_date')}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedCount > 0 ? (
            <button
              type="button"
              onClick={() => setData(field, [])}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
            >
              {trans('hancms.promotion.campaign.clear_all')}
            </button>
          ) : null}
        </div>
      </div>
    );
  };

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
                      <span className="mr-2 text-sm">{getLocaleFlag(lang.code)}</span>
                      <span>{lang.name}</span>
                    </button>
                  );
                  })}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={handleAiTranslate}
                    disabled={aiTranslating || langList.length < 2}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
                      aiTranslating || langList.length < 2
                        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                        : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    <Sparkles size={14} />
                    {aiTranslating ? (trans('hancms.promotion.campaign.ai.generating') || 'Generating...') : 'AI dịch tự động'}
                  </button>
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
                  <p className="mt-1 text-xs text-slate-500">
                    {trans('hancms.promotion.campaign.fields.name_hint') || 'Tối đa 255 ký tự.'}
                  </p>
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
                  <p className="mt-1 text-xs text-slate-500">
                    {trans('hancms.promotion.campaign.fields.description_hint') || 'Tối đa 1000 ký tự.'}
                  </p>
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
        <Card title={trans('hancms.promotion.campaign.scope')} contentClassName="overflow-visible">
          <div className="p-6 space-y-5">
            <div className="grid gap-5 lg:grid-cols-3">
              {renderModuleSelect(trans('hancms.promotion.coupon.name'), couponOptions, 'coupon_ids', trans('hancms.promotion.campaign.module_scope_hint', { module: trans('hancms.promotion.coupon.name') }), 'bg-gradient-to-br from-amber-50 to-white')}
              {renderModuleSelect(trans('hancms.promotion.saleoffer.name'), saleOfferOptions, 'saleoffer_ids', trans('hancms.promotion.campaign.module_scope_hint', { module: trans('hancms.promotion.saleoffer.name') }), 'bg-gradient-to-br from-emerald-50 to-white')}
              {renderModuleSelect(trans('hancms.promotion.buytogift.name'), buyToGiftOptions, 'buytogift_ids', trans('hancms.promotion.campaign.module_scope_hint', { module: trans('hancms.promotion.buytogift.name') }), 'bg-gradient-to-br from-sky-50 to-white')}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              {trans('hancms.promotion.campaign.scope_help')}
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card title={trans('hancms.promotion.campaign.schedule')} contentClassName="overflow-visible">
        <div className="p-6 space-y-5">
          <InputGroup label={trans('hancms.promotion.campaign.fields.starts_at')}>
            <input type="datetime-local" className={inputClass('starts_at')} value={data.starts_at} onChange={(e) => setData('starts_at', e.target.value)} />
            {errors.starts_at && <MessageError>{errors.starts_at}</MessageError>}
          </InputGroup>

          <InputGroup label={trans('hancms.promotion.campaign.fields.ends_at')}>
            <input type="datetime-local" required className={inputClass('ends_at')} value={data.ends_at} onChange={(e) => setData('ends_at', e.target.value)} />
            {errors.ends_at && <MessageError>{errors.ends_at}</MessageError>}
          </InputGroup>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                checked={syncModuleEndDate}
                onChange={(e) => setData('sync_module_ends_at', e.target.checked)}
              />
              <div>
                <div className="text-sm font-semibold text-emerald-900">
                  {trans('hancms.promotion.campaign.sync_module_ends_at', { modules: promotionModuleNames })}
                </div>
                <div className="mt-1 text-xs text-emerald-700">
                  {trans('hancms.promotion.campaign.sync_module_ends_at_help')}
                </div>
              </div>
            </label>
          </div>
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
    </form>
  );
}
