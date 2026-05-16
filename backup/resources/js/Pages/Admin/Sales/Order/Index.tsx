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
import { formatProductPrice, getLanguageByLocale, getLocaleCode, getProductCurrencyFromLocale, type ProductCurrency } from '../../Product/productUtils';
import { resolveOrderCurrencyWithFallback, resolveOrderLanguageList } from './orderCurrency';

export default function IndexPage() {
  const { trans } = useTrans();
  const { items, filters, status_options, locale, langs, all_langs }: any = usePage().props;
  const { data, setData } = useForm({
    ids: '',
  });

  const currentLocale = getLocaleCode(locale);
  const langList = resolveOrderLanguageList(langs, all_langs);
  const currentLanguage = getLanguageByLocale(langList, currentLocale);
  const resolvedCurrency = useMemo<ProductCurrency>(
    () => getProductCurrencyFromLocale(currentLocale, currentLanguage),
    [currentLocale, currentLanguage?.code, currentLanguage?.currency]
  );
  const rows = items?.data || [];
  const links = items?.meta?.links || [];

  const orderStatusLabels = Object.fromEntries((status_options?.order || []).map((option: any) => [option.value, option.label]));
  const paymentStatusLabels = Object.fromEntries((status_options?.payment || []).map((option: any) => [option.value, option.label]));
  const columns = useMemo(
    () => [
      { label: 'ID', name: 'id' },
      { label: trans('hancms.sales.orders.fields.order_number'), name: 'order_number' },
      { label: trans('hancms.sales.orders.fields.customer_name'), name: 'customer_name' },
      { label: trans('hancms.sales.orders.fields.payment_method'), name: 'payment_method_name' },
      {
        label: trans('hancms.sales.orders.fields.order_status'),
        name: 'order_status',
        renderCell: (row: any) => (
          <StatusBadge value={row.order_status === 'completed' ? 1 : 0} activeLabel={orderStatusLabels[row.order_status] || row.order_status} inactiveLabel={orderStatusLabels[row.order_status] || row.order_status} />
        ),
      },
      {
        label: trans('hancms.sales.orders.fields.payment_status'),
        name: 'payment_status',
        renderCell: (row: any) => (
          <StatusBadge value={row.payment_status === 'paid' ? 1 : 0} activeLabel={paymentStatusLabels[row.payment_status] || row.payment_status} inactiveLabel={paymentStatusLabels[row.payment_status] || row.payment_status} />
        ),
      },
      {
        label: trans('hancms.sales.orders.fields.grand_total'),
        name: 'grand_total',
        renderCell: (row: any) => formatProductPrice(row.grand_total, resolveOrderCurrencyWithFallback(row, currentLocale, currentLanguage, resolvedCurrency)),
      },
      { label: trans('hancms.sales.orders.fields.total_quantity'), name: 'total_quantity' },
      { label: trans('hancms.sales.orders.fields.placed_at'), name: 'placed_at' },
      {
        label: trans('hancms.column.action'),
        name: 'action',
        renderCell: (row: any) => (
          <div className="flex flex-nowrap items-center justify-end gap-1.5">
            <Link
              href={route('orders.show', row.id)}
              className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-2 py-1 text-[10px] font-semibold text-white no-underline shadow-md shadow-cyan-950/10 ring-1 ring-cyan-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-sky-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-cyan-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
            >
              <Eye size={12} />
              <span>{trans('hancms.button.view')}</span>
            </Link>
            <EditButton href={route('orders.edit', row.id)}>{trans('hancms.button.edit')}</EditButton>
            <DeleteButtonView size_icon={14} onDelete={() => destroy(row.id)}>
              {trans('hancms.button.delete')}
            </DeleteButtonView>
          </div>
        ),
      },
    ],
    [currentLocale, currentLanguage?.code, currentLanguage?.currency, orderStatusLabels, paymentStatusLabels, resolvedCurrency, trans]
  );

  const destroy = (id: number) => {
    if (confirm(trans('hancms.message.destroy', { name: trans('hancms.sales.orders.name').toLowerCase() }))) {
      router.delete(route('orders.destroy', id));
    }
  };

  const destroys = () => {
    if (confirm(trans('hancms.message.destroys')) && data.ids.length > 0) {
      router.delete(route('orders.destroy-many', { ids: data.ids }));
    }
  };

  const submitFilter = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    router.get(
      route('orders.index'),
      {
        search: String(formData.get('search') || ''),
        order_status: String(formData.get('order_status') || 'all'),
        payment_status: String(formData.get('payment_status') || 'all'),
      },
      { preserveState: true, replace: true }
    );
  };

  return (
    <div>
      <HeaderToolbar title={trans('hancms.sales.orders.name')}>
        <CreatedButton href={route('orders.create')}>{trans('hancms.button.created')}</CreatedButton>
        <DeleteButton onDelete={() => destroys()} size={18}>
          {trans('hancms.button.delete_selected')}
        </DeleteButton>
      </HeaderToolbar>

      <form
        className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_120px]"
        onSubmit={(event) => {
          event.preventDefault();
          submitFilter(event.currentTarget);
        }}
      >
        <input
          name="search"
          defaultValue={filters?.search || ''}
          placeholder={trans('hancms.sales.orders.placeholders.search')}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        />
        <select name="order_status" defaultValue={filters?.order_status || 'all'} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
          <option value="all">{trans('hancms.filter.all')}</option>
          {(status_options?.order || []).map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select name="payment_status" defaultValue={filters?.payment_status || 'all'} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
          <option value="all">{trans('hancms.filter.all')}</option>
          {(status_options?.payment || []).map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
          {trans('hancms.button.filter')}
        </button>
      </form>

      <Card contentClassName="overflow-hidden">
        <TableView
          columns={columns}
          rows={rows}
          sendDataSelectItems={(selected: string) => setData('ids', selected)}
          getRowDetailsUrl={(row: any) => route('orders.edit', row.id)}
          stickyActionColumn
        />
        <Pagination links={links} />
      </Card>
    </div>
  );
}

IndexPage.layout = (page: React.ReactNode) => <MainLayout title="hancms.sales.orders.name" children={page} />;
