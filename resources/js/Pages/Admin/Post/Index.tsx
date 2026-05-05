import { router, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import Pagination from '@/Components/Pagination/Pagination';
import TableView from '@/Components/Table/TableViewAll';
import DeleteButton from '@/Components/Button/DeleteButton';
import DeleteButtonView from '@/Components/Button/DeleteButtonView';
import EditButton from '@/Components/Button/EditButtonView';
import CreatedButton from '@/Components/Button/CreatedButton';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import Card from '@/Components/Main/Card';
import StatusBadge from '@/Components/Status/StatusBadge';

function IndexPage() {
    const { trans } = useTrans();
    const { items, locale }: any = usePage().props;
    const { data, setData } = useForm({
        post_ids: '',
    });

    const currentLocale = (locale as string) || 'vi';
    const rows = items?.data || items || [];
    const links = items?.meta?.links || [];

    const columns = useMemo(
        () => [
            {
                label: 'ID',
                name: 'id',
            },
            {
                label: trans('hancms.column.image'),
                name: 'photo_url',
                renderCell: (row: any) => (
                    row.photo_url ? (
                        <img
                            src={row.photo_url}
                            className="h-14 w-14 rounded-2xl border border-slate-200 object-cover shadow-sm"
                            alt={row.translations?.[currentLocale]?.name || 'post'}
                        />
                    ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            N/A
                        </div>
                    )
                ),
            },
            {
                label: trans('hancms.column.name'),
                name: 'name',
                renderCell: (row: any) => row.translations?.[currentLocale]?.name || row.translations?.vi?.name || 'N/A',
            },
            {
                label: trans('hancms.catalog.category.name'),
                name: 'category_name',
                renderCell: (row: any) => row.category?.name || 'N/A',
            },
            {
                label: 'Type',
                name: 'type',
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
                ),
            },
            {
                label: trans('hancms.column.action'),
                name: 'action',
                renderCell: (row: any) => (
                    <div className="flex gap-2">
                        <EditButton href={route('post.edit', row.id)}>
                            {trans('hancms.button.edit')}
                        </EditButton>
                        <DeleteButtonView size_icon={14} onDelete={() => destroy(row.id)}>
                            {trans('hancms.button.delete')}
                        </DeleteButtonView>
                    </div>
                ),
            },
        ],
        [currentLocale, trans]
    );

    function destroy(id: any) {
        if (confirm(trans('hancms.message.destroy', { name: trans('hancms.catalog.post.name').toLowerCase() }))) {
            router.delete(route('post.destroy', id));
        }
    }

    function destroys() {
        if (confirm(trans('hancms.message.destroys'))) {
            const ids = data.post_ids;
            if (ids.length > 0) {
                router.delete(route('post.destroy-many', { ids: data.post_ids }));
            }
        }
    }

    const handleChildData = (selected: any) => {
        setData('post_ids', selected);
    };

    return (
        <div>
            <HeaderToolbar title={trans('hancms.catalog.post.admin.name')}>
                <CreatedButton href={route('post.create')}>
                    {trans('hancms.button.created')}
                </CreatedButton>
                <DeleteButton onDelete={() => destroys()} size={18}>
                    {trans('hancms.button.delete_selected')}
                </DeleteButton>
            </HeaderToolbar>

            <Card>
                <div className="overflow-x-auto">
                    <TableView
                        columns={columns}
                        rows={rows}
                        sendDataSelectItems={handleChildData}
                    />
                </div>
                {links?.length > 0 && <Pagination links={links} />}
            </Card>
        </div>
    );
}

IndexPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.catalog.post.name" children={page} />
);

export default IndexPage;
