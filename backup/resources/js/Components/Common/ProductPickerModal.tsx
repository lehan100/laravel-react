import { createPortal } from 'react-dom';

type ProductPickerCategory = {
    id: string;
    name: string;
};

type ProductPickerRow = {
    id: number;
    sku: string;
    name: string;
    price: number;
    quantity?: number | string;
    is_stock?: number | string | boolean;
    has_variants?: boolean;
    variants?: Array<{
        id: number;
        sku?: string | null;
        name?: string;
        label?: string;
        price?: number;
        stock?: number;
    }>;
    campaigns?: Array<{
        id: number;
        name: string;
        slug?: string;
        ends_at?: string | null;
        is_active?: boolean;
    }>;
};

type ProductPickerModalProps = {
    title: string;
    isOpen: boolean;
    search: string;
    categoryFilter: string;
    categoryOptions: ProductPickerCategory[];
    rows: ProductPickerRow[];
    loading: boolean;
    currentPage: number;
    totalPages: number;
    selectedIds: number[];
    onClose: () => void;
    onConfirm: () => void;
    onSearchChange: (value: string) => void;
    onCategoryFilterChange: (value: string) => void;
    onToggleProduct: (productId: number) => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
    formatPrice: (price: number) => string;
    trans: (key: string, params?: Record<string, any>) => string;
    allCategoriesLabel: string;
    loadingLabel?: string;
    emptyLabel?: string;
    requireStock?: boolean;
    showCampaigns?: boolean;
};

export default function ProductPickerModal({
    title,
    isOpen,
    search,
    categoryFilter,
    categoryOptions,
    rows,
    loading,
    currentPage,
    totalPages,
    selectedIds,
    onClose,
    onConfirm,
    onSearchChange,
    onCategoryFilterChange,
    onToggleProduct,
    onPreviousPage,
    onNextPage,
    formatPrice,
    trans,
    allCategoriesLabel,
    loadingLabel,
    emptyLabel,
    requireStock = false,
    showCampaigns = false,
}: ProductPickerModalProps) {
    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 py-6">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative z-10 flex w-full max-w-5xl max-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
                    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                    <button type="button" className="text-slate-500 hover:text-slate-700" onClick={onClose}>✕</button>
                </div>

                <div className="flex-1 min-h-0 space-y-3 overflow-auto p-5">
                    <div className="grid gap-3 md:grid-cols-2">
                        <input
                            type="text"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            placeholder={trans('hancms.filter.search')}
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        <select
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            value={categoryFilter}
                            onChange={(e) => onCategoryFilterChange(e.target.value)}
                        >
                            <option value="all">{allCategoriesLabel}</option>
                            {categoryOptions.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="w-14 px-3 py-2 text-left font-semibold text-slate-600">#</th>
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">ID</th>
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.sku')}</th>
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.name')}</th>
                                    {showCampaigns && (
                                        <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.promotion.campaign.name')}</th>
                                    )}
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.price')}</th>
                                    <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.quantity')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {loading ? (
                                    <tr>
                                        <td colSpan={showCampaigns ? 7 : 6} className="px-3 py-6 text-center text-slate-400">
                                            {loadingLabel ?? trans('hancms.loading')}
                                        </td>
                                    </tr>
                                ) : rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={showCampaigns ? 7 : 6} className="px-3 py-6 text-center text-slate-400">
                                            {emptyLabel ?? trans('hancms.no_data')}
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((row) => {
                                        const quantity = Number(row.quantity ?? 0);
                                        const isOutOfStock = requireStock && quantity <= 0;

                                        return (
                                            <tr key={row.id} className={isOutOfStock ? 'bg-slate-50 text-slate-400' : ''}>
                                                <td className="px-3 py-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(row.id)}
                                                        disabled={isOutOfStock}
                                                        onChange={() => onToggleProduct(row.id)}
                                                    />
                                                </td>
                                                <td className="px-3 py-2">{row.id}</td>
                                                <td className="px-3 py-2">{row.sku}</td>
                                                <td className="px-3 py-2">{row.name}</td>
                                                {showCampaigns && (
                                                    <td className="px-3 py-2">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {(row.campaigns || []).length > 0 ? (
                                                                row.campaigns!.map((campaign) => (
                                                                    <span
                                                                        key={campaign.id}
                                                                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                                                            campaign.is_active
                                                                                ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                                                                                : 'bg-slate-50 text-slate-500 ring-1 ring-slate-200'
                                                                        }`}
                                                                        title={campaign.ends_at ?? ''}
                                                                    >
                                                                        {campaign.name}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-xs text-slate-400">{trans('hancms.no_data')}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="px-3 py-2">{formatPrice(row.price)}</td>
                                                <td className="px-3 py-2">
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${isOutOfStock ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'}`}>
                                                        {quantity}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-500">Trang {currentPage}/{totalPages}</span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={currentPage <= 1}
                                onClick={onPreviousPage}
                            >
                                Prev
                            </button>
                            <button
                                type="button"
                                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={currentPage >= totalPages}
                                onClick={onNextPage}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        {trans('hancms.button.cancel')}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        {trans('hancms.button.confirm')}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
