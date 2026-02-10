import React from 'react';

const CountryInput = ({
    photo,
    languageName,
    value,
    onChange,
    placeholder,
    name,
    isTextArea = false
}: any) => {
    const flagUrl = `/media/photo/${photo}`;
    return (
        <div className="flex shadow-sm group mb-2">
            {/* Add-on: Cờ quốc gia */}
            <div className="flex items-center justify-center px-3 bg-white-50 border border-r-0 border-gray-300 rounded-l-lg group-focus-within:border-blue-500 group-focus-within:bg-blue-50 transition-colors">
                <img
                    src={flagUrl}
                    alt={languageName}
                    className="w-5 h-auto object-cover rounded-sm "
                />
            </div>

            {/* Input/Textarea chính */}
            {isTextArea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all resize-none"
                />
            ) : (
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-r-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                />
            )}
        </div>
    );
};

export default CountryInput;
