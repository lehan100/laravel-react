import CountryInput from "@/Components/Form/CountryInput";
import { useTrans } from "@/Hooks/useTrans";
import MainLayout from "@/Layouts/MainLayout";
import { usePage, useForm } from "@inertiajs/react";
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
            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                    {renderUploadField('logo')}
                    {renderUploadField('favicon')}
                </div>
            </div>
            {itemEntries.map(([fieldKey, fieldConfig]: [string, any]) => {
                return (
                    <section key={fieldKey} className="rounded-3xl border border-slate-200 bg-white shadow-[0_14px_30px_-24px_rgba(15,23,42,0.3)]">
                        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 to-slate-800 px-4 py-3 text-white sm:px-5">
                            <div className="text-[11px] uppercase tracking-[0.28em] text-white/60">
                                {translate(`hancms.layout.items.${fieldKey}`) || fieldConfig.name}
                            </div>
                            <div className="mt-1 text-sm font-semibold">
                                {fieldConfig.name}
                            </div>
                        </div>
                        <div className="space-y-4 p-4 sm:p-5">
                            {languages.data.map((row: any) => {
                                const langCode = row.code;
                                const langName = row.name;
                                const langData = formData.pages?.[langCode];

                                const cellValue = (typeof langData === 'object' && langData !== null)
                                    ? (langData[fieldKey] || '')
                                    : '';
                                return (
                                    <div key={`${langCode}-${fieldKey}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                                        <CountryInput
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
                                    </div>
                                );
                            })}
                        </div>
                    </section>
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
                    <section key={fieldKey} className="rounded-3xl border border-slate-200 bg-white shadow-[0_14px_30px_-24px_rgba(15,23,42,0.3)]">
                        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 to-slate-800 px-4 py-3 text-white sm:px-5">
                            <div className="text-[11px] uppercase tracking-[0.28em] text-white/60">
                                {translate(`hancms.layout.items.${fieldKey}`) || fieldConfig.name}
                            </div>
                            <div className="mt-1 text-sm font-semibold">
                                {fieldConfig.name}
                            </div>
                        </div>
                        <div className="space-y-4 p-4 sm:p-5">
                            {languages.data.map((row: any) => {
                                const langCode = row.code;
                                const langName = row.name;
                                const langData = formData.pages?.[langCode];

                                const cellValue = (typeof langData === 'object' && langData !== null)
                                    ? (langData[fieldKey] || '')
                                    : '';
                                return (
                                    <div key={`${langCode}-${fieldKey}`} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                                        <CountryInput
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
                                    </div>
                                );
                            })}
                        </div>
                    </section>
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

    const { data, setData, post, processing } = useForm({
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
                    undo={undo}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form='my-form'
                >
                    {trans('hancms.button.save')}
                </SaveButton>
            </HeaderToolbar>
            <form id='my-form' onSubmit={handleSubmit} noValidate className="text-sm">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]">
                    <div className="flex flex-col md:flex-row">
                        <div className="border-b border-slate-200 bg-gradient-to-b from-slate-950/[0.03] to-white p-3 md:w-64 md:border-b-0 md:border-r md:p-4">
                            <div className="mb-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                                <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{trans('hancms.tabs')}</div>
                                <div className="mt-1 text-sm font-semibold text-slate-900">{trans('hancms.layout.admin.name')}</div>
                            </div>
                            <div className="flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible" role="tablist">
                                {['home', 'general'].map((id) => {
                                    const active = activeTab === id;
                                    return (
                                        <button
                                            type="button"
                                            key={id}
                                            onClick={() => setActiveTab(id)}
                                            className={`group flex min-w-[170px] items-center justify-between rounded-2xl border p-4 text-left transition-all duration-200 md:min-w-0 ${active
                                                    ? 'border-slate-950 bg-slate-950 text-white shadow-[0_18px_45px_-24px_rgba(15,23,42,0.7)]'
                                                    : 'border-slate-200 bg-white/90 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="mt-1 text-sm font-semibold">{trans(`hancms.layout.tabs.${id}`)}</span>
                                            </div>
                                            <span className={`ml-3 text-xs font-semibold ${active ? 'text-cyan-200' : 'text-slate-300 group-hover:text-slate-500'}`}>
                                                {active ? trans('hancms.open') : trans('hancms.view')}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="min-w-0 flex-1 bg-gradient-to-b from-white to-slate-50/70">
                            <div className="border-b border-slate-200/80 bg-white/80 px-5 py-4 backdrop-blur sm:px-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">{trans('hancms.current_tab')}</div>
                                        <h2 className="mt-1 text-lg font-semibold text-slate-900">
                                            {trans(`hancms.layout.tabs.${activeTab}`)}
                                        </h2>
                                    </div>
                                    <div className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 sm:inline-flex">
                                        {trans('hancms.ready')}
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 sm:p-6">
                                {renderTabContent()}
                            </div>
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
