import StatusBadge from '@/Components/Status/StatusBadge';

type ProductRow = {
    id: number;
    sku: string;
    name: string;
    price: number;
    status: number;
};

type SelectedProductsTableProps = {
    rows: ProductRow[];
    emptyLabel: string;
    addLabel: string;
    countLabel: string;
    onOpenPicker: () => void;
    onRemove: (productId: number) => void;
    formatPrice: (price: number) => string;
    trans: (key: string, params?: Record<string, any>) => string;
};

export default function SelectedProductsTable({
    rows,
    emptyLabel,
    addLabel,
    countLabel,
    onOpenPicker,
    onRemove,
    formatPrice,
    trans,
}: SelectedProductsTableProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500">
                    {rows.length} {countLabel}
                </span>
                <button
                    type="button"
                    onClick={onOpenPicker}
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                    + {addLabel}
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">ID</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.sku')}</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.name')}</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.price')}</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.status')}</th>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.action')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-3 py-6 text-center text-slate-400">
                                    {emptyLabel}
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={row.id}>
                                    <td className="px-3 py-2">{row.id}</td>
                                    <td className="px-3 py-2">{row.sku}</td>
                                    <td className="px-3 py-2">{row.name}</td>
                                    <td className="px-3 py-2">{formatPrice(row.price)}</td>
                                    <td className="px-3 py-2">
                                        <StatusBadge
                                            value={row.status}
                                            activeLabel={trans('hancms.status.active')}
                                            inactiveLabel={trans('hancms.status.inactive')}
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <button
                                            type="button"
                                            onClick={() => onRemove(row.id)}
                                            className="rounded-md border border-rose-300 px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                        >
                                            {trans('hancms.button.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
