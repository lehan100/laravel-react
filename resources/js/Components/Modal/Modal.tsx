import React from 'react';
import { X } from 'lucide-react'; // Dùng icon X của Lucide thay cho nút close mặc định

const ModalTable = ({ show, onHide, title, children }: any) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[1050] overflow-y-auto">
            {/* Overlay - Lớp phủ mờ phía sau */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onHide}
            />

            {/* Modal Dialog */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-2xl transition-all">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
                        <h3 className="text-base font-bold text-gray-800">
                            {title}
                        </h3>
                        <button
                            onClick={onHide}
                            className="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 text-sm max-h-[70vh] overflow-y-auto">
                        {children}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-4 py-2">
                        <button
                            onClick={onHide}
                            className="rounded bg-gray-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-600 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalTable;
