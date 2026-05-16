import axios from 'axios';
import { useEffect, useState } from 'react';

export type ProductPickerCategory = {
    id: string;
    name: string;
};

export type ProductPickerRow = {
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

type UseProductPickerModalOptions = {
    routeName: string;
    pageSize?: number;
};

export function useProductPickerModal({ routeName, pageSize = 10 }: UseProductPickerModalOptions) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [rows, setRows] = useState<ProductPickerRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const open = (initialSelectedIds: number[]): void => {
        setSelectedIds(initialSelectedIds);
        setSearch('');
        setCategoryFilter('all');
        setPage(1);
        setIsOpen(true);
    };

    const close = (): void => {
        setIsOpen(false);
    };

    const toggleSelected = (productId: number): void => {
        setSelectedIds((current) => (
            current.includes(productId)
                ? current.filter((id) => id !== productId)
                : [...current, productId]
        ));
    };

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await axios.get(route(routeName), {
                    params: {
                        search,
                        category_id: categoryFilter,
                        page,
                        per_page: pageSize,
                    },
                });

                const responseRows = Array.isArray(response?.data?.data) ? response.data.data : [];
                const meta = response?.data?.meta || {};

                setRows(responseRows);
                setCurrentPage(Number(meta.current_page || 1));
                setTotalPages(Number(meta.last_page || 1));
            } catch (_error) {
                setRows([]);
                setCurrentPage(1);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        }, 250);

        return () => clearTimeout(timeout);
    }, [categoryFilter, isOpen, page, pageSize, routeName, search]);

    return {
        categoryFilter,
        close,
        currentPage,
        isOpen,
        loading,
        open,
        page,
        rows,
        search,
        selectedIds,
        setCategoryFilter,
        setPage,
        setSearch,
        setSelectedIds,
        totalPages,
        toggleSelected,
    };
}
