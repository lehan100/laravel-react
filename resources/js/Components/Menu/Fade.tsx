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
        <div className={`mb-4 btn-fade-group transition-all duration-300 ${isOpen ? 'is-open' : ''}`}>

            <button
                onClick={() => setOpen(!open)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-2 text-indigo-200 hover:bg-indigo-800 rounded-md transition-colors"
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
                className={`text-sm transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0'
                    } ps-5 text-indigo-300`}
            >
                {children}
            </div>
        </div>
    );
}
