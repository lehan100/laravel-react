import { useTrans } from "@/Hooks/useTrans";
import { Link, useForm } from "@inertiajs/react";
import { Save, Undo, ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import SaveButton from '@/Components/Button/SaveButton';
import axios from "axios";
import MainLayout from "@/Layouts/MainLayout";
import { Checkbox } from "@/Components/Form/HancmsCheckbox";
import { InputGroup } from "@/Components/Form/HancmsInput";
function CreatedPage() {
    const { trans } = useTrans();
    const { data, setData, errors, post, processing } = useForm({
        name: '',
        code: '',
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
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">
                    {trans('hancms.languages.created')}
                    {data.name && <span className='text-cyan-600'>: {data.name}</span>}
                </h1>
                <div className="flex gap-2 w-full md:w-auto">
                    <SaveButton
                        loading={processing}
                        undo={0}
                        icon={<Save size={20} />}
                        sendDataStatusUndo={handleUndo}
                        form='my-form'
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                        {trans('hancms.button.save')}
                    </SaveButton>
                    <Link
                        className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-all shadow-sm"
                        href={route('languages.index')}
                    >
                        <Undo size={20} />
                        <span>{trans('hancms.button.back')}</span>
                    </Link>
                </div>
            </div>

            <form id='my-form' noValidate onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CARD THÔNG TIN */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-fit">
                    <div className='py-3 px-4 bg-indigo-800 text-white font-semibold'>
                        {trans('hancms.title.infomation')}
                    </div>
                    <div className="p-6 space-y-5">

                        {/* Status Switch */}
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
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </InputGroup>
                        {/* Code Input */}
                        <InputGroup label={trans('hancms.column.code')}>
                            <input
                                type='text' required
                                className={inputClass('code')}
                                onChange={e => setData('code', e.target.value)}
                            />
                            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
                        </InputGroup>

                        {/* Image Upload Box */}
                        <InputGroup label={trans('hancms.column.image')}>
                            <div className="relative group">
                                <input type="file" id="file-upload" hidden onChange={handleFileChange} accept="image/*" />
                                <label
                                    htmlFor="file-upload"
                                    className={`flex flex-col items-center justify-center  w-20 h-20 p-1 border-2 border-dashed rounded-lg cursor-pointer transition-all overflow-hidden
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
            </form>
        </div>
    );
}

CreatedPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.languages.created" children={page} />
);

export default CreatedPage;