import cx from 'classnames';

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
}

export default function LoadingButton({
  loading,
  className,
  children,
  ...props
}: LoadingButtonProps) {
  const classNames = cx(
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'shadow-lg shadow-slate-900/10 ring-1 ring-slate-900/5',
    loading ? 'pointer-events-none select-none opacity-80' : 'hover:-translate-y-0.5 active:translate-y-0',
    className
  );
  return (
    <button disabled={loading} className={classNames} {...props}>
      {loading && <div className="btn-spinner" />}
      {children}
    </button>
  );
}
