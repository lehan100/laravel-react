import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Editor } from '@tinymce/tinymce-react';
import { Image as ImageIcon, Save } from 'lucide-react';
import BackButton from '@/Components/Button/BackButton';
import SaveButton from '@/Components/Button/SaveButton';
import Card from '@/Components/Main/Card';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import MediaLibraryModal from '@/Components/TinyMCE/MediaLibraryModal';
import StatusBadge from '@/Components/Status/StatusBadge';

type PageFieldType = 'text' | 'image' | 'textarea' | 'editorMCE' | 'relation_new' | 'product' | 'banner_position';

type PageFieldSchema = {
    key: string;
    label: string;
    type: PageFieldType;
    translatable: boolean;
    required: boolean;
};

type FieldGroupOption = {
    id: number;
    title: string;
    fields_schema?: PageFieldSchema[];
    pages_count?: number;
};

type PageLocale = {
    code: string;
    name: string;
    photo?: string;
};

type PickerItem = {
    id: number;
    label?: string;
    name?: string;
    sku?: string;
    type?: string;
    price?: number;
    quantity?: number | string;
    status?: number | boolean;
};

type ValueFormData = {
    status: boolean;
    field_group_id: number | string;
    translations: Record<string, {
        title: string;
        slug: string;
    }>;
    content: Record<string, Record<string, any>>;
};

