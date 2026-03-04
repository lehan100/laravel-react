import MainLayout from "@/Layouts/MainLayout";
import { useForm, usePage } from "@inertiajs/react";
import { Language } from '@/types';
import { useTrans } from '@/Hooks/useTrans';
import SaveButton from '@/Components/Button/SaveButton';
import { PlusCircle, Save } from "lucide-react";
import { Fragment, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { AlertTriangle, X } from "lucide-react";
import HeaderToolbar from "@/Components/Main/HeaderToolbar";
import Card from "@/Components/Main/Card";
function IndexPage() {

    const { trans } = useTrans();
    const { langs, labels, config_path }: any = usePage<{
        lang: Language;

    }>().props;

    const { data, setData, errors, post, processing } = useForm({
        labels: labels || null,
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
                    setData('labels', {
                        ...data.labels,
                        [langCode]: {
                            ...data.labels[langCode],
                            [key]: e.target.value
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

        const updatedLabels = { ...data.labels };
        langs.data.forEach((row: any) => {
            if (!updatedLabels[row.code]) updatedLabels[row.code] = {};
            updatedLabels[row.code][newKey] = "";
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
            const updatedLabels = { ...data.labels };
            Object.keys(updatedLabels).forEach((langCode) => {
                if (updatedLabels[langCode]) delete updatedLabels[langCode][deleteKey];
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
                    <table className="min-w-full divide-y divide-gray-200 text-left">
                        <thead className="bg-gray-50">
                            <tr className="font-bold text-gray-700">
                                <th className="px-4 py-3 whitespace-nowrap">{trans('hancms.column.key')}</th>
                                {langs.data.map((row: any) => (
                                    <th key={row.id} className="px-4 py-3">
                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                            {row.photo && (
                                                <img
                                                    src={'/' + config_path.path + "/" + row.photo}
                                                    className="w-5 h-4 object-contain shadow-sm rounded-sm"
                                                    alt={row.name}
                                                />
                                            )}
                                            <span className="font-medium text-[13px]">{row.name}</span>
                                        </div>
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-center">{trans('hancms.column.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {data.labels.en && Object.entries(data.labels.en).map(([key, value]) => (
                                <tr key={key} className="hover:bg-blue-50/50 transition-colors odd:bg-white even:bg-gray-50/30">
                                    <td className="px-4 py-2 align-middle text-gray-500 font-mono text-xs italic">
                                        label.{key}
                                    </td>
                                    {langs.data.map((row: any) => {
                                        const cellValue = data.labels[row.code] ? data.labels[row.code][key] : '';
                                        return (
                                            <td key={row.id} className="px-4 py-2 align-middle min-w-[200px]">
                                                {renderInput(row.code, key, cellValue)}
                                            </td>
                                        )
                                    })}
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            type="button"
                                            onClick={() => openDeleteModal(key)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            title="Xóa dòng này"
                                        >
                                            <svg xmlns="http://www.w3.org" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-100">
                                <td className="px-4 py-3">
                                    {isAdding ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder={trans('hancms.label.msg_placeholder')}
                                                className="border border-indigo-500 rounded px-2 py-1 text-xs w-full focus:ring-1 focus:ring-indigo-500 outline-none"
                                                value={newKey}
                                                onChange={(e) => setNewKey(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">{trans('hancms.label.msg_newline')}</span>
                                    )}
                                </td>
                                <td colSpan={langs.data.length + 1} className="px-4 py-3">
                                    {isAdding ? (
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={addNewRow}
                                                className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                            >
                                                {trans('hancms.button.confirm')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setIsAdding(false); setNewKey(""); }}
                                                className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-400"
                                            >
                                                {trans('hancms.button.cancel')}
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setIsAdding(true)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all shadow-sm active:scale-95"
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
                                <DialogPanel className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                            <AlertTriangle className="h-6 w-6 text-red-600" />
                                        </div>
                                        <DialogTitle as="h3" className="text-lg font-bold text-gray-900">
                                            {trans('hancms.label.confirm_delete_title')}
                                        </DialogTitle>
                                    </div>
                                    <div className="mt-4 text-sm text-gray-500">
                                        {trans('hancms.label.confirm_delete')}
                                        <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded font-mono text-red-700">label.{deleteKey}</div>
                                    </div>
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">{trans('hancms.button.cancel')}</button>
                                        <button type="button" onClick={handleDelete} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">{trans('hancms.button.delete')}</button>
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