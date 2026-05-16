import MainLayout from "@/Layouts/MainLayout";
import { useForm, usePage } from "@inertiajs/react";
import { Language } from '@/types';
import { useTrans } from '@/Hooks/useTrans';
import SaveButton from '@/Components/Button/SaveButton';
import { AlertTriangle, PlusCircle, Save, Trash2 } from "lucide-react";
import { Fragment, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import HeaderToolbar from "@/Components/Main/HeaderToolbar";
import Card from "@/Components/Main/Card";
function IndexPage() {

    const { trans } = useTrans();
    const { langs, labels, config_path }: any = usePage<{
        lang: Language;

    }>().props;
    const languageRows = Array.isArray(langs?.data) ? langs.data : [];
    const initialLabels = labels ?? { translation_keys: [], translations: {} };

    const { data, setData, errors, post, processing } = useForm({
        labels: initialLabels,
        undo: 0,
    });
    const [undo, setUndo] = useState(0);
    const handleUndo = (status: number) => {
        setUndo(status);
    }
    const [newKey, setNewKey] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    function handleSubmit(e: any) {
        e.preventDefault();
        e.stopPropagation();
        post(route('labels.store'), {
            onSuccess: () => {
                alert(trans('hancms.message.success.edit', { name: trans('hancms.label.name') }));
            }
        });
    }
    const [editingField, setEditingField] = useState<string | null>(null);
    const renderInput = (langCode: string, key: string, value: any) => {
        const fieldId = `${langCode}-${key}`;
        const isEditing = editingField === fieldId;

        return (
            <input
                key={fieldId}
                type="text"
                readOnly={!isEditing}
                value={value || ''}
                // Khi focus, set ID duy nhất này vào state
                onFocus={() => setEditingField(fieldId)}
                onBlur={() => setEditingField(null)}
                onChange={(e) => {
                    const currentTranslations = data.labels?.translations ?? {};
                    setData('labels', {
                        ...data.labels,
                        translations: {
                            ...currentTranslations,
                            [langCode]: {
                                ...(currentTranslations[langCode] ?? {}),
                                [key]: e.target.value
                            }
                        }
                    });
                }}
                autoFocus={isEditing}
                className={`
                block w-full transition-all duration-200 text-sm outline-none
                ${isEditing
                        ? 'px-2 py-1.5 bg-white border border-indigo-500 rounded ring-1 ring-indigo-500 shadow-sm text-gray-900'
                        : 'px-2 py-1.5 bg-transparent border-transparent cursor-pointer text-gray-600 hover:bg-gray-50'
                    }
            `}
            />
        );
    };
    const addNewRow = () => {
        if (!newKey.trim()) {
            alert(trans('hancms.label.msg_verify'));
            return;
        }

        const currentTranslations = data.labels?.translations ?? {};
        const updatedLabels = {
            ...data.labels,
            translation_keys: Array.from(new Set([...(data.labels?.translation_keys ?? []), newKey])),
            translations: { ...currentTranslations },
        };

        languageRows.forEach((row: any) => {
            if (!updatedLabels.translations[row.code]) {
                updatedLabels.translations[row.code] = {};
            }
            updatedLabels.translations[row.code][newKey] = "";
        });

        setData("labels", updatedLabels);
        setNewKey("");
        setIsAdding(false);

    };
    // ... bên trong IndexPage component
    const [isOpen, setIsOpen] = useState(false);
    const [deleteKey, setDeleteKey] = useState<string | null>(null);

    const openDeleteModal = (key: string) => {
        setDeleteKey(key);
        setIsOpen(true);
    };

    const handleDelete = () => {
        if (deleteKey) {
            const currentTranslations = data.labels?.translations ?? {};
            const updatedLabels = {
                ...data.labels,
                translation_keys: (data.labels?.translation_keys ?? []).filter((key: string) => key !== deleteKey),
                translations: { ...currentTranslations },
            };

            Object.keys(updatedLabels.translations).forEach((langCode) => {
                if (updatedLabels.translations[langCode]) {
                    delete updatedLabels.translations[langCode][deleteKey];
                }
            });

            setData("labels", updatedLabels);
            setIsOpen(false);
            setDeleteKey(null);
        }
    };
    // const removeRow = (keyToRemove: string) => {
    //     // Hiển thị xác nhận trước khi xóa
    //     if (!confirm(trans('hancms.label.confirm_delete'))) return;

    //     const updatedLabels = { ...data.labels };

    //     // Duyệt qua từng mã ngôn ngữ (vi, en, ja...) và xóa key
    //     Object.keys(updatedLabels).forEach((langCode) => {
    //         if (updatedLabels[langCode]) {
    //             delete updatedLabels[langCode][keyToRemove];
    //         }
    //     });

    //     setData("labels", updatedLabels);
    // };
    return (
        <div>
            <HeaderToolbar title={trans('hancms.label.name')}>
                <SaveButton
                    loading={processing}
                    undo={0}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form='my-form'
                >
                    {trans('hancms.button.save')}
                </SaveButton>
            </HeaderToolbar>
            <form id='my-form' onSubmit={handleSubmit} noValidate className="text-sm">
                <Card title={trans('hancms.label.admin.name')}>
                    <table className="min-w-full whitespace-nowrap">
                        <thead className="bg-slate-950 text-white">
                            <tr className="text-left">
                                <th className="whitespace-nowrap px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.column.key')}</th>
                                {languageRows.map((row: any) => (
                                    <th key={row.id} className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            {row.photo && (
                                                <img
                                                    src={'/' + config_path.path + "/" + row.photo}
                                                    className="h-4 w-5 rounded-sm object-contain ring-1 ring-white/20"
                                                    alt={row.name}
                                                />
                                            )}
                                            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{row.name}</span>
                                        </div>
                                    </th>
                                ))}
                                <th className="px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.column.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {Array.isArray(data.labels?.translation_keys) && data.labels.translation_keys.length > 0 ? (
                                data.labels.translation_keys.map((key: string) => (
                                    <tr key={key} className="border-t border-slate-200/80 odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-cyan-50/50">
                                        <td className="px-4 py-3 align-middle font-mono text-xs italic text-slate-500">
                                            label.{key}
                                        </td>
                                        {languageRows.map((row: any) => {
                                            const cellValue = data.labels?.translations?.[row.code]?.[key] ?? '';
                                            return (
                                                <td key={row.id} className="min-w-[200px] px-4 py-3 align-middle">
                                                    {renderInput(row.code, key, cellValue)}
                                                </td>
                                            )
                                        })}
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                type="button"
                                                onClick={() => openDeleteModal(key)}
                                                className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50/80 text-rose-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100 hover:text-rose-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                                                title={trans('hancms.button.delete')}
                                                aria-label={trans('hancms.button.delete')}
                                            >
                                                <Trash2 size={16} strokeWidth={2.2} className="transition-transform duration-200 group-hover:scale-110" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={languageRows.length + 2} className="px-4 py-8 text-center text-sm text-slate-500">
                                        {trans('hancms.message.empty')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-slate-50">
                            <tr>
                                <td className="px-4 py-3">
                                    {isAdding ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder={trans('hancms.label.msg_placeholder')}
                                                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200"
                                                value={newKey}
                                                onChange={(e) => setNewKey(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">{trans('hancms.label.msg_newline')}</span>
                                    )}
                                </td>
                                <td colSpan={languageRows.length + 1} className="px-4 py-3">
                                    {isAdding ? (
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={addNewRow}
                                                className="rounded-2xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                                            >
                                                {trans('hancms.button.confirm')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setIsAdding(false); setNewKey(""); }}
                                                className="rounded-2xl bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-300"
                                            >
                                                {trans('hancms.button.cancel')}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setIsAdding(true)}
                                            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition-all hover:-translate-y-0.5 hover:from-emerald-500 hover:to-teal-500 active:translate-y-0"
                                        >
                                            <PlusCircle size={18} />
                                            <span>{trans('hancms.button.new_line')}</span>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </Card>
            </form>
            {/* 1. Modal Xác Nhận Xóa */}
            <Transition show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[100]" onClose={() => setIsOpen(false)}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
                        leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                    </TransitionChild>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-[0_30px_80px_-30px_rgba(225,29,72,0.35)] transition-all">
                                    <div className="flex items-start gap-4 border-b border-rose-100 bg-gradient-to-r from-rose-50 via-white to-white px-6 py-5">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 ring-8 ring-rose-50">
                                            <AlertTriangle className="h-6 w-6" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <DialogTitle as="h3" className="text-lg font-semibold text-slate-950">
                                                {trans('hancms.label.confirm_delete_title')}
                                            </DialogTitle>
                                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                                {trans('hancms.label.confirm_delete')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="px-6 py-5">
                                        <div className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3">
                                            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-500">
                                                {trans('hancms.column.key')}
                                            </div>
                                            <div className="mt-1 font-mono text-sm font-medium text-rose-700">
                                                {deleteKey ? `label.${deleteKey}` : ''}
                                            </div>
                                        </div>
                                        <div className="mt-5 flex justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsOpen(false)}
                                                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300/50"
                                            >
                                                {trans('hancms.button.cancel')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-950/20 transition-all hover:-translate-y-0.5 hover:from-rose-500 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                                            >
                                                {trans('hancms.button.delete')}
                                            </button>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )
}
IndexPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.label.name" children={page} />
);

export default IndexPage;
