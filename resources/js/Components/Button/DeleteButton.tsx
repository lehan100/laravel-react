import { ComponentProps } from 'react';
import { Trash2 } from 'lucide-react';
interface Props extends ComponentProps<'button'> {
  onDelete: () => void;
  size: number
}

export default function DeleteButtonView({ onDelete, className, size, children }: Props) {
  return (
    <button
      className='inline-flex items-center gap-2 p-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200 no-underline shadow-sm'
      type="button"
      tabIndex={-1}
      onClick={onDelete}
    >
      {<Trash2 size={size} />}
      <span>{children}</span>
    </button>
  );
}
