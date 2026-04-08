import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

interface Props {
    data: any[];
    value: Array<number | string>;
    onChange: (value: Array<number | string>) => void;
    trans: (key: string) => string;
    error?: string;
}

export default function CategoryMultiSelect({ data = [], value = [], onChange, trans, error }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (id: number | string) => {
        const exists = value.some((item) => String(item) === String(id));
        onChange(exists ? value.filter((item) => String(item) !== String(id)) : [...value, id]);
    };

    const removeOption = (e: React.MouseEvent, id: number | string) => {
        e.stopPropagation();
        onChange(value.filter((item) => String(item) !== String(id)));
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex min-h-[52px] w-full cursor-pointer items-center justify-between rounded-2xl border bg-white px-4 py-3 text-sm shadow-sm transition-all ${error
                    ? 'border-rose-400 ring-4 ring-rose-100'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md focus-visible:ring-4 focus-visible:ring-slate-200'
                    }`}
            >
                <div className="mr-3 flex max-w-[92%] flex-wrap gap-2">
                    {value.length > 0 ? (
                        data
                            .filter((opt) => value.some((item) => String(item) === String(opt.id)))
                            .map((opt) => (
                                <span
                                    key={opt.id}
                                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                                >
                                    {opt.name_with_depth || opt.name}
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

            {isOpen && (
                <div className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-950/10 ring-1 ring-black/5">
                    {data.map((item) => {
                        const checked = value.some((selected) => String(selected) === String(item.id));
                        return (
                            <label
                                key={item.id}
                                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50 group"
                            >
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                        checked={checked}
                                        onChange={() => toggleOption(item.id)}
                                    />
                                    <span className={`ml-3 text-sm transition-colors ${checked ? 'font-semibold text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                        {item.name_with_depth || item.name}
                                    </span>
                                </div>
                                {checked && <Check size={14} className="text-emerald-600" />}
                            </label>
                        );
                    })}
                </div>
            )}
            {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
        </div>
    );
}
