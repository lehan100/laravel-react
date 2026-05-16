import { useTrans } from "@/Hooks/useTrans";
import { Link, useForm } from "@inertiajs/react";
import { Save, Undo } from "lucide-react";
import { useEffect, useState } from "react";
import SaveButton from '@/Components/Button/SaveButton';
import BackButton from '@/Components/Button/BackButton';
import axios from "axios";
import MainLayout from "@/Layouts/MainLayout";
import { InputGroup } from "@/Components/Form/HancmsInput";
import SingleUpload from "@/Components/ImageUpload/SingleUpload";
import HeaderToolbar from "@/Components/Main/HeaderToolbar";
import Card from "@/Components/Main/Card";
import MessageError from "@/Components/Form/MessageError";
import StatusSwitch from "@/Components/Status/StatusSwitch";
import SelectInput from "@/Components/Form/SelectInput";
function CreatedPage() {
    const { trans } = useTrans();
    const { data, setData, errors, post, processing } = useForm({
        name: '',
        code: '',
        currency: 'VND',
        photo: '',
        status: 0,
        undo: 0,
    });

    const [active, setActive] = useState(data.status);
    const [undo, setUndo] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUndo = (status: number) => setUndo(status);

    useEffect(() => {
        setData(prev => ({ ...prev, undo, status: active }));
    }, [undo, active]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('languages.store'));
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('photo', file);

        setLoading(true);
        try {
            const response = await axios.post(route('photo.upload'), formData);
            setPreviewUrl(response.data.url);
            setData('photo', response.data.file_name);
        } catch (error) {
            console.error("Upload lỗi:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper class cho input validation
    // Lớp CSS dùng chung cho Input để code gọn hơn
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
                    {trans('hancms.languages.created')}
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
                <BackButton href={route('languages.index')}>
                    {trans('hancms.button.back')}
                </BackButton>
            </HeaderToolbar>
            <form id='my-form' noValidate onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title={trans('hancms.title.infomation')}>
                    <div className="p-6 space-y-5">
                        <StatusSwitch
                            value={active}
                            onChange={(value) => setActive(value)}
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

                        <InputGroup label={trans('hancms.column.currency')}>
                            <SelectInput
                                name="currency"
                                value={data.currency}
                                onChange={(e: any) => setData('currency', e.target.value)}
                                options={[
                                    { value: 'VND', label: 'VND' },
                                    { value: 'USD', label: 'USD' },
                                    { value: 'JPY', label: 'JPY' },
                                ]}
                            />
                            {errors.currency && <MessageError>{errors.currency}</MessageError>}
                        </InputGroup>

                        {/* Image Upload Box */}
                        <InputGroup label={trans('hancms.column.image')}>
                            <SingleUpload
                                previewUrl={previewUrl}
                                loading={loading}
                                handleFileChange={handleFileChange}
                            />
                        </InputGroup>
                    </div>
                </Card>
            </form>
        </div>
    );
}

CreatedPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.languages.created" children={page} />
);

export default CreatedPage;
