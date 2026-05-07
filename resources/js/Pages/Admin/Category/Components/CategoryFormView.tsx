import React, { useEffect, useMemo, useState } from 'react';
import { Save, Globe, Search, Info, Layout, Lock, LockOpen, Languages, Sparkles, Plus } from 'lucide-react';
import { InputGroup } from "@/Components/Form/HancmsInput";
import MessageError from '@/Components/Form/MessageError';
import { Editor } from '@tinymce/tinymce-react';
import Card from '@/Components/Main/Card';
import { Link, usePage } from '@inertiajs/react';
import MediaLibraryModal from '@/Components/TinyMCE/MediaLibraryModal';
import SingleUpload from '@/Components/ImageUpload/SingleUpload';
import StatusSwitch from '@/Components/Status/StatusSwitch';
import axios from 'axios';
import CategorySelector from './CategorySelector';
import CategoryTypeSelector from './CategoryTypeSelector';
import CategoryProductsTab from './CategoryProductsTab';
import CategoryNewsTab from './CategoryNewsTab';
import { getLanguageByLocale } from '@/Pages/Admin/Product/productUtils';
import { quickStore as quickCreatePage } from '@/actions/App/Http/Controllers/Admin/PageManager/PageController';

const CategoryFormView = ({ data, setData, langList, trans, config_path, languageConfigPath, errors, langCode, itemsCategoryActive, itemsSelectedProducts = [], itemsSelectedNews = [], pages = [], pageSchemas = [] }: any) => {
    const [currentTab, setCurrentTab] = useState(langCode || 'vi');
    const [contentTab, setContentTab] = useState<'content' | 'products' | 'news'>('content');
    const [aiSeoSuggestingLocale, setAiSeoSuggestingLocale] = useState<string | null>(null);
    const [aiSeoSuggestionError, setAiSeoSuggestionError] = useState('');
    const { props }: any = usePage();
    const siteName = props.app_name || 'HanCMS Store';
    const [lockedTabs, setLockedTabs] = useState<Record<string, boolean>>({});
    const [pageOptions, setPageOptions] = useState<any[]>(pages || []);
    const [isQuickPageModalOpen, setIsQuickPageModalOpen] = useState(false);
    const [isQuickPageSaving, setIsQuickPageSaving] = useState(false);
    const [quickPageSchemaId, setQuickPageSchemaId] = useState<string | number>(pageSchemas[0]?.id || '');
    const [quickPageError, setQuickPageError] = useState('');
    const [quickPageTab, setQuickPageTab] = useState(langCode || langList[0]?.code || 'vi');
    const [quickPageSlugLocked, setQuickPageSlugLocked] = useState<Record<string, boolean>>({});
    const [quickPageTranslations, setQuickPageTranslations] = useState<Record<string, { name: string; slug: string }>>(
        (langList || []).reduce((carry: Record<string, { name: string; slug: string }>, lang: any) => {
            carry[lang.code] = { name: '', slug: '' };
            return carry;
        }, {})
    );
    const isLocked = (locale: string) => lockedTabs[locale] !== false;
    const toggleLock = (locale: string) => {
        setLockedTabs(prev => ({
            ...prev,
            [locale]: !isLocked(locale)
        }));
    };


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
    const quickCreateSlug = (str: string) => createSlug(str);

    const stripHtml = (html: string) => {
        let text = html.replace(/<[^>]*>/g, '');
        const doc = new DOMParser().parseFromString(text, 'text/html');
        text = doc.body.textContent || "";
        return text.replace(/\s+/g, ' ').trim();
    };
    const updateTranslation = (locale: string, field: string, value: any) => {
        setData((prev: any) => {
            const currentLangData = prev.translations?.[locale] || {};
            let updatedData = { ...currentLangData, [field]: value };
            if (field === 'name') {
                if (isLocked(locale)) {
                    updatedData.slug = createSlug(value);
                }
                if (!currentLangData.seo_title || currentLangData.seo_title === currentLangData.name) {
                    updatedData.seo_title = value;
                }
            }
            if (field === 'content') {
                if (!currentLangData.seo_description || currentLangData.seo_description.length < 5) {
                    const plainText = stripHtml(value);
                    updatedData.seo_description = plainText.substring(0, 160);
                }
            }
            return {
                ...prev,
                translations: {
                    ...(prev.translations || {}),
                    [locale]: updatedData
                }
            };
        });
    };

    const handleAiSuggestSeo = async (locale: string) => {
        const langData = data.translations?.[locale] || {};

        setAiSeoSuggestionError('');
        setAiSeoSuggestingLocale(locale);

        try {
            const response = await axios.post(route('category.ai.suggest-seo'), {
                locale,
                name: langData.name || '',
                content: langData.content || '',
                seo_keyword: langData.seo_keyword || '',
                current_seo_title: langData.seo_title || '',
                current_seo_description: langData.seo_description || '',
            });

            const seoTitle = String(response?.data?.seo_title || '').trim();
            const seoDescription = String(response?.data?.seo_description || '').trim();

            if (!seoTitle && !seoDescription) {
                setAiSeoSuggestionError(trans('hancms.catalog.category.ai.empty_response') || 'AI returned an empty response. Please try again.');
                return;
            }

            if (seoTitle) {
                updateTranslation(locale, 'seo_title', seoTitle);
            }

            if (seoDescription) {
                updateTranslation(locale, 'seo_description', seoDescription);
            }
        } catch (error: any) {
            setAiSeoSuggestionError(
                error?.response?.data?.message
                || trans('hancms.catalog.category.ai.failed')
                || 'Unable to generate AI SEO right now.'
            );
        } finally {
            setAiSeoSuggestingLocale(null);
        }
    };

    //Upload Image
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        data.photo ? `/${config_path['path']}/${data.photo}` : null
    );
    const [loading, setLoading] = useState(false);
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        setLoading(true);
        try {
            const response = await axios.post(route('category.upload'), formData);
            setPreviewUrl(response.data.url);
            setData('photo', response.data.file_name);
        } catch (error) {
            console.error("Upload lỗi:", error);
        } finally {
            setLoading(false);
        }
    };

    //Upload Image
    // Tiny MCE
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tinyCallback, setTinyCallback] = useState<any>(null);
    const handleSelectImage = (url: string) => {
        if (tinyCallback) {
            tinyCallback(url);
            setTinyCallback(null);
        }
        setIsModalOpen(false);
    };
    // Tiny MCE
    // Check Error Tab for Languages
    const hasLangError = (langCode: string) => {
        if (!errors) return false;
        return Object.keys(errors).some(key => key.startsWith(`translations.${langCode}.`));
    };
    // Check Error Tab for Languages
    const categoryTypes = [
        { value: '', label: trans('hancms.catalog.category.type.options.select') },
        { value: 'product', label: trans('hancms.catalog.category.type.options.product') },
        { value: 'news', label: trans('hancms.catalog.category.type.options.news') },
        // { value: 'blog', label: trans('hancms.catalog.category.type.options.blog') },
        { value: 'page', label: trans('hancms.catalog.category.type.options.page') },
        { value: 'contact', label: trans('hancms.catalog.category.type.options.contact') },
    ];
    const filteredParentCategories = (itemsCategoryActive || []).filter((category: any) => {
        const currentType = String(data.type || '').trim();
        if (!currentType) return false;
        return String(category.type || 'product') === String(currentType);
    });
    const contentRelationTab: 'products' | 'news' | null = data.type === 'product'
        ? 'products'
        : data.type === 'news'
            ? 'news'
            : null;
    const contentTabs: Array<{ id: 'content' | 'products' | 'news'; label: string }> = contentRelationTab
        ? [
            { id: 'content' as const, label: trans('hancms.column.content') },
            {
                id: contentRelationTab,
                label: contentRelationTab === 'products'
                    ? trans('hancms.catalog.product.name')
                    : trans('hancms.catalog.category.type.options.news') || 'Tin tức',
            },
        ]
        : [];
    const currentLanguage = getLanguageByLocale(langList, currentTab);
    const selectedPage = useMemo(
        () => pageOptions.find((page) => String(page.id) === String(data.page_id)) || null,
        [data.page_id, pageOptions]
    );

    useEffect(() => {
        if (contentRelationTab && contentTab !== 'content' && contentTab !== contentRelationTab) {
            setContentTab('content');
        }

        if (!contentRelationTab && contentTab !== 'content') {
            setContentTab('content');
        }
    }, [contentRelationTab, contentTab]);

    useEffect(() => {
        setPageOptions(pages || []);
    }, [pages]);

    useEffect(() => {
        if (!quickPageSchemaId && pageSchemas[0]) {
            setQuickPageSchemaId(pageSchemas[0].id);
        }
    }, [pageSchemas, quickPageSchemaId]);

    useEffect(() => {
        if (langList?.length && !langList.some((lang: any) => lang.code === quickPageTab) && langList[0]) {
            setQuickPageTab(langList[0].code);
        }
    }, [langList, quickPageTab, quickPageTranslations]);

    useEffect(() => {
        setQuickPageSlugLocked((current) => {
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
        setQuickPageTranslations((current) => {
            const next = { ...current };
            let changed = false;

            (langList || []).forEach((lang: any) => {
                if (!next[lang.code]) {
                    next[lang.code] = { name: '', slug: '' };
                    changed = true;
                }
            });

            return changed ? next : current;
        });
    }, [langList]);

    const updateQuickPageTranslation = (locale: string, field: 'name' | 'slug', value: string): void => {
        setQuickPageTranslations((current) => {
            const currentTranslation = current[locale] || { name: '', slug: '' };
            const nextTranslation = {
                ...currentTranslation,
                [field]: value,
            };

            if (field === 'name' && quickPageSlugLocked[locale] !== false) {
                nextTranslation.slug = quickCreateSlug(value);
            }

            return {
                ...current,
                [locale]: nextTranslation,
            };
        });
    };

    const toggleQuickPageLock = (locale: string): void => {
        setQuickPageSlugLocked((current) => ({
            ...current,
            [locale]: !current[locale],
        }));
    };

    const handleCreateQuickPage = async () => {
        const translations = (langList || []).reduce((carry: Record<string, { title: string; slug: string }>, lang: any) => {
            const currentTranslation = quickPageTranslations[lang.code] || { name: '', slug: '' };
            carry[lang.code] = {
                title: currentTranslation.name.trim(),
                slug: currentTranslation.slug.trim(),
            };
            return carry;
        }, {});

        const hasAnyTitle = Object.values(translations).some((translation) => Boolean(translation.title));

        if (!hasAnyTitle) {
            setQuickPageError(trans('hancms.catalog.category.quick_page_title_required'));
            return;
        }

        if (!quickPageSchemaId) {
            setQuickPageError(trans('hancms.catalog.category.quick_page_schema_required'));
            return;
        }

        setIsQuickPageSaving(true);
        setQuickPageError('');

        try {
            const response = await axios.post(quickCreatePage.url(), {
                translations,
                field_group_id: quickPageSchemaId,
                status: 1,
                content: {},
            });

            const createdPage = response?.data?.page;

            if (createdPage) {
                setPageOptions((current) => [createdPage, ...current.filter((page) => String(page.id) !== String(createdPage.id))]);
                setData('page_id', createdPage.id);
                setIsQuickPageModalOpen(false);
                setQuickPageTranslations((langList || []).reduce((carry: Record<string, { name: string; slug: string }>, lang: any) => {
                    carry[lang.code] = { name: '', slug: '' };
                    return carry;
                }, {}));
                setQuickPageSchemaId(pageSchemas[0]?.id || '');
            }
        } catch (error: any) {
            setQuickPageError(error?.response?.data?.message || trans('hancms.message.error.created'));
        } finally {
            setIsQuickPageSaving(false);
        }
    };

    const contentWarning = selectedPage && !selectedPage.has_content;
    return (
        <div className="animate-in fade-in duration-300">
            <Card title={trans('hancms.layout.tabs.general')} className='mb-6'>
                <div className="p-6 space-y-6 ">
                    <InputGroup label={trans('hancms.column.status')} align="center">
                        <StatusSwitch
                            value={data.status}
                            onChange={(value) => setData('status', value)}
                            activeLabel={trans('hancms.status.active')}
                            inactiveLabel={trans('hancms.status.inactive')}
                        />
                    </InputGroup>

                    <InputGroup label={trans('hancms.catalog.category.name')}>
                        <CategorySelector
                            data={filteredParentCategories}
                            value={data.parent_id}
                            error={errors.parent_id}
                            onChange={(val: any) => setData('parent_id', val)}
                            trans={trans}
                        />
                    </InputGroup>
                    <InputGroup label={trans('hancms.catalog.category.type.label')}>
                        <CategoryTypeSelector
                            value={data.type || ''}
                            onChange={(nextType) => {
                                setData((prev: any) => ({
                                    ...prev,
                                    type: nextType,
                                    parent_id: 0,
                                }));
                            }}
                            options={categoryTypes}
                            placeholder={trans('hancms.catalog.category.type.options.select')}
                        />
                        {errors?.type && <MessageError>{errors.type}</MessageError>}
                    </InputGroup>
                    <InputGroup label={trans('hancms.catalog.category.page')}>
                        <div className="flex gap-2">
                            <select
                                value={data.page_id ?? ''}
                                onChange={(event) => setData('page_id', event.target.value ? Number(event.target.value) : '')}
                                className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value="">{trans('hancms.placeholder.select')}</option>
                                {pageOptions.map((page: any) => (
                                    <option key={page.id} value={page.id}>
                                        {page.name || page.label || page.title || page.schema_title}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => {
                                    setQuickPageError('');
                                    setIsQuickPageModalOpen(true);
                                }}
                                className="inline-flex items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                            >
                                <Plus size={14} />
                                {trans('hancms.catalog.category.quick_create_page')}
                            </button>
                        </div>
                        {errors?.page_id && <MessageError>{errors.page_id}</MessageError>}
                        {contentWarning ? (
                            <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                                <div>{trans('hancms.catalog.category.page_no_content_warning')}</div>
                                <Link
                                    href={selectedPage.edit_url}
                                    className="mt-2 inline-flex rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700"
                                >
                                    {trans('hancms.catalog.category.page_input_content')}
                                </Link>
                            </div>
                        ) : null}
                    </InputGroup>
                    <InputGroup label={trans('hancms.column.image')} className='items-center'>
                        <SingleUpload
                            previewUrl={previewUrl}
                            loading={loading}
                            handleFileChange={handleFileChange}
                        />
                    </InputGroup>
                </div>
            </Card>
            <Card title={trans('hancms.layout.tabs.content')}>
                <div className="space-y-6 p-6">
                    {contentTabs.length > 1 ? (
                        <div className="flex flex-wrap gap-2 border-b pb-4">
                            {contentTabs.map((tab) => {
                                const active = contentTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setContentTab(tab.id)}
                                        className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                                            active
                                                ? 'bg-slate-950 text-white shadow-sm'
                                                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    ) : null}

                    {contentTab === 'content' || !contentRelationTab ? (
                        <>
                            <div className="flex gap-3 mb-6 border-b pb-6 pl-1 overflow-x-auto">
                                {langList.map((lang: any) => {
                                    const errorInTab = hasLangError(lang.code);
                                    return (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => setCurrentTab(lang.code)}
                                            className={`p-4 rounded-md text-[12px] font-black uppercase transition-all flex items-center gap-2 border-2
                                                    ${currentTab === lang.code
                                                    ? 'bg-indigo-800 text-white shadow-lg scale-105 border-indigo-800'
                                                    : errorInTab
                                                        ? 'bg-red-50 text-red-600 border-red-300 animate-pulse shadow-sm'
                                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border-transparent'
                                                }`}
                                        >
                                            <img src={`/${languageConfigPath.path}/${lang.photo}`} className="w-4 h-4 rounded-full object-cover" alt={lang.name} />
                                            {lang.name}
                                            {errorInTab && (
                                                <span className="relative flex h-2 w-2 ml-1">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600 border border-white"></span>
                                                </span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            <InputGroup label={trans('hancms.column.name')}>
                                <input
                                    type="text"
                                    value={data.translations?.[currentTab]?.name || ''}
                                    onChange={(e) => updateTranslation(currentTab, 'name', e.target.value)}
                                    className={`w-full border rounded-md p-2 text-sm outline-none transition-all ${errors?.[`translations.${currentTab}.name`]
                                        ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
                                        }`}
                                />
                                {errors?.[`translations.${currentTab}.name`] && <MessageError>{errors[`translations.${currentTab}.name`]}</MessageError>}
                            </InputGroup>

                            <InputGroup label={trans('hancms.seo.slug') || "Slug / URL (SEO)"}>
                                <div className="relative flex items-center group">
                                    <input
                                        type="text"
                                        readOnly={isLocked(currentTab)}
                                        value={data.translations?.[currentTab]?.slug || ''}
                                        onChange={(e) => updateTranslation(currentTab, 'slug', e.target.value)}
                                        className={`w-full border rounded-md p-2 pr-10 text-sm outline-none transition-all font-mono ${errors?.[`translations.${currentTab}.slug`]
                                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                            : isLocked(currentTab)
                                                ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'border-indigo-300 focus:ring-2 focus:ring-indigo-500 bg-white'
                                            }`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => toggleLock(currentTab)}
                                        className={`absolute right-2 p-1.5 rounded-md transition-all ${isLocked(currentTab)
                                            ? 'text-gray-400 hover:bg-gray-200'
                                            : 'text-indigo-600 bg-indigo-50 shadow-sm border border-indigo-100'
                                            }`}
                                    >
                                        {isLocked(currentTab) ? <Lock size={14} /> : <LockOpen size={14} />}
                                    </button>
                                </div>

                                {errors?.[`translations.${currentTab}.slug`] && (
                                    <div className="mt-1">
                                        <MessageError>{errors[`translations.${currentTab}.slug`]}</MessageError>
                                    </div>
                                )}

                                {!isLocked(currentTab) && !errors?.[`translations.${currentTab}.slug`] && (
                                    <p className="text-[10px] text-amber-600 mt-1 italic font-medium">
                                        {trans('hancms.message.edit_slug') || "* Đang cho phép sửa tay Slug của ngôn ngữ này."}
                                    </p>
                                )}
                            </InputGroup>

                            <InputGroup label={trans('hancms.column.content')}>
                                <Editor
                                    tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                                    licenseKey="gpl"
                                    value={data.translations?.[currentTab]?.content || ''}
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
                                    onEditorChange={(content) => updateTranslation(currentTab, 'content', content)}
                                />
                            </InputGroup>
                            <br />
                            <div className="bg-gray-100 p-5 rounded-xl border border-gray-200 space-y-6">
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-indigo-900 font-bold uppercase">
                                        <Search size={16} /> {trans('hancms.seo.name') || "Search Engine Optimization"}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleAiSuggestSeo(currentTab)}
                                        disabled={aiSeoSuggestingLocale === currentTab}
                                        className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Sparkles size={14} />
                                        {aiSeoSuggestingLocale === currentTab
                                            ? (trans('hancms.catalog.category.ai.generating') || 'Generating...')
                                            : (trans('hancms.catalog.category.ai.suggest_seo') || 'AI suggest SEO')}
                                    </button>
                                </div>
                                {aiSeoSuggestionError && <MessageError>{aiSeoSuggestionError}</MessageError>}
                                <InputGroup
                                    label={
                                        <div className="flex justify-between items-end w-full">
                                            <span>{trans('hancms.seo.field.title') || "Seo Title"}</span>
                                            <span className={`text-[10px] font-mono ${data.translations?.[currentTab]?.seo_title?.length > 60 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                                {data.translations?.[currentTab]?.seo_title?.length || 0}/60 {trans('hancms.seo.character') || "character"}
                                            </span>
                                        </div>
                                    }
                                >
                                    <input
                                        type="text"
                                        value={data.translations?.[currentTab]?.seo_title || ''}
                                        onChange={(e) => updateTranslation(currentTab, 'seo_title', e.target.value)}
                                        className="w-full border-gray-300 rounded-md p-2 text-sm"
                                    />
                                </InputGroup>
                                <InputGroup label={trans('hancms.seo.field.keyword') || "SEO Keywords"}>
                                    <textarea
                                        rows={3}
                                        value={data.translations?.[currentTab]?.seo_keyword || ''}
                                        onChange={(e) => updateTranslation(currentTab, 'seo_keyword', e.target.value)}
                                        className="w-full border-gray-300 rounded-md p-2 text-sm"
                                    />
                                </InputGroup>
                                <InputGroup
                                    label={
                                        <div className="flex justify-between items-end w-full">
                                            <span>{trans('hancms.seo.field.description') || "SEO Description"}</span>
                                            <span className={`text-[10px] font-mono ${data.translations?.[currentTab]?.seo_description?.length > 160 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                                {data.translations?.[currentTab]?.seo_description?.length || 0}/160 {trans('hancms.seo.character') || "character"}
                                            </span>
                                        </div>
                                    }
                                >
                                    <textarea
                                        rows={3}
                                        value={data.translations?.[currentTab]?.seo_description || ''}
                                        onChange={(e) => updateTranslation(currentTab, 'seo_description', e.target.value)}
                                        className={`w-full border rounded-md p-2 text-sm outline-none transition-all ${data.translations?.[currentTab]?.seo_description?.length > 160 ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
                                            }`}
                                        placeholder={trans('hancms.seo.placeholder.description') || "Mô tả ngắn gọn nội dung trang web..."}
                                    />
                                    {data.translations?.[currentTab]?.seo_description?.length > 160 && (
                                        <p className="text-[10px] text-red-500 mt-1 italic"> {trans('hancms.seo.message.description') || "* Nội dung quá dài sẽ bị Google cắt bớt khi hiển thị."}</p>
                                    )}
                                </InputGroup>
                            </div>
                        </>
                    ) : contentRelationTab === 'products' ? (
                        <CategoryProductsTab
                            data={data}
                            setData={setData}
                            errors={errors}
                            itemsSelectedProducts={itemsSelectedProducts}
                            trans={trans}
                            langCode={currentTab}
                            currentLanguage={currentLanguage}
                        />
                    ) : (
                        <CategoryNewsTab
                            data={data}
                            itemsSelectedNews={itemsSelectedNews}
                            trans={trans}
                        />
                    )}

                </div>
            </Card>
            <div className="mt-6 p-5 bg-gray-300 border border-gray-200 rounded-xl shadow-sm w-full font-sans">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <Globe size={14} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[12px] text-[#202124] leading-tight">{siteName}</span>
                        <span className="text-[12px] text-green-700 leading-tight flex items-center gap-1">
                            https://domain.com /{data.translations?.[currentTab]?.slug || 'alias'}.html
                        </span>
                    </div>
                </div>

                <h3 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer font-normal leading-tight mb-1">
                    {data.translations?.[currentTab]?.seo_title || data.translations?.[currentTab]?.name || trans('hancms.seo.review.title')}
                </h3>

                <p className="text-[14px] text-[#4d5156] leading-relaxed line-clamp-2">
                    {data.translations?.[currentTab]?.seo_description || trans('hancms.seo.review.description')}
                </p>
            </div>
            {isQuickPageModalOpen ? (
                <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setIsQuickPageModalOpen(false)} />
                    <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <h3 className="text-base font-semibold text-slate-900">{trans('hancms.catalog.category.quick_create_page')}</h3>
                        </div>
                        <div className="space-y-4 px-5 py-5">
                            {quickPageError ? <MessageError>{quickPageError}</MessageError> : null}
                            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                                {langList.map((lang: any) => {
                                    const active = quickPageTab === lang.code;
                                    return (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => setQuickPageTab(lang.code)}
                                            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                                                active
                                                    ? 'bg-slate-900 text-white'
                                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <img src={`/${languageConfigPath.path}/${lang.photo}`} className="h-4 w-4 rounded-full object-cover" alt={lang.name} />
                                            <span>{lang.name}</span>
                                            <span className="uppercase opacity-70">{lang.code}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <InputGroup label={trans('hancms.column.name')}>
                                <input
                                    type="text"
                                    value={quickPageTranslations[quickPageTab]?.name || ''}
                                    onChange={(event) => updateQuickPageTranslation(quickPageTab, 'name', event.target.value)}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </InputGroup>
                            <InputGroup className="hidden" label={trans('hancms.seo.slug') || 'Slug'}>
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        readOnly={quickPageSlugLocked[quickPageTab] !== false}
                                        value={quickPageTranslations[quickPageTab]?.slug || ''}
                                        onChange={(event) => updateQuickPageTranslation(quickPageTab, 'slug', event.target.value)}
                                        className={`w-full rounded-md border px-3 py-2 pr-14 text-sm outline-none transition-all font-mono ${
                                            quickPageSlugLocked[quickPageTab] !== false
                                                ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400'
                                                : 'border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => toggleQuickPageLock(quickPageTab)}
                                        className={`absolute right-2 rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                                            quickPageSlugLocked[quickPageTab] !== false
                                                ? 'border border-gray-200 bg-white text-gray-400 hover:bg-gray-100'
                                                : 'border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                        }`}
                                    >
                                        {quickPageSlugLocked[quickPageTab] !== false ? 'LOCK' : 'EDIT'}
                                    </button>
                                </div>
                            </InputGroup>
                        <InputGroup label={trans('hancms.content.field_design')}>
                                <select
                                    value={quickPageSchemaId}
                                    onChange={(event) => setQuickPageSchemaId(event.target.value ? Number(event.target.value) : '')}
                                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                >
                                    <option value="">{trans('hancms.placeholder.select')}</option>
                                    {pageSchemas.map((schema: any) => (
                                        <option key={schema.id} value={schema.id}>
                                            {schema.title}
                                        </option>
                                    ))}
                                </select>
                            </InputGroup>
                        </div>
                        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
                            <button
                                type="button"
                                onClick={() => setIsQuickPageModalOpen(false)}
                                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                {trans('hancms.button.cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateQuickPage}
                                disabled={isQuickPageSaving}
                                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isQuickPageSaving ? '...' : trans('hancms.catalog.category.quick_create_page')}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
            <MediaLibraryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectImage}
            />
        </div>

    )
}

export default CategoryFormView;
