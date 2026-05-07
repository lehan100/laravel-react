import React, { useState } from 'react';
import { InputGroup } from "@/Components/Form/HancmsInput";
import axios from "axios";
import { Editor } from '@tinymce/tinymce-react';
import SingleUpload from "@/Components/ImageUpload/SingleUpload";
import { usePage } from '@inertiajs/react';
import MessageError from '@/Components/Form/MessageError';

const ContentTab = ({ data, setData, langList, trans, config_path, errors }: any) => {
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [previewUrls, setPreviewUrls] = useState<Record<string, string | null>>({});
    const [activeLocale, setActiveLocale] = useState<string>(langList?.[0]?.code || 'vi');
    const { props } = usePage();
    const currentLang = (props.locale as string) || 'vi';
    const editorLangCode = (currentLang === 'vn') ? 'vi' : currentLang;
    const updateTranslation = (locale: string, field: string, value: any) => {
        setData((prev: any) => {
            const currentLangData = prev.translations?.[locale] || {};
            let updatedData = { ...currentLangData, [field]: value };
            return {
                ...prev,
                translations: {
                    ...(prev.translations || {}),
                    [locale]: updatedData
                }
            };
        });
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>, locale: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const localUrl = URL.createObjectURL(file);
        setPreviewUrls(prev => ({ ...prev, [locale]: localUrl }));

        const formData = new FormData();
        formData.append('photo', file);
        setLoadingStates(prev => ({ ...prev, [locale]: true }));
        try {
            const response = await axios.post(route('photo.upload'), formData);

            updateTranslation(locale, 'photo', response.data.file_name);
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setLoadingStates(prev => ({ ...prev, [locale]: false }));
        }
    };

    React.useEffect(() => {
        if (!langList?.some((lang: any) => lang.code === activeLocale) && langList?.[0]?.code) {
            setActiveLocale(langList[0].code);
        }
    }, [activeLocale, langList]);

    const activeLanguageData = data.translations?.[activeLocale] || {};
    const activeNameError = errors?.[`translations.${activeLocale}.name`];
    const activeContentError = errors?.[`translations.${activeLocale}.content`];
    const activeImageError = errors?.[`translations.${activeLocale}.photo`];

    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_30px_-24px_rgba(15,23,42,0.35)]">
                <div className="flex flex-wrap gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
                    {langList.map((lang: any) => {
                        const active = activeLocale === lang.code;
                        const errorInTab = Object.keys(errors || {}).some((key) => key.startsWith(`translations.${lang.code}.`));

                        return (
                            <button
                                key={lang.code}
                                type="button"
                                onClick={() => setActiveLocale(lang.code)}
                                className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-[12px] font-black uppercase transition-all ${active
                                    ? 'bg-indigo-900 text-white shadow-lg border-indigo-900 scale-105'
                                    : errorInTab
                                        ? 'border-red-300 bg-red-50 text-red-600 shadow-sm'
                                        : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                <img
                                    src={`/${config_path.path}/${lang.photo}`}
                                    className="h-4 w-4 rounded-full object-cover"
                                    alt={lang.name}
                                />
                                {lang.name}
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

                <div className="space-y-5 p-5 sm:p-6">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                        <InputGroup label={trans('hancms.column.name')}>
                            <input
                                type="text"
                                value={activeLanguageData.name || ''}
                                onChange={(e) => updateTranslation(activeLocale, 'name', e.target.value)}
                                className={`w-full rounded-2xl border bg-white p-3 text-sm outline-none transition-all ${activeNameError
                                    ? 'border-rose-400 ring-4 ring-rose-100'
                                    : 'border-slate-200 focus:border-slate-300 focus:ring-4 focus:ring-slate-200'
                                    }`}
                            />
                            {activeNameError && <MessageError>{activeNameError}</MessageError>}
                        </InputGroup>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                        <InputGroup label={trans('hancms.column.image')}>
                            <SingleUpload
                                id={`upload-${activeLocale}`}
                                key={`upload-${activeLocale}-${previewUrls[activeLocale] || activeLanguageData.photo || ''}`}
                                previewUrl={
                                    previewUrls[activeLocale]
                                        ? previewUrls[activeLocale]
                                        : (activeLanguageData.photo ? `/media/photo/${activeLanguageData.photo}` : null)
                                }
                                loading={loadingStates[activeLocale] || false}
                                handleFileChange={(e: any) => handleBannerUpload(e, activeLocale)}
                                width='w-auto min-w-20'
                            />
                            {activeImageError && <MessageError>{activeImageError}</MessageError>}
                        </InputGroup>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                        <InputGroup label={trans('hancms.column.content')}>
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <Editor
                                    key={`editor-${editorLangCode}`}
                                    tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                                    licenseKey="gpl"
                                    value={activeLanguageData.content || ''}
                                    init={{
                                        height: 350,
                                        menubar: false,
                                        branding: false,
                                        promotion: false,
                                        document_base_url: '/',
                                        convert_urls: true,
                                        remove_script_host: true,
                                        relative_urls: false,
                                        language: editorLangCode,
                                        language_url: `/js/tinymce/langs/${editorLangCode}.js`,
                                        plugins: ['advlist', 'autolink', 'lists', 'link', 'code'],
                                        toolbar: 'undo redo | blocks | bold italic underline | bullist numlist | link | code | removeformat',
                                    }}
                                    onEditorChange={(content) => updateTranslation(activeLocale, 'content', content)}
                                />
                            </div>
                            {activeContentError && <MessageError>{activeContentError}</MessageError>}
                        </InputGroup>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ContentTab;
