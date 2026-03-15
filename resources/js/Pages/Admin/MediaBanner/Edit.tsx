import SaveButton from "@/Components/Button/SaveButton";
import HeaderToolbar from "@/Components/Main/HeaderToolbar";
import { useTrans } from "@/Hooks/useTrans";
import MainLayout from "@/Layouts/MainLayout";
import { MediaBanner, MediaPosition } from "@/types";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Save, Undo } from "lucide-react";
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
    const { data, setData, errors, put, processing } = useForm({
        status: item?.status ?? 0,
        undo: item?.undo ?? 0,
        position_ids: item?.positions?.map((p: MediaPosition) => p.id) || [],
        translations: initialTranslations,
    });
    // console.log(errors);
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
        put(route('media-banner.update',item.id), {
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
                    undo={0}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form='my-form'
                >
                    {trans('hancms.button.save')}
                </SaveButton>
                <Link
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-all shadow-sm"
                    href={route('media-banner.index')}
                >
                    <Undo size={20} />
                    <span>{trans('hancms.button.back')}</span>
                </Link>
            </HeaderToolbar>
            <form id='my-form' onSubmit={handleSubmit} noValidate className="text-sm">
                <div className="flex flex-col md:flex-row item-start gap-4 md:gap-8">
                    {/* Tab List */}
                    <div className="flex flex-row md:flex-col w-full md:w-56 overflow-x-auto border-r border-gray-200 text-base" role="tablist">
                        {['general', 'content'].map((id) => {
                            const errorInTab = hasTabError(id);
                            return (
                                <button
                                    type="button"
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={`p-5 text-left font-medium transition-all flex justify-between item-center ${activeTab === id
                                            ? 'bg-indigo-800 text-white'
                                            : errorInTab
                                                ? 'bg-red-50 text-red-600' 
                                                : 'bg-indigo-50 text-indigo-900'
                                        }`}
                                >
                                    <span>{trans(`hancms.layout.tabs.${id}`)}</span>

                                    {errorInTab && (
                                        <span className="relative flex h-2 w-2 ml-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="w-full flex-1 bg-white min-h-[200px] rounded-lg shadow-sm ">
                        <div className="bg-indigo-800 text-white px-6 py-3 font-medium uppercase text-base rounded-tl-lg  rounded-tr-lg">
                            {trans(`hancms.layout.tabs.${activeTab}`)}
                        </div>
                        <div className="p-6">
                            {renderTabContent()}
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