import { useTrans } from '@/Hooks/useTrans';
import { Loader2, ImagePlus } from 'lucide-react';

const SingleUpload = ({
    previewUrl,
    loading,
    handleFileChange,
    id = "file-upload",
    width = "w-20",
    height = "h-20"
}: any) => {
    const { trans } = useTrans();

    return (
        <div className={`relative group inline-block ${width} ${height}`}>
            <input
                type="file"
                id={id}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
            />
            <label
                htmlFor={id}
                className={`flex flex-col items-center justify-center w-full h-full p-1 border-2 border-dashed rounded-lg cursor-pointer transition-all overflow-hidden
                    ${previewUrl ? 'border-indigo-400 bg-white' : 'border-gray-300 hover:border-indigo-500 bg-gray-50'}`}
            >
                {loading ? (
                    <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                ) : previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-md" />
                ) : (
                    <div className="flex flex-col items-center text-gray-400 group-hover:text-indigo-500 transition-colors px-1 text-center">
                        <ImagePlus size={24} />
                        <span className="text-[9px] mt-1 uppercase font-bold tracking-tighter truncate w-full">
                            {trans("hancms.column.upload")}
                        </span>
                    </div>
                )}
            </label>

            {previewUrl && !loading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none">
                    <span className="text-white text-[10px] font-medium uppercase tracking-widest text-center px-1">
                        {trans("hancms.column.image_edit")}
                    </span>
                </div>
            )}
        </div>
    );
};

export default SingleUpload;
