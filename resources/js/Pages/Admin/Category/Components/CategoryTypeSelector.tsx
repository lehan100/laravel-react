import { Check, ChevronDown, X } from 'lucide-react';
import { useMemo, useState } from 'react';

type TypeOption = {
    value: string;
    label: string;
};

interface Props {
    value?: string;
    options: TypeOption[];
    onChange: (value: string) => void;
    placeholder: string;
}

const CategoryTypeSelector = ({ value = '', options = [], onChange, placeholder }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = useMemo(
        () => options.find((item) => String(item.value) === String(value) && item.value !== ''),
        [options, value]
    );

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex cursor-pointer items-center justify-between rounded-md border bg-white px-3 py-2 text-sm"
            >
                <div className="flex gap-2">
                    {selectedOption ? (
                        <span className="flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700">
                            {selectedOption.label}
                            <X
                                size={12}
                                className="ml-1"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange('');
                                }}
                            />
                        </span>
                    ) : (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                </div>
                <ChevronDown size={16} className={isOpen ? 'rotate-180' : ''} />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white py-1 shadow-xl">
                    {options.map((item) => (
                        <div
                            key={item.value || 'select'}
                            onClick={() => {
                                onChange(item.value);
                                setIsOpen(false);
                            }}
                            className={`flex cursor-pointer justify-between px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 ${
                                String(value) === String(item.value) ? 'bg-indigo-50 font-bold' : ''
                            }`}
                        >
                            <span className="transition-colors">{item.label}</span>
                            {String(value) === String(item.value) && <Check size={14} className="text-indigo-600" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryTypeSelector;
