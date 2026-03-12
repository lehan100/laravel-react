import { useState, useRef, useEffect } from "react";
import { InputGroup } from "@/Components/Form/HancmsInput";
import { ChevronDown, Check, X } from "lucide-react";
import MessageError from "@/Components/Form/MessageError";
interface Option {
    id: number;
    name: string;
    code: string;
    status: number;
}

interface GeneralTabProps {
    data: any;
    setData: (key: string, value: any) => void;
    trans: (key: string) => string;
    positions: Option[];
    errors?: any;
}

const GeneralTab = ({ data, setData, trans, positions = [], errors }: GeneralTabProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentIds = Array.isArray(data.position_ids) ? data.position_ids : [];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (id: number) => {
        const isSelected = currentIds.includes(id);
        const newValues = isSelected
            ? currentIds.filter((itemId: number) => itemId !== id)
            : [...currentIds, id];
        setData('position_ids', newValues);
    };

    const removeOption = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        const newValues = currentIds.filter((itemId: number) => itemId !== id);
        setData('position_ids', newValues);
    };
    //Error
    const positionError = errors?.position_ids;
    return (
        <div className="space-y-6">
            <InputGroup label={trans('hancms.column.status')} align="center">
                <div className="flex items-center gap-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={data.status === 1}
                            onChange={(e) => setData('status', e.target.checked ? 1 : 0)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-700">
                            {data.status === 1 ? trans('hancms.status.active') : trans('hancms.status.inactive')}
                        </span>
                    </label>
                </div>
            </InputGroup>

            <InputGroup label={trans('hancms.media.position.name')} align="center">
                <div className="relative w-full" ref={dropdownRef}>
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className={`min-h-[42px] w-full border rounded-md shadow-sm px-2 py-1.5 text-sm bg-white cursor-pointer flex justify-between items-center transition-all ${positionError
                                ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-gray-300 hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500'
                            }`}
                    >
                        <div className="flex flex-wrap gap-1.5 mr-2 max-w-[92%]">
                            {currentIds.length > 0 ? (
                                positions
                                    .filter(opt => currentIds.includes(opt.id))
                                    .map((opt) => (
                                        <span
                                            key={opt.id}
                                            className="inline-flex items-center bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                        >
                                            {opt.name}
                                            <button
                                                type="button"
                                                onClick={(e) => removeOption(e, opt.id)}
                                                className="ml-1.5 p-0.5 rounded-full hover:bg-indigo-200 text-indigo-400 hover:text-indigo-600 transition-all"
                                            >
                                                <X size={12} strokeWidth={3} />
                                            </button>
                                        </span>
                                    ))
                            ) : (
                                <span className="text-gray-400 ml-1 font-normal">
                                    {trans('hancms.placeholder.select')}
                                </span>
                            )}
                        </div>
                        <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {positionError && (
                        <MessageError>{positionError}</MessageError>
                    )}
                    {isOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto py-1 ring-1 ring-black ring-opacity-5">
                            {positions.map((position) => {
                                const isChecked = currentIds.includes(position.id);
                                return (
                                    <label
                                        key={position.id}
                                        className="flex items-center justify-between px-4 py-2.5 hover:bg-indigo-50 cursor-pointer group transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                                checked={isChecked}
                                                onChange={() => toggleOption(position.id)}
                                            />
                                            <span className={`ml-3 text-sm transition-colors ${isChecked ? 'font-semibold text-indigo-700' : 'text-gray-700 group-hover:text-indigo-600'}`}>
                                                {position.name}
                                            </span>
                                        </div>
                                        {isChecked && <Check size={14} className="text-indigo-600" />}
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
            </InputGroup>
        </div>
    );
};

export default GeneralTab;
