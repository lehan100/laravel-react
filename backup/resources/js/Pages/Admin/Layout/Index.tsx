import CountryInput from "@/Components/Form/CountryInput";
import { useTrans } from "@/Hooks/useTrans";
import MainLayout from "@/Layouts/MainLayout";
import { usePage, useForm } from "@inertiajs/react";
import React, { useEffect, useMemo, useState } from 'react';
import { InputGroup } from "@/Components/Form/HancmsInput";
import SaveButton from '@/Components/Button/SaveButton';
import { ImagePlus, Loader2, Save, Sparkles } from "lucide-react";
import axios from "axios";
import HeaderToolbar from "@/Components/Main/HeaderToolbar";
import AdminSideTabsLayout from "@/Components/Common/AdminSideTabsLayout";
import { translate as translateLocaleFields } from '@/actions/App/Http/Controllers/Ai/LocaleTranslateController';
type LanguageItem = {
    code: string;
    name: string;
    photo: string;
};

type LayoutFieldConfig = {
    name: string;
    is_textarea?: boolean;
};

function getLocaleFlag(code: string): string {
    switch (code) {
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

function stripParenthetical(text: string): string {
    return text.replace(/\s*\([^)]*\)/g, '').trim();
}

const AI_PROVIDER_OPTIONS = [
    'anthropic',
    'azure',
    'cohere',
    'deepseek',
    'eleven',
    'gemini',
    'groq',
    'jina',
    'mistral',
    'ollama',
    'openai',
    'openrouter',
    'voyageai',
    'xai',
];

const AI_SETTINGS_SECTIONS = [
    {
        titleKey: 'hancms.settings.layout.ai.sections.default',
        fields: [
            { key: 'AI_PROVIDER', labelKey: 'hancms.settings.layout.ai.fields.provider_default', type: 'select' },
            { key: 'AI_IMAGE_PROVIDER', labelKey: 'hancms.settings.layout.ai.fields.image_provider', type: 'select' },
            { key: 'AI_AUDIO_PROVIDER', labelKey: 'hancms.settings.layout.ai.fields.audio_provider', type: 'select' },
            { key: 'AI_TRANSCRIPTION_PROVIDER', labelKey: 'hancms.settings.layout.ai.fields.transcription_provider', type: 'select' },
            { key: 'AI_EMBEDDING_PROVIDER', labelKey: 'hancms.settings.layout.ai.fields.embedding_provider', type: 'select' },
            { key: 'AI_RERANKING_PROVIDER', labelKey: 'hancms.settings.layout.ai.fields.reranking_provider', type: 'select' },
        ],
    },
    {
        titleKey: 'hancms.settings.layout.ai.sections.api_keys',
        fields: [
            { key: 'OPENAI_API_KEY', labelKey: 'hancms.settings.layout.ai.fields.openai_api_key', type: 'text' },
            { key: 'GEMINI_API_KEY', labelKey: 'hancms.settings.layout.ai.fields.gemini_api_key', type: 'text' },
            { key: 'ANTHROPIC_API_KEY', labelKey: 'hancms.settings.layout.ai.fields.anthropic_api_key', type: 'text' },
            { key: 'COHERE_API_KEY', labelKey: 'hancms.settings.layout.ai.fields.cohere_api_key', type: 'text' },
            { key: 'DEEPSEEK_API_KEY', labelKey: 'hancms.settings.layout.ai.fields.deepseek_api_key', type: 'text' },
            { key: 'ELEVENLABS_API_KEY', labelKey: 'hancms.settings.layout.ai.fields.elevenlabs_api_key', type: 'text' },
            { key: 'GROQ_API_KEY', labelKey: 'hancms.settings.layout.ai.fields.groq_api_key', type: 'text' },
            { key: 'JINA_API_KEY', labelKey: 'hancms.settings.layout.ai.fields.jina_api_key', type: 'text' },
            { key: 'MISTRAL_API_KEY', labelKey: 'hancms.settings.layout.ai.fields.mistral_api_key', type: 'text' },
            { key: 'OLLAMA_API_KEY', labelKey: 'hancms.settings.layout.ai.fields.ollama_api_key', type: 'text' },
            { key: 'OPENROUTER_API_KEY', labelKey: 'hancms.settings.layout.ai.fields.openrouter_api_key', type: 'text' },
            { key: 'VOYAGEAI_API_KEY', labelKey: 'hancms.settings.layout.ai.fields.voyageai_api_key', type: 'text' },
            { key: 'XAI_API_KEY', labelKey: 'hancms.settings.layout.ai.fields.xai_api_key', type: 'text' },
        ],
    },
    {
        titleKey: 'hancms.settings.layout.ai.sections.azure_openai',
        fields: [
            { key: 'AZURE_OPENAI_API_KEY', labelKey: 'hancms.settings.layout.ai.fields.azure_openai_api_key', type: 'text' },
            { key: 'AZURE_OPENAI_URL', labelKey: 'hancms.settings.layout.ai.fields.azure_openai_url', type: 'text' },
            { key: 'AZURE_OPENAI_API_VERSION', labelKey: 'hancms.settings.layout.ai.fields.azure_openai_api_version', type: 'text' },
            { key: 'AZURE_OPENAI_DEPLOYMENT', labelKey: 'hancms.settings.layout.ai.fields.azure_openai_deployment', type: 'text' },
            { key: 'AZURE_OPENAI_EMBEDDING_DEPLOYMENT', labelKey: 'hancms.settings.layout.ai.fields.azure_openai_embedding_deployment', type: 'text' },
        ],
    },
    {
        titleKey: 'hancms.settings.layout.ai.sections.ollama',
        fields: [
            { key: 'OLLAMA_BASE_URL', labelKey: 'hancms.settings.layout.ai.fields.ollama_base_url', type: 'text' },
        ],
    },
];

type CommonConfigTabProps = {
    activeLanguage: LanguageItem;
    languageItems: LanguageItem[];
    setActiveLocale: (locale: string) => void;
    formData: any;
    setFormData: (key: string, value: any) => void;
    translate: (key: string, params?: Record<string, any>) => string;
    layoutItemsHome: Record<string, LayoutFieldConfig>;
    layoutItemsGeneral: Record<string, LayoutFieldConfig>;
};

function CommonConfigTab({
    activeLanguage,
    languageItems,
    setActiveLocale,
    formData,
    setFormData,
    translate,
    layoutItemsHome = {},
    layoutItemsGeneral = {},
}: CommonConfigTabProps) {
    const [previews, setPreviews] = useState<Record<string, string>>({});
    const [loadingField, setLoadingField] = useState<string | null>(null);
    const [aiTranslating, setAiTranslating] = useState(false);
    const [aiTranslateError, setAiTranslateError] = useState('');
    const activeLangCode = activeLanguage?.code || 'vi';
    const activeLangData = formData.pages?.[activeLangCode] || {};
    const commonFieldKeys = useMemo(
        () => [
            ...Object.keys(layoutItemsHome || {}),
            ...Object.keys(layoutItemsGeneral || {}),
        ],
        [layoutItemsHome, layoutItemsGeneral]
    );

    const updateLanguageValue = (fieldKey: string, value: string): void => {
        setFormData('pages', {
            ...formData.pages,
            [activeLangCode]: {
                ...(typeof activeLangData === 'object' && activeLangData !== null ? activeLangData : {}),
                [fieldKey]: value,
            },
        });
    };

    const updateAllLanguageValues = (fieldKey: string, value: string): void => {
        const nextPages = { ...(formData.pages || {}) };

        languageItems.forEach((language) => {
            nextPages[language.code] = {
                ...(nextPages[language.code] || {}),
                [fieldKey]: value,
            };
        });

        setFormData('pages', nextPages);
    };

    const getGlobalMediaValue = (fieldKey: string): string => {
        for (const language of languageItems) {
            const value = formData.pages?.[language.code]?.[fieldKey];

            if (typeof value === 'string' && value.trim() !== '') {
                return value;
            }
        }

        return '';
    };

    const getFieldLimit = (fieldKey: string): number | null => {
        switch (fieldKey) {
            case 'meta_title':
                return 60;
            case 'meta_keyword':
                return 255;
            case 'meta_description':
                return 160;
            default:
                return null;
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string): Promise<void> => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        const uploadData = new FormData();
        uploadData.append('photo', file);

        setLoadingField(fieldKey);

        try {
            const response = await axios.post(route('photo.upload'), uploadData);

            setPreviews((current) => ({
                ...current,
                [fieldKey]: response.data.url,
            }));

            updateAllLanguageValues(fieldKey, response.data.file_name || '');
        } catch (error) {
            console.error('Upload lỗi:', error);
        } finally {
            setLoadingField(null);
        }
    };

    const renderUploadField = (fieldKey: string) => {
        const currentPreview = previews[fieldKey] || getGlobalMediaValue(fieldKey);
        const isLoading = loadingField === fieldKey;
        const urlReview = currentPreview?.includes('/temp/')
            ? currentPreview
            : currentPreview
                ? `/media/photo/${currentPreview}?v=${new Date().getTime()}`
                : '';

        return (
            <InputGroup label={translate(`hancms.layout.items.${fieldKey}`)} align="center">
                <div className="relative group inline-block">
                    <input
                        type="file"
                        id={`file-${activeLangCode}-${fieldKey}`}
                        hidden
                        onChange={(event) => handleFileChange(event, fieldKey)}
                        accept="image/*"
                    />
                    <label
                        htmlFor={`file-${activeLangCode}-${fieldKey}`}
                        className={`flex flex-col items-center justify-center w-20 h-20 p-1 border-2 border-dashed rounded-lg cursor-pointer transition-all overflow-hidden ${
                            currentPreview ? 'bg-gray-100' : 'border-gray-300 bg-gray-50 hover:border-indigo-500'
                        }`}
                    >
                        {isLoading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        ) : currentPreview ? (
                            <img src={urlReview} alt="Preview" className="h-full w-auto max-w-full object-contain" />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-500">
                                <ImagePlus size={32} />
                                <span className="mt-1 text-[10px] uppercase font-semibold">Upload</span>
                            </div>
                        )}
                    </label>
                    {urlReview && !isLoading && (
                        <div className="pointer-events-none absolute left-0 top-0 flex h-20 w-20 items-center justify-center rounded-lg bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="text-[10px] font-medium text-white">{translate('hancms.column.image_edit')}</span>
                        </div>
                    )}
                </div>
            </InputGroup>
        );
    };

    const handleAiTranslate = async () => {
        setAiTranslateError('');

        const sourceFields = commonFieldKeys.reduce<Record<string, string>>((carry, fieldKey) => {
            const value = String(activeLangData?.[fieldKey] ?? '').trim();

            if (value !== '') {
                carry[fieldKey] = value;
            }

            return carry;
        }, {});

        if (Object.keys(sourceFields).length === 0) {
            setAiTranslateError(translate('hancms.settings.layout.ai.messages.missing_input') || 'Hãy nhập ít nhất một trường trước khi dịch.');
            return;
        }

        const targetLocales = languageItems
            .map((language) => language.code)
            .filter((locale) => locale !== activeLangCode);

        if (targetLocales.length === 0) {
            setAiTranslateError(translate('hancms.settings.layout.ai.messages.no_target_languages') || 'Không có ngôn ngữ đích để dịch.');
            return;
        }

        setAiTranslating(true);

        try {
            const response = await axios.request({
                ...translateLocaleFields(),
                data: {
                    module: 'page',
                    source_locale: activeLangCode,
                    target_locales: targetLocales,
                    fields: sourceFields,
                },
            });

            const translations = response?.data?.translations || {};

            if (!Object.keys(translations).length) {
                setAiTranslateError(translate('hancms.settings.layout.ai.messages.empty_response') || 'AI chưa trả về bản dịch.');
                return;
            }

            const nextPages = { ...(formData.pages || {}) };

            Object.entries(translations).forEach(([locale, fields]) => {
                nextPages[locale] = {
                    ...(nextPages[locale] || {}),
                    ...(fields as Record<string, string>),
                };
            });

            setFormData('pages', nextPages);
        } catch (error: any) {
            setAiTranslateError(error?.response?.data?.message || translate('hancms.settings.layout.ai.messages.failed') || 'Không thể dịch tự động lúc này.');
        } finally {
            setAiTranslating(false);
        }
    };

    const renderFieldGroup = (title: string, items: Record<string, LayoutFieldConfig>) => {
        const itemEntries = Object.entries(items || {});

        return (
            <section className="rounded-3xl border border-slate-200 bg-white shadow-[0_14px_30px_-24px_rgba(15,23,42,0.3)]">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 to-slate-800 px-4 py-3 text-white sm:px-5">
                    <div className="text-[11px] uppercase tracking-[0.28em] text-white/60">{title}</div>
                    <div className="mt-1 text-sm font-semibold">{activeLanguage.name}</div>
                </div>

                <div className="space-y-4 p-4 sm:p-5">
                    {itemEntries.map(([fieldKey, fieldConfig]) => (
                        <InputGroup
                            key={fieldKey}
                            label={stripParenthetical(translate(`hancms.layout.items.${fieldKey}`) || fieldConfig.name)}
                            align="center"
                        >
                            <CountryInput
                                photo={activeLanguage.photo}
                                languageName={activeLanguage.name}
                                value={activeLangData?.[fieldKey] || ''}
                                isTextArea={fieldConfig.is_textarea}
                                placeholder={stripParenthetical(translate(`hancms.layout.items.${fieldKey}`))}
                                onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    updateLanguageValue(fieldKey, event.target.value);
                                }}
                            />
                            {getFieldLimit(fieldKey) ? (
                                <div className="mt-1 text-[10px] font-mono text-slate-400">
                                    {(String(activeLangData?.[fieldKey] || '').length)}/{getFieldLimit(fieldKey)} {translate('hancms.seo.character') || 'character'}
                                </div>
                            ) : null}
                        </InputGroup>
                    ))}
                </div>
            </section>
        );
    };

    return (
        <div className="space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
                            {translate('hancms.settings.layout.tabs.common') || 'Cấu hình chung'}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                            {translate('hancms.settings.layout.common.logo_favicon') || 'Logo & Favicon'}
                        </div>
                    </div>
                    <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {translate('hancms.settings.layout.common.global') || 'Toàn cục'}
                    </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {renderUploadField('logo')}
                    {renderUploadField('favicon')}
                </div>
            </section>

            <section className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm sm:p-5">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                    <div className="flex flex-wrap gap-3 overflow-x-auto">
                        {languageItems.map((language) => {
                            const active = activeLangCode === language.code;

                            return (
                                <button
                                    key={language.code}
                                    type="button"
                                    onClick={() => setActiveLocale(language.code)}
                                    className={`inline-flex min-w-[8.75rem] items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-all ${
                                        active
                                            ? 'border-transparent bg-[#1f173d] text-white shadow-[0_14px_30px_rgba(31,23,61,0.25)]'
                                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                    }`}
                                >
                                    <span className="text-lg leading-none">{getLocaleFlag(language.code)}</span>
                                    <span>{language.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <button
                            type="button"
                            onClick={handleAiTranslate}
                            disabled={aiTranslating || languageItems.length < 2}
                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
                                aiTranslating || languageItems.length < 2
                                    ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                                    : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                            }`}
                        >
                            <Sparkles size={14} />
                            {aiTranslating
                                ? (translate('hancms.settings.layout.ai.generating') || 'Generating...')
                                : (translate('hancms.settings.layout.ai.translate_button') || 'AI dịch tự động')}
                        </button>
                        {aiTranslateError ? (
                            <div className="max-w-[20rem] text-right text-xs text-rose-600">
                                {aiTranslateError}
                            </div>
                        ) : null}
                    </div>
                </div>

                {renderFieldGroup(translate('hancms.settings.layout.sections.home') || 'Cấu hình Meta mặc định', layoutItemsHome)}
                {renderFieldGroup(translate('hancms.settings.layout.sections.general') || 'Cài đặt chung', layoutItemsGeneral)}
            </section>
        </div>
    );
}

type AiConfigTabProps = {
    aiSettings: Record<string, string>;
    setAiSettings: (next: Record<string, string>) => void;
    trans: (key: string, params?: Record<string, any>) => string;
};

function AiConfigTab({ aiSettings, setAiSettings, trans }: AiConfigTabProps) {
    const updateSetting = (key: string, value: string): void => {
        setAiSettings({
            ...aiSettings,
            [key]: value,
        });
    };

    const renderField = (field: { key: string; labelKey: string; type: string }) => {
        const value = aiSettings[field.key] || '';
        const label = trans(field.labelKey) || field.key;

        return (
            <InputGroup key={field.key} label={label} align="center">
                {field.type === 'select' ? (
                    <select
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        value={value}
                        onChange={(event) => updateSetting(field.key, event.target.value)}
                    >
                        <option value="">-- Chọn --</option>
                        {AI_PROVIDER_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type="text"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        value={value}
                        onChange={(event) => updateSetting(field.key, event.target.value)}
                        placeholder={label}
                    />
                )}
            </InputGroup>
        );
    };

    return (
        <div className="space-y-5">
            <div className="rounded-3xl border border-indigo-200 bg-indigo-50/70 p-4 text-sm text-indigo-800">
                {trans('hancms.settings.layout.ai.note') || 'Cập nhật giá trị rồi lưu, hệ thống sẽ ghi trực tiếp vào .env và làm mới cấu hình.'}
            </div>

            {AI_SETTINGS_SECTIONS.map((section) => (
                <section key={section.titleKey} className="rounded-3xl border border-slate-200 bg-white shadow-[0_14px_30px_-24px_rgba(15,23,42,0.3)]">
                    <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 to-slate-800 px-4 py-3 text-white sm:px-5">
                        <div className="text-[11px] uppercase tracking-[0.28em] text-white/60">
                            {trans(section.titleKey)}
                        </div>
                        <div className="mt-1 text-sm font-semibold">
                            {trans('hancms.settings.layout.ai.title') || 'Thông tin cấu hình AI'}
                        </div>
                    </div>
                    <div className="space-y-4 p-4 sm:p-5">
                        {section.fields.map(renderField)}
                    </div>
                </section>
            ))}
        </div>
    );
}

function IndexPage() {
    const { trans } = useTrans();
    const { langs, pages, layout_items_home, layout_items_general, ai_settings, errors }: any = usePage().props;
    const languageItems: LanguageItem[] = Array.isArray(langs?.data) ? langs.data : [];

    const initialPages = useMemo(() => {
        const basePages = (pages && typeof pages === 'object' && !Array.isArray(pages)) ? pages : {};
        const itemKeys = [
            ...Object.keys(layout_items_home || {}),
            ...Object.keys(layout_items_general || {}),
            'logo',
            'favicon'
        ];
        const initialized: any = {};

        langs.data.forEach((lang: any) => {
            const langCode = lang.code;

            const existingLangData = (basePages[langCode] && typeof basePages[langCode] === 'object')
                ? basePages[langCode]
                : {};

            initialized[langCode] = { ...existingLangData };

            itemKeys.forEach(key => {
                if (initialized[langCode][key] === undefined || initialized[langCode][key] === null) {
                    initialized[langCode][key] = '';
                }
            });

            // Riêng cho logo và favicon
            // ['logo', 'favicon'].forEach(imgKey => {
            //     if (initialized[langCode][imgKey] === undefined || initialized[langCode][imgKey] === null) {
            //         initialized[langCode][imgKey] = '';
            //     }
            // });
        });

        return initialized;
    }, [pages, langs, layout_items_home, layout_items_general]);

    const initialAiSettings = useMemo(() => {
        const current = ai_settings && typeof ai_settings === 'object' && !Array.isArray(ai_settings) ? ai_settings : {};
        return Object.fromEntries(Object.keys(current).map((key) => [key, String(current[key] ?? '')]));
    }, [ai_settings]);

    const { data, setData, post, processing } = useForm({
        pages: initialPages,
        ai_settings: initialAiSettings,
        undo: 0,
    });

    const [activeTab, setActiveTab] = useState<'common' | 'ai'>('common');
    const [activeLocale, setActiveLocale] = useState<string>(languageItems[0]?.code || 'vi');
    const [undo, setUndo] = useState(0);

    useEffect(() => {
        if (!languageItems.some((item) => item.code === activeLocale) && languageItems[0]?.code) {
            setActiveLocale(languageItems[0].code);
        }
    }, [activeLocale, languageItems]);

    const handleUndo = (status: number) => {
        setUndo(status);
    }

    const renderTabContent = () => {
        if (activeTab === 'ai') {
            return (
                <AiConfigTab
                    aiSettings={data.ai_settings || {}}
                    setAiSettings={(next) => setData('ai_settings', next)}
                    trans={trans}
                />
            );
        }

        const activeLanguage = languageItems.find((item) => item.code === activeLocale) || languageItems[0];

        if (!activeLanguage) {
            return null;
        }

            return (
                <CommonConfigTab
                    activeLanguage={activeLanguage}
                    languageItems={languageItems}
                    setActiveLocale={setActiveLocale}
                    formData={data}
                    setFormData={setData}
                    translate={trans}
                    layoutItemsHome={layout_items_home}
                    layoutItemsGeneral={layout_items_general}
            />
        );
    };
    function handleSubmit(e: any) {
        e.preventDefault();
        e.stopPropagation();
        post(route('layout.store'), {
            onSuccess: () => {
                alert(trans('hancms.message.success.edit', { name: trans('hancms.settings.layout.name') }));
            },
        });
    }
    return (
        <div>
            <HeaderToolbar title={trans('hancms.settings.layout.admin.name')}>
                <SaveButton
                    loading={processing}
                    undo={undo}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form='my-form'
                >
                    {trans('hancms.button.save')}
                </SaveButton>
            </HeaderToolbar>
            <form id="my-form" onSubmit={handleSubmit} noValidate className="text-sm">
                <AdminSideTabsLayout
                    title={trans('hancms.settings.layout.admin.name')}
                    activeTab={activeTab}
                    tabs={[
                        { id: 'common', label: trans('hancms.settings.layout.tabs.common') || 'Cấu hình Chung' },
                        { id: 'ai', label: trans('hancms.settings.layout.tabs.ai') || 'Cấu hình AI' },
                    ]}
                    onTabChange={setActiveTab}
                    hasTabError={(tab) => tab === 'common' ? Object.keys(errors || {}).some((key) => key.startsWith('translations.')) : false}
                    trans={trans}
                >
                    {renderTabContent()}
                </AdminSideTabsLayout>
            </form>
        </div>
    );
}

IndexPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.settings.layout.admin.name" children={page} />
);

export default IndexPage;
