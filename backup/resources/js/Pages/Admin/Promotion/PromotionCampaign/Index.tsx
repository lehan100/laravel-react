import { Link, router, useForm, usePage } from '@inertiajs/react';
import { Eye } from 'lucide-react';
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
import PromotionStatusBadge from '@/Components/Status/PromotionStatusBadge';

export default function IndexPage() {
  const { trans } = useTrans();
  const { items, locale }: any = usePage().props;
  const { data, setData } = useForm({
    ids: '',
  });
  const uiLocale = locale === 'vi' ? 'vi-VN' : locale === 'ja' ? 'ja-JP' : locale === 'en' ? 'en-US' : locale || 'vi-VN';

  const rows = items?.data || [];
  const links = items?.meta?.links || [];

  const formatDateTimeByLocale = (value?: string | null) => {
    if (!value) {
      return '---';
    }

    const normalized = value.includes('T') ? value : value.replace(' ', 'T');
    const date = new Date(normalized);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(uiLocale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const columns = useMemo(
    () => [
      { label: 'ID', name: 'id' },
      { label: trans('hancms.column.name'), name: 'name' },
      {
        label: trans('hancms.promotion.campaign.fields.ends_at'),
        name: 'ends_at',
        renderCell: (row: any) => formatDateTimeByLocale(row.ends_at),
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
        label: trans('hancms.promotion.status'),
        name: 'promotion_status',
        renderCell: (row: any) => (
          <PromotionStatusBadge
            value={row.promotion_status}
            labels={{
              active: trans('hancms.promotion.statuses.active'),
              upcoming: trans('hancms.promotion.statuses.upcoming'),
              expired: trans('hancms.promotion.statuses.expired'),
              inactive: trans('hancms.promotion.statuses.inactive'),
            }}
          />
        ),
      },
      {
        label: trans('hancms.column.action'),
        name: 'action',
        renderCell: (row: any) => (
          <div className="flex gap-2">
            <Link
              href={`/flash-sale/${row.slug}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-2.5 py-1.5 text-[11px] font-semibold text-white no-underline shadow-md shadow-cyan-950/10 ring-1 ring-cyan-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-sky-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-cyan-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
            >
              <Eye size={13} />
              <span>{trans('hancms.button.view')}</span>
            </Link>
            <EditButton href={route('promotion-campaign.edit', row.id)}>{trans('hancms.button.edit')}</EditButton>
            <DeleteButtonView size_icon={14} onDelete={() => destroy(row.id)}>
              {trans('hancms.button.delete')}
            </DeleteButtonView>
          </div>
        ),
      },
    ],
    [trans, uiLocale]
  );

  function destroy(id: number) {
    if (confirm(trans('hancms.message.destroy', { name: trans('hancms.promotion.campaign.name').toLowerCase() }))) {
      router.delete(route('promotion-campaign.destroy', id));
    }
  }

  function destroys() {
    if (confirm(trans('hancms.message.destroys')) && data.ids.length > 0) {
      router.delete(route('promotion-campaign.destroy-many', { ids: data.ids }));
    }
  }

  const handleChildData = (selected: string) => {
    setData('ids', selected);
  };

  return (
    <div>
      <HeaderToolbar title={trans('hancms.promotion.campaign.name')}>
        <CreatedButton href={route('promotion-campaign.create')}>{trans('hancms.button.created')}</CreatedButton>
        <DeleteButton onDelete={() => destroys()} size={18}>
          {trans('hancms.button.delete_selected')}
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
  <MainLayout title="hancms.promotion.campaign.name" children={page} />
);
