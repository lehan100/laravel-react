import { useMemo, useState } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import { Editor } from '@tinymce/tinymce-react';
import { AlertTriangle, CheckCircle2, Lock, LockOpen, Save, Search, Sparkles } from 'lucide-react';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import SaveButton from '@/Components/Button/SaveButton';
import BackButton from '@/Components/Button/BackButton';
import Card from '@/Components/Main/Card';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import StatusSwitch from '@/Components/Status/StatusSwitch';
import SingleUpload from '@/Components/ImageUpload/SingleUpload';
import MediaLibraryModal from '@/Components/TinyMCE/MediaLibraryModal';
import { translate as translatePostAi } from '@/actions/App/Http/Controllers/Ai/PostAiController';
import AiButton from '@/Components/Button/AiButton';

type SeoAnalysisItem = {
    label: string;
    status: 'good' | 'warning' | 'missing';
    message: string;
};

type SeoKeywordDensity = {
    keyword: string;
    count: number;
    density: number;
    status: 'good' | 'warning' | 'missing';
};

type SeoAnalysisResult = {
    score: number;
    summary: string;
    keyword_density: SeoKeywordDensity[];
    checks: SeoAnalysisItem[];
    recommendations: string[];
};

interface Props {
    title: string;
    backHref: string;
    submitLabel: string;
    item?: any;
    data: any;
    setData: any;
    errors: any;
    trans: (key: string) => string;
    langList: any[];
    langCode?: string;
    itemsCategoryActive: any[];
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    processing: boolean;
    undo: number;
    handleUndo: (status: number) => void;
}

