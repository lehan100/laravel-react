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
    console.log(data);

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

        // 1. Hiển thị preview tạm thời bằng URL local (tùy chọn)
        // setPreviewUrl(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append('photo', file);

        setLoading(true);
        try {
            // 2. Gửi lên Laravel để lưu vào tmp
            const response = await axios.post(route('photo.upload'), formData);
            // 3. Cập nhật preview bằng URL thật từ server trả về
            // Giả sử Laravel trả về { "url": "http://domain.com" }
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
            {/* Header Section */}
            <div className="flex flex-wrap justify-between items-center mb-6">
                <div className="w-full md:flex-1 mb-3 md:mb-0">
                    <h1 className="text-xl font-bold text-gray-800">
                        {trans('hancms.languages.edit')}
                        {data.name !== '' && <span className='text-blue-600 font-medium'> : {data.name}</span>}
                    </h1>
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
                        <Link
                            href={route('languages.index')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all text-sm font-medium no-underline shadow-sm active:scale-95"
                        >
                            <Undo size={18} />
                            <span>{trans('hancms.button.back')}</span>
                        </Link>
                    </div>
                </div>
            </div>

            <form id='my-form' onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Information Card */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="px-4 py-3 bg-indigo-800 text-white font-bold uppercase tracking-wider">
                            {trans('hancms.title.infomation')}
                        </div>

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
                                {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
                                {errors?.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                            </InputGroup>

                            {/* Image Upload Area */}
                            <InputGroup label={trans('hancms.column.image')}>
                                <div className="relative group">
                                    <input type="file" id="file-upload" hidden onChange={handleFileChange} accept="image/*" />
                                    <label
                                        htmlFor="file-upload"
                                        className={`flex flex-col items-center justify-center w-20 h-20 p-1 border-2 border-dashed rounded-lg cursor-pointer transition-all overflow-hidden
                                            ${previewUrl ? 'border-indigo-400' : 'border-gray-300 hover:border-indigo-500 bg-gray-50'}`}
                                    >
                                        {loading ? (
                                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                        ) : previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-500">
                                                <ImagePlus size={32} />
                                                <span className="text-[10px] mt-1 uppercase font-semibold">Upload</span>
                                            </div>
                                        )}
                                    </label>
                                    {previewUrl && !loading && (
                                        <div className="absolute top-0 left-0 w-32 h-32 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none">
                                            <span className="text-white text-xs font-medium">Thay đổi</span>
                                        </div>
                                    )}
                                </div>
                            </InputGroup>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );

}
EditPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.languages.edit" children={page} />
);

export default EditPage;