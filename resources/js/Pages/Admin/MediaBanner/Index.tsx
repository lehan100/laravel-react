import CreatedButton from "@/Components/Button/CreatedButton";
import DeleteButton from "@/Components/Button/DeleteButton";
import HeaderToolbar from "@/Components/Main/HeaderToolbar";
import { useTrans } from "@/Hooks/useTrans";
import MainLayout from "@/Layouts/MainLayout";
import { MediaBanner, PaginatedData } from "@/types";
import { router, useForm, usePage } from "@inertiajs/react";
function IndexPage() {
    const { trans } = useTrans();
    const { items, config_path }: any = usePage<{ items: PaginatedData<MediaBanner>; }>().props;
    const { data, setData, errors, post, processing } = useForm({
        data_ids: ''
    });
    const { meta: { links } }: any = items;
    const statusClass: any = {
        '0': {
            'bg': 'inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-red-500 text-white',
            'text': trans('hancms.status.inactive')
        },
        '1': {
            'bg': 'inline-flex items-center px-2 py-1 rounded text-[11px] font-medium bg-green-500 text-white',
            'text': trans('hancms.status.active')
        }
    };
    function destroy(id: any) {
        if (confirm(trans('hancms.message.destroy', { name: trans('hancms.media.banner.name').toLowerCase() }))) {
            router.delete(route('media-banner.destroy', id), {

                onSuccess: () => {

                }
            });
        }
    }
    function destroys() {
        if (confirm(trans('hancms.message.destroys'))) {
            let ids = data.data_ids;
            if (ids.length > 0) {
                router.delete(route('media-banner.destroy-many', { 'ids': data.data_ids }));
            }

        }
    }
    // Callback function to receive data
    const handleChildData = (data: any) => {
        setData('data_ids', data);
    };
    return (
        <div>
            <HeaderToolbar title={trans('hancms.media.banner.name')}>
                <CreatedButton
                    href={route("media-banner.create")}
                >
                    {trans('hancms.button.created')}
                </CreatedButton>
                <DeleteButton
                    onDelete={() => destroys()}
                    size={18}
                >
                    {trans('hancms.button.delete.selected')}
                </DeleteButton>
            </HeaderToolbar>
        </div>
    )
}
IndexPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.media.banner.name" children={page} />
);

export default IndexPage;
