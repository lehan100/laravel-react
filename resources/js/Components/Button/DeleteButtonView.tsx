import { ComponentProps } from 'react';
import { Trash2 } from 'lucide-react';
interface Props extends ComponentProps<'button'> {
  onDelete: () => void;
  size_icon: number
}

export default function DeleteButton({ onDelete, size_icon, children }: Props) {
  return (
    <button
      className='inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 px-2.5 py-1.5 text-[11px] font-semibold text-white no-underline shadow-md shadow-rose-950/10 ring-1 ring-rose-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-rose-500 hover:to-red-500 hover:shadow-lg hover:shadow-rose-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2'
      type="button"
      tabIndex={-1}
      onClick={onDelete}
    >
      <Trash2 size={size_icon} />
      <span>{children}</span>
    </button>
  );
}
