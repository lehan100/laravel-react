import SaveButton from "@/Components/Button/SaveButton";
import BackButton from "@/Components/Button/BackButton";
import HeaderToolbar from "@/Components/Main/HeaderToolbar";
import { useTrans } from "@/Hooks/useTrans";
import MainLayout from "@/Layouts/MainLayout";
import { MediaBanner, MediaPosition } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import { Save } from "lucide-react";
import { useState } from "react";
import GeneralTab from "./Tabs/GeneralTab";
import ContentTab from "./Tabs/ContentTab";
function CreatedPage() {
    const { trans } = useTrans();
    const { langs, item, positions, config_path }: any = usePage<{
        item: MediaBanner;
        positions: MediaPosition;

    }>().props;

    const langList = langs?.data || (Array.isArray(langs) ? langs : Object.values(langs || {}));
    const initialTranslations = langList.reduce((result: any, lang: any) => {
        const locale = lang.code;
        const existing = item?.translations?.[locale];
        result[locale] = {
            name: existing?.name || '',
            alias_link: existing?.alias_link || '',
            description: existing?.description || '',
            content: existing?.content || '',
            photo: existing?.photo || '',
        };
        return result;
    }, {});
    const { data, setData, errors, post, processing } = useForm({
        status: item?.status ?? 0,
        undo: item?.undo ?? 0,
        position_ids: item?.positions?.map((p: MediaPosition) => p.id) || [],
        translations: initialTranslations,
    });
    const [undo, setUndo] = useState(0);
    const [activeTab, setActiveTab] = useState('general');
    const handleUndo = (status: number) => setUndo(status);
    const renderTabContent = () => {
        const commonProps = { data, setData, trans, config_path, errors };

        switch (activeTab) {
            case 'general':
                return <GeneralTab {...commonProps} positions={positions} />;
            case 'content':
                return <ContentTab {...commonProps} langList={langList} />;
            default:
                return null;
        }
    };
    const hasTabError = (tabId: string) => {
        if (!errors) return false;

        if (tabId === 'general') {
            return !!errors.position_ids || !!errors.status;
        }

        if (tabId === 'content') {
            return Object.keys(errors).some(key => key.startsWith('translations.'));
        }

        return false;
    };
    function handleSubmit(e: any) {
        e.preventDefault();
        e.stopPropagation();
        post(route('media-banner.store'), {
            onSuccess: () => {
                //alert(trans('hancms.message.success.edit', { name: trans('hancms.media.banner.name') }));
            },
        });
    }
    return (
        <div>
            <HeaderToolbar title={trans('hancms.media.banner.name')}>
                <SaveButton
                    loading={processing}
                    undo={undo}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form='my-form'
                >
                    {trans('hancms.button.save')}
                </SaveButton>
                <BackButton href={route('media-banner.index')}>
                    {trans('hancms.button.back')}
                </BackButton>
            </HeaderToolbar>
            <form id='my-form' onSubmit={handleSubmit} noValidate className="text-sm">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]">
                    <div className="flex flex-col md:flex-row">
                        <div className="border-b border-slate-200 bg-gradient-to-b from-slate-950/[0.03] to-white p-3 md:w-72 md:border-b-0 md:border-r md:p-4">
                            <div className="mb-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                                <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{trans('hancms.tabs')}</div>
                                <div className="mt-1 text-sm font-semibold text-slate-900">{trans('hancms.media.banner.name')}</div>
                            </div>
                            <div className="flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible" role="tablist">
                                {['general', 'content'].map((id) => {
                                    const errorInTab = hasTabError(id);
                                    const active = activeTab === id;
                                    return (
                                        <button
                                            type="button"
                                            key={id}
                                            onClick={() => setActiveTab(id)}
                                            className={`group flex min-w-[170px] items-center justify-between rounded-2xl border p-4 text-left transition-all duration-200 md:min-w-0 ${active
                                                    ? 'border-slate-950 bg-slate-950 text-white shadow-[0_18px_45px_-24px_rgba(15,23,42,0.7)]'
                                                    : errorInTab
                                                        ? 'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100'
                                                        : 'border-slate-200 bg-white/90 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            <div className="flex flex-col">
                                                <span className="mt-1 text-sm font-semibold">{trans(`hancms.layout.tabs.${id}`)}</span>
                                            </div>

                                            {errorInTab ? (
                                                <span className="ml-3 inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_0_4px_rgba(244,63,94,0.14)]" />
                                            ) : (
                                                <span className={`ml-3 text-xs font-semibold ${active ? 'text-cyan-200' : 'text-slate-300 group-hover:text-slate-500'}`}>
                                                    {active ? trans('hancms.open') : trans('hancms.view')}
                                                </span>
                                            )}
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
                                        {hasTabError(activeTab) ? trans('hancms.needs_attention') : trans('hancms.ready')}
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
    )
}
CreatedPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.media.banner.name" children={page} />
);
export default CreatedPage;
