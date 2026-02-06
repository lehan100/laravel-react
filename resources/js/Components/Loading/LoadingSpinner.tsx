interface LoadingSpinnerProps {
    isLoading: boolean;
    children?: React.ReactNode;
    variant?: string; // Ví dụ: 'blue', 'red', 'white'...
}

export default function LoadingSpinner({ isLoading, children, variant = 'white' }: LoadingSpinnerProps) {
    // Map màu sắc linh hoạt (tương tự variant của Bootstrap)
    const colorMap: Record<string, string> = {
        primary: 'bg-blue-600',
        danger: 'bg-red-600',
        success: 'bg-green-600',
        white: 'bg-white',
    };

    return (
        <div className="relative">
            {/* Hiển thị nội dung bên dưới khi không load hoặc load xong */}
            {children}

            {isLoading && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    {/* Hiệu ứng "grow" bằng animate-ping của Tailwind */}
                    <div className={`h-12 w-12 rounded-full animate-ping ${colorMap[variant] || colorMap.white}`}></div>

                    {/* Text loading hỗ trợ Accessibility (ẩn với người dùng thường) */}
                    <span className="sr-only">Đang tải...</span>
                </div>
            )}
        </div>
    );
}
