import { useEffect, useState } from 'react';

export default function Face({ children, ...props }: any) {
    const [openRoute, setOpenRoute] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (props.index !== undefined && props.index > -1) {
            setOpenRoute(true);
            setOpen(false);
        } else {
            setOpenRoute(false);
        }
    }, [props.index]); // Thêm dependency để tránh re-render vô tận

    const isOpen = open || openRoute;

    return (
        /* Sử dụng flex để đưa Button và Content nằm trên 1 dòng nếu cần, 
           hoặc giữ block tùy vào thiết kế UI của bạn */
        <div className={`mb-3 rounded-2xl border border-white/10 bg-white/5 p-1 transition-all duration-300 ${isOpen ? 'ring-1 ring-cyan-400/30' : ''}`}>

            <button
                onClick={() => setOpen(!open)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
            >
                {/* Phần chứa Icon và Title luôn nằm trên 1 dòng nhờ flex */}
                <div className="flex items-center gap-2 px-2">
                    {props.icon}
                    <span className="font-medium">{props.title}</span>
                </div>

                {/* Icon mũi tên xoay để báo trạng thái đóng/mở */}
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Hiệu ứng Fade bằng Tailwind: opacity + transform */}
            <div
                id={props.id}
                className={`overflow-hidden ps-3 text-sm text-slate-300 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                {children}
            </div>
        </div>
    );
}
