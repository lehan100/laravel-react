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
import MediaBannerTabShell from "./Tabs/MediaBannerTabShell";
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
                <MediaBannerTabShell
                    title={trans('hancms.media.banner.name')}
                    activeTab={activeTab}
                    tabs={[
                        { id: 'general', label: trans('hancms.layout.tabs.general') },
                        { id: 'content', label: trans('hancms.layout.tabs.content') },
                    ]}
                    trans={trans}
                    hasTabError={hasTabError}
                    onTabChange={setActiveTab}
                    renderTabContent={renderTabContent}
                />
            </form>
        </div>
    )
}
CreatedPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.media.banner.name" children={page} />
);
export default CreatedPage;
