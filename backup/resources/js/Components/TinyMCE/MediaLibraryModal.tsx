import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import {
    X,
    Loader2,
    ImageIcon,
    Folder,
    ArrowLeft,
    ChevronRight,
    Home,
    FolderPlus,
    Upload,
    Move,
    Trash2,
    Edit2Icon,
    Copy,
    Check,
    Search,
} from 'lucide-react';
import { useTrans } from '@/Hooks/useTrans';

type MediaInfo = {
    width?: number;
    height?: number;
    size?: string;
    count?: number;
};

type Breadcrumb = {
    name: string;
    path: string;
};

type MediaItem = {
    type: 'file' | 'folder';
    name: string;
    path: string;
    url?: string;
    info?: MediaInfo;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    onSelectItem?: (item: MediaItem) => void;
};

type AlertType = 'success' | 'error';

type UiAlert = {
    id: string;
    type: AlertType;
    message: string;
};

const MediaLibraryModal = ({ isOpen, onClose, onSelect, onSelectItem }: Props) => {
    const { trans } = useTrans();
    const [items, setItems] = useState<MediaItem[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [currentPath, setCurrentPath] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [draggingItem, setDraggingItem] = useState<MediaItem | null>(null);
    const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
    const [query, setQuery] = useState('');
    const [copied, setCopied] = useState(false);
    const [alerts, setAlerts] = useState<UiAlert[]>([]);

    const pushAlert = useCallback((type: AlertType, message: string) => {
        const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
        setAlerts((prev) => [{ id, type, message }, ...prev].slice(0, 3));
        window.setTimeout(() => {
            setAlerts((prev) => prev.filter((item) => item.id !== id));
        }, 3500);
    }, []);

    const fetchMedia = useCallback((path = '') => {
        setLoading(true);
        // @ts-ignore
        axios.get(route('media.get.images', { path })).then(res => {
            const payload = res.data || {};
            setItems(Array.isArray(payload.items) ? payload.items : []);
            setBreadcrumbs(Array.isArray(payload.breadcrumbs) ? payload.breadcrumbs : []);
            setCurrentPath(path);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const filteredItems = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((item) => (item.name || '').toLowerCase().includes(q));
    }, [items, query]);

    const handleGoBack = useCallback(() => {
        if (!currentPath) {
            fetchMedia('');
            return;
        }

        const parentPath = currentPath.split('/').filter(Boolean).slice(0, -1).join('/');
        fetchMedia(parentPath);
    }, [currentPath, fetchMedia]);

    const uploadFiles = async (files: FileList) => {
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('file', file));
        formData.append('path', currentPath);
        setUploading(true);
        try {
            // @ts-ignore
            await axios.post(route('media.upload.tinymce'), formData);
            pushAlert('success', trans('hancms.tinymce.message.success.upload'));
            fetchMedia(currentPath);
        } catch (error) {
            pushAlert('error', trans('hancms.tinymce.message.error.upload'));
        } finally {
            setUploading(false);
        }
    };

    const handleMoveItem = async (targetFolderPath: string) => {
        if (!draggingItem || draggingItem.type === 'folder') return;
        setLoading(true);
        try {
            // @ts-ignore
            await axios.post(route('media.move.file'), {
                file_path: draggingItem.path,
                target_path: targetFolderPath
            });
            fetchMedia(currentPath);
        } catch (error) {
            pushAlert('error', trans('hancms.tinymce.message.error.move'));
        } finally {
            setDraggingItem(null);
            setLoading(false);
        }
    };

    const handleCreateFolder = async (e?: any) => {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        if (!newFolderName.trim()) return;
        try {
            // @ts-ignore
            await axios.post(route('media.create.folder'), { name: newFolderName, path: currentPath });
            setNewFolderName('');
            setIsCreating(false);
            fetchMedia(currentPath);
        } catch (error) {
            pushAlert('error', trans('hancms.tinymce.message.error.create_folder'));
        }
    };
    const handleDelete = async (e: any, item: any) => {
        e.stopPropagation();
        const typeLabel = item.type === 'folder'
            ? trans('hancms.tinymce.label.folder')
            : trans('hancms.tinymce.label.file');
        if (!confirm(trans('hancms.tinymce.message.delete', { name: typeLabel }))) return;

        setLoading(true);
        try {
            // @ts-ignore
            await axios.post(route('media.delete'), { path: item.path, type: item.type });
            if (selectedItem?.path === item.path) {
                setSelectedItem(null);
            }
            pushAlert('success', trans('hancms.tinymce.message.success.delete'));
            fetchMedia(currentPath);
        } catch (error) {
            pushAlert('error', trans('hancms.tinymce.message.error.delete'));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDirect = async (item: MediaItem) => {
        const typeLabel = item.type === 'folder'
            ? trans('hancms.tinymce.label.folder')
            : trans('hancms.tinymce.label.file');
        if (!confirm(trans('hancms.tinymce.message.delete', { name: typeLabel }))) return;

        setLoading(true);
        try {
            // @ts-ignore
            await axios.post(route('media.delete'), { path: item.path, type: item.type });
            if (selectedItem?.path === item.path) {
                setSelectedItem(null);
            }
            pushAlert('success', trans('hancms.tinymce.message.success.delete'));
            fetchMedia(currentPath);
        } catch (_error) {
            pushAlert('error', trans('hancms.tinymce.message.error.delete'));
        } finally {
            setLoading(false);
        }
    };

    // Hàm xử lý Đổi tên
    const handleRename = async (e: any, item: any) => {
        e.stopPropagation();
        const newName = prompt(trans('hancms.tinymce.label.new_name'), item.name);
        if (!newName || newName === item.name) return;

        setLoading(true);
        try {
            // @ts-ignore
            const response = await axios.post(route('media.rename'), {
                old_path: item.path.replace(/^\/+/, ''),
                new_name: newName,
                type: item.type
            });
            if (selectedItem?.path === item.path) {
                setSelectedItem((current) => (
                    current
                        ? {
                            ...current,
                            name: response.data?.name || newName,
                            path: response.data?.path || current.path,
                        }
                        : current
                ));
            }
            fetchMedia(currentPath);
        } catch (error) {
            pushAlert('error', trans('hancms.tinymce.message.error.rename'));
        } finally {
            setLoading(false);
        }
    };

    const getRelativeUrl = (item: MediaItem): string => {
        const itemUrl = item.url || '';
        if (!itemUrl) return '';
        return itemUrl.replace(window.location.origin, '');
    };

    const insertSelected = (item: MediaItem) => {
        const relativeUrl = getRelativeUrl(item);
        if (!relativeUrl) return;
        onSelect(relativeUrl);
        onSelectItem?.(item);
        onClose();
    };

    const copySelectedUrl = async (item: MediaItem) => {
        const url = getRelativeUrl(item);
        if (!url) return;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
        } catch (_e) {
            prompt('Copy URL', url);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setCopied(false);
            setSelectedItem(null);
            setAlerts([]);
            setBreadcrumbs([]);
            fetchMedia('');
        }
        if (!isOpen) {
            setDraggingItem(null);
            setIsCreating(false);
            setQuery('');
            setCopied(false);
            setSelectedItem(null);
            setAlerts([]);
            setBreadcrumbs([]);
        }
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose, fetchMedia]);

    const handleItemClick = (item: any) => {
        if (item.type === 'folder') {
            fetchMedia(item.path);
        } else {
            setSelectedItem(item);
        }
    };

    if (!isOpen) return null;

    const portalTarget = typeof document !== 'undefined' ? document.body : null;

    if (!portalTarget) return null;

    return createPortal(
        <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-[96vw] max-w-6xl h-[92vh] max-h-[92vh] sm:w-full sm:h-auto sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative border border-white/20">

                <div className="flex flex-col gap-3 border-b bg-gray-50/80 p-3 backdrop-blur-md z-30 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                            <ImageIcon className="text-white" size={18} />
                        </div>
                        <h3 className="font-black text-gray-800 text-[13px] uppercase tracking-wider sm:text-[14px]">{trans('hancms.tinymce.name')}</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <label className="flex flex-1 min-w-[130px] items-center justify-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-xl text-[11px] font-black hover:bg-emerald-600 cursor-pointer shadow-md shadow-emerald-100 active:scale-95 transition-all uppercase tracking-tighter sm:flex-none sm:px-4 sm:text-[12px]">
                            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                            {trans('hancms.tinymce.button.upload_image')}
                            <input type="file" className="hidden" multiple onChange={(e) => e.target.files && uploadFiles(e.target.files)} accept="image/*" />
                        </label>

                        <button
                            type="button"
                            onClick={() => setIsCreating(true)}
                            className="flex flex-1 min-w-[130px] items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-xl text-[11px] font-black hover:bg-indigo-700 shadow-md shadow-indigo-100 active:scale-95 transition-all uppercase tracking-tighter sm:flex-none sm:px-4 sm:text-[12px]"
                        >
                            <FolderPlus size={14} />  {trans('hancms.tinymce.button.create_folder')}
                        </button>

                        <button type="button" onClick={onClose} className="ml-auto rounded-full p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 sm:ml-1">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap border-b bg-white px-4 py-2 text-[10px] font-bold text-gray-400 shadow-sm sm:px-6 sm:py-2.5 sm:text-[11px] z-20">
                    <button
                        type="button"
                        onClick={handleGoBack}
                        disabled={!currentPath}
                        className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-600 transition-colors hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ArrowLeft size={12} />
                        Back
                    </button>
                    <button type="button" onClick={() => fetchMedia('')} className="hover:text-indigo-600 flex items-center gap-1 transition-colors"><Home size={14} /> Root</button>
                    {breadcrumbs.map((folder, i) => (
                        <React.Fragment key={i}>
                            <ChevronRight size={12} className="text-gray-300" />
                            <button type="button" onClick={() => fetchMedia(folder.path)} className="hover:text-indigo-600 transition-colors">{folder.name}</button>
                        </React.Fragment>
                    ))}
                </div>

                <div
                    className="relative flex-1 overflow-y-auto bg-white p-4 custom-scrollbar sm:min-h-[400px] sm:p-6"
                    onClick={() => setDraggingItem(null)}
                >
                    {(uploading || loading) && (
                        <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                                <Loader2 className="animate-spin text-indigo-600" size={48} />
                                <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest text-center">{trans('hancms.tinymce.message.data_warning')}</span>
                            </div>
                        </div>
                    )}

                    {alerts.length ? (
                        <div className="mb-4 space-y-2 sm:mb-6">
                            {alerts.map((alertItem) => (
                                <div
                                    key={alertItem.id}
                                    className={`rounded-2xl border px-4 py-3 shadow-sm ${
                                        alertItem.type === 'success'
                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                            : 'border-rose-200 bg-rose-50 text-rose-800'
                                    }`}
                                    role="alert"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="text-[12px] font-bold leading-relaxed">
                                            {alertItem.message}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAlerts((prev) => prev.filter((item) => item.id !== alertItem.id))}
                                            className="rounded-xl p-1 text-current/60 hover:bg-white/60 hover:text-current"
                                            aria-label="Dismiss"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-md">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={trans('hancms.tinymce.label.search') || 'Search...'}
                                className="w-full rounded-2xl border border-gray-200 bg-white pl-10 pr-3 py-2.5 text-[12px] font-bold text-gray-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                            />
                        </div>
                        {selectedItem?.type === 'file' ? (
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => copySelectedUrl(selectedItem)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-widest text-gray-600 shadow-sm transition-all active:scale-95 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied
                                        ? (trans('hancms.tinymce.button.copied') || 'Copied')
                                        : (trans('hancms.tinymce.button.copy_url') || 'Copy URL')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertSelected(selectedItem)}
                                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-white shadow-md shadow-indigo-100 transition-all active:scale-95 hover:bg-indigo-700"
                                >
                                    <ImageIcon size={14} />
                                    {trans('hancms.tinymce.button.insert') || 'Insert'}
                                </button>
                            </div>
                        ) : null}
                    </div>

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-4">
                        {isCreating && (
                            <div className="border-2 border-indigo-400 rounded-2xl p-3 bg-indigo-50 flex flex-col items-center justify-center gap-3 aspect-square shadow-inner animate-in zoom-in-95 sm:p-4">
                                <Folder size={40} className="text-indigo-400 fill-indigo-100" />
                                <input autoFocus className="w-full text-[11px] p-2 border-2 border-indigo-200 rounded-xl outline-none focus:border-indigo-600 bg-white font-bold text-center" placeholder="Tên thư mục..." value={newFolderName} onChange={e => setNewFolderName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreateFolder()} />
                                <div className="flex gap-2 w-full">
                                    <button type="button" onClick={handleCreateFolder} className="flex-1 bg-indigo-600 text-white text-[10px] py-2 rounded-xl font-black shadow-md active:scale-95 transition-all">{trans('hancms.tinymce.button.save')}</button>
                                    <button type="button" onClick={() => setIsCreating(false)} className="flex-1 bg-white text-gray-500 text-[10px] py-2 rounded-xl font-bold border border-gray-200 active:scale-95 transition-all text-center uppercase">{trans('hancms.tinymce.button.cancel')}</button>
                                </div>
                            </div>
                        )}

                        {filteredItems.length > 0 ? (
                            filteredItems.map((item: MediaItem, idx) => (
                                <div
                                    key={idx}
                                    draggable={item.type === 'file'}
                                    onDragStart={() => item.type === 'file' && setDraggingItem(item)}
                                    onDragOver={(e) => {
                                        if (item.type === 'folder' && draggingItem) {
                                            e.preventDefault();
                                            e.currentTarget.classList.add('ring-4', 'ring-indigo-500', 'scale-105', 'z-10');
                                        }
                                    }}
                                    onDragLeave={(e) => {
                                        if (item.type === 'folder') {
                                            e.currentTarget.classList.remove('ring-4', 'ring-indigo-500', 'scale-105', 'z-10');
                                        }
                                    }}
                                    onDrop={(e) => {
                                        if (item.type === 'folder') {
                                            e.preventDefault();
                                            e.currentTarget.classList.remove('ring-4', 'ring-indigo-500', 'scale-105', 'z-10');
                                            handleMoveItem(item.path);
                                        }
                                    }}
                                    className={`group relative border rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all bg-gray-50 aspect-square flex flex-col items-center justify-center
                                        ${item.type === 'file'
                                            ? (selectedItem?.path === item.path ? 'border-indigo-500 ring-4 ring-indigo-100' : 'border-gray-100 hover:border-indigo-500 active:scale-95')
                                            : 'border-gray-100 hover:bg-indigo-50/50 hover:border-amber-400'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleItemClick(item);
                                    }}
                                    onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        if (item.type === 'file') {
                                            insertSelected(item);
                                        }
                                    }}
                                >
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 flex gap-1 z-10 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={(e) => handleRename(e, item)}
                                            className="p-1.5 bg-white shadow-sm rounded-lg border border-gray-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
                                        >
                                            <Edit2Icon size={12} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => handleDelete(e, item)}
                                            className="p-1.5 bg-white shadow-sm rounded-lg border border-gray-100 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                    {item.type === 'folder' ? (
                                        <div className="flex h-full w-full flex-col items-center justify-start px-3 pt-5 pb-4">
                                            <Folder size={58} className="shrink-0 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform duration-500 shadow-sm" />
                                            <span className="mt-3 flex min-h-[40px] w-full items-center justify-center px-1 text-center text-[13px] font-black leading-5 tracking-tight text-gray-700 capitalize break-words [overflow-wrap:anywhere]">
                                                {item.name}
                                            </span>
                                            <span className="mt-2 text-[10px] font-bold text-gray-400 tracking-widest">
                                                {item.info?.count || 0} items
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <img src={item.url} alt="" className="h-full w-full object-contain bg-gray-100 p-2 group-hover:scale-105 transition-transform duration-700 shadow-inner" />
                                            {draggingItem?.path === item.path && (
                                                <div className="absolute inset-0 bg-indigo-600/40 backdrop-blur-sm flex items-center justify-center">
                                                    <Move size={32} className="text-white animate-pulse" />
                                                </div>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300">
                                                <p className="text-[10px] text-white font-black truncate uppercase tracking-widest leading-tight">{item.name}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-[9px] text-indigo-300 font-bold italic">{item.info?.width}x{item.info?.height}</span>
                                                    <span className="text-[8px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-md font-black uppercase">{item.info?.size}</span>
                                                </div>
                                            </div>

                                        </>
                                    )}
                                </div>
                            ))
                        ) : !isCreating && !loading && (
                            <div className="col-span-full py-24 text-center">
                                <ImageIcon size={48} className="text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">{trans('hancms.tinymce.message.folder_empty')}</p>
                            </div>
                        )}
                    </div>

                        <div className="hidden lg:block">
                            <div className="sticky top-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3">
                                    <div className="min-w-0 text-[12px] font-black uppercase tracking-widest text-gray-800">
                                        {trans('hancms.tinymce.label.inspector') || 'Inspector'}
                                    </div>
                                    <div className="inline-flex max-w-[130px] shrink-0 items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-gray-600 shadow-sm">
                                        <span className="truncate whitespace-nowrap">
                                            {selectedItem?.type === 'file'
                                                ? (trans('hancms.tinymce.label.selected_file') || 'Selected file')
                                                : (trans('hancms.tinymce.label.no_selection') || 'No selection')}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    {selectedItem?.type === 'file' ? (
                                        <div className="space-y-4">
                                            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                                                <img src={selectedItem.url} alt="" className="h-48 w-full object-contain p-2" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="break-words text-[14px] font-black leading-snug text-gray-900">
                                                    {selectedItem.name}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wider text-gray-600">
                                                    {selectedItem.info?.width && selectedItem.info?.height ? (
                                                        <span className="rounded-lg bg-indigo-50 px-2 py-1 text-indigo-700">
                                                            {selectedItem.info.width}x{selectedItem.info.height}
                                                        </span>
                                                    ) : null}
                                                    {selectedItem.info?.size ? (
                                                        <span className="rounded-lg bg-gray-100 px-2 py-1 text-gray-700">
                                                            {selectedItem.info.size}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>

                                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                                                    {trans('hancms.tinymce.label.url') || 'URL'}
                                                </div>
                                                <div className="mt-2 max-h-20 overflow-y-auto break-all rounded-lg bg-white p-2 font-mono text-[11px] leading-relaxed text-gray-800">
                                                    {getRelativeUrl(selectedItem)}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => copySelectedUrl(selectedItem)}
                                                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-widest text-gray-700 shadow-sm transition-all active:scale-95 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                                >
                                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                                    {copied
                                                        ? (trans('hancms.tinymce.button.copied') || 'Copied')
                                                        : (trans('hancms.tinymce.button.copy_url') || 'Copy URL')}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => insertSelected(selectedItem)}
                                                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-white shadow-md shadow-indigo-100 transition-all active:scale-95 hover:bg-indigo-700"
                                                >
                                                    <ImageIcon size={14} />
                                                    {trans('hancms.tinymce.button.insert') || 'Insert'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteDirect(selectedItem)}
                                                    className="inline-flex min-h-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700 shadow-sm transition-all active:scale-95 hover:border-rose-300 hover:bg-rose-100"
                                                    title={trans('hancms.button.delete') || 'Delete'}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-5 text-center">
                                            <ImageIcon className="mx-auto text-gray-300" size={34} />
                                            <div className="mt-3 text-[11px] font-bold leading-relaxed tracking-wider text-gray-500">
                                                {trans('hancms.tinymce.message.pick_image_hint') || 'Select an image to preview and insert.'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t bg-gray-50 p-3 sm:p-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2 text-[11px] font-black uppercase tracking-widest text-gray-600 shadow-sm transition-all active:scale-95 hover:border-red-100 hover:bg-red-50 hover:text-red-500 sm:px-6 sm:text-[12px]"
                    >
                        <X size={16} /> {trans('hancms.tinymce.button.close')}
                    </button>
                </div>
            </div>
        </div>,
        portalTarget
    );
};

export default MediaLibraryModal;
