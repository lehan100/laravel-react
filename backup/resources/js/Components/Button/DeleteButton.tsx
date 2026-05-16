import { ComponentProps } from 'react';
import { Trash2 } from 'lucide-react';
interface Props extends ComponentProps<'button'> {
  onDelete: () => void;
  size: number
}

export default function DeleteButtonView({ onDelete, className, size, children, disabled, ...props }: Props) {
  return (
    <button
      className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-lg shadow-rose-950/10 ring-1 ring-rose-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-rose-500 hover:to-red-500 hover:shadow-xl hover:shadow-rose-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      type="button"
      tabIndex={-1}
      onClick={onDelete}
      disabled={disabled}
      {...props}
    >
      <Trash2 size={size} />
      <span>{children}</span>
    </button>
  );
}
