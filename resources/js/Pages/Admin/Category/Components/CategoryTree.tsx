import React, { useMemo, useState, useEffect } from 'react';
import {
    ChevronRight,
    ChevronDown,
    Folder,
    FolderOpen,
    Trash2,
    Hash
} from 'lucide-react';
import { useTrans } from '@/Hooks/useTrans';
import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/Status/StatusBadge';

interface Props {
    data: any[];
    onDelete: (id: number) => void;
    activeId?: number;
    locale: string;
}

const CategoryTree = ({ data, onDelete, activeId, locale }: Props) => {
    const { trans } = useTrans();
    const [expanded, setExpanded] = useState<number[]>([]);
    const treeData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const map: { [key: number]: any } = {};
        const roots: any[] = [];

        // Tạo bản đồ tham chiếu
        data.forEach(item => {
            map[item.id] = { ...item, children: [] };
        });

        data.forEach(item => {
            const parentId = item.parent_id;
            if (parentId && map[parentId]) {
                map[parentId].children.push(map[item.id]);
            } else {
                roots.push(map[item.id]);
            }
        });

        return roots;
    }, [data]);
    useEffect(() => {
        if (activeId && data.length > 0) {
            const parentIds: number[] = [];
            // Trace back to the root to find all ancestor IDs
            const findParents = (currentId: number) => {
                const item = data.find(i => i.id === currentId);
                if (item && item.parent_id) {
                    parentIds.push(item.parent_id);
                    findParents(item.parent_id);// Recursive call for higher levels
                }
            };

            findParents(activeId);

            setExpanded(prev => Array.from(new Set([...prev, ...parentIds])));
        }
    }, [activeId, data]);

    const toggleExpand = (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setExpanded(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const renderNodes = (nodes: any[], level: number = 0) => {
        return nodes.map((node) => {
            const isActive = activeId === node.id;
            const isExpanded = expanded.includes(node.id);
            const hasChildren = node.children && node.children.length > 0;
            const displayName = node.translations?.[locale]?.name || 'Unnamed';

            /**
             * Logic check: Inactive status
             * If status is 0 (or not 1), we apply faded styles.
             */
            const isInactive = node.status === 0;

            return (
                <div key={node.id} className="w-full">
                    <div
                        className={`
                        group flex items-center justify-between py-1.5 px-3 rounded-md transition-all mb-1
                        ${isActive ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'hover:bg-gray-100 text-gray-600'}
                    `}
                        style={{ marginLeft: `${level * 16}px` }}
                    >
                        <Link
                            href={route('category.edit', { id: node.id })}
                            className={`
                                flex items-center overflow-hidden flex-1 cursor-pointer
                                ${isInactive ? 'opacity-50 grayscale-[0.5]' : ''} /* Faded style for inactive items */
                            `}
                        >
                            {/* SLOT 1: Toggle area - Fixed width w-6 to keep folders aligned */}
                            <div
                                onClick={(e) => { if (hasChildren) toggleExpand(node.id, e); }}
                                className="w-6 h-6 flex items-center justify-center shrink-0 mr-1"
                            >
                                {hasChildren && (
                                    isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                                )}
                            </div>

                            {/* SLOT 2: Folder Icon - Always aligned in Slot 2 */}
                            <div className="shrink-0 mr-2">
                                {hasChildren ? (
                                    isExpanded ? <FolderOpen size={16} className="text-yellow-500" /> : <Folder size={16} className="text-yellow-500" />
                                ) : (
                                    <Folder size={16} className="text-orange-400" />
                                )}
                            </div>

                            {/* SLOT 3: Label - Text gets lighter if inactive */}
                            <div className="flex items-center gap-2 overflow-hidden">
                                <span className={`truncate`}>
                                    {displayName}
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
