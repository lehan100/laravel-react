import { useTrans } from "@/Hooks/useTrans";
import { Link, useForm } from "@inertiajs/react";
import { Save, Undo } from "lucide-react";
import { useEffect, useState } from "react";
import SaveButton from '@/Components/Button/SaveButton';
import MainLayout from "@/Layouts/MainLayout";
import { Checkbox } from "@/Components/Form/HancmsCheckbox";
import { InputGroup } from "@/Components/Form/HancmsInput";
import HeaderToolbar from "@/Components/Main/HeaderToolbar";
import Card from "@/Components/Main/Card";
import MessageError from "@/Components/Form/MessageError";

function CreatePage() {
    const { trans } = useTrans();
    const { data, setData, errors, post, processing } = useForm({
        name: '',
        code: '',
        status: 0,
        undo: 0,
    });

    const [active, setActive] = useState(data.status);
    const [undo, setUndo] = useState(0);
    const handleUndo = (status: number) => setUndo(status);

    useEffect(() => {
        setData(prev => ({ ...prev, undo, status: active }));
    }, [undo, active]);
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('media-position.store'));
    }
    const inputClass = (fieldName: string) => `
        w-full border rounded-md p-2 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500
        ${(errors[fieldName as keyof typeof errors])
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 focus:border-indigo-500'}
    `;
    return (
        <div className="p-6">
            <HeaderToolbar title={
                <>
                    {trans('hancms.media.position.created')}
                    {data.name && <span className='text-cyan-600'>: {data.name}</span>}
                </>
            }>
                <SaveButton
                    loading={processing}
                    undo={0}
                    icon={<Save size={20} />}
                    sendDataStatusUndo={handleUndo}
                    form='my-form'
                >
                    {trans('hancms.button.save')}
                </SaveButton>
                <Link
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-all shadow-sm"
                    href={route('media-position.index')}
                >
                    <Undo size={20} />
                    <span>{trans('hancms.button.back')}</span>
                </Link>
            </HeaderToolbar>
            <form id='my-form' noValidate onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title={trans('hancms.title.infomation')}>
                    <div className="p-6 space-y-5">
                        <Checkbox>
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={active === 1}
                                onChange={() => setActive(active === 1 ? 0 : 1)}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            <span className={`ml-3 text-sm font-medium ${active === 1 ? 'text-indigo-900' : 'text-gray-400'}`}>
                                {active === 1 ? trans('hancms.status.active') : trans('hancms.status.inactive')}
                            </span>
                        </Checkbox>
                        {/* Name Input */}
                        <InputGroup label={trans('hancms.column.name')}>
                            <input
                                type='text' required
                                className={inputClass('name')}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <MessageError>{errors.name}</MessageError>}
                        </InputGroup>
                        {/* Code Input */}
                        <InputGroup label={trans('hancms.column.code')}>
                            <input
                                type='text' required
                                className={inputClass('code')}
                                onChange={e => setData('code', e.target.value)}
                            />
                            {errors.code && <MessageError>{errors.code}</MessageError>}
                        </InputGroup>
                    </div>
                </Card>
            </form>
        </div>
    )
}
CreatePage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.media.position.name" children={page} />
);
export default CreatePage;