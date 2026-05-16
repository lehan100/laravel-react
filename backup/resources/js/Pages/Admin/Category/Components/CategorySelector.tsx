import { Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";

const CategorySelector = ({ value, data, onChange, trans }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedNode = data.find((item: any) => String(item.id) === String(value));

    return (
        <div className="relative">
            {/* Thanh hiển thị (Trigger) */}
            <div onClick={() => setIsOpen(!isOpen)} className="border text-sm rounded-md px-3 py-2 flex justify-between items-center bg-white cursor-pointer">
                <div className="flex gap-2">
                    {selectedNode && String(value) !== '0' ? (
                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-100 flex items-center">
                            {selectedNode.name.replace(/^[-\s]+/, '')} 
                            <X size={12} className="ml-1" onClick={(e) => { e.stopPropagation(); onChange('0'); }} />
                        </span>
                    ) : (
                        <span className="text-gray-400">{trans('hancms.catalog.category.select')}</span>
                    )}
                </div>
                <ChevronDown size={16} className={isOpen ? 'rotate-180' : ''} />
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-xl max-h-60 overflow-y-auto py-1">
                    {data.map((item: any) => (
                        <div 
                            key={item.id} 
                            onClick={() => { onChange(item.id); setIsOpen(false); }}
                            className={`px-4 py-2 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer text-sm flex justify-between ${String(value) === String(item.id) ? 'bg-indigo-50 font-bold' : ''}`}
                        >
                            <span className="transition-colors">{item.name_with_depth}</span> 
                            {String(value) === String(item.id) && <Check size={14} className="text-indigo-600" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default CategorySelector;