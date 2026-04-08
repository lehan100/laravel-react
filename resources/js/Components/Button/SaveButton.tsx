import { ComponentProps } from 'react';
import cx from 'classnames';

interface Props extends ComponentProps<'button'> {
  icon?: React.ReactNode;
  loading: boolean;
  undo: number;
  sendDataStatusUndo: (status: number) => void;
}

export default function Save({ loading, icon, children, sendDataStatusUndo, undo, className, ...props }: Props) {
  const formId = typeof props.form === 'string' && props.form ? props.form : 'my-form';

  return (
    <button
      {...props}
      type="submit"
      form={formId}
      disabled={loading}
      onClick={() => !loading && sendDataStatusUndo(undo)}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3.5 text-base font-semibold text-white shadow-xl shadow-emerald-950/10 ring-1 ring-emerald-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-500 hover:to-teal-500 hover:shadow-2xl hover:shadow-emerald-950/15 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:from-emerald-600 disabled:hover:to-teal-600',
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
