import { ComponentProps } from 'react';
import cx from 'classnames';

interface Props extends ComponentProps<'button'> {
  icon?: React.ReactNode;
  loading: boolean;
  undo: number;
  sendDataStatusUndo: (status: number) => void;
}

export default function Save({ loading, icon, children, sendDataStatusUndo, undo, className, ...props }: Props) {
  return (
    <button
      {...props}
      type="submit"
      form="my-form"
      disabled={loading}
      onClick={() => !loading && sendDataStatusUndo(undo)}
      className={cx(
        // Cấu trúc & Font (text-sm và font-medium theo ý bạn)
        'inline-flex items-center justify-center gap-2 p-3 rounded-md font-medium transition-all duration-200',
        // Màu sắc & Hiệu ứng
        'bg-green-600 text-white shadow-sm hover:bg-green-700 active:scale-95',
        // Trạng thái Loading
        'disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-green-600',
        className // Cho phép ghi đè từ bên ngoài
      )}
    >
      {/* Hiển thị Spinner khi loading */}
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        // Chỉ hiển thị icon khi không loading
        icon && <span className="flex-shrink-0">{icon}</span>
      )}

      <span>{children}</span>
    </button>
  );
}
