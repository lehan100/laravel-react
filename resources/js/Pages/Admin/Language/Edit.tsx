import { useTrans } from "@/Hooks/useTrans";
import MainLayout from "@/Layouts/MainLayout";
import { router, useForm, usePage } from "@inertiajs/react";
import { Save, Undo, ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import SaveButton from '@/Components/Button/SaveButton';
import BackButton from '@/Components/Button/BackButton';
import axios from "axios";
import { Language } from "@/types";
import { InputGroup } from "@/Components/Form/HancmsInput";
import SingleUpload from "@/Components/ImageUpload/SingleUpload";
import Card from "@/Components/Main/Card";
import HeaderToolbar from "@/Components/Main/HeaderToolbar";
import MessageError from "@/Components/Form/MessageError";
import StatusSwitch from "@/Components/Status/StatusSwitch";
function EditPage() {
    const { trans } = useTrans();
    const { item, config_path }: any = usePage<{
        item: Language;

    }>().props;

    const { data, setData, errors, put, processing } = useForm({
        id: item.id || null,
        name: item.name || '',
        code: item.code || '',
        photo: item.photo || '',
        status: item.status || 0,
        undo: 0,
    });

    const [validated, setValidated] = useState(false);
    const [active, setActive]: any = useState(data.status);
    const [undo, setUndo] = useState(0);
    const handleUndo = (status: number) => {
        setUndo(status);
    }
    useEffect(() => {
        data.undo = undo;
        if (active != data.status) {
            data.status = active;
        }
    }, [data, undo, active]);
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route('languages.update', item.id));
    }
    //Upload Photo
    const [previewUrl, setPreviewUrl]: any = useState(data.photo ? '/' + config_path.path + "/" + data.photo : null);
    const [loading, setLoading] = useState(false);
    const handleFileChange = async (e: any) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('photo', file);

        setLoading(true);
        try {
            const response = await axios.post(route('photo.upload'), formData);
            setPreviewUrl(response.data.url);
            data.photo = response.data.file_name;
        } catch (error) {
            console.error("Upload lỗi:", error);
        } finally {
            setLoading(false);
        }
    };
    const inputClass = (fieldName: string) => `
        w-full border rounded-md p-2 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500
        ${(errors[fieldName as keyof typeof errors])
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 focus:border-indigo-500'}
    `;
    return (
        <div className="content p-4 text-sm">
            <HeaderToolbar title={
                <>
                    {trans('hancms.languages.edit')}
                    {data.name && <span className='text-cyan-600'>: {data.name}</span>}
                </>
            }>
                <SaveButton
                    loading={processing}
                    undo={undo}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form='my-form'
                >
                    {trans('hancms.button.save')}
                </SaveButton>
                <BackButton href={route('languages.index')}>
                    {trans('hancms.button.back')}
                </BackButton>
            </HeaderToolbar>
            <form id='my-form' onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title={trans('hancms.title.infomation')}>
                        <div className="p-4 space-y-5">
                            <StatusSwitch
                                value={active}
                                onChange={setActive}
                                activeLabel={trans('hancms.status.active')}
                                inactiveLabel={trans('hancms.status.inactive')}
                            />

                            {/* Name Input */}
                            <InputGroup label={trans('hancms.column.name')}>
                                <input
                                    type='text'
                                    required
                                    className={inputClass('name')}
                                    onChange={e => setData('name', e.target.value)}
                                    defaultValue={item.name}
                                />
                                {errors?.name && <MessageError>{errors.name}</MessageError>}
                            </InputGroup>
                            {/* Code Input */}
                            <InputGroup label={trans('hancms.column.code')}>
                                <input
                                    type='text'
                                    required
                                    className={inputClass('code')}
                                    onChange={e => setData('code', e.target.value)}
                                    defaultValue={item.code}
                                />
                                {errors?.code && <MessageError>{errors.code}</MessageError>}
                            </InputGroup>

                            {/* Image Upload Area */}
                            <InputGroup label={trans('hancms.column.image')}>
                                <SingleUpload
                                    previewUrl={previewUrl}
                                    loading={loading}
                                    handleFileChange={handleFileChange}
                                />
                            </InputGroup>
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );

}
EditPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.languages.edit" children={page} />
);

export default EditPage;
