import { router, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import Pagination from '@/Components/Pagination/Pagination';
import TableView from '@/Components/Table/TableViewAll';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import Card from '@/Components/Main/Card';
import StatusBadge from '@/Components/Status/StatusBadge';
import EditButton from '@/Components/Button/EditButtonView';
import { CircleCheck, CircleX } from 'lucide-react';

export default function WarehouseIndexPage() {
  const { trans } = useTrans();
  const { items, filters, warehouse_name }: any = usePage().props;

  const rows = items?.data || [];
  const links = items?.meta?.links || [];

  const columns = useMemo(() => [
    { label: 'ID', name: 'id' },
    { label: trans('hancms.column.sku'), name: 'sku' },
    { label: trans('hancms.column.name'), name: 'name' },
    { label: trans('hancms.column.quantity'), name: 'quantity' },
    {
      label: trans('hancms.column.status'),
      name: 'is_stock',
      renderCell: (row: any) => (
        <StatusBadge
          value={row.is_stock ? 1 : 0}
          activeLabel={trans('hancms.catalog.product.fields.stock_available')}
          inactiveLabel={trans('hancms.catalog.product.fields.stock_out')}
        />
      ),
    },
    {
      label: trans('hancms.column.action'),
      name: 'action',
      renderCell: (row: any) => (
        <div className="flex flex-nowrap items-center justify-end gap-1.5">
          <EditButton href={route('warehouse.edit', row.id)}>
            {trans('hancms.sales.warehouse.actions.update_stock')}
          </EditButton>
          <button
            type="button"
            onClick={() => toggleStock(row.id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-white ${
              row.is_stock ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {row.is_stock ? <CircleX size={13} /> : <CircleCheck size={13} />}
            {row.is_stock
              ? trans('hancms.sales.warehouse.actions.mark_out_stock')
              : trans('hancms.sales.warehouse.actions.mark_in_stock')}
          </button>
        </div>
      ),
    },
  ], [trans]);

  const toggleStock = (id: number) => {
    router.put(route('warehouse.toggle-stock', id), {}, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const submitFilter = (form: HTMLFormElement) => {
    const data = new FormData(form);
    router.get(route('warehouse.index'), {
      search: String(data.get('search') || ''),
      stock_status: String(data.get('stock_status') || 'all'),
    }, { preserveState: true, replace: true });
  };

  return (
    <div>
      <HeaderToolbar title={`${trans('hancms.sales.warehouse.name')} - ${warehouse_name || trans('hancms.sales.warehouse.default_name')}`} />
      <form
        className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_120px]"
        onSubmit={(e) => {
          e.preventDefault();
          submitFilter(e.currentTarget);
        }}
      >
        <input
          name="search"
          defaultValue={filters?.search || ''}
          placeholder={trans('hancms.sales.warehouse.placeholders.search')}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        />
        <select
          name="stock_status"
          defaultValue={filters?.stock_status || 'all'}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="all">{trans('hancms.filter.all')}</option>
          <option value="in_stock">{trans('hancms.catalog.product.fields.stock_available')}</option>
          <option value="out_stock">{trans('hancms.catalog.product.fields.stock_out')}</option>
        </select>
        <button type="submit" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white">{trans('hancms.button.filter')}</button>
      </form>

      <Card contentClassName="overflow-hidden">
        <TableView
          columns={columns}
          rows={rows}
        />
        <Pagination links={links} />
      </Card>
    </div>
  );
}

WarehouseIndexPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.sales.warehouse.name" children={page} />
);
