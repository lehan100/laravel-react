import { Link, usePage, useForm, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Language, PaginatedData } from '@/types';
import { useTrans } from '@/Hooks/useTrans';
import { useMemo } from 'react';
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
    const { data, setData, errors, post, processing } = useForm({
        data_ids: ''
    });
    const { items, config_path }: any = usePage<{ items: PaginatedData<Language>; }>().props;
    const { meta: { links } }: any = items;
    const columns = useMemo(
        () => [
            {
                label: 'ID',
                name: 'id'
            },
            {
                label: trans('hancms.column.image'),
                name: 'photo',
                renderCell: (row: any) => (
                    row.photo && <img
                        src={`/${config_path.path}/${row.photo}`}
                        className="w-10 h-auto object-contain rounded shadow-sm border border-gray-100"
                        alt={row.name}
                    />
                )
            },
            {
                label: trans('hancms.column.name'),
                name: 'name',
            },

            {
                label: trans('hancms.column.code'),
                name: 'code'
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
                            <EditButton href={route('languages.edit', row.id)}>
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
        if (confirm(trans('hancms.message.destroy', { name: trans('hancms.languages.name').toLowerCase() }))) {
            router.delete(route('languages.destroy', id), {

                onSuccess: () => {

                }
            });
        }
    }
    function destroys() {
        if (confirm(trans('hancms.message.destroys'))) {
            let ids = data.data_ids;
            if (ids.length > 0) {
                router.delete(route('languages.destroy-many', { 'ids': data.data_ids }));
            }

        }
    }
    // Callback function to receive data
    const handleChildData = (data: any) => {
        setData('data_ids', data);
    };
    return (
        <div>
            <HeaderToolbar title={trans('hancms.languages.admin.name')}>
                <CreatedButton
                    href={route("languages.create")}
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
                        rows={items.data}
                        sendDataSelectItems={handleChildData}
                        getRowDetailsUrl={row => route('languages.edit', row.id)}
                    />
                </div>
                <Pagination links={links} />
            </Card>
        </div>
    );
}
IndexPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.languages.name" children={page} />
);

export default IndexPage;
