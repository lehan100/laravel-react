import { useTrans } from "@/Hooks/useTrans";
import MainLayout from "@/Layouts/MainLayout";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { Save, Undo, ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import SaveButton from '@/Components/Button/SaveButton';
import axios from "axios";
import { Language } from "@/types";
import { Checkbox } from "@/Components/Form/HancmsCheckbox";
import { InputGroup } from "@/Components/Form/HancmsInput";
import SingleUpload from "@/Components/ImageUpload/SingleUpload";
import Card from "@/Components/Main/Card";
import HeaderToolbar from "@/Components/Main/HeaderToolbar";
import MessageError from "@/Components/Form/MessageError";
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
                    undo={0}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form='my-form'
                >
                    {trans('hancms.button.save')}
                </SaveButton>
                <Link
                    href={route('languages.index')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all text-sm font-medium no-underline shadow-sm active:scale-95"
                >
                    <Undo size={18} />
                    <span>{trans('hancms.button.back')}</span>
                </Link>
            </HeaderToolbar>
            <form id='my-form' onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title={trans('hancms.title.infomation')}>
                        <div className="p-4 space-y-5">
                            {/* Status Switch */}
                            <Checkbox>
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={active == '1'}
                                    onChange={() => setActive(active == 1 ? 0 : 1)}
                                />
                                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                                <span className={`ml-3 text-sm font-medium ${active == '1' ? 'text-green-600' : 'text-gray-500'}`}>
                                    {active == '1' ? trans('hancms.status.active') : trans('hancms.status.inactive')}
                                </span>
                            </Checkbox>

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