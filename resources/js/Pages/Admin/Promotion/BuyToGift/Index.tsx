import { Link, router, useForm, usePage } from '@inertiajs/react';
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
import { Eye } from 'lucide-react';

export default function IndexPage() {
  const { trans } = useTrans();
  const { items }: any = usePage().props;
  const { data, setData } = useForm({
    ids: '',
  });

  const rows = items?.data || [];
  const links = items?.meta?.links || [];

  const columns = useMemo(
    () => [
      { label: 'ID', name: 'id' },
      { label: trans('hancms.column.code'), name: 'code' },
      { label: trans('hancms.column.name'), name: 'name' },
      {
        label: trans('hancms.promotion.buytogift.conditions'),
        name: 'condition_type',
        renderCell: (row: any) => (
          row.condition_type === 'order_amount'
            ? trans('hancms.promotion.buytogift.options.order_amount')
            : trans('hancms.promotion.buytogift.options.buy_product')
        ),
      },
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
          <div className="flex gap-2">
            <Link
              href={route('buytogift.show', row.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-2.5 py-1.5 text-[11px] font-semibold text-white no-underline shadow-md shadow-cyan-950/10 ring-1 ring-cyan-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-sky-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-cyan-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
            >
              <Eye size={13} />
              <span>{trans('hancms.button.view')}</span>
            </Link>
            <EditButton href={route('buytogift.edit', row.id)}>{trans('hancms.button.edit')}</EditButton>
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
    if (confirm(trans('hancms.message.destroy', { name: trans('hancms.promotion.buytogift.name').toLowerCase() }))) {
      router.delete(route('buytogift.destroy', id));
    }
  }

  function destroys() {
    if (confirm(trans('hancms.message.destroys')) && data.ids.length > 0) {
      router.delete(route('buytogift.destroy-many', { ids: data.ids }));
    }
  }

  const handleChildData = (selected: string) => {
    setData('ids', selected);
  };

  return (
    <div>
      <HeaderToolbar title={trans('hancms.promotion.buytogift.name')}>
        <CreatedButton href={route('buytogift.create')}>{trans('hancms.button.created')}</CreatedButton>
        <DeleteButton onDelete={() => destroys()} size={18}>
          {trans('hancms.button.delete.selected')}
        </DeleteButton>
      </HeaderToolbar>

      <Card>
        <div className="overflow-x-auto">
          <TableView columns={columns} rows={rows} sendDataSelectItems={handleChildData} />
        </div>
        <Pagination links={links} />
      </Card>
    </div>
  );
}

IndexPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.promotion.buytogift.name" children={page} />
);
