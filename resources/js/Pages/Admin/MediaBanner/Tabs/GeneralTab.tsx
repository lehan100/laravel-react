import { useState, useRef, useEffect } from "react";
import { InputGroup } from "@/Components/Form/HancmsInput";
import { ChevronDown, Check, X } from "lucide-react";
import MessageError from "@/Components/Form/MessageError";
import StatusSwitch from "@/Components/Status/StatusSwitch";
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
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <InputGroup label={trans('hancms.column.status')} align="center">
                    <StatusSwitch
                        value={data.status}
                        onChange={(value) => setData('status', value)}
                        activeLabel={trans('hancms.status.active')}
                        inactiveLabel={trans('hancms.status.inactive')}
                    />
                </InputGroup>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
                <InputGroup label={trans('hancms.media.position.name')} align="center">
                    <div className="relative w-full" ref={dropdownRef}>
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            className={`flex min-h-[52px] w-full cursor-pointer items-center justify-between rounded-2xl border bg-white px-4 py-3 text-sm shadow-sm transition-all ${positionError
                                    ? 'border-rose-400 ring-4 ring-rose-100'
                                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md focus-visible:ring-4 focus-visible:ring-slate-200'
                                }`}
                        >
                            <div className="mr-3 flex max-w-[92%] flex-wrap gap-2">
                                {currentIds.length > 0 ? (
                                    positions
                                        .filter(opt => currentIds.includes(opt.id))
                                        .map((opt) => (
                                            <span
                                                key={opt.id}
                                                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                                            >
                                                {opt.name}
                                                <button
                                                    type="button"
                                                    onClick={(e) => removeOption(e, opt.id)}
                                                    className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-300 hover:text-slate-700"
                                                >
                                                    <X size={10} strokeWidth={3} />
                                                </button>
                                            </span>
                                        ))
                                ) : (
                                    <span className="ml-1 font-normal text-slate-400">
                                        {trans('hancms.placeholder.select')}
                                    </span>
                                )}
                            </div>
                            <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                        {positionError && (
                            <MessageError>{positionError}</MessageError>
                        )}
                        {isOpen && (
                            <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-950/10 ring-1 ring-black/5">
                                {positions.map((position) => {
                                    const isChecked = currentIds.includes(position.id);
                                    return (
                                        <label
                                            key={position.id}
                                            className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50 group"
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                                    checked={isChecked}
                                                    onChange={() => toggleOption(position.id)}
                                                />
                                                <span className={`ml-3 text-sm transition-colors ${isChecked ? 'font-semibold text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                                    {position.name}
                                                </span>
                                            </div>
                                            {isChecked && <Check size={14} className="text-emerald-600" />}
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </InputGroup>
            </div>
        </div>
    );
};

export default GeneralTab;
