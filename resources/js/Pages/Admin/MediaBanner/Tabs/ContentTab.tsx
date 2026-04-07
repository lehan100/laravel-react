import React, { useState, useCallback } from 'react';
import { InputGroup } from "@/Components/Form/HancmsInput";
import axios from "axios";
import { Editor } from '@tinymce/tinymce-react';
import MediaLibraryModal from '@/Components/TinyMCE/MediaLibraryModal';
import SingleUpload from "@/Components/ImageUpload/SingleUpload";
import { usePage } from '@inertiajs/react';
import MessageError from '@/Components/Form/MessageError';

const ContentTab = ({ data, setData, langList, trans, config_path, errors }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tinyCallback, setTinyCallback] = useState<any>(null);
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [previewUrls, setPreviewUrls] = useState<Record<string, string | null>>({});
    const { props } = usePage();
    const currentLang = (props.locale as string) || 'vi';
    const langCode = (currentLang === 'vn') ? 'vi' : (currentLang || 'vi');
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

    const handleSelectImage = (url: string) => {
        if (tinyCallback) {
            tinyCallback(url);
            setTinyCallback(null);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {langList.map((lang: any) => {
                const locale = lang.code;
                const langData = data.translations?.[locale] || {};

                const bannerPreview = previewUrls[locale]
                    ? previewUrls[locale]
                    : (langData.photo ? `/media/photo/${langData.photo}` : null);

                const nameError = errors?.[`translations.${locale}.name`];

                return (
                    <section key={`tab-content-${locale}`} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_14px_30px_-24px_rgba(15,23,42,0.35)]">
                        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-gradient-to-r from-slate-950 to-slate-800 px-4 py-3 text-white sm:px-5">
                            <div className="flex items-center gap-3">
                                <img
                                    src={`/${config_path.path}/${lang.photo}`}
                                    className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/20"
                                    alt={lang.name}
                                />
                                <div>
                                    <div className="text-[11px] uppercase tracking-[0.28em] text-white/60">Locale</div>
                                    <div className="text-sm font-semibold leading-5">{lang.name}</div>
                                </div>
                            </div>
                            <div className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                                {locale}
                            </div>
                        </div>

                        <div className="space-y-5 p-5 sm:p-6">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                                <InputGroup label={trans('hancms.column.name')}>
                                    <input
                                        type="text"
                                        value={langData.name || ''}
                                        onChange={(e) => updateTranslation(locale, 'name', e.target.value)}
                                        className={`w-full rounded-2xl border bg-white p-3 text-sm outline-none transition-all ${nameError
                                            ? 'border-rose-400 ring-4 ring-rose-100'
                                            : 'border-slate-200 focus:border-slate-300 focus:ring-4 focus:ring-slate-200'
                                            }`}
                                    />
                                    {nameError && <MessageError>{nameError}</MessageError>}
                                </InputGroup>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                                <InputGroup label={trans('hancms.column.image')}>
                                    <SingleUpload
                                        id={`upload-${locale}`}
                                        key={`upload-${locale}-${bannerPreview}`}
                                        previewUrl={bannerPreview}
                                        loading={loadingStates[locale] || false}
                                        handleFileChange={(e: any) => handleBannerUpload(e, locale)}
                                        width='w-auto min-w-20'
                                    />
                                </InputGroup>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                                <InputGroup label={trans('hancms.column.content')}>
                                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                        <Editor
                                            tinymceScriptSrc="/js/tinymce/tinymce.min.js"
                                            licenseKey="gpl"
                                            value={langData.content || ''}
                                            init={{
                                                height: 350,
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
                                    </div>
                                </InputGroup>
                            </div>
                        </div>
                    </section>
                );
            })}

            <MediaLibraryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectImage}
            />
        </div>
    );
};

export default ContentTab;
