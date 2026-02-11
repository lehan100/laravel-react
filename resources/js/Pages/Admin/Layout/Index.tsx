import CountryInput from "@/Components/Form/CountryInput";
import { useTrans } from "@/Hooks/useTrans";
import MainLayout from "@/Layouts/MainLayout";
import { usePage, useForm } from "@inertiajs/react";
import { Language } from '@/types';
import React, { useState, useMemo } from 'react';
import { InputGroup } from "@/Components/Form/HancmsInput";
import SaveButton from '@/Components/Button/SaveButton';
import { ImagePlus, Loader2, Save } from "lucide-react";
import axios from "axios";
const HomeTab = ({ langs, data, setData, trans, layout_items_home }: any) => {
    const itemEntries = layout_items_home ? Object.entries(layout_items_home) : [];
    const [previews, setPreviews] = useState<Record<string, string>>({});
    const [loadingField, setLoadingField] = useState<string | null>(null);
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        setLoadingField(fieldKey); // Chỉ loading đúng ô đang upload
        try {
            const response = await axios.post(route('photo.upload'), formData);

            setPreviews(prev => ({ ...prev, [fieldKey]: response.data.url }));

            const newValue = response.data.file_name;
            const updatedPages = langs.data.reduce((acc: any, row: any) => {
                const code = row.code;
                const oldLangData = data.pages?.[code] || {};
                acc[code] = {
                    ...(typeof oldLangData === 'object' ? oldLangData : {}),
                    [fieldKey]: newValue
                };
                return acc;
            }, { ...data.pages });

            setData('pages', updatedPages);
        } catch (error) {
            console.error("Upload lỗi:", error);
        } finally {
            setLoadingField(null);
        }
    };
    const renderUploadField = (fieldKey: string) => {
        const currentPreview = previews[fieldKey] || data.pages?.[langs.data[0]?.code]?.[fieldKey];
        const isLoading = loadingField === fieldKey;
        const urlReview = currentPreview?.includes('/temp/') ? currentPreview : `/media/photo/${currentPreview}`;
        return (
            <InputGroup label={trans(`hancms.layout.items.${fieldKey}`)} align='center'>
                <div className="relative group">
                    <input
                        type="file"
                        id={`file-${fieldKey}`}
                        hidden
                        onChange={(e) => handleFileChange(e, fieldKey)}
                        accept="image/*"
                    />
                    <label
                        htmlFor={`file-${fieldKey}`}
                        className={`flex flex-col items-center justify-center w-20 h-20 p-1 border-2 border-dashed rounded-lg cursor-pointer transition-all overflow-hidden
                        ${currentPreview ? 'border-indigo-400' : 'border-gray-300 hover:border-indigo-500 bg-gray-50'}`}
                    >
                        {isLoading ? (
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        ) : currentPreview ? (
                            <img src={urlReview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-500">
                                <ImagePlus size={32} />
                                <span className="text-[10px] mt-1 uppercase font-semibold">Upload</span>
                            </div>
                        )}
                    </label>
                </div>
            </InputGroup>
        );
    };
    return (
        <div className="space-y-4">
            {renderUploadField('logo')}
            {renderUploadField('favicon')}
            {itemEntries.map(([fieldKey, fieldConfig]: [string, any]) => {

                return (
                    <InputGroup key={fieldKey} label={trans(`hancms.layout.items.${fieldKey}`) || fieldConfig.name} align='center' className='border border-gray-200 p-4 pt-6 bg-gray-50 rounded-lg'>
                        {langs.data.map((row: any) => {
                            const langCode = row.code;
                            const langName = row.name;
                            const langData = data.pages?.[langCode];

                            const cellValue = (typeof langData === 'object' && langData !== null)
                                ? (langData[fieldKey] || '')
                                : '';
                            return (
                                <CountryInput
                                    key={`${langCode}-${fieldKey}`}
                                    photo={row.photo}
                                    value={cellValue}
                                    isTextArea={fieldConfig.is_textarea}
                                    placeholder={`${trans(`hancms.layout.items.${fieldKey}`)} (${langName})`}
                                    onChange={(e: any) => {
                                        const newValue = e.target.value;
                                        setData('pages', {
                                            ...data.pages,
                                            [langCode]: {
                                                ...(typeof langData === 'object' ? langData : {}),
                                                [fieldKey]: newValue
                                            }
                                        });
                                    }}
                                />
                            );
                        })}
                    </InputGroup>
                )
            })}

        </div>
    )
};
const GeneralTab = ({ langs, data, setData, trans, layout_items_general }: any) => {
    const itemEntries = layout_items_general ? Object.entries(layout_items_general) : [];
    return (
        <div className="space-y-4">
            {itemEntries.map(([fieldKey, fieldConfig]: [string, any]) => {
                return (
                    <InputGroup key={fieldKey} label={trans(`hancms.layout.items.${fieldKey}`) || fieldConfig.name} align='center' className='border border-gray-200 p-4 pt-6 bg-gray-50 rounded-lg'>
                        {langs.data.map((row: any) => {
                            const langCode = row.code;
                            const langName = row.name;
                            const langData = data.pages?.[langCode];

                            const cellValue = (typeof langData === 'object' && langData !== null)
                                ? (langData[fieldKey] || '')
                                : '';
                            return (
                                <CountryInput
                                    key={`${langCode}-${fieldKey}`}
                                    photo={row.photo}
                                    value={cellValue}
                                    isTextArea={fieldConfig.is_textarea}
                                    placeholder={`${trans(`hancms.layout.items.${fieldKey}`)} (${langName})`}
                                    onChange={(e: any) => {
                                        const newValue = e.target.value;
                                        setData('pages', {
                                            ...data.pages,
                                            [langCode]: {
                                                ...(typeof langData === 'object' ? langData : {}),
                                                [fieldKey]: newValue
                                            }
                                        });
                                    }}
                                />
                            );
                        })}
                    </InputGroup>
                )
            })}

        </div>
    )
};
function IndexPage() {
    const { trans } = useTrans();
    const { langs, pages, layout_items_home, layout_items_general }: any = usePage().props;
    const initialPages = useMemo(() => {
        const basePages = (pages && typeof pages === 'object' && !Array.isArray(pages)) ? pages : {};
        //const itemKeys = layout_items_home ? Object.keys(layout_items_home) : [];
        const itemKeys = [
            ...Object.keys(layout_items_home || {}),
            ...Object.keys(layout_items_general || {}), // Nếu có thêm tab khác
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

    // 2. Truyền initialPages vào useForm
    const { data, setData, post, processing } = useForm({
        pages: initialPages,
        undo: 0,
    });
    console.log(data.pages);

    const [activeTab, setActiveTab] = useState('home');
    const [undo, setUndo] = useState(0);
    const handleUndo = (status: number) => {
        setUndo(status);
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'home':
                return <HomeTab langs={langs} data={data} layout_items_home={layout_items_home} setData={setData} trans={trans} />
            case 'general':
                return <GeneralTab langs={langs} data={data} layout_items_general={layout_items_general} setData={setData} trans={trans} />
            default:
                return null;
        }
    };
    function handleSubmit(e: any) {
        e.preventDefault();
        e.stopPropagation();
        post(route('layout.store'), {
            onSuccess: () => {
                alert(trans('hancms.message.success.edit', { name: trans('hancms.layout.name') }));
            }
        });
    }
    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div className="w-full md:flex-1 mb-3 md:mb-0">
                    <h1 className="text-xl font-bold text-gray-800">{trans('hancms.layout.admin.name')}</h1>
                </div>
                <div className="w-full md:w-auto">
                    <div className="flex gap-2">
                        <SaveButton
                            loading={processing}
                            undo={0}
                            icon={<Save size={18} />}
                            sendDataStatusUndo={handleUndo}
                            form='my-form'
                        >
                            {trans('hancms.button.save')}
                        </SaveButton>
                    </div>
                </div>
            </div>
            <form id='my-form' onSubmit={handleSubmit} noValidate className="text-sm">
                <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
                    {/* Tab List (Giữ nguyên phần UI) */}
                    <div className="flex flex-row md:flex-col w-full md:w-56 overflow-x-auto border-r border-gray-200" role="tablist">
                        {['home', 'general'].map((id) => (
                            <button
                                type="button"
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`p-3 py-5 font-medium transition-all ${activeTab === id ? 'bg-indigo-800 text-white' : 'bg-indigo-50'}`}
                            >
                                {trans(`hancms.layout.tabs.${id}`)}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="w-full flex-1 bg-white min-h-[200px] rounded-lg shadow-sm">
                        <div className="bg-indigo-800 text-white px-6 py-3 font-bold uppercase">
                            {trans(`hancms.layout.tabs.${activeTab}`)}
                        </div>
                        <div className="p-6">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

IndexPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.layout.admin.name" children={page} />
);

export default IndexPage;
