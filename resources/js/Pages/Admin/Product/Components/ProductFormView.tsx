import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { Globe, Save, Search, Sparkles } from 'lucide-react';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import SaveButton from '@/Components/Button/SaveButton';
import BackButton from '@/Components/Button/BackButton';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import Card from '@/Components/Main/Card';
import StatusSwitch from '@/Components/Status/StatusSwitch';
import MultiUpload from '@/Components/ImageUpload/MultiUpload';
import MediaLibraryModal from '@/Components/TinyMCE/MediaLibraryModal';
import CategoryMultiSelect from './CategoryMultiSelect';
import { formatPriceInput, getProductCurrencyFromLocale } from '../productUtils';

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

const ProductFormView = ({
    title,
    backHref,
    submitLabel,
    item,
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
    const [currentTab, setCurrentTab] = useState(langCode || 'vi');
    const priceCurrency = getProductCurrencyFromLocale(langCode || 'vi');
    const priceSymbol = ({
        VND: 'đ',
        USD: '$',
        JPY: '￥',
        KRW: '₩',
        CNY: '¥',
        THB: '฿',
        EUR: '€',
    }[priceCurrency.code] || priceCurrency.code);
    const [existingPhotos, setExistingPhotos] = useState<any[]>(
        [...(item?.photos || [])].sort((a: any, b: any) => {
            const orderDiff = (a.order ?? 0) - (b.order ?? 0);
            return orderDiff !== 0 ? orderDiff : (a.id ?? 0) - (b.id ?? 0);
        })
    );
    const [slugLocked, setSlugLocked] = useState<Record<string, boolean>>(
        langList.reduce((acc: Record<string, boolean>, lang: any) => {
            acc[lang.code] = true;
            return acc;
        }, {})
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tinyCallback, setTinyCallback] = useState<any>(null);
    const [priceInput, setPriceInput] = useState(() => formatPriceInput(data.price, priceCurrency));
    const [aiSuggestingLocale, setAiSuggestingLocale] = useState<string | null>(null);
    const [aiSuggestionError, setAiSuggestionError] = useState('');
    const [aiSeoSuggestingLocale, setAiSeoSuggestingLocale] = useState<string | null>(null);
    const [aiSeoSuggestionError, setAiSeoSuggestionError] = useState('');
    const selectedCategoryIds = Array.isArray(data.category_ids) ? data.category_ids : [];
    const selectedFiles = Array.isArray(data.photos) ? data.photos : [];
    const defaultPhotoId = data.default_photo_id ?? item?.default_photo_id ?? existingPhotos.find((photo: any) => photo.is_default)?.id ?? null;

    useEffect(() => {
        setData('photo_orders', existingPhotos.map((photo: any) => photo.id));
    }, [existingPhotos]);

    useEffect(() => {
        setPriceInput(formatPriceInput(data.price, priceCurrency));
    }, [priceCurrency.code]);

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

        if (lastSpace <= 0) {
            return sliced.trim();
        }

        return sliced.slice(0, lastSpace).trim();
    };

    const updateTranslation = (locale: string, field: string, value: any) => {
        setData((prev: any) => {
            const currentLangData = prev.translations?.[locale] || {};
            const nextLangData = { ...currentLangData, [field]: value };

            if (field === 'name' && slugLocked[locale]) {
                nextLangData.slug = createSlug(value);
            }

            if (field === 'name') {
                if (!currentLangData.seo_title || currentLangData.seo_title === currentLangData.name) {
                    nextLangData.seo_title = value;
                }
            }

            if (field === 'description') {
                if (!currentLangData.seo_description || currentLangData.seo_description === currentLangData.description || currentLangData.seo_description.length < 5) {
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
                    [locale]: nextLangData
                }
            };
        });
    };

    const handleToggleSlugLock = (locale: string) => {
        setSlugLocked(prev => ({
            ...prev,
            [locale]: !prev[locale]
        }));
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
            const response = await axios.post(route('product.ai.suggest-content'), {
                locale,
                name: langData.name || '',
                description: langData.description || '',
                seo_keyword: langData.seo_keyword || '',
                current_content: langData.content || '',
            });

            const generated = String(response?.data?.content || '').trim();

            if (!generated) {
                setAiSuggestionError(
                    trans('hancms.catalog.product.ai.empty_response') || 'AI did not return content.'
                );
                return;
            }

            updateTranslation(locale, 'content', generated);
        } catch (error: any) {
            const message = error?.response?.data?.message
                || trans('hancms.catalog.product.ai.failed')
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
            const response = await axios.post(route('product.ai.suggest-seo'), {
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
                    trans('hancms.catalog.product.ai.empty_response') || 'AI did not return SEO content.'
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
                || trans('hancms.catalog.product.ai.failed')
                || 'Cannot generate SEO right now.';
            setAiSeoSuggestionError(message);
        } finally {
            setAiSeoSuggestingLocale(null);
        }
    };

    const hasTabError = (tabId: string) => {
        if (!errors) return false;

        if (tabId === 'general') {
            return !!errors.sku || !!errors.price || !!errors.quantity || !!errors.weight || !!errors.order || !!errors.status || !!errors.is_stock || !!errors.is_coupon;
        }

        if (tabId === 'content') {
            return Object.keys(errors).some((key) => key.startsWith('translations.'));
        }

        if (tabId === 'categories') {
            return !!errors.category_ids;
        }

        if (tabId === 'photos') {
            return !!errors.photos || !!errors.default_photo_id;
        }

        return false;
    };

    const inputClass = (fieldName: string) => `
        w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition-all focus:ring-4
        ${(errors?.[fieldName])
            ? 'border-rose-400 bg-rose-50 ring-rose-100'
            : 'border-slate-200 focus:border-slate-300 focus:ring-slate-200'}
    `;

    const renderGeneralTab = () => (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                    <InputGroup label={trans('hancms.column.sku')}>
                        <input
                            type="text"
                            className={inputClass('sku')}
                            value={data.sku || ''}
                            onChange={(e) => setData('sku', e.target.value)}
                        />
                        {errors?.sku && <MessageError>{errors.sku}</MessageError>}
                    </InputGroup>
                    <InputGroup label={trans('hancms.column.quantity')}>
                        <input
                            type="number"
                            min="0"
                            className={inputClass('quantity')}
                            value={data.quantity ?? 0}
                            onChange={(e) => setData('quantity', e.target.value)}
                        />
                        {errors?.quantity && <MessageError>{errors.quantity}</MessageError>}
                    </InputGroup>
                    <InputGroup label={trans('hancms.column.price')}>
                        <div className="relative">
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-semibold text-slate-500">
                                {priceSymbol}
                            </span>
                            <input
                                type="text"
                                inputMode={priceCurrency.code === 'VND' || priceCurrency.code === 'JPY' || priceCurrency.code === 'KRW' ? 'numeric' : 'decimal'}
                                className={`${inputClass('price')} pl-8`}
                                value={priceInput}
                                onChange={(e) => {
                                    setPriceInput(e.target.value);
                                    setData('price', e.target.value);
                                }}
                                onBlur={() => {
                                    const formatted = formatPriceInput(priceInput, priceCurrency);
                                    setPriceInput(formatted);
                                    setData('price', formatted);
                                }}
                            />
                        </div>
                        {errors?.price && <MessageError>{errors.price}</MessageError>}
                    </InputGroup>
                    <InputGroup label={trans('hancms.column.weight')}>
                        <input
                            type="number"
                            min="0"
                            className={inputClass('weight')}
                            value={data.weight ?? 0}
                            onChange={(e) => setData('weight', e.target.value)}
                        />
                        {errors?.weight && <MessageError>{errors.weight}</MessageError>}
                    </InputGroup>

                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <div className="space-y-4">
                    <StatusSwitch
                        value={data.status}
                        onChange={(value) => setData('status', value)}
                        activeLabel={trans('hancms.status.active')}
                        inactiveLabel={trans('hancms.status.inactive')}
                    />
                    <StatusSwitch
                        value={data.is_stock}
                        onChange={(value) => setData('is_stock', value)}
                        activeLabel={trans('hancms.catalog.product.fields.stock_available')}
                        inactiveLabel={trans('hancms.catalog.product.fields.stock_out')}
                    />
                    <StatusSwitch
                        value={data.is_coupon}
                        onChange={(value) => setData('is_coupon', value)}
                        activeLabel={trans('hancms.catalog.product.fields.coupon_allowed')}
                        inactiveLabel={trans('hancms.catalog.product.fields.coupon_disallowed')}
                    />
                </div>
            </div>
        </div>
    );

    const renderContentTab = () => {
        const lang = langList.find((item: any) => item.code === currentTab) || langList[0];

        if (!lang) {
            return null;
        }

        const locale = lang.code;
        const langCode = locale === 'vn' ? 'vi' : locale;
        const langData = data.translations?.[locale] || {};
        const nameError = errors?.[`translations.${locale}.name`];
        const slugError = errors?.[`translations.${locale}.slug`];
        const descriptionError = errors?.[`translations.${locale}.description`];
        const contentError = errors?.[`translations.${locale}.content`];
        const seoTitleError = errors?.[`translations.${locale}.seo_title`];
        const seoKeywordError = errors?.[`translations.${locale}.seo_keyword`];
        const seoDescriptionError = errors?.[`translations.${locale}.seo_description`];
        const isSlugLocked = !!slugLocked[locale];
        return (
            <div className="space-y-6">
                <div className="flex flex-wrap gap-3 overflow-x-auto border-b border-slate-200 pb-6">
                    {langList.map((item: any) => {
                        const active = currentTab === item.code;
                        const errorInTab = Object.keys(errors || {}).some((key) => key.startsWith(`translations.${item.code}.`));

                        return (
                            <button
                                key={item.code}
                                type="button"
                                onClick={() => setCurrentTab(item.code)}
                                className={`flex items-center gap-2 rounded-md border-2 px-4 py-3 text-[12px] font-black uppercase transition-all ${active
                                    ? 'bg-indigo-900 text-white shadow-lg border-indigo-900 scale-105'
                                    : errorInTab
                                        ? 'border-red-300 bg-red-50 text-red-600 shadow-sm'
                                        : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                <img
                                    src={`/${props.languageConfigPath.path}/${item.photo}`}
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

                <div className="border-t border-slate-200 pt-6">
                    <div className="grid gap-6">
                        <InputGroup label={trans('hancms.column.name')}>
                            <input
                                type="text"
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
                                    readOnly={isSlugLocked}
                                    value={langData.slug || ''}
                                    onChange={(e) => updateTranslation(locale, 'slug', e.target.value)}
                                    className={`w-full rounded-md border p-2 pr-10 text-sm outline-none transition-all font-mono ${slugError
                                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                        : isSlugLocked
                                            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'border-indigo-300 focus:ring-2 focus:ring-indigo-500 bg-white'
                                        }`}
                                />

                                <button
                                    type="button"
                                    onClick={() => handleToggleSlugLock(locale)}
                                    className={`absolute right-2 p-1.5 rounded-md transition-all ${isSlugLocked
                                        ? 'text-gray-400 hover:bg-gray-200'
                                        : 'text-indigo-600 bg-indigo-50 shadow-sm border border-indigo-100'
                                        }`}
                                >
                                    {isSlugLocked ? 'LOCK' : 'EDIT'}
                                </button>
                            </div>
                            {slugError && <MessageError>{slugError}</MessageError>}
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
                            <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleAiSuggestContent(locale)}
                                    disabled={aiSuggestingLocale === locale}
                                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${aiSuggestingLocale === locale
                                        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                                        : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                        }`}
                                >
                                    <Sparkles size={14} />
                                    {aiSuggestingLocale === locale
                                        ? (trans('hancms.catalog.product.ai.generating') || 'Generating...')
                                        : (trans('hancms.catalog.product.ai.suggest_content') || 'AI suggest content')}
                                </button>
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
                                    language: langCode,
                                    language_url: `/js/tinymce/langs/${langCode}.js`,
                                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'code', 'table', 'wordcount'],
                                    toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist | image code',
                                    file_picker_callback: (callback, value, meta) => {
                                        if (meta.filetype === 'image') {
                                            setTinyCallback(() => callback);
                                            setIsModalOpen(true);
                                        }
                                    }
                                }}
                                onEditorChange={(content) => updateTranslation(locale, 'content', content)}
                            />
                            {aiSuggestionError && <MessageError>{aiSuggestionError}</MessageError>}
                            {contentError && <MessageError>{contentError}</MessageError>}
                        </InputGroup>

                        <div className="bg-gray-100 p-5 rounded-xl border border-gray-200 space-y-6">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-indigo-900 font-bold uppercase">
                                    <Search size={16} /> {trans('hancms.seo.name') || "Search Engine Optimization"}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleAiSuggestSeo(locale)}
                                    disabled={aiSeoSuggestingLocale === locale}
                                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${aiSeoSuggestingLocale === locale
                                        ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                        }`}
                                >
                                    <Sparkles size={14} />
                                    {aiSeoSuggestingLocale === locale
                                        ? (trans('hancms.catalog.product.ai.generating') || 'Generating...')
                                        : (trans('hancms.catalog.product.ai.suggest_seo') || 'AI suggest SEO')}
                                </button>
                            </div>
                            {aiSeoSuggestionError && <MessageError>{aiSeoSuggestionError}</MessageError>}

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
                                    placeholder={trans('hancms.seo.placeholder.description') || "Mô tả ngắn gọn nội dung trang web..."}
                                />
                                {seoDescriptionError && <MessageError>{seoDescriptionError}</MessageError>}
                            </InputGroup>
                        </div>

                        <div className="mt-6 p-5 bg-gray-300 border border-gray-200 rounded-xl shadow-sm w-full font-sans">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                    <Globe size={14} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[12px] text-[#202124] leading-tight">{siteName}</span>
                                    <span className="text-[12px] text-green-700 leading-tight flex items-center gap-1">
                                        https://domain.com /{langData.slug || 'alias'}.html
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer font-normal leading-tight mb-1">
                                {langData.seo_title || langData.name || trans('hancms.seo.review.title')}
                            </h3>

                            <p className="text-[14px] text-[#4d5156] leading-relaxed line-clamp-2">
                                {langData.seo_description || trans('hancms.seo.review.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCategoriesTab = () => (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.35)] sm:p-6">
            <InputGroup label={trans('hancms.column.categories')} align="center">
                <CategoryMultiSelect
                    data={itemsCategoryActive || []}
                    value={selectedCategoryIds}
                    onChange={(ids) => setData('category_ids', ids)}
                    trans={trans}
                    error={errors?.category_ids}
                />
            </InputGroup>
        </div>
    );

    const renderPhotosTab = () => (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.35)] sm:p-6">
            <MultiUpload
                existingPhotos={existingPhotos}
                selectedFiles={selectedFiles}
                onFilesChange={(files) => setData('photos', files)}
                onExistingPhotosChange={setExistingPhotos}
                onDeleteExisting={(id) => {
                    setExistingPhotos((prev) => prev.filter((photo) => String(photo.id) !== String(id)));
                    const next = Array.isArray(data.delete_photo_ids) ? data.delete_photo_ids : [];
                    setData('delete_photo_ids', [...next, id]);
                    if (String(defaultPhotoId) === String(id)) {
                        setData('default_photo_id', null);
                    }
                }}
                defaultPhotoId={defaultPhotoId}
                onSetDefaultPhotoId={(id) => setData('default_photo_id', id)}
            />
            {errors?.photos && <MessageError>{errors.photos}</MessageError>}
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return renderGeneralTab();
            case 'content':
                return renderContentTab();
            case 'categories':
                return renderCategoriesTab();
            case 'photos':
                return renderPhotosTab();
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
                    form="product-form"
                >
                    {submitLabel}
                </SaveButton>
                <BackButton href={backHref}>
                    {trans('hancms.button.back')}
                </BackButton>
            </HeaderToolbar>

            <form id="product-form" onSubmit={onSubmit} noValidate className="text-sm">
                <Card title={trans('hancms.catalog.product.admin.name')} className="mb-6">
                    <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
                        <div className="flex flex-wrap gap-3 overflow-x-auto pb-1">
                            {['general', 'content', 'categories', 'photos'].map((id) => {
                                const errorInTab = hasTabError(id);
                                const active = activeTab === id;

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
                                        <span>{trans(`hancms.catalog.product.tabs.${id}`)}</span>
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

export default ProductFormView;
