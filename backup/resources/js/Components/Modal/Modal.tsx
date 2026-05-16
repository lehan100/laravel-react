import React, { useEffect } from 'react';
import { X } from 'lucide-react'; // Dùng icon X của Lucide thay cho nút close mặc định
import { useTrans } from '@/Hooks/useTrans';

const ModalTable = ({ show, onHide, title, children, disableScroll = false }: any) => {
    const { trans } = useTrans();

    useEffect(() => {
        if (!show) {
            return;
        }

        const body = document.body;
        const html = document.documentElement;
        const previousBodyOverflow = body.style.overflow;
        const previousHtmlOverflow = html.style.overflow;
        const previousBodyPaddingRight = body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - html.clientWidth;

        body.style.overflow = 'hidden';
        html.style.overflow = 'hidden';

        if (scrollbarWidth > 0) {
            body.style.paddingRight = `${scrollbarWidth}px`;
        }

        return () => {
            body.style.overflow = previousBodyOverflow;
            html.style.overflow = previousHtmlOverflow;
            body.style.paddingRight = previousBodyPaddingRight;
        };
    }, [show]);

    if (!show) {
        return null;
    }

    const rootClassName = disableScroll
        ? "fixed inset-0 z-[1050] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        : "fixed inset-0 z-[1050] overflow-y-auto";

    const dialogClassName = disableScroll
        ? "relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-2xl transition-all max-h-[calc(100vh-2rem)]"
        : "relative w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-2xl transition-all";

    const bodyClassName = disableScroll
        ? "max-h-[70vh] overflow-y-auto p-4 text-sm [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        : "p-4 text-sm max-h-[70vh] overflow-y-auto";

    return (
        <div className={rootClassName}>
            {/* Overlay - Lớp phủ mờ phía sau */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onHide}
            />

            {/* Modal Dialog */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className={dialogClassName}>

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
                    <div className={bodyClassName}>
                        {children}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-4 py-2">
                        <button
                            onClick={onHide}
                            className="rounded bg-gray-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-600 transition-all"
                        >
                            {trans('hancms.button.close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalTable;
