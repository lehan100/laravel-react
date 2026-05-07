import React, { useEffect, useMemo, useState } from 'react';
import {
    ChevronRight,
    ChevronDown,
    Folder,
    FolderOpen,
    Trash2,
    GripVertical,
    Loader2,
    Package,
    Newspaper,
    BookOpenText,
    FileText,
    PhoneCall,
} from 'lucide-react';
import { useTrans } from '@/Hooks/useTrans';
import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/Status/StatusBadge';
import axios from 'axios';

type CategoryNode = {
    id: number;
    parent_id?: number | null;
    status?: number;
    type?: string;
    order?: number;
    products_count?: number;
    posts_count?: number;
    tree_products_count?: number;
    tree_posts_count?: number;
    translations?: Record<string, { name?: string }>;
    children?: CategoryNode[];
};

type DropTarget = {
    id: number;
    position: 'before' | 'after';
} | null;

interface Props {
    data: CategoryNode[];
    onDelete: (id: number) => void;
    activeId?: number;
    locale: string;
}

const TYPE_META = {
    news: { labelKey: 'hancms.catalog.category.type.options.news', icon: Newspaper, className: 'bg-blue-50 text-blue-700 border-blue-200' },
    blog: { labelKey: 'hancms.catalog.category.type.options.blog', icon: BookOpenText, className: 'bg-violet-50 text-violet-700 border-violet-200' },
    page: { labelKey: 'hancms.catalog.category.type.options.page', icon: FileText, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    contact: { labelKey: 'hancms.catalog.category.type.options.contact', icon: PhoneCall, className: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    product: { labelKey: 'hancms.catalog.category.type.options.product', icon: Package, className: 'bg-amber-50 text-amber-700 border-amber-200' },
} as const;

function getTypeMeta(type?: string) {
    const normalized = String(type || 'product').toLowerCase() as keyof typeof TYPE_META;
    return TYPE_META[normalized] || TYPE_META.product;
}

function buildTree(data: CategoryNode[]) {
    const map = new Map<number, CategoryNode>();
    const roots: CategoryNode[] = [];
    const ordered = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    ordered.forEach((item) => map.set(item.id, { ...item, children: [] }));

    ordered.forEach((item) => {
        const node = map.get(item.id);
        if (!node) return;

        if (item.parent_id && map.has(item.parent_id)) {
            map.get(item.parent_id)?.children?.push(node);
        } else {
            roots.push(node);
        }
    });

    return roots;
}

function findAncestorIds(data: CategoryNode[], nodeId: number) {
    const ancestorIds: number[] = [];
    let current = data.find((item) => item.id === nodeId);

    while (current?.parent_id) {
        ancestorIds.push(current.parent_id);
        current = data.find((item) => item.id === current?.parent_id);
    }

    return ancestorIds;
}

function resolveTreeProductCount(node: CategoryNode): number {
    const directCount = Number(node.products_count ?? 0);
    const childrenCount = (node.children || []).reduce((total, child) => total + resolveTreeProductCount(child), 0);

    return directCount + childrenCount;
}

function resolveTreePostCount(node: CategoryNode): number {
    const directCount = Number(node.posts_count ?? 0);
    const childrenCount = (node.children || []).reduce((total, child) => total + resolveTreePostCount(child), 0);

    return directCount + childrenCount;
}

function resolveTreeCount(node: CategoryNode): number {
    if ((node.type ?? 'product') === 'news') {
        return Number(node.tree_posts_count ?? resolveTreePostCount(node));
    }

    return Number(node.tree_products_count ?? resolveTreeProductCount(node));
}

function resolveCountLabelKey(type?: string): string {
    if ((type ?? 'product') === 'news') {
        return 'hancms.catalog.category.tree_count.news';
    }

    return 'hancms.catalog.category.tree_count.product';
}

const CategoryTree = ({ data, onDelete, activeId, locale }: Props) => {
    const { trans } = useTrans();
    const [expanded, setExpanded] = useState<number[]>([]);
    const [treeItems, setTreeItems] = useState<CategoryNode[]>(data || []);
    const [draggingId, setDraggingId] = useState<number | null>(null);
    const [dropTarget, setDropTarget] = useState<DropTarget>(null);
    const [savingSort, setSavingSort] = useState(false);

    useEffect(() => {
        setTreeItems(data || []);
    }, [data]);

    const treeData = useMemo(() => buildTree(treeItems || []), [treeItems]);

    useEffect(() => {
        if (!activeId || treeItems.length === 0) return;

        const parentIds = findAncestorIds(treeItems, activeId);
        setExpanded((prev) => Array.from(new Set([...prev, ...parentIds])));
    }, [activeId, treeItems]);

    const toggleExpand = (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setExpanded(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const normalizeParentId = (value?: number | null) => {
        if (value === null || value === undefined || value === 0) return null;
        return Number(value);
    };

    const sortByOrder = (a: CategoryNode, b: CategoryNode) => (a.order ?? 0) - (b.order ?? 0);

    const reorderTreeItems = (
        items: CategoryNode[],
        sourceId: number,
        targetId: number,
        position: 'before' | 'after'
    ) => {
        if (sourceId === targetId) return items;

        const next = items.map((item) => ({ ...item }));
        const source = next.find((item) => item.id === sourceId);
        const target = next.find((item) => item.id === targetId);
        if (!source || !target) return items;

        const oldParent = normalizeParentId(source.parent_id);
        const newParent = normalizeParentId(target.parent_id);

        const oldSiblings = next
            .filter((item) => normalizeParentId(item.parent_id) === oldParent && item.id !== sourceId)
            .sort(sortByOrder);

        const newSiblings = (oldParent === newParent
            ? oldSiblings
            : next.filter((item) => normalizeParentId(item.parent_id) === newParent && item.id !== sourceId).sort(sortByOrder));

        const targetIndexRaw = newSiblings.findIndex((item) => item.id === targetId);
        if (targetIndexRaw === -1) return items;
        const insertIndex = position === 'after' ? targetIndexRaw + 1 : targetIndexRaw;
        newSiblings.splice(insertIndex, 0, source);

        if (oldParent !== newParent) {
            oldSiblings.forEach((item, index) => {
                item.parent_id = oldParent;
                item.order = index;
            });
        }

        newSiblings.forEach((item, index) => {
            item.parent_id = newParent;
            item.order = index;
        });

        return next;
    };

    const saveReorder = async (items: CategoryNode[]) => {
        const payload = items.map((item) => ({
            id: item.id,
            parent_id: normalizeParentId(item.parent_id),
            order: Number(item.order ?? 0),
        }));

        setSavingSort(true);
        try {
            await axios.post(route('category.reorder'), { items: payload });
        } catch (_error) {
            setTreeItems(data || []);
        } finally {
            setSavingSort(false);
        }
    };

    const renderNodes = (nodes: CategoryNode[], level = 0) => {
        return nodes.map((node) => {
            const isActive = activeId === node.id;
            const isExpanded = expanded.includes(node.id);
            const hasChildren = !!node.children?.length;
            const displayName = node.translations?.[locale]?.name || 'Unnamed';
            const typeMeta = getTypeMeta(node.type);
            const TypeIcon = typeMeta.icon;
            const isInactive = node.status === 0;
            const treeCount = resolveTreeCount(node);
            const countLabelKey = resolveCountLabelKey(node.type);
            const isDragging = draggingId === node.id;
            const isDropTarget = dropTarget?.id === node.id && draggingId !== null && draggingId !== node.id;
            const showDropBefore = isDropTarget && dropTarget?.position === 'before';
            const showDropAfter = isDropTarget && dropTarget?.position === 'after';

            return (
                <div key={node.id} className="w-full">
                    <div
                        className={`
                        group relative flex items-center justify-between py-1.5 px-3 rounded-md transition-all mb-1 border
                        ${isActive ? 'bg-indigo-100 text-indigo-700 shadow-sm border-indigo-200' : 'hover:bg-gray-100 text-gray-600 border-transparent'}
                        ${isDragging ? 'opacity-50 scale-[0.995] shadow-md' : ''}
                        ${isDropTarget ? 'border-indigo-200 bg-indigo-50/40' : ''}
                        ${savingSort ? 'pointer-events-none opacity-80' : ''}
                    `}
                        style={{ marginLeft: `${level * 16}px` }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            const rect = e.currentTarget.getBoundingClientRect();
                            const offset = e.clientY - rect.top;
                            const nextPosition = offset < rect.height / 2 ? 'before' : 'after';
                            setDropTarget((current) => {
                                if (current?.id === node.id && current.position === nextPosition) return current;
                                return { id: node.id, position: nextPosition };
                            });
                        }}
                        onDragEnter={(e) => {
                            e.preventDefault();
                        }}
                        onDragLeave={() => {
                            setDropTarget((current) => (current?.id === node.id ? null : current));
                        }}
                        onDrop={async (e) => {
                            e.preventDefault();
                            if (draggingId === null || draggingId === node.id || savingSort || !dropTarget) {
                                setDropTarget(null);
                                return;
                            }

                            const reordered = reorderTreeItems(treeItems, draggingId, node.id, dropTarget.position);
                            setTreeItems(reordered);
                            setDropTarget(null);
                            setDraggingId(null);
                            await saveReorder(reordered);
                        }}
                        onDragEnd={() => {
                            setDraggingId(null);
                            setDropTarget(null);
                        }}
                    >
                        {showDropBefore && (
                            <div className="pointer-events-none absolute left-2 right-2 top-0 h-0.5 rounded-full bg-indigo-500" />
                        )}
                        {showDropAfter && (
                            <div className="pointer-events-none absolute left-2 right-2 bottom-0 h-0.5 rounded-full bg-indigo-500" />
                        )}

                        <Link
                            href={route('category.edit', { id: node.id })}
                            className={`
                                flex items-center overflow-hidden flex-1 cursor-pointer
                                ${isInactive ? 'opacity-50 grayscale-[0.5]' : ''} /* Faded style for inactive items */
                                ${draggingId !== null ? 'pointer-events-none' : ''}
                            `}
                        >
                            <div
                                onClick={(e) => { if (hasChildren) toggleExpand(node.id, e); }}
                                className="w-6 h-6 flex items-center justify-center shrink-0 mr-1"
                            >
                                {hasChildren && (
                                    isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                                )}
                            </div>

                            <div className="shrink-0 mr-2">
                                {hasChildren ? (
                                    isExpanded ? <FolderOpen size={16} className="text-yellow-500" /> : <Folder size={16} className="text-yellow-500" />
                                ) : (
                                    <Folder size={16} className="text-orange-400" />
                                )}
                            </div>

                            <div className="flex items-center gap-2 overflow-hidden">
                                <span className={`truncate`}>
                                    {displayName}
                                </span>
                                <span
                                    className={`inline-flex items-center justify-center rounded-full border p-1 ${typeMeta.className}`}
                                    title={`${trans('hancms.catalog.category.type.label')}: ${trans(typeMeta.labelKey)}`}
                                >
                                    <TypeIcon size={11} />
                                </span>

                                <span
                                    className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
                                    title={trans(countLabelKey)}
                                >
                                    {treeCount}
                                </span>

                                {isInactive && (
                                    <StatusBadge
                                        value={0}
                                        activeLabel={trans('hancms.status.active')}
                                        inactiveLabel={trans('hancms.status.inactive')}
                                        className="ml-1 scale-90"
                                    />
                                )}
                            </div>
                        </Link>

                        <button
                            type="button"
                            draggable={!savingSort}
                            onDragStart={(e) => {
                                setDraggingId(node.id);
                                e.dataTransfer.effectAllowed = 'move';
                                e.dataTransfer.setData('text/plain', String(node.id));
                            }}
                            onDragEnd={() => {
                                setDraggingId(null);
                                setDropTarget(null);
                            }}
                            className="mr-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 cursor-grab active:cursor-grabbing"
                            title={trans('hancms.catalog.category.tree_drag') || 'Drag to reorder'}
                        >
                            {savingSort ? <Loader2 size={14} className="animate-spin" /> : <GripVertical size={14} />}
                        </button>

                        <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(node.id); }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-100 rounded transition-opacity shrink-0"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                    {hasChildren && isExpanded && (
                        <div className="border-l border-gray-200 ml-6">
                            {renderNodes(node.children, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    };


    return (
        <div className="category-tree-container select-none py-2">
            {treeData.length > 0 ? (
                renderNodes(treeData)
            ) : (
                <div className="text-center py-10 text-gray-400 text-sm italic">
                    {trans('hancms.catalog.category.no_data')}
                </div>
            )}
        </div>
    );
};

export default CategoryTree;
