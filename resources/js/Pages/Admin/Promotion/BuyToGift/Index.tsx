import { Link, router, useForm, usePage } from '@inertiajs/react';
import React, { useMemo } from 'react';
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
import { Eye } from 'lucide-react';

export default function IndexPage() {
  const { trans } = useTrans();
  const { items, locale }: any = usePage().props;
  const currentLocale = locale || 'vi';
  const uiLocale = currentLocale === 'vi' ? 'vi-VN' : currentLocale === 'ja' ? 'ja-JP' : currentLocale === 'en' ? 'en-US' : currentLocale;
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
        label: trans('hancms.promotion.buytogift.fields.ends_at'),
        name: 'ends_at',
        renderCell: (row: any) => formatDateTimeByLocale(row.ends_at),
      },
      {
        label: trans('hancms.promotion.buytogift.conditions'),
        name: 'condition_type',
        renderCell: (row: any) => {
          const rules = Array.isArray(row.rules) ? row.rules : [];
          const primaryRule = rules[0] || null;
          const conditionLabel = (rule: any) => (
            rule?.condition_type === 'order_amount'
              ? trans('hancms.promotion.buytogift.options.order_amount')
              : trans('hancms.promotion.buytogift.options.buy_product')
          );

          if (!primaryRule) {
            return (
              <div className="text-xs text-slate-500">
                {row.condition_type === 'order_amount'
                  ? trans('hancms.promotion.buytogift.options.order_amount')
                  : trans('hancms.promotion.buytogift.options.buy_product')}
              </div>
            );
          }

          return (
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-slate-800">
                {conditionLabel(primaryRule)}
              </div>
              {primaryRule.condition_type === 'order_amount' && (
                <div className="text-slate-600">
                  {trans('hancms.promotion.buytogift.summary.min_order_amount')}: {primaryRule.min_order_amount ? Number(primaryRule.min_order_amount).toLocaleString(locale === 'en' ? 'en-US' : (locale === 'ja' ? 'ja-JP' : 'vi-VN')) : 0}
                </div>
              )}
              {primaryRule.condition_type !== 'order_amount' && (
                <div className="text-slate-600">
                  {trans('hancms.promotion.buytogift.summary.buy')}: {(primaryRule.buy_product_ids || []).length} {trans('hancms.promotion.buytogift.summary.product_short')} x{primaryRule.buy_qty || 1}
                </div>
              )}
              <div className="text-slate-600">
                {trans('hancms.promotion.buytogift.summary.gift')}: {(primaryRule.gift_product_ids || []).length} {trans('hancms.promotion.buytogift.summary.product_short')} x{primaryRule.gift_qty || 1}
              </div>
              {rules.length > 1 && (
                <div className="text-slate-500">+{rules.length - 1} {trans('hancms.promotion.buytogift.summary.more_rules')}</div>
              )}
            </div>
          );
        },
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
          <div className="flex flex-nowrap items-center justify-end gap-1.5">
            <Link
              href={route('buytogift.show', row.id)}
              className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-2 py-1 text-[10px] font-semibold text-white no-underline shadow-md shadow-cyan-950/10 ring-1 ring-cyan-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-sky-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-cyan-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
            >
              <Eye size={12} />
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
    [trans, uiLocale]
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
          {trans('hancms.button.delete_selected')}
        </DeleteButton>
      </HeaderToolbar>

      <Card contentClassName="overflow-hidden">
        <TableView
          columns={columns}
          rows={rows}
          sendDataSelectItems={handleChildData}
        />
        <Pagination links={links} />
      </Card>
    </div>
  );
}

IndexPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.promotion.buytogift.name" children={page} />
);
