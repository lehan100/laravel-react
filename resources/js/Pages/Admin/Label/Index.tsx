import MainLayout from "@/Layouts/MainLayout";
import { useForm, usePage } from "@inertiajs/react";
import { Language } from '@/types';
import { useTrans } from '@/Hooks/useTrans';
import SaveButton from '@/Components/Button/SaveButton';
import { Save } from "lucide-react";
import { useState } from "react";
function IndexPage() {

    const { trans } = useTrans();
    const { lang, labels, config_path }: any = usePage<{
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
    const [validated, setValidated] = useState(false);
    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === true) {
            setValidated(false);
            post(route('label.store'));

        }
        setValidated(true);
    };
    const [editingField, setEditingField] = useState(null);
    const renderInput = (field: any, key: any, value: any) => {
        const isEditing = editingField === field;

        return (
            <input
                key={field}
                type="text"
                readOnly={!isEditing}
                value={value}
                onFocus={() => setEditingField(field)}
                onBlur={() => setEditingField(null)}
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
    return (
        <div>
            {/* Header Section */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div className="w-full md:flex-1 mb-3 md:mb-0">
                    <h1 className="text-xl font-bold text-gray-800">{trans('hancms.label.name')}</h1>
                </div>
                <div className="w-full md:w-auto">
                    <div className="flex gap-2">
                        <SaveButton
                            loading={processing}
                            undo={0}
                            icon={<Save size={18} />}
                            sendDataStatusUndo={handleUndo}
                            form='my-form'
                        >
                            {trans('hancms.button.save')}
                        </SaveButton>
                    </div>
                </div>
            </div>

            <form id='my-form' onSubmit={handleSubmit} noValidate className="text-sm">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    {/* Card Header phong cách Tailwind */}
                    <div className="px-4 py-3 bg-indigo-800 text-white font-bold uppercase tracking-wider">
                        {trans('hancms.label.admin.name')}
                    </div>

                    {/* Bảng dịch thuật */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-left">
                            <thead className="bg-gray-50">
                                <tr className="font-bold text-gray-700">
                                    <th className="px-4 py-3 whitespace-nowrap">{trans('hancms.column.key')}</th>
                                    {lang.data.map((row: any) => (
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
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {labels.en && Object.entries(labels.en).map(([key, value]) => (
                                    <tr key={key} className="hover:bg-blue-50/50 transition-colors odd:bg-white even:bg-gray-50/30">
                                        {/* Cột Key: Dùng text-xs để trông kỹ thuật hơn */}
                                        <td className="px-4 py-2 align-middle text-gray-500 font-mono text-xs italic">
                                            label.{key}
                                        </td>
                                        {lang.data.map((row: any) => {
                                            const cellValue = labels[row.code] ? labels[row.code][key] : '';
                                            return (
                                                <td key={row.id} className="px-4 py-2 align-middle min-w-[200px]">
                                                    {/* Đảm bảo hàm renderInput bên dưới cũng dùng class text-sm */}
                                                    {renderInput(row.code, key, cellValue)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </form>
        </div>
    )
}
IndexPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.label.name" children={page} />
);

export default IndexPage;