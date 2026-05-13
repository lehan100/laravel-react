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
import PromotionStatusBadge from '@/Components/Status/PromotionStatusBadge';
import { formatPriceInput, getLocaleCode, getProductCurrencyFromLocale } from '../../Product/productUtils';

export default function IndexPage() {
  const { trans } = useTrans();
  const { locale, items }: any = usePage().props;
  const currentLocale = getLocaleCode(locale || 'vi');
  const uiLocale = currentLocale === 'vi' ? 'vi-VN' : currentLocale === 'ja' ? 'ja-JP' : currentLocale === 'en' ? 'en-US' : currentLocale;
  const discountCurrency = getProductCurrencyFromLocale(currentLocale);
  const { data, setData } = useForm({
    ids: '',
  });

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
      { label: trans('hancms.column.code'), name: 'code' },
      { label: trans('hancms.column.name'), name: 'name' },
      {
        label: trans('hancms.promotion.coupon.fields.priority'),
        name: 'priority',
      },
      {
        label: trans('hancms.promotion.coupon.fields.ends_at'),
        name: 'ends_at',
        renderCell: (row: any) => formatDateTimeByLocale(row.ends_at),
      },
      {
        label: trans('hancms.promotion.coupon.fields.discount_value'),
        name: 'discount_display',
        renderCell: (row: any) =>
          row.discount_type === 'percent'
            ? `${row.discount_value}%`
            : formatPriceInput(row.discount_value, discountCurrency),
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
            <EditButton href={route('coupon.edit', row.id)}>{trans('hancms.button.edit')}</EditButton>
            <DeleteButtonView size_icon={14} onDelete={() => destroy(row.id)}>
              {trans('hancms.button.delete')}
            </DeleteButtonView>
          </div>
        ),
      },
    ],
    [discountCurrency.code, discountCurrency.locale, trans, uiLocale]
  );

  function destroy(id: number) {
    if (confirm(trans('hancms.message.destroy', { name: trans('hancms.promotion.coupon.name').toLowerCase() }))) {
      router.delete(route('coupon.destroy', id));
    }
  }

  function destroys() {
    if (confirm(trans('hancms.message.destroys')) && data.ids.length > 0) {
      router.delete(route('coupon.destroy-many', { ids: data.ids }));
    }
  }

  const handleChildData = (selected: string) => {
    setData('ids', selected);
  };

  return (
    <div>
      <HeaderToolbar title={trans('hancms.promotion.coupon.name')}>
        <CreatedButton href={route('coupon.create')}>{trans('hancms.button.created')}</CreatedButton>
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
  <MainLayout title="hancms.promotion.coupon.name" children={page} />
);
