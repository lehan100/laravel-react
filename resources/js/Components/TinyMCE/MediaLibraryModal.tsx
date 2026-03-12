import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { X, Loader2, ImageIcon, Folder, ChevronRight, Home, FolderPlus, Upload, Move, Trash2, Edit2Icon } from 'lucide-react';
import { useTrans } from '@/Hooks/useTrans';
const MediaLibraryModal = ({ isOpen, onClose, onSelect }: any) => {
    const { trans } = useTrans();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [currentPath, setCurrentPath] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [draggingItem, setDraggingItem] = useState<any>(null);

    const fetchMedia = useCallback((path = '') => {
        setLoading(true);
        // @ts-ignore
        axios.get(route('media.get.images', { path })).then(res => {
            setItems(res.data);
            setCurrentPath(path);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const uploadFiles = async (files: FileList) => {
        const formData = new FormData();
        Array.from(files).forEach(file => formData.append('file', file));
        formData.append('path', currentPath);
        setUploading(true);
        try {
            // @ts-ignore
            await axios.post(route('media.upload.tinymce'), formData);
            fetchMedia(currentPath);
        } catch (error) {
            alert("Lỗi upload!");
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
            alert(trans('hancms.tinymce.message.error.move'));
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
            alert(trans('hancms.tinymce.message.error.create_folder'));
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
            fetchMedia(currentPath);
        } catch (error) {
            alert(trans('hancms.tinymce.message.error.delete'));
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
            await axios.post(route('media.rename'), {
                old_path: item.path.replace(/^\/+/, ''),
                new_name: newName,
                type: item.type
            });
            fetchMedia(currentPath);
        } catch (error) {
            alert(trans('hancms.tinymce.message.error.rename'));
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (isOpen) fetchMedia('');
        if (!isOpen) {
            setDraggingItem(null);
            setIsCreating(false);
        }
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose, fetchMedia]);

    const handleItemClick = (item: any) => {
        if (item.type === 'folder') {
            fetchMedia(item.path);
        } else {
            const relativeUrl = item.url.replace(window.location.origin, '');
            onSelect(relativeUrl);
        }
    };

    const breadcrumbs = currentPath.split('/').filter(Boolean);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative border border-white/20">

                <div className="p-4 border-b flex justify-between items-center bg-gray-50/80 backdrop-blur-md z-30">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                            <ImageIcon className="text-white" size={18} />
                        </div>
                        <h3 className="font-black text-gray-800 text-[14px] uppercase tracking-wider">{trans('hancms.tinymce.name')}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-[12px] font-black hover:bg-emerald-600 cursor-pointer shadow-md shadow-emerald-100 active:scale-95 transition-all uppercase tracking-tighter">
                            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                            {trans('hancms.tinymce.button.upload_image')}
                            <input type="file" className="hidden" multiple onChange={(e) => e.target.files && uploadFiles(e.target.files)} accept="image/*" />
                        </label>

                        <button
                            type="button"
                            onClick={() => setIsCreating(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[12px] font-black hover:bg-indigo-700 shadow-md shadow-indigo-100 active:scale-95 transition-all uppercase tracking-tighter"
                        >
                            <FolderPlus size={14} />  {trans('hancms.tinymce.button.create_folder')}
                        </button>

                        <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all ml-1">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="px-6 py-2.5 border-b bg-white flex items-center gap-2 text-[11px] font-bold text-gray-400 overflow-x-auto whitespace-nowrap z-20 shadow-sm">
                    <button type="button" onClick={() => fetchMedia('')} className="hover:text-indigo-600 flex items-center gap-1 transition-colors uppercase"><Home size={14} /> Root</button>
                    {breadcrumbs.map((folder, i) => (
                        <React.Fragment key={i}>
                            <ChevronRight size={12} className="text-gray-300" />
                            <button type="button" onClick={() => fetchMedia(breadcrumbs.slice(0, i + 1).join('/'))} className="hover:text-indigo-600 uppercase transition-colors">{folder}</button>
                        </React.Fragment>
                    ))}
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-white custom-scrollbar relative min-h-[400px]" onClick={() => setDraggingItem(null)}>
                    {(uploading || loading) && (
                        <div className="absolute inset-0 bg-white/60 z-50 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="flex flex-col items-center gap-3 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                                <Loader2 className="animate-spin text-indigo-600" size={48} />
                                <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest text-center">{trans('hancms.tinymce.message.data_warning')}</span>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {isCreating && (
                            <div className="border-2 border-indigo-400 rounded-2xl p-4 bg-indigo-50 flex flex-col items-center justify-center gap-3 aspect-square shadow-inner animate-in zoom-in-95">
                                <Folder size={40} className="text-indigo-400 fill-indigo-100" />
                                <input autoFocus className="w-full text-[11px] p-2 border-2 border-indigo-200 rounded-xl outline-none focus:border-indigo-600 bg-white font-bold text-center" placeholder="Tên thư mục..." value={newFolderName} onChange={e => setNewFolderName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreateFolder()} />
                                <div className="flex gap-2 w-full">
                                    <button type="button" onClick={handleCreateFolder} className="flex-1 bg-indigo-600 text-white text-[10px] py-2 rounded-xl font-black shadow-md active:scale-95 transition-all">{trans('hancms.tinymce.button.save')}</button>
                                    <button type="button" onClick={() => setIsCreating(false)} className="flex-1 bg-white text-gray-500 text-[10px] py-2 rounded-xl font-bold border border-gray-200 active:scale-95 transition-all text-center uppercase">{trans('hancms.tinymce.button.cancel')}</button>
                                </div>
                            </div>
                        )}

                        {items.length > 0 ? (
                            items.map((item: any, idx) => (
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
                                    className={`group relative border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all bg-gray-50 aspect-square flex flex-col items-center justify-center 
                                        ${item.type === 'file' ? 'active:scale-95 hover:border-indigo-500' : 'hover:bg-indigo-50/50 hover:border-amber-400'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleItemClick(item);
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
                                        <div className="w-full h-full flex flex-col items-center justify-center p-4">
                                            <Folder size={56} className="text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform duration-500 shadow-sm" />
                                            <span className="text-[10px] font-black text-gray-600 mt-3 truncate w-full text-center uppercase tracking-tight px-1">{item.name}</span>
                                            <span className="text-[9px] font-bold text-gray-400 tracking-widest mt-0.5">
                                                {item.info?.count || 0} items
                                            </span>
                                        </div>
                                    ) : (
                                        <>
                                            <img src={item.url} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 shadow-inner" />
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
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end items-center gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-[12px] font-black hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all uppercase tracking-widest flex items-center gap-2 shadow-sm active:scale-95"
                    >
                        <X size={16} /> {trans('hancms.tinymce.button.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MediaLibraryModal;
