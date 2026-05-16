import { useTrans } from "@/Hooks/useTrans";
import { useForm } from "@inertiajs/react";
import { Save, Undo } from "lucide-react";
import { useEffect, useState } from "react";
import SaveButton from '@/Components/Button/SaveButton';
import BackButton from '@/Components/Button/BackButton';
import MainLayout from "@/Layouts/MainLayout";
import { InputGroup } from "@/Components/Form/HancmsInput";
import HeaderToolbar from "@/Components/Main/HeaderToolbar";
import Card from "@/Components/Main/Card";
import MessageError from "@/Components/Form/MessageError";
import StatusSwitch from "@/Components/Status/StatusSwitch";

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
                    undo={undo}
                    icon={<Save size={20} />}
                    sendDataStatusUndo={handleUndo}
                    form='my-form'
                >
                    {trans('hancms.button.save')}
                </SaveButton>
                <BackButton href={route('media-position.index')}>
                    {trans('hancms.button.back')}
                </BackButton>
            </HeaderToolbar>
            <form id='my-form' noValidate onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title={trans('hancms.title.infomation')}>
                    <div className="p-6 space-y-5">
                        <StatusSwitch
                            value={active}
                            onChange={setActive}
                            activeLabel={trans('hancms.status.active')}
                            inactiveLabel={trans('hancms.status.inactive')}
                        />
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
