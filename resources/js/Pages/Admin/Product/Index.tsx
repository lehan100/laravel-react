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
import { formatProductPrice, getLanguageByLocale, getLocaleCode, getProductCurrencyFromLocale, loadProductCurrency, type ProductCurrency } from './productUtils';
import { Filter, RotateCcw } from 'lucide-react';

function IndexPage() {
    const { trans } = useTrans();
    const { items, filters, categories, locale, langs }: any = usePage().props;
    const { data, setData } = useForm({
        product_ids: '',
    });

    const currentLocale = getLocaleCode(locale);
    const langList = langs?.data || (Array.isArray(langs) ? langs : Object.values(langs || {}));
    const currentLanguage = getLanguageByLocale(langList, currentLocale);
    const [resolvedCurrency, setResolvedCurrency] = useState<ProductCurrency>(() => getProductCurrencyFromLocale(currentLocale, currentLanguage));
    const rows = items?.data || items || [];
    const links = items?.meta?.links || [];

    const submitFilter = (form: HTMLFormElement) => {
        const formData = new FormData(form);
        router.get(
            route('product.index'),
            {
                search: String(formData.get('search') || ''),
                status: String(formData.get('status') || 'all'),
                category_id: String(formData.get('category_id') || 'all'),
            },
            { preserveState: true, replace: true }
        );
    };

    const handleResetFilter = () => {
        router.get(
            route('product.index'),
            {},
            { preserveState: false, replace: true }
        );
    };

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
            {
                label: 'ID',
                name: 'id',
            },
            {
                label: trans('hancms.column.image'),
                name: 'photo_url',
                renderCell: (row: any) => (
                    row.photo_url ? (
                        <img
                            src={row.photo_url}
                            className="h-14 w-14 rounded-2xl border border-slate-200 object-cover shadow-sm"
                            alt={row.translations?.[currentLocale]?.name || row.sku || 'product'}
                        />
                    ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            N/A
                        </div>
                    )
                ),
            },
            {
                label: trans('hancms.column.sku'),
                name: 'sku',
            },
            {
                label: trans('hancms.column.name'),
                name: 'name',
                renderCell: (row: any) => row.translations?.[currentLocale]?.name || row.translations?.vi?.name || row.sku || 'N/A',
            },
            {
                label: trans('hancms.column.price'),
                name: 'price',
                renderCell: (row: any) => formatProductPrice(row.price, resolvedCurrency),
            },
            {
                label: trans('hancms.column.quantity'),
                name: 'quantity',
            },
            {
                label: trans('hancms.column.status'),
                name: 'status',
                renderCell: (row: any) => (
                    <StatusBadge
                        value={row.status}
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
                        <EditButton href={route('product.edit', row.id)}>
                            {trans('hancms.button.edit')}
                        </EditButton>
                        <DeleteButtonView size_icon={14} onDelete={() => destroy(row.id)}>
                            {trans('hancms.button.delete')}
                        </DeleteButtonView>
                    </div>
                ),
            },
        ],
        [currentLocale, resolvedCurrency, trans]
    );

    function destroy(id: any) {
        if (confirm(trans('hancms.message.destroy', { name: trans('hancms.catalog.product.name').toLowerCase() }))) {
            router.delete(route('product.destroy', id));
        }
    }

    function destroys() {
        if (confirm(trans('hancms.message.destroys'))) {
            const ids = data.product_ids;
            if (ids.length > 0) {
                router.delete(route('product.destroy-many', { ids: data.product_ids }));
            }
        }
    }

    const handleChildData = (selected: any) => {
        setData('product_ids', selected);
    };

    return (
        <div>
            <HeaderToolbar title={trans('hancms.catalog.product.admin.name')}>
                <CreatedButton href={route('product.create')}>
                    {trans('hancms.button.created')}
                </CreatedButton>
                <DeleteButton onDelete={() => destroys()} size={18}>
                    {trans('hancms.button.delete_selected')}
                </DeleteButton>
            </HeaderToolbar>

            <form
                className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px_180px_120px_120px]"
                onSubmit={(event) => {
                    event.preventDefault();
                    submitFilter(event.currentTarget);
                }}
            >
                <input
                    name="search"
                    defaultValue={filters?.search || ''}
                    placeholder={trans('hancms.sales.warehouse.placeholders.search') || 'Tìm kiếm SKU hoặc tên sản phẩm...'}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                />
                <select name="category_id" defaultValue={filters?.category_id || 'all'} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                    <option value="all">{trans('hancms.catalog.category.type.options.select') || 'Tất cả danh mục'}</option>
                    {(categories || []).map((category: any) => (
                        <option key={category.id} value={category.id}>
                            {category.name_with_depth || category.translations?.[currentLocale]?.name || category.translations?.vi?.name || 'Unnamed'}
                        </option>
                    ))}
                </select>
                <select name="status" defaultValue={filters?.status || 'all'} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
                    <option value="all">{trans('hancms.filter.all') || 'Tất cả'}</option>
                    <option value="1">{trans('hancms.status.active') || 'Hoạt động'}</option>
                    <option value="0">{trans('hancms.status.inactive') || 'Ngừng hoạt động'}</option>
                </select>
                <button type="submit" className="inline-flex items-center justify-center gap-1.5 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors">
                    <Filter size={16} />
                    <span>{trans('hancms.button.filter') || 'Lọc'}</span>
                </button>
                <button
                    type="button"
                    onClick={handleResetFilter}
                    className="inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    <RotateCcw size={16} />
                    <span>{trans('hancms.filter.reset') || 'Làm mới'}</span>
                </button>
            </form>

            <Card>
                <div className="overflow-x-auto">
                    <TableView
                        columns={columns}
                        rows={rows}
                        sendDataSelectItems={handleChildData}
                    />
                </div>
                {links?.length > 0 && <Pagination links={links} />}
            </Card>
        </div>
    );
}

IndexPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.catalog.product.name" children={page} />
);

export default IndexPage;
