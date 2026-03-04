import { useTrans } from '@/Hooks/useTrans';
import { Loader2, ImagePlus } from 'lucide-react';
const SingleUpload = ({
    previewUrl,
    loading,
    handleFileChange,
    id = "file-upload"
}: any) => {
    const {trans} = useTrans();
    return (
        <div className="relative group inline-block">
            <input
                type="file"
                id={id}
                hidden
                onChange={handleFileChange}
                accept="image/*"
            />
            <label
                htmlFor={id}
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
                <div className="absolute top-0 left-0 w-20 h-20 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none">
                    <span className="text-white text-[10px] font-medium">{trans("hancms.column.image_edit")}</span>
                </div>
            )}
        </div>
    );
};

export default SingleUpload;