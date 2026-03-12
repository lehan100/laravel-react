import CountryInput from "@/Components/Form/CountryInput";
import { useTrans } from "@/Hooks/useTrans";
import MainLayout from "@/Layouts/MainLayout";
import { usePage, useForm, router } from "@inertiajs/react";
import React, { useState, useMemo } from 'react';
import { InputGroup } from "@/Components/Form/HancmsInput";
import SaveButton from '@/Components/Button/SaveButton';
import { ImagePlus, Loader2, Save } from "lucide-react";
import axios from "axios";
import HeaderToolbar from "@/Components/Main/HeaderToolbar";
const HomeTab = ({ languages, formData, setFormData, translate, layoutItems }: any) => {
    const itemEntries = layoutItems ? Object.entries(layoutItems) : [];
    const [previews, setPreviews] = useState<Record<string, string>>({});
    const [loadingField, setLoadingField] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldKey: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('photo', file);

        setLoadingField(fieldKey);
        try {
            const response = await axios.post(route('photo.upload'), uploadData);

            setPreviews((prev: any) => ({ ...prev, [fieldKey]: response.data.url }));

            const newValue = response.data.file_name;
            const updatedPages = languages.data.reduce((acc: any, row: any) => {
                const code = row.code;
                const oldLangData = formData.pages?.[code] || {};
                acc[code] = {
                    ...(typeof oldLangData === 'object' ? oldLangData : {}),
                    [fieldKey]: newValue
                };
                return acc;
            }, { ...formData.pages });

            setFormData('pages', updatedPages);
        } catch (error) {
            console.error("Upload lỗi:", error);
        } finally {
            setLoadingField(null);
        }
    };

    const renderUploadField = (fieldKey: string) => {
        const currentPreview = previews?.[fieldKey] || formData.pages?.[languages.data[0]?.code]?.[fieldKey];
        const isLoading = loadingField === fieldKey;
        const urlReview = currentPreview?.includes('/temp/')
            ? currentPreview
            : `/media/photo/${currentPreview}?v=${new Date().getTime()}`;

        return (
            <InputGroup label={translate(`hancms.layout.items.${fieldKey}`)} align='center'>
                <div className="relative group inline-block">
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
                        ${currentPreview ? 'bg-gray-100' : 'border-gray-300 hover:border-indigo-500 bg-gray-50'}`}
                    >
                        {isLoading ? (
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        ) : currentPreview ? (
                            <img src={urlReview} alt="Preview" className="w-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-500">
                                <ImagePlus size={32} />
                                <span className="text-[10px] mt-1 uppercase font-semibold">Upload</span>
                            </div>
                        )}
                    </label>
                    {urlReview && !isLoading && (
                        <div className="absolute top-0 left-0 w-20 h-20 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none">
                            <span className="text-white text-[10px] font-medium">{translate("hancms.column.image_edit")}</span>
                        </div>
                    )}
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
                    <InputGroup key={fieldKey} label={translate(`hancms.layout.items.${fieldKey}`) || fieldConfig.name} align='center' className='border border-gray-200 p-4 pt-6 bg-gray-50 rounded-lg'>
                        {languages.data.map((row: any) => {
                            const langCode = row.code;
                            const langName = row.name;
                            const langData = formData.pages?.[langCode];

                            const cellValue = (typeof langData === 'object' && langData !== null)
                                ? (langData[fieldKey] || '')
                                : '';
                            return (
                                <CountryInput
                                    key={`${langCode}-${fieldKey}`}
                                    photo={row.photo}
                                    value={cellValue}
                                    isTextArea={fieldConfig.is_textarea}
                                    placeholder={`${translate(`hancms.layout.items.${fieldKey}`)} (${langName})`}
                                    onChange={(e: any) => {
                                        const newValue = e.target.value;
                                        setFormData('pages', {
                                            ...formData.pages,
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
    );
};

const GeneralTab = ({ languages, formData, setFormData, translate, layoutItems }: any) => {
    const itemEntries = layoutItems ? Object.entries(layoutItems) : [];
    return (
        <div className="space-y-4">
            {itemEntries.map(([fieldKey, fieldConfig]: [string, any]) => {
                return (
                    <InputGroup key={fieldKey} label={translate(`hancms.layout.items.${fieldKey}`) || fieldConfig.name} align='center' className='border border-gray-200 p-4 pt-6 bg-gray-50 rounded-lg'>
                        {languages.data.map((row: any) => {
                            const langCode = row.code;
                            const langName = row.name;
                            const langData = formData.pages?.[langCode];

                            const cellValue = (typeof langData === 'object' && langData !== null)
                                ? (langData[fieldKey] || '')
                                : '';
                            return (
                                <CountryInput
                                    key={`${langCode}-${fieldKey}`}
                                    photo={row.photo}
                                    value={cellValue}
                                    isTextArea={fieldConfig.is_textarea}
                                    placeholder={`${translate(`hancms.layout.items.${fieldKey}`)} (${langName})`}
                                    onChange={(e: any) => {
                                        const newValue = e.target.value;
                                        setFormData('pages', {
                                            ...formData.pages,
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
        const itemKeys = [
            ...Object.keys(layout_items_home || {}),
            ...Object.keys(layout_items_general || {}),
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

    const { data, setData, post, processing, reset } = useForm({
        pages: initialPages,
        undo: 0,
    });

    const [activeTab, setActiveTab] = useState('home');
    const [undo, setUndo] = useState(0);
    const handleUndo = (status: number) => {
        setUndo(status);
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'home':
                return <HomeTab languages={langs} formData={data} layoutItems={layout_items_home} setFormData={setData} translate={trans} />
            case 'general':
                return <GeneralTab languages={langs} formData={data} layoutItems={layout_items_general} setFormData={setData} translate={trans} />
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
            },
        });
    }
    return (
        <div>
            <HeaderToolbar title={trans('hancms.layout.admin.name')}>
                <SaveButton
                    loading={processing}
                    undo={0}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form='my-form'
                >
                    {trans('hancms.button.save')}
                </SaveButton>
            </HeaderToolbar>
            <form id='my-form' onSubmit={handleSubmit} noValidate className="text-sm">
                <div className="flex flex-col md:flex-row items-start gap-4 md:gap-8">
                    {/* Tab List */}
                    <div className="flex flex-row md:flex-col w-full md:w-56 overflow-x-auto border-r border-gray-200 text-base" role="tablist">
                        {['home', 'general'].map((id) => (
                            <button
                                type="button"
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`p-5 font-medium text-left transition-all ${activeTab === id ? 'bg-indigo-800 text-white' : 'bg-indigo-50'}`}
                            >
                                {trans(`hancms.layout.tabs.${id}`)}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="w-full flex-1 bg-white min-h-[200px] rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-indigo-800 text-white px-6 py-3 font-bold uppercase text-base">
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
