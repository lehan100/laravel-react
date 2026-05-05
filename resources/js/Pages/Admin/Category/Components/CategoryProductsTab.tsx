import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import ProductPickerModal from '@/Components/Common/ProductPickerModal';
import MessageError from '@/Components/Form/MessageError';
import { formatProductPrice, getProductCurrencyFromLocale, loadProductCurrency, type ProductCurrency } from '@/Pages/Admin/Product/productUtils';

type ProductRow = {
    id: number;
    sku?: string;
    price?: string | number;
    quantity?: number | string;
    is_stock?: number | boolean;
    image_url?: string | null;
    translations?: Record<string, { name?: string }>;
    name?: string;
};

type Props = {
    data: any;
    setData: (key: string, value: any) => void;
    errors: Record<string, any>;
    itemsSelectedProducts?: ProductRow[];
    trans: (key: string, replace?: Record<string, any>) => string;
    langCode?: string;
    currentLanguage?: any;
};

function getProductName(product: ProductRow, locale: string): string {
    return product.translations?.[locale]?.name || product.translations?.vi?.name || product.name || product.sku || `#${product.id}`;
}

function getProductQuantity(product: ProductRow): number {
    return Number(product.is_stock ? product.quantity ?? 0 : 0);
}

export default function CategoryProductsTab({ data, setData, errors, itemsSelectedProducts = [], trans, langCode, currentLanguage }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [modalProducts, setModalProducts] = useState<ProductRow[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<ProductRow[]>(itemsSelectedProducts);
    const [knownProducts, setKnownProducts] = useState<Record<number, ProductRow>>({});
    const [resolvedCurrency, setResolvedCurrency] = useState<ProductCurrency>(() => getProductCurrencyFromLocale(langCode || 'vi', currentLanguage));
    const locale = langCode || 'vi';
    const modalRows = useMemo(
        () =>
            modalProducts.map((product) => ({
                id: Number(product.id),
                sku: product.sku || `#${product.id}`,
                name: getProductName(product, locale),
                price: Number(product.price ?? 0),
                quantity: Number(product.quantity ?? 0),
                is_stock: product.is_stock,
            })),
        [locale, modalProducts]
    );
    const selectedIds = useMemo(() => {
        return Array.isArray(data.product_ids)
            ? data.product_ids.map((id: any) => Number(id)).filter((id: number) => !Number.isNaN(id))
            : [];
    }, [data.product_ids]);

    useEffect(() => {
        setSelectedProducts(itemsSelectedProducts);
    }, [itemsSelectedProducts]);

    useEffect(() => {
        let mounted = true;

        loadProductCurrency(currentLanguage, langCode || 'vi').then((currency) => {
            if (!mounted) return;
            setResolvedCurrency(currency);
        });

        return () => {
            mounted = false;
        };
    }, [currentLanguage?.code, currentLanguage?.currency, langCode]);

    useEffect(() => {
        if (!isModalOpen) {
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await axios.get(route('category.products-picker'), {
                    params: {
                        search,
                        page,
                        per_page: 12,
                    },
                });

                const rows = Array.isArray(response?.data?.data) ? response.data.data : [];
                const meta = response?.data?.meta || {};

                setModalProducts(rows);
                setLastPage(Number(meta.last_page || 1));
                setKnownProducts((prev) => {
                    const map = { ...prev };
                    rows.forEach((row: ProductRow) => {
                        map[row.id] = row;
                    });
                    return map;
                });
            } catch (_error) {
                setModalProducts([]);
                setLastPage(1);
            } finally {
                setLoading(false);
            }
        }, 250);

        return () => clearTimeout(timeout);
    }, [isModalOpen, page, search]);

    const toggleTempProduct = (product: ProductRow) => {
        const productId = Number(product.id);
        if (selectedIds.includes(productId)) {
            setData('product_ids', selectedIds.filter((id: number) => id !== productId));
            setSelectedProducts((prev) => prev.filter((item) => Number(item.id) !== productId));
            return;
        }

        const nextIds = [...selectedIds, productId];
        setData('product_ids', nextIds);
        setSelectedProducts((prev) => {
            if (prev.some((item) => Number(item.id) === productId)) {
                return prev;
            }

            return [...prev, product];
        });
    };

    const removeSelectedProduct = (productId: number) => {
        setData('product_ids', selectedIds.filter((id: number) => id !== productId));
        setSelectedProducts((prev) => prev.filter((item) => Number(item.id) !== productId));
    };

    const openModal = () => {
        setPage(1);
        setSearch('');
        setIsModalOpen(true);
    };

    const saveModalSelection = () => {
        const nextProducts = selectedIds.map((id: number) => knownProducts[id] || selectedProducts.find((item) => Number(item.id) === id)).filter(Boolean) as ProductRow[];
        setSelectedProducts(nextProducts);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-950">{trans('hancms.catalog.category.products') || 'Sản phẩm của danh mục'}</h3>
                        <p className="mt-1 text-xs text-slate-500">
                            {trans('hancms.catalog.category.products_hint') || 'Chọn các sản phẩm thuộc danh mục này.'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={openModal}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                    >
                        <Plus size={16} />
                        {trans('hancms.button.add') || 'Thêm'}
                    </button>
                </div>

                <div className="mt-4 space-y-3">
                    {selectedProducts.length > 0 ? (
                        selectedProducts.map((product) => (
                            <div key={product.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-semibold text-slate-900">{getProductName(product, locale)}</div>
                                    <div className="mt-1 text-xs text-slate-500">
                                        {product.sku || `#${product.id}`}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeSelectedProduct(Number(product.id))}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
                                >
                                    <Trash2 size={14} />
                                    {trans('hancms.button.delete') || 'Xóa'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                            {trans('hancms.message.empty') || 'Chưa có sản phẩm nào được chọn.'}
                        </div>
                    )}
                </div>

                {errors.product_ids && (
                    <div className="mt-3">
                        <MessageError>{errors.product_ids}</MessageError>
                    </div>
                )}
            </div>

            <ProductPickerModal
                title={trans('hancms.catalog.category.products_picker') || 'Chọn sản phẩm'}
                isOpen={isModalOpen}
                search={search}
                categoryFilter="all"
                categoryOptions={[]}
                rows={modalRows}
                loading={loading}
                currentPage={page}
                totalPages={lastPage}
                selectedIds={selectedIds}
                onClose={() => setIsModalOpen(false)}
                onConfirm={saveModalSelection}
                onSearchChange={setSearch}
                onCategoryFilterChange={() => {}}
                onToggleProduct={(productId) => {
                    const product = modalProducts.find((item) => Number(item.id) === Number(productId));
                    if (product) {
                        toggleTempProduct(product);
                    }
                }}
                onPreviousPage={() => setPage((prev) => Math.max(1, prev - 1))}
                onNextPage={() => setPage((prev) => Math.min(lastPage, prev + 1))}
                formatPrice={(price) => formatProductPrice(price, resolvedCurrency)}
                trans={trans}
                allCategoriesLabel={trans('hancms.catalog.category.type.options.select') || 'Tất cả danh mục'}
                loadingLabel={trans('hancms.message.loading') || 'Đang tải...'}
                emptyLabel={trans('hancms.message.empty') || 'Không có dữ liệu'}
            />
        </div>
    );
}
