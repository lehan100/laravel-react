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
    console.log(data);

    const updateTranslation = (locale: string, field: string, value: any) => {
        setData((prev: any) => ({
            ...prev,
            translations: {
                ...(prev.translations || {}),
                [locale]: {
                    ...(prev.translations?.[locale] || {}),
                    [field]: value
                }
            }
        }));
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
                    <div key={`tab-content-${locale}`} className="p-5 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-200 mb-4 text-xs font-bold text-indigo-900 uppercase">
                            <img
                                src={`/${config_path.path}/${lang.photo}`}
                                className="w-5 h-5 rounded-sm object-cover"
                                alt={lang.name}
                            />
                            <span>{lang.name}</span>
                        </div>

                        <InputGroup label={trans('hancms.column.name')}>
                            <input
                                type="text"
                                value={langData.name || ''}
                                onChange={(e) => updateTranslation(locale, 'name', e.target.value)}
                                className={`w-full border rounded-md p-2 text-sm outline-none transition-all ${nameError
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                    : 'border-gray-300 focus:ring-2 focus:ring-indigo-500'
                                    }`}
                            />
                            {nameError && <MessageError>{nameError}</MessageError>}
                        </InputGroup>

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

                        <InputGroup label={trans('hancms.column.content')}>
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
                        </InputGroup>
                    </div>
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
