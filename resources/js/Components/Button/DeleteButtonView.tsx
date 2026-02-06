import { ComponentProps } from 'react';
import { Trash2 } from 'lucide-react';
interface Props extends ComponentProps<'button'> {
  onDelete: () => void;
  size_icon: number
}

export default function DeleteButton({ onDelete, size_icon, children }: Props) {
  return (
    <button
      className='inline-flex items-center gap-2 px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors duration-200 no-underline shadow-sm'
      type="button"
      tabIndex={-1}
      onClick={onDelete}
    >
      {<Trash2 size={size_icon} />}
      <span>{children}</span>
    </button>
  );
}
