import { useMemo, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import CreatedButton from '@/Components/Button/CreatedButton';
import DeleteButton from '@/Components/Button/DeleteButton';
import DeleteButtonView from '@/Components/Button/DeleteButtonView';
import EditButton from '@/Components/Button/EditButtonView';
import ViewButtonView from '@/Components/Button/ViewButtonView';
import StatusBadge from '@/Components/Status/StatusBadge';
import Pagination from '@/Components/Pagination/Pagination';
import Card from '@/Components/Main/Card';
import TableView from '@/Components/Table/TableViewAll';
import { useTrans } from '@/Hooks/useTrans';
import { create, destroy as destroyRoute, destroyMany as destroyManyRoute, edit, index as fieldGroupIndex, show, toggleStatus } from '@/routes/page-schemas';

type FieldGroupRow = {
    id: number;
    title: string;
    status: boolean;
    pages_count?: number;
    fields_schema?: Array<{
        key?: string;
        label?: string;
        type?: string;
        required?: boolean;
        translatable?: boolean;
    }>;
    created_at?: string;
};

type Props = {
    fieldGroups: {
        data?: FieldGroupRow[];
        links?: Array<any>;
        meta?: {
            links?: Array<any>;
        };
    };
    filters?: {
        search?: string;
    };
};

export default function Index() {
    const { trans } = useTrans();
    const { fieldGroups, filters } = usePage().props as unknown as Props;
    const rows = fieldGroups?.data || [];
    const paginationLinks = fieldGroups?.links || fieldGroups?.meta?.links || [];
    const [selectedIds, setSelectedIds] = useState('');

    const columns = useMemo(() => [
        {
            label: 'ID',
            name: 'id',
        },
        {
            label: trans('hancms.column.name'),
            name: 'title',
            renderCell: (row: FieldGroupRow) => (
                <span className="font-semibold text-slate-900">{row.title}</span>
            ),
        },
        {
            label: trans('hancms.page.field_count'),
            name: 'fields_count',
            renderCell: (row: FieldGroupRow) => (
                <span className="text-sm font-semibold text-slate-700">{row.fields_schema?.length || 0}</span>
            ),
        },
        {
            label: trans('hancms.page.usage_status'),
            name: 'usage_status',
            renderCell: (row: FieldGroupRow) => (
                <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${
                    (row.pages_count || 0) > 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                }`}
                >
                    {(row.pages_count || 0) > 0 ? `${row.pages_count} pages` : trans('hancms.page.not_in_use')}
                </span>
            ),
        },
        {
            label: trans('hancms.column.status'),
            name: 'status',
            renderCell: (row: FieldGroupRow) => (
                <button type="button" onClick={() => router.put(toggleStatus.url({ id: row.id }), {}, { preserveScroll: true })} className="inline-flex">
                    <StatusBadge
                        value={row.status}
                        activeLabel={trans('hancms.status.active')}
                        inactiveLabel={trans('hancms.status.inactive')}
                    />
                </button>
            ),
        },
        {
            label: trans('hancms.column.action'),
            name: 'action',
            renderCell: (row: FieldGroupRow) => (
                <div className="flex flex-nowrap items-center justify-end gap-1.5">
                    <ViewButtonView href={show.url({ field_group: row.id })}>
                        {trans('hancms.button.view')}
                    </ViewButtonView>
                    <EditButton href={edit.url({ field_group: row.id })}>
                        {trans('hancms.button.edit')}
                    </EditButton>
                    {(row.pages_count || 0) > 0 ? (
                        <button
                            type="button"
                            disabled
                            title={`Used by ${row.pages_count || 0} pages`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 disabled:cursor-not-allowed"
                        >
                            {trans('hancms.button.delete')}
                        </button>
                    ) : (
                        <DeleteButtonView size_icon={14} onDelete={() => handleDelete(row.id)}>
                            {trans('hancms.button.delete')}
                        </DeleteButtonView>
                    )}
                </div>
            ),
        },
    ], [trans]);

    const handleDelete = (id: number): void => {
        if (!confirm(trans('hancms.message.destroy', { name: trans('hancms.content.field_design').toLowerCase() }))) {
            return;
        }

        router.delete(destroyRoute.url({ field_group: id }), {
            preserveScroll: true,
        });
    };

    const handleBulkDelete = (): void => {
        const ids = selectedIds.split(',').filter(Boolean).map((id) => Number(id));

        if (!ids.length) {
            return;
        }

        if (!confirm(trans('hancms.message.destroys'))) {
            return;
        }

        router.delete(destroyManyRoute.url({ query: { ids } }), {
            preserveScroll: true,
            onSuccess: () => setSelectedIds(''),
        });
    };

    const submitFilter = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        router.get(fieldGroupIndex.url(), {
            search: String(formData.get('search') || ''),
        }, { preserveState: true, replace: true });
    };

    return (
        <div className="space-y-6">
            <HeaderToolbar title={trans('hancms.content.field_design')}>
                <CreatedButton href={create.url()}>
                    {trans('hancms.button.created')}
                </CreatedButton>
                <DeleteButton onDelete={handleBulkDelete} size={18} disabled={!selectedIds}>
                    {trans('hancms.button.delete_selected')}
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

            <Card contentClassName="overflow-hidden">
                <TableView
                    columns={columns}
                    rows={rows}
                    sendDataSelectItems={setSelectedIds}
                    stickyActionColumn
                />
                {paginationLinks.length > 0 ? (
                    <Pagination links={paginationLinks} />
                ) : null}
            </Card>
        </div>
    );
}

Index.layout = (page: React.ReactNode) => <MainLayout title="hancms.content.field_design">{page}</MainLayout>;
