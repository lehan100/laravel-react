import { router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
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
import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { formatProductPrice, getLanguageByLocale, getLocaleCode, getProductCurrencyFromLocale, loadProductCurrency, type ProductCurrency } from '../../Product/productUtils';

export default function IndexPage() {
  const { trans } = useTrans();
  const { locale, items, langs }: any = usePage().props;
  const currentLocale = getLocaleCode(locale || 'vi');
  const langList = langs?.data || (Array.isArray(langs) ? langs : Object.values(langs || {}));
  const currentLanguage = getLanguageByLocale(langList, currentLocale);
  const [resolvedCurrency, setResolvedCurrency] = useState<ProductCurrency>(() => getProductCurrencyFromLocale(currentLocale, currentLanguage));
  const { data, setData } = useForm({
    ids: '',
  });

  const rows = items?.data || [];
  const links = items?.meta?.links || [];

  useEffect(() => {
    let mounted = true;

    loadProductCurrency(currentLanguage, currentLocale).then((currency) => {
      if (!mounted) return;
      setResolvedCurrency(currency);
    });

    return () => {
      mounted = false;
    };
  }, [currentLocale, currentLanguage?.code, currentLanguage?.currency]);

  const columns = useMemo(
    () => [
      { label: 'ID', name: 'id' },
      { label: trans('hancms.column.code'), name: 'code' },
      { label: trans('hancms.column.name'), name: 'name' },
      {
        label: trans('hancms.promotion.saleoffer.fields.discount_value'),
        name: 'discount_display',
        renderCell: (row: any) =>
          row.discount_type === 'percent'
            ? `${row.discount_value}%`
            : formatProductPrice(row.discount_value, resolvedCurrency),
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
              href={route('saleoffer.show', row.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 px-2.5 py-1.5 text-[11px] font-semibold text-white no-underline shadow-md shadow-cyan-950/10 ring-1 ring-cyan-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-sky-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-cyan-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
            >
              <Eye size={13} />
              <span>{trans('hancms.button.view')}</span>
            </Link>
            <EditButton href={route('saleoffer.edit', row.id)}>{trans('hancms.button.edit')}</EditButton>
            <DeleteButtonView size_icon={14} onDelete={() => destroy(row.id)}>
              {trans('hancms.button.delete')}
            </DeleteButtonView>
          </div>
        ),
      },
    ],
    [resolvedCurrency, trans]
  );

  function destroy(id: number) {
    if (confirm(trans('hancms.message.destroy', { name: trans('hancms.promotion.saleoffer.name').toLowerCase() }))) {
      router.delete(route('saleoffer.destroy', id));
    }
  }

  function destroys() {
    if (confirm(trans('hancms.message.destroys')) && data.ids.length > 0) {
      router.delete(route('saleoffer.destroy-many', { ids: data.ids }));
    }
  }

  const handleChildData = (selected: string) => {
    setData('ids', selected);
  };

  return (
    <div>
      <HeaderToolbar title={trans('hancms.promotion.saleoffer.name')}>
        <CreatedButton href={route('saleoffer.create')}>{trans('hancms.button.created')}</CreatedButton>
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
  <MainLayout title="hancms.promotion.saleoffer.name" children={page} />
);
