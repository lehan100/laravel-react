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
import { CircleCheck, CircleX } from 'lucide-react';

export default function IndexPage() {
  const { trans } = useTrans();
  const { items, filters }: any = usePage().props;
  const { data, setData } = useForm({
    ids: '',
  });

  const rows = items?.data || [];
  const links = items?.meta?.links || [];

  const columns = useMemo(
    () => [
      { label: 'ID', name: 'id' },
      { label: trans('hancms.column.code'), name: 'code' },
      { label: trans('hancms.column.provider'), name: 'provider' },
      { label: trans('hancms.column.name'), name: 'name' },
      { label: trans('hancms.column.description'), name: 'description' },
      { label: trans('hancms.column.order'), name: 'sort_order' },
      {
        label: trans('hancms.column.status'),
        name: 'is_active',
        renderCell: (row: any) => (
          <StatusBadge
            value={row.is_active ? 1 : 0}
            activeLabel={trans('hancms.status.active')}
            inactiveLabel={trans('hancms.status.inactive')}
          />
        ),
      },
      {
        label: trans('hancms.column.action'),
        name: 'action',
        renderCell: (row: any) => (
          <div className="flex flex-nowrap items-center justify-end gap-1.5">
            <EditButton href={route('payment-methods.edit', row.id)}>{trans('hancms.button.edit')}</EditButton>
            <button
              type="button"
              onClick={() => toggleStatus(row.id)}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold text-white ${
                row.is_active ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {row.is_active ? <CircleX size={12} /> : <CircleCheck size={12} />}
              {row.is_active ? trans('hancms.sales.payment_methods.actions.disable') : trans('hancms.sales.payment_methods.actions.enable')}
            </button>
            <DeleteButtonView size_icon={14} onDelete={() => destroy(row.id)}>
              {trans('hancms.button.delete')}
            </DeleteButtonView>
          </div>
        ),
      },
    ],
    [trans]
  );

  function destroy(id: number) {
    if (confirm(trans('hancms.message.destroy', { name: trans('hancms.sales.payment_methods.name').toLowerCase() }))) {
      router.delete(route('payment-methods.destroy', id));
    }
  }

  function destroys() {
    if (confirm(trans('hancms.message.destroys')) && data.ids.length > 0) {
      router.delete(route('payment-methods.destroy-many', { ids: data.ids }));
    }
  }

  const handleChildData = (selected: string) => {
    setData('ids', selected);
  };

  const toggleStatus = (id: number) => {
    router.put(route('payment-methods.toggle-status', id), {}, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const submitFilter = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    router.get(route('payment-methods.index'), {
      search: String(formData.get('search') || ''),
    }, { preserveState: true, replace: true });
  };

  return (
    <div>
      <HeaderToolbar title={trans('hancms.sales.payment_methods.name')}>
        <CreatedButton href={route('payment-methods.create')}>{trans('hancms.button.created')}</CreatedButton>
        <DeleteButton onDelete={() => destroys()} size={18}>
          {trans('hancms.button.delete_selected')}
        </DeleteButton>
      </HeaderToolbar>

      <form
        className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_120px]"
        onSubmit={(e) => {
          e.preventDefault();
          submitFilter(e.currentTarget);
        }}
      >
        <input
          name="search"
          defaultValue={filters?.search || ''}
          placeholder={trans('hancms.filter.search')}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white">{trans('hancms.button.filter')}</button>
      </form>

      <Card contentClassName="overflow-hidden">
        <TableView
          columns={columns}
          rows={rows}
          sendDataSelectItems={handleChildData}
          stickyActionColumn
        />
        <Pagination links={links} />
      </Card>
    </div>
  );
}

IndexPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.sales.payment_methods.name" children={page} />
);
