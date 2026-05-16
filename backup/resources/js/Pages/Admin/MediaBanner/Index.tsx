
import Card from "@/Components/Main/Card";
import Pagination from '@/Components/Pagination/Pagination';
import TableView from '@/Components/Table/TableViewAll';
import DeleteButton from '@/Components/Button/DeleteButton';
import DeleteButtonView from '@/Components/Button/DeleteButtonView';
import EditButton from '@/Components/Button/EditButtonView';
import CreatedButton from '@/Components/Button/CreatedButton';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import StatusBadge from '@/Components/Status/StatusBadge';
import { useTrans } from "@/Hooks/useTrans";
import MainLayout from "@/Layouts/MainLayout";
import { MediaBanner, PaginatedData } from "@/types";
import { router, useForm, usePage } from "@inertiajs/react";
import { useMemo } from "react";
function IndexPage() {
    const { trans } = useTrans();
    const { items, config_path }: any = usePage<{ items: PaginatedData<MediaBanner>; }>().props;
    const { data, setData, errors, post, processing } = useForm({
        data_ids: ''
    });
    const rows = items?.data || [];
    const paginationLinks = items?.meta?.links || [];
    const columns = useMemo(
        () => [
            {
                label: 'ID',
                name: 'id'
            },
            {
                label: trans('hancms.column.image'),
                name: 'image',
                renderCell: (row: any) => {
                    // Lấy danh sách các ngôn ngữ (vi, en, ja, ...)
                    const languages = Object.keys(row.translations || {});
                    const grayPlaceholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8+R8AAnkB9m9pS00AAAAASUVORK5CYII=";

                    return (
                        <div className="flex gap-2">
                            {languages.map((lang) => {
                                const translation = row.translations[lang];
                                const photoUrl = translation?.photo_url || grayPlaceholder;

                                return (
                                    <div key={lang} className="relative w-20 h-12 overflow-hidden rounded border border-gray-200 bg-gray-50 flex items-center justify-center group">
                                        {/* Note nhỏ ghi tên ngôn ngữ ở góc */}
                                        <span className="absolute top-0 left-0 bg-black/60 text-white text-[8px] px-1 rounded-br z-10 uppercase">
                                            {lang}
                                        </span>

                                        <img
                                            src={photoUrl}
                                            alt={lang}
                                            className="w-full h-full object-cover"
                                            onError={(e: any) => {
                                                e.target.onerror = null;
                                                e.target.src = '/images/no-image.png'
                                            }}
                                        />
                                    </div>
                                );
                            })}
                            {languages.length === 0 && (
                                <span className="text-[10px] text-gray-400 italic text-center w-20">No data</span>
                            )}
                        </div>
                    );
                }
            },
            {
                label: trans('hancms.column.name'),
                name: 'name',
                renderCell: (row: any) => {
                    const languages = Object.keys(row.translations || {});

                    return (
                        <div className="flex flex-col gap-1.5">
                            {languages.map((lang) => {
                                const translation = row.translations[lang];
                                return (
                                    <div key={lang} className="flex items-center gap-2 group">
                                        <div className="flex flex-col leading-tight">
                                            <span className="font-semibold text-sm text-gray-800">
                                                {translation?.name || 'N/A'}
                                                {/* Badge ngôn ngữ nhỏ ở cuối tên */}
                                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 text-[9px] uppercase border border-gray-200 font-bold group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                    {lang}
                                                </span>
                                            </span>
                                            <span className="text-[11px] text-gray-400 italic truncate max-w-[200px]">
                                                {translation?.alias_link || 'no-link'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            {languages.length === 0 && <span className="text-gray-400 italic">No data</span>}
                        </div>
                    );
                }
            },
            {
                label: trans('hancms.media.position.name'),
                name: 'positions',
                renderCell: (row: any) => (
                    <div className="flex flex-wrap gap-1">
                        {row.positions?.map((pos: any) => (
                            <span key={pos.id} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px]">
                                {pos.name}
                            </span>
                        ))}
                    </div>
                )
            },
            {
                label: trans('hancms.column.status'),
                name: 'status',
                renderCell: (row: any) => (
                    <StatusBadge
                        value={row.status}
                        activeLabel={trans('hancms.status.active')}
                        inactiveLabel={trans('hancms.status.inactive')}
                    />
                )
            },
            {
                label: trans('hancms.column.action'),
                name: 'action',
                renderCell: (row: any) => (
                    <>
                        <div className="flex gap-2">
                            <EditButton href={route('media-banner.edit', row.id)}>
                                {trans('hancms.button.edit')}
                            </EditButton>
                            <DeleteButtonView size_icon={14} onDelete={() => destroy(row.id)}>
                                {trans('hancms.button.delete')}
                            </DeleteButtonView>
                        </div>

                    </>
                )
            },
        ],
        [trans]
    );
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
            console.log(ids);
            
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
                    {trans('hancms.button.delete_selected')}
                </DeleteButton>
            </HeaderToolbar>
            <Card>
                <div className="overflow-x-auto">
                    <TableView
                        columns={columns}
                        rows={rows}
                        sendDataSelectItems={handleChildData}
                        getRowDetailsUrl={row => route('media-banner.edit', row.id)}
                    />
                </div>
                <Pagination links={paginationLinks} />
            </Card>
        </div>
    )
}
IndexPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.media.banner.name" children={page} />
);

export default IndexPage;
