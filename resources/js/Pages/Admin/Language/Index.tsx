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
import { PlusCircle } from 'lucide-react';
function IndexPage() {
    const { trans } = useTrans();
    const { data, setData, errors, post, processing } = useForm({
        data_ids: ''
    });
    const { items, config_path }: any = usePage<{ items: PaginatedData<Language>; }>().props;
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
                    <span className={statusClass[row.status]['bg']}>{statusClass[row.status]['text']}</span >
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
        []
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
                router.delete(route('languages.destroyMany', { 'ids': data.data_ids }));
            }

        }
    }
    // Callback function to receive data
    const handleChildData = (data: any) => {
        setData('data_ids', data);
    };
    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6">
                {/* Tiêu đề trang: text-xl thay vì 3xl để tinh tế hơn */}
                <div className="w-full md:flex-1 mb-3 md:mb-0 text-left">
                    <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                        {trans('hancms.languages.admin.name')}
                    </h1>
                </div>

                {/* Nhóm nút bấm: text-sm và font-medium */}
                <div className="w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        {/* Nút Created: Thêm padding và font-size nhỏ */}
                        <CreatedButton
                            href={route("languages.create")}
                            className="px-3 py-1.5 text-sm font-medium transition-all active:scale-95 shadow-sm"
                        >
                            {trans('hancms.button.created')}
                        </CreatedButton>

                        {/* Nút Delete: Bỏ class 'btn btn-danger' của Bootstrap */}
                        <DeleteButton
                            onDelete={() => destroys()}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors shadow-sm active:scale-95 border-none"
                            size={18} // Giảm size icon xuống 18 cho cân đối với text-sm
                        >
                            {trans('hancms.button.delete.selected')}
                        </DeleteButton>
                    </div>
                </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {/* Phần TableView bên trong nên dùng text-sm để đồng bộ */}
                <div className="overflow-x-auto">
                    <TableView
                        columns={columns}
                        rows={items.data}
                        sendDataSelectItems={handleChildData}
                        getRowDetailsUrl={row => route('languages.edit', row.id)}
                    />
                </div>

                {/* Phân trang: Ngăn cách bằng đường kẻ mảnh */}
                <Pagination links={links} />
            </div>
        </div>
    );
}
IndexPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.languages.name" children={page} />
);

export default IndexPage;