type Props = {
    title: string;
    backHref: string;
    submitLabel: string;
    data: ValueFormData;
    setData: (key: keyof ValueFormData | string, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    undo: number;
    handleUndo: (status: number) => void;
    languages: PageLocale[];
    fieldGroups: FieldGroupOption[];
    posts: PickerItem[];
    products: PickerItem[];
    bannerPositions: Array<{ id: number; name: string; code?: string }>;
    trans: (key: string, replace?: Record<string, any>) => string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    allowFieldGroupChange?: boolean;
};

function cloneContent(content: Record<string, Record<string, any>>): Record<string, Record<string, any>> {
    return Object.keys(content || {}).reduce<Record<string, Record<string, any>>>((carry, locale) => {
        carry[locale] = { ...(content[locale] || {}) };
        return carry;
    }, {});
}

function createSlug(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/(\s+)/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function hasContentChanged(
    current: Record<string, Record<string, any>>,
    next: Record<string, Record<string, any>>
): boolean {
    return JSON.stringify(current || {}) !== JSON.stringify(next || {});
}

function getSelectedValues(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.map((item) => String(item));
    }

    if (value === null || typeof value === 'undefined' || value === '') {
        return [];
    }

    return [String(value)];
}

function getSelectedIds(value: unknown): number[] {
    return getSelectedValues(value)
        .map((item) => Number(item))
        .filter((item) => !Number.isNaN(item));
}

export default function PageValueFormView({
    title,
    backHref,
    submitLabel,
    data,
    setData,
    errors,
    processing,
    undo,
    handleUndo,
    languages,
    fieldGroups,
    posts,
    products,
    bannerPositions,
    trans,
    onSubmit,
    allowFieldGroupChange = false,
}: Props) {
    const [activeLocale, setActiveLocale] = useState(languages[0]?.code || 'vi');
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
    const [imageTarget, setImageTarget] = useState<{ locale: string; key: string } | null>(null);
    const [pickerTarget, setPickerTarget] = useState<{ locale: string; key: string; type: 'product' | 'post' } | null>(null);
    const [pickerSearch, setPickerSearch] = useState('');
    const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
    const [slugLocked, setSlugLocked] = useState<Record<string, boolean>>(
        languages.reduce<Record<string, boolean>>((carry, language) => {
            carry[language.code] = true;
            return carry;
        }, {})
    );
    const [selectedFieldGroupId, setSelectedFieldGroupId] = useState<string | number>(
        data.field_group_id || ''
    );

    const selectedFieldGroup = useMemo(
        () => fieldGroups.find((fieldGroup) => String(fieldGroup.id) === String(selectedFieldGroupId)) || null,
        [fieldGroups, selectedFieldGroupId]
    );
    const previewOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    const activeTranslation = data.translations?.[activeLocale] || { title: '', slug: '' };
    const previewSlug = createSlug(activeTranslation.slug || activeTranslation.title || '') || 'alias';
    const previewPath = previewOrigin ? `${previewOrigin}/${previewSlug}` : `/${previewSlug}`;

    const translatableFields = useMemo(
        () => selectedFieldGroup?.fields_schema?.filter((field) => field.translatable) || [],
        [selectedFieldGroup]
    );
    const sharedFields = useMemo(
        () => selectedFieldGroup?.fields_schema?.filter((field) => !field.translatable) || [],
        [selectedFieldGroup]
    );
    const sharedLocale = languages[0]?.code || activeLocale;

    const renderLanguageBadge = (language: PageLocale) => {
        if (language.photo) {
            return (
                <img
                    src={`/media/photo/${language.photo}`}
                    className="h-4 w-4 rounded-full object-cover"
                    alt={language.name}
                />
            );
        }

        return (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[9px] font-black uppercase text-slate-600">
                {language.code.slice(0, 2)}
            </span>
        );
    };

    useEffect(() => {
        if (!languages.some((language) => language.code === activeLocale) && languages[0]) {
            setActiveLocale(languages[0].code);
        }
    }, [activeLocale, languages]);

    useEffect(() => {
        setSlugLocked((current) => {
            const next = { ...current };
            let changed = false;

            languages.forEach((language) => {
                if (typeof next[language.code] === 'undefined') {
                    next[language.code] = true;
                    changed = true;
                }
            });

            return changed ? next : current;
        });
    }, [languages]);

    useEffect(() => {
        if (!selectedFieldGroup) {
            return;
        }

        const nextContent = cloneContent(data.content || {});
        const nextTranslations = { ...(data.translations || {}) };
        let contentChanged = false;
        let translationsChanged = false;

        languages.forEach((language) => {
            if (!nextContent[language.code]) {
                nextContent[language.code] = {};
                contentChanged = true;
            }

            if (!nextTranslations[language.code]) {
                nextTranslations[language.code] = {
                    title: '',
                    slug: '',
                };
                translationsChanged = true;
            }

            selectedFieldGroup.fields_schema?.forEach((field) => {
                if (typeof nextContent[language.code][field.key] === 'undefined') {
                    nextContent[language.code][field.key] = field.type === 'relation_new' ? [] : '';
                    contentChanged = true;
                }
            });
        });

        if (String(data.field_group_id) !== String(selectedFieldGroup.id)) {
            setData('field_group_id', selectedFieldGroup.id);
        }

        if (contentChanged || hasContentChanged(data.content || {}, nextContent)) {
            setData('content', nextContent);
        }

        if (translationsChanged) {
            setData('translations', nextTranslations);
        }
    }, [data.field_group_id, data.content, data.translations, languages, selectedFieldGroup, setData]);

    const updateContentValue = (locale: string, key: string, value: any): void => {
        const nextContent = cloneContent(data.content || {});
        const isSharedField = selectedFieldGroup?.fields_schema?.some((field) => field.key === key && !field.translatable);

        if (isSharedField) {
            languages.forEach((language) => {
                nextContent[language.code] = {
                    ...(nextContent[language.code] || {}),
                    [key]: value,
                };
            });

            setData('content', nextContent);

            return;
        }

        nextContent[locale] = {
            ...(nextContent[locale] || {}),
            [key]: value,
        };
        setData('content', nextContent);
    };

    const updatePageTranslation = (locale: string, field: 'title' | 'slug', value: string): void => {
        const nextTranslations = { ...(data.translations || {}) };
        const currentTranslation = nextTranslations[locale] || { title: '', slug: '' };

        nextTranslations[locale] = {
            ...currentTranslation,
            [field]: value,
        };

        if (field === 'title' && slugLocked[locale]) {
            nextTranslations[locale].slug = createSlug(value);
        }

        setData('translations', nextTranslations);
    };

    const toggleSlugLock = (locale: string): void => {
        setSlugLocked((current) => ({
            ...current,
            [locale]: !current[locale],
        }));
    };

    const handleImageSelected = (url: string): void => {
        if (!imageTarget) {
            return;
        }

        updateContentValue(imageTarget.locale, imageTarget.key, url);
        setImageTarget(null);
        setIsImagePickerOpen(false);
    };

    const openItemPicker = (field: PageFieldSchema, locale: string, type: 'product' | 'post'): void => {
        setPickerTarget({ locale, key: field.key, type });
        setTempSelectedIds(getSelectedIds(data.content?.[locale]?.[field.key]));
        setPickerSearch('');
    };

    const closeItemPicker = (): void => {
        setPickerTarget(null);
        setTempSelectedIds([]);
        setPickerSearch('');
    };

    const confirmItemPicker = (): void => {
        if (!pickerTarget) {
            return;
        }

        updateContentValue(pickerTarget.locale, pickerTarget.key, tempSelectedIds);
        closeItemPicker();
    };

    const toggleTempItem = (id: number): void => {
        setTempSelectedIds((current) => (
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        ));
    };

    const removeSelectedItem = (locale: string, key: string, id: number): void => {
        updateContentValue(locale, key, getSelectedIds(data.content?.[locale]?.[key]).filter((item) => item !== id));
    };

    const getPickerItems = (type: 'product' | 'post'): PickerItem[] => (type === 'product' ? products : posts);

    const formatPrice = (price: number | undefined): string => {
        if (typeof price === 'undefined' || Number.isNaN(Number(price))) {
            return '-';
        }

        return Number(price).toLocaleString();
    };

    const renderSelectedItemsTable = (field: PageFieldSchema, locale: string, type: 'product' | 'post') => {
        const items = getPickerItems(type);
        const selectedIds = getSelectedIds(data.content?.[locale]?.[field.key]);
        const selectedRows = selectedIds
            .map((id) => items.find((item) => Number(item.id) === id))
            .filter(Boolean) as PickerItem[];
        const fieldError = errors[`content.${locale}.${field.key}`];
        const isProduct = type === 'product';

        return (
            <div key={`${locale}-${field.key}`}>
                <label className="text-sm font-semibold text-slate-700">{field.label || field.key}</label>
                <div className="mt-2 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-500">
                            {selectedRows.length} {isProduct ? trans('hancms.catalog.category.type.options.product') : trans('hancms.catalog.post.name')}
                        </span>
                        <button
                            type="button"
                            onClick={() => openItemPicker(field, locale, type)}
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
                                    {isProduct ? <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.sku')}</th> : null}
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.name')}</th>
                                    {isProduct ? <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.price')}</th> : null}
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.status')}</th>
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {!selectedRows.length ? (
                                    <tr>
                                        <td colSpan={isProduct ? 6 : 4} className="px-3 py-6 text-center text-slate-400">
                                            {trans('hancms.placeholder.select')}
                                        </td>
                                    </tr>
                                ) : selectedRows.map((row) => (
                                    <tr key={row.id}>
                                        <td className="px-3 py-2">{row.id}</td>
                                        {isProduct ? <td className="px-3 py-2">{row.sku || `#${row.id}`}</td> : null}
                                        <td className="px-3 py-2">{row.name || row.label || `#${row.id}`}</td>
                                        {isProduct ? <td className="px-3 py-2">{formatPrice(row.price)}</td> : null}
                                        <td className="px-3 py-2">
                                            <StatusBadge
                                                value={row.status ?? true}
                                                activeLabel={trans('hancms.status.active')}
                                                inactiveLabel={trans('hancms.status.inactive')}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <button
                                                type="button"
                                                onClick={() => removeSelectedItem(locale, field.key, row.id)}
                                                className="rounded-md border border-rose-300 px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                            >
                                                {trans('hancms.button.delete')}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {fieldError ? <p className="mt-1 text-xs text-red-500">{fieldError}</p> : null}
                </div>
            </div>
        );
    };

    const renderFieldInput = (field: PageFieldSchema, locale: string) => {
        const value = data.content?.[locale]?.[field.key] ?? (field.type === 'relation_new' ? [] : '');
        const errorKey = `content.${locale}.${field.key}`;
        const fieldError = errors[errorKey];
        const baseInputClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

        if (field.type === 'textarea') {
            return (
                <div key={`${locale}-${field.key}`}>
                    <label className="text-sm font-semibold text-slate-700">{field.label || field.key}</label>
                    <textarea
                        value={value}
                        onChange={(event) => updateContentValue(locale, field.key, event.target.value)}
                        rows={4}
                        className={baseInputClass}
                    />
                    {fieldError ? <p className="mt-1 text-xs text-red-500">{fieldError}</p> : null}
                </div>
            );
        }

        if (field.type === 'editorMCE') {
            return (
                <div key={`${locale}-${field.key}`}>
                    <label className="text-sm font-semibold text-slate-700">{field.label || field.key}</label>
                    <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <Editor
                            tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                            licenseKey="gpl"
                            value={value || ''}
                            init={{
                                height: 320,
                                menubar: false,
                                branding: false,
                                promotion: false,
                                document_base_url: '/',
                                convert_urls: true,
                                remove_script_host: true,
                                relative_urls: false,
                                language: locale,
                                language_url: `/js/tinymce/langs/${locale}.js`,
                                plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'code', 'table', 'wordcount'],
                                toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist | image code',
                                file_picker_callback: (callback, _value, meta) => {
                                    if (meta.filetype === 'image') {
                                        setImageTarget({ locale, key: field.key });
                                        setIsImagePickerOpen(true);
                                    }
                                    void callback;
                                },
                            }}
                            onEditorChange={(content) => updateContentValue(locale, field.key, content)}
                        />
                    </div>
                    {fieldError ? <p className="mt-1 text-xs text-red-500">{fieldError}</p> : null}
                </div>
            );
        }

        if (field.type === 'image') {
            return (
                <div key={`${locale}-${field.key}`}>
                    <label className="text-sm font-semibold text-slate-700">{field.label || field.key}</label>
                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-3">
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                            {value ? (
                                <img src={value} alt={field.label || field.key} className="h-full w-full object-cover" />
                            ) : (
                                <ImageIcon className="h-7 w-7 text-slate-300" />
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                value={value}
                                onChange={(event) => updateContentValue(locale, field.key, event.target.value)}
                                className={baseInputClass}
                                placeholder="/media/..."
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImageTarget({ locale, key: field.key });
                                    setIsImagePickerOpen(true);
                                }}
                                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                            >
                                <ImageIcon className="h-4 w-4" />
                                {trans('hancms.page.pick_image')}
                            </button>
                        </div>
                    </div>
                    {fieldError ? <p className="mt-1 text-xs text-red-500">{fieldError}</p> : null}
                </div>
            );
        }

        if (field.type === 'relation_new') {
            return renderSelectedItemsTable(field, locale, 'post');
        }

        if (field.type === 'product') {
            return renderSelectedItemsTable(field, locale, 'product');
        }

        if (field.type === 'banner_position') {
            return (
                <div key={`${locale}-${field.key}`}>
                    <label className="text-sm font-semibold text-slate-700">{field.label || field.key}</label>
                    <select
                        value={value}
                        onChange={(event) => updateContentValue(locale, field.key, event.target.value)}
                        className={baseInputClass}
                    >
                        <option value="">{trans('hancms.placeholder.select')}</option>
                        {bannerPositions.map((position) => (
                            <option key={position.id} value={position.id}>
                                {position.name} {position.code ? `(${position.code})` : ''}
                            </option>
                        ))}
                    </select>
                    {fieldError ? <p className="mt-1 text-xs text-red-500">{fieldError}</p> : null}
                </div>
            );
        }

        return (
            <div key={`${locale}-${field.key}`}>
                <label className="text-sm font-semibold text-slate-700">{field.label || field.key}</label>
                <input
                    value={value}
                    onChange={(event) => updateContentValue(locale, field.key, event.target.value)}
                    className={baseInputClass}
                />
                {fieldError ? <p className="mt-1 text-xs text-red-500">{fieldError}</p> : null}
            </div>
        );
    };

    return (
        <div>
            <HeaderToolbar title={title}>
                <SaveButton
                    loading={processing}
                    undo={undo}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form="page-value-form"
                >
                        {submitLabel}
                </SaveButton>
                <BackButton href={backHref}>{trans('hancms.button.back')}</BackButton>
            </HeaderToolbar>

            <form id="page-value-form" onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <section className="space-y-6">
                    <Card title={trans('hancms.page.locale_title')} contentClassName="overflow-visible">
                        <div className="space-y-4 p-6">
                            <div className="flex flex-wrap gap-2">
                                {languages.map((language) => (
                                    <button
                                        key={language.code}
                                        type="button"
                                        onClick={() => setActiveLocale(language.code)}
                                        className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                                            activeLocale === language.code
                                                ? 'bg-slate-900 text-white'
                                                : 'border border-slate-200 bg-white text-slate-600'
                                        }`}
                                    >
                                        {renderLanguageBadge(language)}
                                        <span>{language.name}</span>
                                        <span className="uppercase opacity-70">{language.code}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">{trans('hancms.column.name')}</label>
                                    <input
                                        value={data.translations?.[activeLocale]?.title || ''}
                                        onChange={(event) => updatePageTranslation(activeLocale, 'title', event.target.value)}
                                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                    {errors[`translations.${activeLocale}.title`] ? <p className="mt-1 text-xs text-red-500">{errors[`translations.${activeLocale}.title`]}</p> : null}
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-700">{trans('hancms.column.slug')}</label>
                                    <div className="relative flex items-center group mt-2">
                                        <input
                                            value={data.translations?.[activeLocale]?.slug || ''}
                                            readOnly={slugLocked[activeLocale]}
                                            onChange={(event) => updatePageTranslation(activeLocale, 'slug', event.target.value)}
                                            className={`w-full rounded-xl border px-3 py-2 pr-14 text-sm outline-none transition font-mono ${
                                                errors[`translations.${activeLocale}.slug`]
                                                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                                    : slugLocked[activeLocale]
                                                        ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                                                        : 'border-indigo-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => toggleSlugLock(activeLocale)}
                                            className={`absolute right-2 rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                                                slugLocked[activeLocale]
                                                    ? 'border border-slate-200 bg-white text-slate-400 hover:bg-slate-100'
                                                    : 'border border-indigo-100 bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                            }`}
                                        >
                                            {slugLocked[activeLocale] ? 'LOCK' : 'EDIT'}
                                        </button>
                                    </div>
                                    <div className="mt-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2">
                                        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                            {trans('hancms.page.slug_preview')}
                                        </div>
                                        <div className="mt-1 break-all font-mono text-xs text-slate-700">
                                            {previewPath}
                                        </div>
                                    </div>
                                    {errors[`translations.${activeLocale}.slug`] ? <p className="mt-1 text-xs text-red-500">{errors[`translations.${activeLocale}.slug`]}</p> : null}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {sharedFields.length ? (
                        <Card title={trans('hancms.page.shared_fields')} contentClassName="overflow-visible">
                            <div className="space-y-4 p-6">
                                <p className="text-sm text-slate-500">{trans('hancms.page.shared_fields_note')}</p>
                                {sharedFields.map((field) => renderFieldInput(field, sharedLocale))}
                            </div>
                        </Card>
                    ) : null}

                    <Card title={trans('hancms.page.content')} contentClassName="overflow-visible">
                        <div className="space-y-6 p-6">
                            <div className="flex flex-wrap gap-2">
                                {languages.map((language) => (
                                    <button
                                        key={language.code}
                                        type="button"
                                        onClick={() => setActiveLocale(language.code)}
                                        className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                                            activeLocale === language.code
                                                ? 'bg-slate-900 text-white'
                                                : 'border border-slate-200 bg-white text-slate-600'
                                        }`}
                                    >
                                        {renderLanguageBadge(language)}
                                        <span>{language.name}</span>
                                        <span className="uppercase opacity-70">{language.code}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                            {translatableFields.map((field) => renderFieldInput(field, activeLocale))}
                            {!translatableFields.length ? (
                                <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                    {trans('hancms.message.nodata')}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    </Card>
                </section>

                <aside className="space-y-4">
                    <Card title={trans('hancms.title.infomation')} contentClassName="overflow-visible">
                        <div className="space-y-4 p-5 text-sm">
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    {trans('hancms.content.field_design')}
                                </div>
                                {allowFieldGroupChange ? (
                                    <>
                                        <select
                                            value={selectedFieldGroupId}
                                            onChange={(event) => setSelectedFieldGroupId(event.target.value)}
                                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                        >
                                            <option value="">{trans('hancms.placeholder.select')}</option>
                                            {fieldGroups.map((fieldGroup) => (
                                                <option key={fieldGroup.id} value={fieldGroup.id}>
                                                    {fieldGroup.title}
                                                    {typeof fieldGroup.pages_count !== 'undefined'
                                                        ? ` (${fieldGroup.pages_count} ${trans('hancms.page.page_count')})`
                                                        : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-2 text-xs text-slate-500">
                                            {trans('hancms.page.select_schema_hint')}
                                        </p>
                                    </>
                                ) : (
                                    <div className="mt-2 space-y-1 font-semibold text-slate-900">
                                        <div>{selectedFieldGroup?.title || '-'}</div>
                                        <div className="text-xs font-medium text-slate-500">
                                            {typeof selectedFieldGroup?.pages_count !== 'undefined'
                                                ? `${selectedFieldGroup?.pages_count || 0} ${trans('hancms.page.page_count')}`
                                                : ''}
                                        </div>
                                    </div>
                                )}
                            </div>


                            <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        {trans('hancms.column.status')}
                                    </div>
                                    <div className="text-sm font-semibold text-slate-900">{trans('hancms.status.active')}</div>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={Boolean(data.status)}
                                    onChange={(event) => setData('status', event.target.checked)}
                                    className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                            </label>
                        </div>
                    </Card>
                </aside>
            </div>

            <MediaLibraryModal
                isOpen={isImagePickerOpen}
                onClose={() => {
                    setImageTarget(null);
                    setIsImagePickerOpen(false);
                }}
                onSelect={handleImageSelected}
            />
            {pickerTarget && createPortal(
                <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 py-6">
                    <div className="absolute inset-0 bg-black/40" onClick={closeItemPicker} />
                    <div className="relative z-10 flex max-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
                            <h3 className="text-base font-semibold text-slate-900">
                                {pickerTarget.type === 'product' ? trans('hancms.catalog.category.type.options.product') : trans('hancms.catalog.post.name')}
                            </h3>
                            <button type="button" className="text-slate-500 hover:text-slate-700" onClick={closeItemPicker}>x</button>
                        </div>
                        <div className="min-h-0 flex-1 space-y-3 overflow-auto p-5">
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                placeholder={trans('hancms.filter.search')}
                                value={pickerSearch}
                                onChange={(event) => setPickerSearch(event.target.value)}
                            />
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="w-14 px-3 py-2 text-left font-semibold text-slate-600">#</th>
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">ID</th>
                                    {pickerTarget.type === 'product' ? <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.sku')}</th> : null}
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.name')}</th>
                                    {pickerTarget.type === 'product' ? <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.price')}</th> : null}
                                    {pickerTarget.type === 'product' ? <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.quantity')}</th> : null}
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.status')}</th>
                                </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {getPickerItems(pickerTarget.type)
                                            .filter((row) => {
                                                const keyword = pickerSearch.trim().toLowerCase();

                                                if (!keyword) {
                                                    return true;
                                                }

                                                return [
                                                    row.id,
                                                    row.sku,
                                                    row.name,
                                                    row.label,
                                                    row.type,
                                                ].some((value) => String(value || '').toLowerCase().includes(keyword));
                                            })
                                            .map((row) => (
                                                <tr key={row.id}>
                                                    <td className="px-3 py-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={tempSelectedIds.includes(row.id)}
                                                            onChange={() => toggleTempItem(row.id)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">{row.id}</td>
                                                    {pickerTarget.type === 'product' ? <td className="px-3 py-2">{row.sku || `#${row.id}`}</td> : null}
                                                    <td className="px-3 py-2">{row.name || row.label || `#${row.id}`}</td>
                                                    {pickerTarget.type === 'product' ? <td className="px-3 py-2">{formatPrice(row.price)}</td> : null}
                                                    {pickerTarget.type === 'product' ? <td className="px-3 py-2">{row.quantity ?? '-'}</td> : null}
                                                    <td className="px-3 py-2">
                                                        <StatusBadge
                                                            value={row.status ?? true}
                                                            activeLabel={trans('hancms.status.active')}
                                                            inactiveLabel={trans('hancms.status.inactive')}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
                            <button
                                type="button"
                                onClick={closeItemPicker}
                                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                {trans('hancms.button.cancel')}
                            </button>
                            <button
                                type="button"
                                onClick={confirmItemPicker}
                                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                            >
                                {trans('hancms.button.confirm')}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </form>
        </div>
    );
}
