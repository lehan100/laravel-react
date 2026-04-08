import { useState } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import { ImagePlus, Loader2, Star, Trash2, X } from 'lucide-react';
import { useTrans } from '@/Hooks/useTrans';

interface PhotoItem {
    id: number | string;
    url: string;
    filename?: string;
    alt?: string | null;
    is_default?: boolean;
    order?: number;
    width?: number | null;
    height?: number | null;
    size?: number | null;
    size_label?: string | null;
}

interface Props {
    existingPhotos?: PhotoItem[];
    selectedFiles?: string[];
    onFilesChange: (files: string[]) => void;
    onExistingPhotosChange?: (photos: PhotoItem[]) => void;
    onDeleteExisting: (id: number | string) => void;
    defaultPhotoId?: number | string | null;
    onSetDefaultPhotoId: (id: number | string | null) => void;
    loading?: boolean;
}

export default function MultiUpload({
    existingPhotos = [],
    selectedFiles = [],
    onFilesChange,
    onExistingPhotosChange,
    onDeleteExisting,
    defaultPhotoId,
    onSetDefaultPhotoId,
    loading = false,
}: Props) {
    const { trans } = useTrans();
    const { props }: any = usePage();
    const [isUploading, setIsUploading] = useState(false);
    const [draggingExistingId, setDraggingExistingId] = useState<number | string | null>(null);
    const [draggingNewIndex, setDraggingNewIndex] = useState<number | null>(null);
    const [hoverExistingId, setHoverExistingId] = useState<number | string | null>(null);
    const [hoverNewIndex, setHoverNewIndex] = useState<number | null>(null);
    const [uploadedFileMeta, setUploadedFileMeta] = useState<Record<string, PhotoItem>>({});
    const tempBasePath = `/${props.config_path?.temp || 'var/temp'}`;
    const busy = loading || isUploading;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        setIsUploading(true);
        try {
            const uploaded = await Promise.all(
                files.map(async (file) => {
                    const formData = new FormData();
                    formData.append('photo', file);
                    const response = await axios.post(route('product.upload'), formData);
                    return response.data;
                })
            );

            const uploadedNames = uploaded
                .map((file) => file?.file_name)
                .filter(Boolean) as string[];

            const nextMeta = uploaded.reduce((acc, file) => {
                if (file?.file_name) {
                    acc[file.file_name] = {
                        id: file.file_name,
                        url: file.url,
                        filename: file.file_name,
                        width: file.width ?? null,
                        height: file.height ?? null,
                        size: file.size ?? null,
                        size_label: file.size_label ?? null,
                    };
                }
                return acc;
            }, {} as Record<string, PhotoItem>);

            setUploadedFileMeta((prev) => ({
                ...prev,
                ...nextMeta,
            }));

            onFilesChange([...(selectedFiles || []), ...uploadedNames]);
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const removeNewFile = (index: number) => {
        onFilesChange(selectedFiles.filter((_, idx) => idx !== index));
        if (typeof defaultPhotoId === 'string' && defaultPhotoId === selectedFiles[index]) {
            onSetDefaultPhotoId(null);
        }
    };

    const moveItem = <T,>(list: T[], from: number, to: number) => {
        const next = [...list];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        return next;
    };

    const handleExistingDrop = (targetId: number | string) => {
        if (!onExistingPhotosChange || draggingExistingId === null || String(draggingExistingId) === String(targetId)) return;

        const fromIndex = existingPhotos.findIndex((photo) => String(photo.id) === String(draggingExistingId));
        const toIndex = existingPhotos.findIndex((photo) => String(photo.id) === String(targetId));
        if (fromIndex === -1 || toIndex === -1) return;

        const next = moveItem(existingPhotos, fromIndex, toIndex);
        onExistingPhotosChange(next);
        setHoverExistingId(null);
    };

    const handleNewDrop = (targetIndex: number) => {
        if (draggingNewIndex === null || draggingNewIndex === targetIndex) return;

        const nextFiles = moveItem(selectedFiles, draggingNewIndex, targetIndex);
        onFilesChange(nextFiles);
        setHoverNewIndex(null);
    };

    const selectedFilesCount = selectedFiles.length;
    const currentDefault = defaultPhotoId ?? existingPhotos.find(photo => photo.is_default)?.id ?? null;

    const fileHint = trans('hancms.catalog.product.photo_hint') || 'Upload nhiều ảnh. Ảnh được chọn mặc định sẽ hiển thị đầu tiên.';
    const renderMeta = (photo?: PhotoItem) => {
        if (!photo) return null;

        const dimension = photo.width && photo.height ? `${photo.width}x${photo.height}` : null;
        const size = photo.size_label || (photo.size ? `${(photo.size / 1024).toFixed(1)} KB` : null);

        if (!dimension && !size) return null;

        return (
            <div className="mt-2 flex flex-wrap gap-1.5">
                {dimension && (
                    <span className="rounded-full bg-slate-950/80 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
                        {dimension}
                    </span>
                )}
                {size && (
                    <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
                        {size}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <input
                    id="product-photos"
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                />
                <label
                    htmlFor="product-photos"
                    className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white px-4 py-6 text-center transition hover:border-cyan-400 hover:bg-cyan-50/40"
                >
                    {busy ? (
                        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                    ) : (
                        <>
                            <ImagePlus className="h-10 w-10 text-slate-400" />
                            <div className="mt-3 text-sm font-semibold text-slate-700">
                                {trans('hancms.catalog.product.upload_photos')}
                            </div>
                            <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">{fileHint}</p>
                        </>
                    )}
                </label>
            </div>

            <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {trans('hancms.catalog.product.existing_photos')}
                </div>
                {existingPhotos.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-400">
                        {trans('hancms.catalog.product.no_photo')}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {existingPhotos.map((photo, index) => {
                            const isDefault = currentDefault === photo.id || photo.is_default;
                            const isDragging = String(draggingExistingId) === String(photo.id);
                            const isHoverTarget = String(hoverExistingId) === String(photo.id);
                            return (
                                <div
                                    key={photo.id}
                                    draggable
                                    onDragStart={() => setDraggingExistingId(photo.id)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDragEnter={() => setHoverExistingId(photo.id)}
                                    onDragLeave={() => setHoverExistingId((current) => (String(current) === String(photo.id) ? null : current))}
                                    onDrop={() => handleExistingDrop(photo.id)}
                                    onDragEnd={() => {
                                        setDraggingExistingId(null);
                                        setHoverExistingId(null);
                                    }}
                                    className={`group cursor-grab overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 will-change-transform active:cursor-grabbing ${isDragging
                                            ? 'scale-[0.98] border-indigo-400 shadow-2xl shadow-indigo-100 opacity-70'
                                            : isHoverTarget
                                                ? 'scale-[1.02] border-indigo-500 shadow-xl ring-4 ring-indigo-100'
                                                : 'border-slate-200'
                                        }`}
                                >
                                    <div className="relative aspect-[4/3] bg-slate-100">
                                        <img src={photo.url} alt={photo.alt || ''} className="h-full w-full object-cover" />
                                        <div className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                                            #{index + 1}
                                        </div>
                                        <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm transition-transform duration-300 group-hover:translate-y-0">
                                            Drag
                                        </div>
                                        {isDefault && (
                                            <div className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                                                {trans('hancms.default')}
                                            </div>
                                        )}
                                        {(photo.width || photo.height || photo.size_label || photo.size) && (
                                            <div className="absolute bottom-3 right-3">
                                                {renderMeta(photo)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between gap-2 px-4 py-3">
                                        <button
                                            type="button"
                                            onClick={() => onSetDefaultPhotoId(photo.id)}
                                            className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold transition ${isDefault
                                                    ? 'bg-emerald-600 text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                        >
                                            <Star size={14} />
                                            {trans('hancms.default')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDeleteExisting(photo.id)}
                                            className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                                        >
                                            <Trash2 size={14} />
                                            {trans('hancms.button.delete')}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {trans('hancms.catalog.product.new_photos')}
                </div>
                {selectedFilesCount === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-400">
                        {trans('hancms.catalog.product.no_new_photo')}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {selectedFiles.map((file, index) => {
                            const url = file ? `${tempBasePath}/${file}` : '';
                            const isDefault = currentDefault === file;
                            const meta = uploadedFileMeta[file];
                            const isDragging = draggingNewIndex === index;
                            const isHoverTarget = hoverNewIndex === index;
                            return (
                                <div
                                    key={`${file}-${index}`}
                                    draggable
                                    onDragStart={() => setDraggingNewIndex(index)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDragEnter={() => setHoverNewIndex(index)}
                                    onDragLeave={() => setHoverNewIndex((current) => (current === index ? null : current))}
                                    onDrop={() => handleNewDrop(index)}
                                    onDragEnd={() => {
                                        setDraggingNewIndex(null);
                                        setHoverNewIndex(null);
                                    }}
                                    className={`group cursor-grab overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 will-change-transform active:cursor-grabbing ${isDragging
                                            ? 'scale-[0.98] border-indigo-400 shadow-2xl shadow-indigo-100 opacity-70'
                                            : isHoverTarget
                                                ? 'scale-[1.02] border-indigo-500 shadow-xl ring-4 ring-indigo-100'
                                                : 'border-slate-200'
                                        }`}
                                >
                                    <div className="relative aspect-[4/3] bg-slate-100">
                                        {url ? (
                                            <img src={url} alt={file} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <ImagePlus className="h-8 w-8 text-slate-400" />
                                            </div>
                                        )}
                                        <div className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                                            NEW
                                        </div>
                                        <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm transition-transform duration-300">
                                            Drag
                                        </div>
                                        {isDefault && (
                                            <div className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                                                {trans('hancms.default')}
                                            </div>
                                        )}
                                        {meta && (
                                            <div className="absolute bottom-3 right-3">
                                                {renderMeta(meta)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between gap-2 px-4 py-3">
                                        <button
                                            type="button"
                                            onClick={() => onSetDefaultPhotoId(file)}
                                            className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold transition ${isDefault
                                                    ? 'bg-emerald-600 text-white shadow-sm'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                        >
                                            <Star size={14} />
                                            {trans('hancms.default')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeNewFile(index)}
                                            className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                                        >
                                            <X size={14} />
                                            {trans('hancms.button.delete')}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
