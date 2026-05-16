import { useEffect, useMemo, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Plus, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import MediaLibraryModal from '@/Components/TinyMCE/MediaLibraryModal';
import { resolveMediaUrl } from '@/Components/Common/mediaUrl';

export type PageFieldType = 'text' | 'image' | 'textarea' | 'editorMCE' | 'relation_new' | 'product' | 'banner_position';

export type PageFieldSchema = {
    key: string;
    label: string;
    type: PageFieldType;
    translatable: boolean;
    required: boolean;
};

export type PageLocale = {
    code: string;
    name: string;
    photo?: string;
};

type PageFormData = {
    title: string;
    slug: string;
    status: boolean;
    field_group: {
        title: string;
        status: boolean;
        fields: PageFieldSchema[];
    };
    content: Record<string, Record<string, any>>;
};

type Props = {
    title: string;
    backHref: string;
    submitLabel: string;
    data: PageFormData;
    setData: (key: keyof PageFormData | string, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    languages: PageLocale[];
    posts: Array<{ id: number; label: string; slug?: string; name?: string }>;
    products: Array<{ id: number; label: string }>;
    bannerPositions: Array<{ id: number; name: string; code?: string }>;
    trans: (key: string, replace?: Record<string, any>) => string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

function buildLocaleKey(locale: string, fieldKey: string): string {
    return `${locale}.${fieldKey}`;
}

function cloneContent(content: Record<string, Record<string, any>>): Record<string, Record<string, any>> {
    return Object.keys(content || {}).reduce<Record<string, Record<string, any>>>((carry, locale) => {
        carry[locale] = { ...(content[locale] || {}) };
        return carry;
    }, {});
}

function PageFormView({
    title,
    backHref,
    submitLabel,
    data,
    setData,
    errors,
    processing,
    languages,
    posts,
    products,
    bannerPositions,
    trans,
    onSubmit,
}: Props) {
    const [activeLocale, setActiveLocale] = useState(languages[0]?.code || 'vi');
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
    const [imageTarget, setImageTarget] = useState<{ locale: string; key: string } | null>(null);

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

    const fieldTypeOptions = useMemo(
        () => [
            { value: 'text', label: trans('hancms.page.field_types.text') },
            { value: 'image', label: trans('hancms.page.field_types.image') },
            { value: 'textarea', label: trans('hancms.page.field_types.textarea') },
            { value: 'editorMCE', label: trans('hancms.page.field_types.editor') },
            { value: 'relation_new', label: trans('hancms.page.field_types.relation_new') },
            { value: 'product', label: trans('hancms.page.field_types.product') },
            { value: 'banner_position', label: trans('hancms.page.field_types.banner_position') },
        ],
        [trans]
    );

    useEffect(() => {
        if (!languages.length) {
            return;
        }

        if (!languages.some((language) => language.code === activeLocale)) {
            setActiveLocale(languages[0].code);
        }
    }, [activeLocale, languages]);

    useEffect(() => {
        const nextContent = cloneContent(data.content || {});

        languages.forEach((language) => {
            if (!nextContent[language.code]) {
                nextContent[language.code] = {};
            }

            data.field_group.fields.forEach((field) => {
                if (field.key && typeof nextContent[language.code][field.key] === 'undefined') {
                    nextContent[language.code][field.key] = field.type === 'image' ? '' : '';
                }
            });
        });

        const nextLocales = Object.keys(nextContent);
        const currentLocales = Object.keys(data.content || {});

        if (
            nextLocales.length !== currentLocales.length ||
            nextLocales.some((locale) => JSON.stringify(nextContent[locale]) !== JSON.stringify((data.content || {})[locale] || {}))
        ) {
            setData('content', nextContent);
        }
    }, [data.content, data.field_group.fields, languages, setData]);

    const updateTitle = (value: string): void => {
        setData('title', value);

        if (!data.slug) {
            setData('slug', value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    };

    const updateField = (index: number, patch: Partial<PageFieldSchema>): void => {
        const nextFields = data.field_group.fields.map((field, fieldIndex) => {
            if (fieldIndex !== index) {
                return field;
            }

            const nextField = { ...field, ...patch };

            if (patch.key && patch.key !== field.key) {
                const nextContent = cloneContent(data.content || {});

                Object.keys(nextContent).forEach((locale) => {
                    nextContent[locale][patch.key as string] = nextContent[locale][field.key];
                    delete nextContent[locale][field.key];
                });

                setData('content', nextContent);
            }

            return nextField;
        });

        setData('field_group', { ...data.field_group, fields: nextFields });
    };

    const addField = (): void => {
        const nextIndex = data.field_group.fields.length + 1;
        const key = `field_${nextIndex}`;

        const nextFields = [
            ...data.field_group.fields,
            {
                key,
                label: '',
                type: 'text' as PageFieldType,
                translatable: true,
                required: true,
            },
        ];

        const nextContent = cloneContent(data.content || {});
        languages.forEach((language) => {
            nextContent[language.code] = {
                ...(nextContent[language.code] || {}),
                [key]: '',
            };
        });

        setData('field_group', { ...data.field_group, fields: nextFields });
        setData('content', nextContent);
    };

    const removeField = (index: number): void => {
        const removedField = data.field_group.fields[index];
        const nextFields = data.field_group.fields.filter((_, fieldIndex) => fieldIndex !== index);
        const nextContent = cloneContent(data.content || {});

        Object.keys(nextContent).forEach((locale) => {
            delete nextContent[locale][removedField?.key];
        });

        setData('field_group', { ...data.field_group, fields: nextFields });
        setData('content', nextContent);
    };

    const updateContentValue = (locale: string, key: string, value: any): void => {
        const nextContent = cloneContent(data.content || {});
        nextContent[locale] = {
            ...(nextContent[locale] || {}),
            [key]: value,
        };
        setData('content', nextContent);
    };

    const handleImageSelected = (url: string): void => {
        if (!imageTarget) {
            return;
        }

        updateContentValue(imageTarget.locale, imageTarget.key, resolveMediaUrl(url) ?? url);
        setImageTarget(null);
        setIsImagePickerOpen(false);
    };

    const renderFieldInput = (field: PageFieldSchema, locale: string) => {
        const value = data.content?.[locale]?.[field.key] ?? '';
        const errorKey = `content.${locale}.${field.key}`;
        const fieldError = errors[errorKey];
        const baseInputClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

        if (field.type === 'textarea') {
            return (
                <div key={buildLocaleKey(locale, field.key)}>
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
                <div key={buildLocaleKey(locale, field.key)}>
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
            const imageSrc = resolveMediaUrl(value);

            return (
                <div key={buildLocaleKey(locale, field.key)}>
                    <label className="text-sm font-semibold text-slate-700">{field.label || field.key}</label>
                    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-3">
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                            {imageSrc ? (
                                <img src={imageSrc} alt={field.label || field.key} className="h-full w-full object-cover" />
                            ) : (
                                <ImageIcon className="h-7 w-7 text-slate-300" />
                            )}
                        </div>
                        <div className="flex-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setImageTarget({ locale, key: field.key });
                                    setIsImagePickerOpen(true);
                                }}
                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
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
            return (
                <div key={buildLocaleKey(locale, field.key)}>
                    <label className="text-sm font-semibold text-slate-700">{field.label || field.key}</label>
                    <select
                        value={value}
                        onChange={(event) => updateContentValue(locale, field.key, event.target.value)}
                        className={baseInputClass}
                    >
                        <option value="">{trans('hancms.placeholder.select')}</option>
                        {posts.map((post) => (
                            <option key={post.id} value={post.id}>
                                {post.label || post.name || post.slug || `#${post.id}`}
                            </option>
                        ))}
                    </select>
                    {fieldError ? <p className="mt-1 text-xs text-red-500">{fieldError}</p> : null}
                </div>
            );
        }

        if (field.type === 'product') {
            return (
                <div key={buildLocaleKey(locale, field.key)}>
                    <label className="text-sm font-semibold text-slate-700">{field.label || field.key}</label>
                    <select
                        value={value}
                        onChange={(event) => updateContentValue(locale, field.key, event.target.value)}
                        className={baseInputClass}
                    >
                        <option value="">{trans('hancms.placeholder.select')}</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.label || `#${product.id}`}
                            </option>
                        ))}
                    </select>
                    {fieldError ? <p className="mt-1 text-xs text-red-500">{fieldError}</p> : null}
                </div>
            );
        }

        if (field.type === 'banner_position') {
            return (
                <div key={buildLocaleKey(locale, field.key)}>
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
            <div key={buildLocaleKey(locale, field.key)}>
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
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">{title}</h1>
                    <p className="mt-1 text-sm text-slate-500">{trans('hancms.page.subtitle')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <a href={backHref} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                        <ArrowLeft className="h-4 w-4" />
                        {trans('hancms.button.back')}
                    </a>
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitLabel}
                    </button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                <section className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">{trans('hancms.title.infomation')}</h2>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">{trans('hancms.page.page_title')}</label>
                                <input
                                    value={data.title}
                                    onChange={(event) => updateTitle(event.target.value)}
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                                {errors.title ? <p className="mt-1 text-xs text-red-500">{errors.title}</p> : null}
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">{trans('hancms.column.slug')}</label>
                                <input
                                    value={data.slug}
                                    onChange={(event) => setData('slug', event.target.value)}
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                                {errors.slug ? <p className="mt-1 text-xs text-red-500">{errors.slug}</p> : null}
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700">{trans('hancms.page.group_title')}</label>
                                <input
                                    value={data.field_group.title}
                                    onChange={(event) => setData('field_group', { ...data.field_group, title: event.target.value })}
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                                {errors['field_group.title'] ? <p className="mt-1 text-xs text-red-500">{errors['field_group.title']}</p> : null}
                            </div>
                            <div className="flex items-end">
                                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={data.status}
                                        onChange={(event) => setData('status', event.target.checked)}
                                    />
                                    {trans('hancms.status.active')}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">{trans('hancms.page.field_builder')}</h2>
                                <p className="mt-1 text-sm text-slate-500">{trans('hancms.page.field_builder_note')}</p>
                            </div>
                            <button
                                type="button"
                                onClick={addField}
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                            >
                                <Plus className="h-4 w-4" />
                                {trans('hancms.page.add_field')}
                            </button>
                        </div>

                        <div className="mt-4 space-y-4">
                            {data.field_group.fields.map((field, index) => (
                                <div key={`${field.key}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="grid gap-4 md:grid-cols-4">
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.key')}</label>
                                            <input
                                                value={field.key}
                                                onChange={(event) => updateField(index, { key: event.target.value })}
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500"
                                            />
                                            {errors[`field_group.fields.${index}.key`] ? <p className="mt-1 text-xs text-red-500">{errors[`field_group.fields.${index}.key`]}</p> : null}
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.name')}</label>
                                            <input
                                                value={field.label}
                                                onChange={(event) => updateField(index, { label: event.target.value })}
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500"
                                            />
                                            {errors[`field_group.fields.${index}.label`] ? <p className="mt-1 text-xs text-red-500">{errors[`field_group.fields.${index}.label`]}</p> : null}
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.type')}</label>
                                            <select
                                                value={field.type}
                                                onChange={(event) => updateField(index, { type: event.target.value as PageFieldType })}
                                                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500"
                                            >
                                                {fieldTypeOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-end justify-end gap-4">
                                            <button
                                                type="button"
                                                onClick={() => removeField(index)}
                                                className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                {trans('hancms.button.delete')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <aside className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900">{trans('hancms.page.content')}</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {languages.map((language) => (
                                <button
                                    key={language.code}
                                    type="button"
                                    onClick={() => setActiveLocale(language.code)}
                                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
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
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700">{trans('hancms.page.select_schema_hint')}</label>
                            </div>
                            {(languages.find((language) => language.code === activeLocale) ? [languages.find((language) => language.code === activeLocale)!] : languages).map((language) => (
                                <div key={language.code} className="space-y-4">
                                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                            {renderLanguageBadge(language)}
                                            <span>{language.name}</span>
                                            <span className="text-xs uppercase text-slate-500">{language.code}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {data.field_group.fields.map((field) => renderFieldInput(field, language.code))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
        </form>
    );
}

export default PageFormView;
