import { useMemo, useState, type FormEvent } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import MainLayout from '@/Layouts/MainLayout';
import Pagination from '@/Components/Pagination/Pagination';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import CreatedButton from '@/Components/Button/CreatedButton';
import DeleteButton from '@/Components/Button/DeleteButton';
import DeleteButtonView from '@/Components/Button/DeleteButtonView';
import EditButton from '@/Components/Button/EditButtonView';
import ViewButtonView from '@/Components/Button/ViewButtonView';
import StatusBadge from '@/Components/Status/StatusBadge';
import TableView from '@/Components/Table/TableViewAll';
import { create, destroy as destroyRoute, destroyMany as destroyManyRoute, edit, index as pageIndex, show, toggleStatus } from '@/routes/pages';

type PageRow = {
    id: number;
    title: string;
    slug: string;
    status: boolean;
    acf_data?: Record<string, unknown>;
    updated_at?: string;
    translations?: Array<{
        locale?: string;
        title?: string;
    }>;
    field_group?: {
        title?: string;
        fields_schema?: unknown[];
    };
    fieldGroup?: {
        title?: string;
        fields_schema?: unknown[];
    };
    posts_count?: number;
};

type PageProps = {
    pages: {
        data?: PageRow[];
        links?: Array<any>;
        meta?: {
            links?: Array<any>;
        };
    };
    filters?: {
        search?: string;
    };
    translations: Record<string, any>;
};

export default function Index() {
    const { trans } = useTrans();
    const { pages, filters } = usePage().props as unknown as PageProps;
    const rows = pages?.data || [];
    const paginationLinks = pages?.links || pages?.meta?.links || [];
    const [selectedIds, setSelectedIds] = useState('');

    const selectedIdList = useMemo(
        () => selectedIds.split(',').filter(Boolean).map((id) => Number(id)),
        [selectedIds]
    );

    const handleBulkDelete = (): void => {
        if (!selectedIdList.length) {
            return;
        }

        if (!confirm(trans('hancms.message.destroys'))) {
            return;
        }

        router.delete(destroyManyRoute.url({ query: { ids: selectedIdList } }), {
            preserveScroll: true,
            onSuccess: () => setSelectedIds(''),
        });
    };

    const handleDelete = (id: number): void => {
        if (!confirm(trans('hancms.message.destroy', { name: trans('hancms.page.title').toLowerCase() }))) {
            return;
        }

        router.delete(destroyRoute.url({ page: id }), {
            preserveScroll: true,
        });
    };

    const handleToggleStatus = (id: number): void => {
        router.put(toggleStatus.url({ id }), {
            preserveScroll: true,
        });
    };

    const submitFilter = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        router.get(pageIndex.url(), { search: String(formData.get('search') || '') }, { preserveState: true, replace: true });
    };

    const getFieldGroup = (row: PageRow): PageRow['fieldGroup'] => row.fieldGroup || row.field_group;

    const getPageName = (row: PageRow): string => row.title || row.translations?.[0]?.title || '-';

    const getFieldCount = (row: PageRow): number => getFieldGroup(row)?.fields_schema?.length || 0;

    const formatDate = (value?: string): string => {
        if (!value) {
            return '-';
        }

        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(value));
    };

    const columns = useMemo(() => [
        {
            label: 'ID',
            name: 'id',
        },
        {
            label: 'ID',
            name: 'page_id',
            renderCell: (row: PageRow) => (
                <span className="font-semibold text-slate-800">#{row.id}</span>
            ),
        },
        {
            label: trans('hancms.column.name'),
            name: 'name',
            renderCell: (row: PageRow) => (
                <span className="font-medium text-slate-700">{getPageName(row)}</span>
            ),
        },
        {
            label: trans('hancms.page.group_title'),
            name: 'schema',
            renderCell: (row: PageRow) => (
                <span className="text-sm font-medium text-slate-700">{getFieldGroup(row)?.title || '-'}</span>
            ),
        },
        {
            label: trans('hancms.page.field_count'),
            name: 'field_count',
            renderCell: (row: PageRow) => (
                <span className="inline-flex min-w-10 justify-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {getFieldCount(row)}
                </span>
            ),
        },
        {
            label: trans('hancms.column.status'),
            name: 'status',
            renderCell: (row: PageRow) => (
                <button type="button" onClick={() => handleToggleStatus(row.id)}>
                    <StatusBadge
                        value={row.status}
                        activeLabel={trans('hancms.status.active')}
                        inactiveLabel={trans('hancms.status.inactive')}
                    />
                </button>
            ),
        },
        {
            label: trans('hancms.page.updated_at'),
            name: 'updated_at',
            renderCell: (row: PageRow) => (
                <span className="text-xs text-slate-500">{formatDate(row.updated_at)}</span>
            ),
        },
        {
            label: trans('hancms.column.action'),
            name: 'action',
            renderCell: (row: PageRow) => (
                <div className="flex gap-2">
                    <ViewButtonView href={show.url({ page: row.id })}>
                        {trans('hancms.button.view')}
                    </ViewButtonView>
                    <EditButton href={edit.url({ page: row.id })}>
                        {trans('hancms.button.edit')}
                    </EditButton>
                    <DeleteButtonView size_icon={14} onDelete={() => handleDelete(row.id)}>
                        {trans('hancms.button.delete')}
                    </DeleteButtonView>
                </div>
            ),
        },
    ], [trans]);

    return (
        <div className="space-y-6">
            <HeaderToolbar title={trans('hancms.page.title')}>
                <CreatedButton href={create.url()}>
                    {trans('hancms.button.created')}
                </CreatedButton>
                <DeleteButton onDelete={handleBulkDelete} size={18} disabled={!selectedIds.length}>
                    {trans('hancms.button.delete_selected')} ({selectedIdList.length})
                </DeleteButton>
            </HeaderToolbar>

            <form
                className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_120px]"
                onSubmit={submitFilter}
            >
                <input
                    name="search"
                    defaultValue={filters?.search || ''}
                    placeholder={trans('hancms.filter.search')}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
                <button type="submit" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
                    {trans('hancms.button.filter')}
                </button>
            </form>

            <div className="space-y-4">
                <TableView columns={columns} rows={rows} sendDataSelectItems={setSelectedIds} />
                <div>
                    <Pagination links={paginationLinks} />
                </div>
            </div>
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <MainLayout title="hancms.page.title">{page}</MainLayout>;