const PostFormView = ({
    title,
    backHref,
    submitLabel,
    data,
    setData,
    errors,
    trans,
    langList = [],
    langCode,
    itemsCategoryActive = [],
    onSubmit,
    processing,
    undo,
    handleUndo,
}: Props) => {
    const { props }: any = usePage();
    const siteName = props.app_name || 'HanCMS Store';
    const [activeTab, setActiveTab] = useState('general');
    const [currentLocale, setCurrentLocale] = useState(langCode || langList[0]?.code || 'vi');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tinyCallback, setTinyCallback] = useState<any>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [aiSuggestingLocale, setAiSuggestingLocale] = useState<string | null>(null);
    const [aiSuggestionError, setAiSuggestionError] = useState('');
    const [aiSeoSuggestingLocale, setAiSeoSuggestingLocale] = useState<string | null>(null);
    const [aiSeoSuggestionError, setAiSeoSuggestionError] = useState('');
    const [aiSeoAnalyzingLocale, setAiSeoAnalyzingLocale] = useState<string | null>(null);
    const [aiSeoAnalysisError, setAiSeoAnalysisError] = useState('');
    const [seoAnalysisByLocale, setSeoAnalysisByLocale] = useState<Record<string, SeoAnalysisResult>>({});
    const [aiTranslating, setAiTranslating] = useState(false);
    const [aiTranslateError, setAiTranslateError] = useState('');
    const [lockedTabs, setLockedTabs] = useState<Record<string, boolean>>({});

    const isLocked = (locale: string) => lockedTabs[locale] !== false;
    const toggleLock = (locale: string) => {
        setLockedTabs(prev => ({
            ...prev,
            [locale]: !isLocked(locale)
        }));
    };

    const imagePath = props.config_path?.path || 'media/post';
    const languageImagePath = props.languageConfigPath?.path || 'media/photo';

    const photoPreview = useMemo(() => {
        if (previewUrl) return previewUrl;
        if (data.photo) return `/${imagePath}/${data.photo}`;
        return null;
    }, [previewUrl, data.photo, imagePath]);

    const createSlug = (str: string) => {
        if (!str) return '';
        return str.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^\p{L}\p{N}\s-]/gu, '')
            .replace(/(\s+)/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const stripHtml = (html: string) => {
        const text = html.replace(/<[^>]*>/g, '');
        const doc = new DOMParser().parseFromString(text, 'text/html');
        return (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
    };

    const truncateMetaDescription = (text: string, maxLength = 160) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;

        const sliced = text.slice(0, maxLength);
        const lastSpace = sliced.lastIndexOf(' ');

        return (lastSpace <= 0 ? sliced : sliced.slice(0, lastSpace)).trim();
    };

    const updateTranslation = (locale: string, field: string, value: any) => {
        setData((prev: any) => {
            const currentLangData = prev.translations?.[locale] || {};
            const nextLangData = { ...currentLangData, [field]: value };

            if (field === 'name') {
                if (isLocked(locale)) {
                    nextLangData.slug = createSlug(value);
                }
                if (!currentLangData.seo_title || currentLangData.seo_title === currentLangData.name) {
                    nextLangData.seo_title = value;
                }
            }

            if (field === 'description') {
                if (!currentLangData.seo_description || currentLangData.seo_description.length < 5) {
                    nextLangData.seo_description = truncateMetaDescription(stripHtml(value));
                }
            }

            if (field === 'content') {
                if (!currentLangData.seo_description || currentLangData.seo_description.length < 5) {
                    nextLangData.seo_description = truncateMetaDescription(stripHtml(value));
                }
            }

            return {
                ...prev,
                translations: {
                    ...(prev.translations || {}),
                    [locale]: nextLangData,
                },
            };
        });
    };

    const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreviewUrl(URL.createObjectURL(file));
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('photo', file);
            const response = await axios.post(route('photo.upload'), formData);
            setData('photo', response.data.file_name || '');
        } catch (_error) {
            //
        } finally {
            setUploading(false);
        }
    };

    const handleSelectImage = (url: string) => {
        if (tinyCallback) {
            tinyCallback(url);
            setTinyCallback(null);
        }
        setIsModalOpen(false);
    };

    const handleAiSuggestContent = async (locale: string) => {
        const langData = data.translations?.[locale] || {};

        setAiSuggestionError('');
        setAiSuggestingLocale(locale);

        try {
            const response = await axios.post(route('post.ai.suggest-content'), {
                locale,
                name: langData.name || '',
                description: langData.description || '',
                seo_keyword: langData.seo_keyword || '',
                current_content: langData.content || '',
            });

            const generated = String(response?.data?.content || '').trim();
            if (!generated) {
                setAiSuggestionError(
                    trans('hancms.catalog.post.ai.empty_response') || 'AI did not return content.'
                );
                return;
            }

            updateTranslation(locale, 'content', generated);
        } catch (error: any) {
            const message = error?.response?.data?.message
                || trans('hancms.catalog.post.ai.failed')
                || 'Cannot generate content right now.';
            setAiSuggestionError(message);
        } finally {
            setAiSuggestingLocale(null);
        }
    };

    const handleAiSuggestSeo = async (locale: string) => {
        const langData = data.translations?.[locale] || {};

        setAiSeoSuggestionError('');
        setAiSeoSuggestingLocale(locale);

        try {
            const response = await axios.post(route('post.ai.suggest-seo'), {
                locale,
                name: langData.name || '',
                description: langData.description || '',
                seo_keyword: langData.seo_keyword || '',
                current_content: langData.content || '',
                current_seo_title: langData.seo_title || '',
                current_seo_description: langData.seo_description || '',
            });

            const seoTitle = String(response?.data?.seo_title || '').trim();
            const seoDescription = String(response?.data?.seo_description || '').trim();

            if (!seoTitle && !seoDescription) {
                setAiSeoSuggestionError(
                    trans('hancms.catalog.post.ai.empty_response') || 'AI did not return SEO content.'
                );
                return;
            }

            if (seoTitle) {
                updateTranslation(locale, 'seo_title', seoTitle);
            }

            if (seoDescription) {
                updateTranslation(locale, 'seo_description', seoDescription);
            }
        } catch (error: any) {
            const message = error?.response?.data?.message
                || trans('hancms.catalog.post.ai.failed')
                || 'Cannot generate SEO right now.';
            setAiSeoSuggestionError(message);
        } finally {
            setAiSeoSuggestingLocale(null);
        }
    };

    const handleAiAnalyzeSeo = async (locale: string) => {
        const langData = data.translations?.[locale] || {};

        setAiSeoAnalysisError('');
        setAiSeoAnalyzingLocale(locale);

        try {
            const response = await axios.post(route('post.ai.analyze-seo'), {
                locale,
                name: langData.name || '',
                description: langData.description || '',
                content: langData.content || '',
                seo_title: langData.seo_title || '',
                seo_keyword: langData.seo_keyword || '',
                seo_description: langData.seo_description || '',
            });

            setSeoAnalysisByLocale((current) => ({
                ...current,
                [locale]: response.data as SeoAnalysisResult,
            }));
        } catch (error: any) {
            const message = error?.response?.data?.message
                || trans('hancms.catalog.post.ai.failed')
                || 'Cannot analyze SEO right now.';
            setAiSeoAnalysisError(message);
        } finally {
            setAiSeoAnalyzingLocale(null);
        }
    };

    const applyAiTranslations = (translations: Record<string, any>) => {
        setData((prev: any) => {
            const nextTranslations = { ...(prev.translations || {}) };

            Object.entries(translations).forEach(([locale, fields]) => {
                const currentData = nextTranslations[locale] || {};
                const translatedFields = fields as Record<string, any>;
                const translatedName = String(translatedFields.name || '').trim();
                const nextLocaleData = { ...currentData };

                ['name', 'description', 'content', 'seo_title', 'seo_keyword', 'seo_description'].forEach((field) => {
                    const value = String(translatedFields[field] || '').trim();

                    if (value !== '') {
                        nextLocaleData[field] = value;
                    }
                });

                if (translatedName !== '' && (isLocked(locale) || String(nextLocaleData.slug || '').trim() === '')) {
                    nextLocaleData.slug = createSlug(translatedName);
                }

                nextTranslations[locale] = nextLocaleData;
            });

            return {
                ...prev,
                translations: nextTranslations,
            };
        });
    };

    const handleAiTranslate = async () => {
        const sourceTranslation = data.translations?.[currentLocale] || {};
        const targetLocales = langList
            .map((item: any) => item.code)
            .filter((code: string) => code !== currentLocale);

        setAiTranslateError('');

        if (!targetLocales.length) {
            setAiTranslateError(trans('hancms.catalog.post.ai.no_target_languages') || 'No target languages available.');
            return;
        }

        const hasSourceContent = ['name', 'description', 'content', 'seo_title', 'seo_keyword', 'seo_description']
            .some((field) => String(sourceTranslation?.[field] || '').trim() !== '');

        if (!hasSourceContent) {
            setAiTranslateError(trans('hancms.catalog.post.ai.missing_input') || 'Please enter content in the current language first.');
            return;
        }

        setAiTranslating(true);

        try {
            const response = await axios.request({
                ...translatePostAi(),
                data: {
                    source_locale: currentLocale,
                    target_locales: targetLocales,
                    name: sourceTranslation.name || '',
                    description: sourceTranslation.description || '',
                    content: sourceTranslation.content || '',
                    seo_title: sourceTranslation.seo_title || '',
                    seo_keyword: sourceTranslation.seo_keyword || '',
                    seo_description: sourceTranslation.seo_description || '',
                },
            });

            const translations = response?.data?.translations || {};

            if (!Object.keys(translations).length) {
                setAiTranslateError(trans('hancms.catalog.post.ai.empty_response') || 'AI did not return translations.');
                return;
            }

            applyAiTranslations(translations);
        } catch (error: any) {
            const message = error?.response?.data?.message
                || trans('hancms.catalog.post.ai.failed')
                || 'Cannot translate right now.';
            setAiTranslateError(message);
        } finally {
            setAiTranslating(false);
        }
    };

    const inputClass = (fieldName: string) => `
        w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-4
        ${(errors?.[fieldName])
            ? 'border-rose-400 bg-rose-50 ring-rose-100'
            : 'border-slate-200 focus:border-slate-300 focus:ring-slate-200'}
    `;

    const hasTabError = (tabId: string) => {
        if (!errors) return false;
        if (tabId === 'general') {
            return !!errors.category_id || !!errors.type || !!errors.status || !!errors.photo;
        }
        if (tabId === 'content') {
            return Object.keys(errors).some((key) => key.startsWith('translations.'));
        }
        return false;
    };

    const renderGeneralTab = () => (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <InputGroup label={trans('hancms.column.status')} stacked required>
                    <StatusSwitch
                        value={data.status}
                        onChange={(value) => setData('status', value)}
                        activeLabel={trans('hancms.status.active')}
                        inactiveLabel={trans('hancms.status.inactive')}
                    />
                </InputGroup>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                    <InputGroup label={trans('hancms.catalog.category.name')} required>
                        <select
                            required
                            className={inputClass('category_id')}
                            value={data.category_id ?? ''}
                            onChange={(e) => setData('category_id', e.target.value)}
                        >
                            <option value="">{trans('hancms.placeholder.select')}</option>
                            {itemsCategoryActive.map((item: any) => (
                                <option key={item.id} value={item.id}>
                                    {item.name_with_depth || item.name || `#${item.id}`}
                                </option>
                            ))}
                        </select>
                        {errors?.category_id && <MessageError>{errors.category_id}</MessageError>}
                    </InputGroup>
                    <InputGroup label={trans('hancms.catalog.post.fields.type') || 'Loại bài viết'} required>
                        <select
                            required
                            className={inputClass('type')}
                            value={data.type || ''}
                            onChange={(e) => setData('type', e.target.value)}
                        >
                            <option value="">{trans('hancms.catalog.post.type.options.select') || 'Chọn'}</option>
                            <option value="primary">{trans('hancms.catalog.post.type.options.primary') || 'Primary'}</option>
                            <option value="footer">{trans('hancms.catalog.post.type.options.footer') || 'Footer'}</option>
                            <option value="sidebar">{trans('hancms.catalog.post.type.options.sidebar') || 'Sidebar'}</option>
                        </select>
                        {errors?.type && <MessageError>{errors.type}</MessageError>}
                    </InputGroup>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <InputGroup label={trans('hancms.column.image')} align="center">
                    <SingleUpload
                        id="post-photo"
                        key={`post-photo-${photoPreview || 'empty'}`}
                        previewUrl={photoPreview}
                        loading={uploading}
                        handleFileChange={handleUploadPhoto}
                        width="w-auto min-w-20"
                    />
                    {errors?.photo && <MessageError>{errors.photo}</MessageError>}
                </InputGroup>
            </div>
        </div>
    );

    const renderContentTab = () => {
        const lang = langList.find((item: any) => item.code === currentLocale) || langList[0];
        if (!lang) return null;

        const locale = lang.code;
        const tinyLocale = locale === 'vn' ? 'vi' : locale;
        const langData = data.translations?.[locale] || {};

        const nameError = errors?.[`translations.${locale}.name`];
        const slugError = errors?.[`translations.${locale}.slug`];
        const descriptionError = errors?.[`translations.${locale}.description`];
        const contentError = errors?.[`translations.${locale}.content`];
        const seoTitleError = errors?.[`translations.${locale}.seo_title`];
        const seoKeywordError = errors?.[`translations.${locale}.seo_keyword`];
        const seoDescriptionError = errors?.[`translations.${locale}.seo_description`];

        const seoAnalysis = seoAnalysisByLocale[locale];
        const seoScoreColor = (seoAnalysis?.score || 0) >= 80
            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
            : (seoAnalysis?.score || 0) >= 60
                ? 'text-amber-700 bg-amber-50 border-amber-200'
                : 'text-rose-700 bg-rose-50 border-rose-200';

        return (
            <div className="space-y-6">
                <div className="border-b border-slate-200 pb-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-3">
                            {langList.map((item: any) => {
                                const active = currentLocale === item.code;
                                const errorInTab = Object.keys(errors || {}).some((key) => key.startsWith(`translations.${item.code}.`));

                                return (
                                    <button
                                        key={item.code}
                                        type="button"
                                        onClick={() => setCurrentLocale(item.code)}
                                        className={`flex items-center gap-2 rounded-md border-2 px-4 py-3 text-[12px] font-black uppercase transition-all ${active
                                            ? 'bg-indigo-900 text-white shadow-lg border-indigo-900 scale-105'
                                            : errorInTab
                                                ? 'border-red-300 bg-red-50 text-red-600 shadow-sm'
                                                : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }`}
                                    >
                                        <img
                                            src={`/${languageImagePath}/${item.photo}`}
                                            className="h-4 w-4 rounded-full object-cover"
                                            alt={item.name}
                                        />
                                        {item.name}
                                        {errorInTab && (
                                            <span className="relative ml-1 flex h-2 w-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600 border border-white" />
                                            </span>
                                        )}
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
                                
                                {aiTranslating
                                    ? (trans('hancms.catalog.post.ai.generating') || 'Generating...')
                                    : (trans('hancms.catalog.post.ai.translate_button') || 'AI dịch tự động')}
                            </AiButton>
                            {aiTranslateError && (
                                <div className="max-w-[20rem] text-right text-xs font-semibold text-rose-600">
                                    {aiTranslateError}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    <InputGroup label={trans('hancms.catalog.post.fields.name')} required>
                        <input
                            type="text"
                            required
                            value={langData.name || ''}
                            onChange={(e) => updateTranslation(locale, 'name', e.target.value)}
                            className={`w-full rounded-md border p-2 text-sm outline-none transition-all ${nameError
                                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
                                }`}
                        />
                        {nameError && <MessageError>{nameError}</MessageError>}
                    </InputGroup>

                    <InputGroup label={trans('hancms.column.slug')}>
                        <div className="relative flex items-center group">
                            <input
                                type="text"
                                readOnly={isLocked(locale)}
                                value={langData.slug || ''}
                                onChange={(e) => updateTranslation(locale, 'slug', e.target.value)}
                                className={`w-full border rounded-md p-2 pr-10 text-sm outline-none transition-all font-mono ${slugError
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                    : isLocked(locale)
                                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'border-indigo-300 focus:ring-2 focus:ring-indigo-500 bg-white'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => toggleLock(locale)}
                                className={`absolute right-2 p-1.5 rounded-md transition-all ${isLocked(locale)
                                    ? 'text-gray-400 hover:bg-gray-200'
                                    : 'text-indigo-600 bg-indigo-50 shadow-sm border border-indigo-100'
                                    }`}
                            >
                                {isLocked(locale) ? <Lock size={14} /> : <LockOpen size={14} />}
                            </button>
                        </div>
                        {slugError && <MessageError>{slugError}</MessageError>}
                        {!isLocked(locale) && !slugError && (
                            <p className="text-[12px] text-amber-600 mt-1 italic font-medium">
                                {trans('hancms.message.edit_slug') || "* Đang cho phép sửa tay Slug của ngôn ngữ này."}
                            </p>
                        )}
                    </InputGroup>

                    <InputGroup label={trans('hancms.column.description')}>
                        <textarea
                            rows={3}
                            value={langData.description || ''}
                            onChange={(e) => updateTranslation(locale, 'description', e.target.value)}
                            className={`w-full rounded-md border p-2 text-sm outline-none transition-all ${descriptionError
                                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
                                }`}
                        />
                        {descriptionError && <MessageError>{descriptionError}</MessageError>}
                    </InputGroup>

                    <InputGroup label={trans('hancms.column.content')}>
                        <div className="mb-2 flex flex-col items-end gap-2">
                            <button
                                type="button"
                                onClick={() => handleAiSuggestContent(locale)}
                                disabled={aiSuggestingLocale === locale}
                                className="inline-flex items-center gap-2 rounded-xl border-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-fuchsia-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Sparkles size={14} className="animate-pulse" />
                                {aiSuggestingLocale === locale
                                    ? (trans('hancms.catalog.post.ai.generating') || 'Generating...')
                                    : (trans('hancms.catalog.post.ai.suggest_content') || 'AI suggest content')}
                            </button>
                            {aiSuggestionError && (
                                <div className="max-w-[20rem] text-right text-xs text-rose-600">
                                    {aiSuggestionError}
                                </div>
                            )}
                        </div>
                        <Editor
                            tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                            licenseKey="gpl"
                            value={langData.content || ''}
                            init={{
                                height: 400,
                                menubar: false,
                                branding: false,
                                promotion: false,
                                document_base_url: '/',
                                convert_urls: true,
                                remove_script_host: true,
                                relative_urls: false,
                                language: tinyLocale,
                                language_url: `/js/tinymce/langs/${tinyLocale}.js`,
                                plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'code', 'table', 'wordcount'],
                                toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist | image code',
                                file_picker_callback: (callback, value, meta) => {
                                    if (meta.filetype === 'image') {
                                        setTinyCallback(() => callback);
                                        setIsModalOpen(true);
                                    }
                                },
                            }}
                            onEditorChange={(content) => updateTranslation(locale, 'content', content)}
                        />
                        {contentError && <MessageError>{contentError}</MessageError>}
                    </InputGroup>

                    <div className="bg-gray-100 p-5 rounded-xl border border-gray-200 space-y-6">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-indigo-900 font-bold uppercase">
                                <Search size={16} /> {trans('hancms.seo.name') || "Search Engine Optimization"}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleAiAnalyzeSeo(locale)}
                                    disabled={aiSeoAnalyzingLocale === locale}
                                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${aiSeoAnalyzingLocale === locale
                                        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                                        : 'border-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-md hover:from-fuchsia-400 hover:to-cyan-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30'
                                        }`}
                                >
                                    <Search size={14} />
                                    {aiSeoAnalyzingLocale === locale
                                        ? (trans('hancms.catalog.post.ai.generating') || 'Generating...')
                                        : (trans('hancms.catalog.post.ai.analyze_seo') || 'AI analyze SEO')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAiSuggestSeo(locale)}
                                    disabled={aiSeoSuggestingLocale === locale}
                                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${aiSeoSuggestingLocale === locale
                                        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                                        : 'border-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-md hover:from-fuchsia-400 hover:to-cyan-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30'
                                        }`}
                                >
                                    <Sparkles size={14} className="animate-pulse" />
                                    {aiSeoSuggestingLocale === locale
                                        ? (trans('hancms.catalog.post.ai.generating') || 'Generating...')
                                        : (trans('hancms.catalog.post.ai.suggest_seo') || 'AI suggest SEO')}
                                </button>
                            </div>
                        </div>
                        {aiSeoSuggestionError && <MessageError>{aiSeoSuggestionError}</MessageError>}
                        {aiSeoAnalysisError && <MessageError>{aiSeoAnalysisError}</MessageError>}
                        {seoAnalysis ? (
                            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                            {trans('hancms.catalog.post.ai.seo_analysis') || 'SEO analysis'}
                                        </div>
                                        <p className="mt-1 text-sm text-slate-600">{seoAnalysis.summary}</p>
                                    </div>
                                    <div className={`rounded-2xl border px-4 py-2 text-center ${seoScoreColor}`}>
                                        <div className="text-2xl font-black leading-none">{seoAnalysis.score}</div>
                                        <div className="mt-1 text-[10px] font-bold uppercase tracking-wide">SEO</div>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                            {trans('hancms.catalog.post.ai.seo_checks') || 'SEO checks'}
                                        </div>
                                        {(seoAnalysis.checks || []).map((check, index) => (
                                            <div key={`${check.label}-${index}`} className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm">
                                                {check.status === 'good' ? (
                                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                                ) : (
                                                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                                )}
                                                <div>
                                                    <div className="font-semibold text-slate-800">{check.label}</div>
                                                    <div className="mt-0.5 text-xs text-slate-500">{check.message}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                                {trans('hancms.catalog.post.ai.keyword_density') || 'Keyword density'}
                                            </div>
                                            <div className="mt-2 space-y-2">
                                                {(seoAnalysis.keyword_density || []).length > 0 ? seoAnalysis.keyword_density.map((item, index) => (
                                                    <div key={`${item.keyword}-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                                                        <span className="min-w-0 truncate font-semibold text-slate-700">{item.keyword}</span>
                                                        <span className="shrink-0 font-mono text-xs text-slate-500">
                                                            {item.count} / {Number(item.density || 0).toFixed(2)}%
                                                        </span>
                                                    </div>
                                                )) : (
                                                    <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500">
                                                        {trans('hancms.catalog.post.ai.no_keywords') || 'No SEO keywords to analyze.'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {(seoAnalysis.recommendations || []).length > 0 ? (
                                            <div>
                                                <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                                    {trans('hancms.catalog.post.ai.recommendations') || 'Recommendations'}
                                                </div>
                                                <ul className="mt-2 space-y-2 text-sm text-slate-600">
                                                    {seoAnalysis.recommendations.map((recommendation, index) => (
                                                        <li key={`${recommendation}-${index}`} className="rounded-xl bg-cyan-50 px-3 py-2 text-cyan-800">
                                                            {recommendation}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <InputGroup
                            label={
                                <div className="flex justify-between items-end w-full">
                                    <span>{trans('hancms.seo.field.title') || "Seo Title"}</span>
                                    <span className={`text-[10px] font-mono ${langData.seo_title?.length > 60 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                        {langData.seo_title?.length || 0}/60 {trans('hancms.seo.character') || "character"}
                                    </span>
                                </div>
                            }
                        >
                            <input
                                type="text"
                                value={langData.seo_title || ''}
                                onChange={(e) => updateTranslation(locale, 'seo_title', e.target.value)}
                                className={`w-full rounded-md border p-2 text-sm outline-none transition-all ${seoTitleError
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
                                    }`}
                            />
                            {seoTitleError && <MessageError>{seoTitleError}</MessageError>}
                        </InputGroup>

                        <InputGroup label={trans('hancms.seo.field.keyword') || "SEO Keywords"}>
                            <textarea
                                rows={3}
                                value={langData.seo_keyword || ''}
                                onChange={(e) => updateTranslation(locale, 'seo_keyword', e.target.value)}
                                className={`w-full rounded-md border p-2 text-sm outline-none transition-all ${seoKeywordError
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
                                    }`}
                            />
                            {seoKeywordError && <MessageError>{seoKeywordError}</MessageError>}
                        </InputGroup>

                        <InputGroup
                            label={
                                <div className="flex justify-between items-end w-full">
                                    <span>{trans('hancms.seo.field.description') || "SEO Description"}</span>
                                    <span className={`text-[10px] font-mono ${langData.seo_description?.length > 160 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                        {langData.seo_description?.length || 0}/160 {trans('hancms.seo.character') || "character"}
                                    </span>
                                </div>
                            }
                        >
                            <textarea
                                rows={3}
                                value={langData.seo_description || ''}
                                onChange={(e) => updateTranslation(locale, 'seo_description', e.target.value)}
                                className={`w-full rounded-md border p-2 text-sm outline-none transition-all ${seoDescriptionError
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
                                    }`}
                            />
                            {seoDescriptionError && <MessageError>{seoDescriptionError}</MessageError>}
                        </InputGroup>
                    </div>

                    <div className="mt-2 p-5 bg-gray-300 border border-gray-200 rounded-xl shadow-sm w-full font-sans">
                        <div className="text-[12px] text-[#202124] leading-tight">{siteName}</div>
                        <span className="text-[12px] text-green-700 leading-tight">
                            https://domain.com /{langData.slug || 'alias'}.html
                        </span>
                        <h3 className="mt-2 text-[20px] text-[#1a0dab]">
                            {langData.seo_title || langData.name || trans('hancms.seo.review.title')}
                        </h3>
                        <p className="text-[14px] text-[#4d5156] leading-relaxed line-clamp-2">
                            {langData.seo_description || trans('hancms.seo.review.description')}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return renderGeneralTab();
            case 'content':
                return renderContentTab();
            default:
                return null;
        }
    };

    return (
        <div>
            <HeaderToolbar title={title}>
                <SaveButton
                    loading={processing}
                    undo={undo}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form="post-form"
                >
                    {submitLabel}
                </SaveButton>
                <BackButton href={backHref}>
                    {trans('hancms.button.back')}
                </BackButton>
            </HeaderToolbar>

            <form id="post-form" onSubmit={onSubmit} noValidate className="text-sm">
                <Card title={trans('hancms.catalog.post.name')}>
                    <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
                        <div className="flex flex-wrap items-start gap-3 pb-1">
                            {['general', 'content'].map((id) => {
                                const active = activeTab === id;
                                const errorInTab = hasTabError(id);
                                const label = id === 'general'
                                    ? (trans('hancms.layout.tabs.general') || 'General')
                                    : (trans('hancms.layout.tabs.content') || 'Content');

                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setActiveTab(id)}
                                        className={`flex items-center gap-2 rounded-md border-2 px-4 py-3 text-[12px] font-black uppercase transition-all ${active
                                            ? 'scale-105 border-slate-900 bg-slate-900 text-white shadow-lg'
                                            : errorInTab
                                                ? 'border-rose-300 bg-rose-50 text-rose-600 shadow-sm'
                                                : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span>{label}</span>
                                        {errorInTab && (
                                            <span className="relative flex h-2 w-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-600 border border-white" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-6 min-h-[500px]">
                        {renderTabContent()}
                    </div>
                </Card>
            </form>

            <MediaLibraryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectImage}
            />
        </div>
    );
};

export default PostFormView;
