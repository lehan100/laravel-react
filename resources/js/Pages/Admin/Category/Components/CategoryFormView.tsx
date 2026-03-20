import React, { useState } from 'react';
import { Save, Globe, Search, Info, Layout, Lock, LockOpen, Languages } from 'lucide-react';
import { InputGroup } from "@/Components/Form/HancmsInput";
import MessageError from '@/Components/Form/MessageError';
import { Editor } from '@tinymce/tinymce-react';
import Card from '@/Components/Main/Card';
import { usePage } from '@inertiajs/react';
import MediaLibraryModal from '@/Components/TinyMCE/MediaLibraryModal';
import SingleUpload from '@/Components/ImageUpload/SingleUpload';
import axios from 'axios';
import CategorySelector from './CategorySelector';

const CategoryFormView = ({ data, setData, langList, trans, config_path, languageConfigPath, errors, langCode, itemsCategoryActive }: any) => {
    const [currentTab, setCurrentTab] = useState(langList[0]?.code || 'vi');
    const { props }: any = usePage();
    const siteName = props.app_name || 'HanCMS Store';
    const [lockedTabs, setLockedTabs] = useState<Record<string, boolean>>({});
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
    return (
        <div className="animate-in fade-in duration-300">
            <Card title={trans('hancms.layout.tabs.general')} className='mb-6'>
                <div className="p-6 space-y-6 ">
                    <InputGroup label={trans('hancms.column.status')} align="center">
                        <div className="flex items-center gap-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={data.status === 1}
                                    onChange={(e) => setData('status', e.target.checked ? 1 : 0)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-700">
                                    {data.status === 1 ? trans('hancms.status.active') : trans('hancms.status.inactive')}
                                </span>
                            </label>
                        </div>
                    </InputGroup>
                    <InputGroup label={trans('hancms.catalog.category.name')}>
                        <CategorySelector
                            data={itemsCategoryActive}
                            value={data.parent_id}
                            error={errors.parent_id}
                            onChange={(val: any) => setData('parent_id', val)}
                            trans={trans}
                        />
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
                        <div className="flex items-center gap-2 text-indigo-900 font-bold uppercase mb-2">
                            <Search size={16} /> {trans('hancms.seo.name') || "Search Engine Optimization"}
                        </div>
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
            <MediaLibraryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelectImage}
            />
        </div>

    )
}

export default CategoryFormView;
