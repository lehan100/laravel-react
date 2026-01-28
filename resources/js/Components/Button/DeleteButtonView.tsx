import { ComponentProps } from 'react';
import { Trash2 } from 'lucide-react';
interface Props extends ComponentProps<'button'> {
  onDelete: () => void;
  size: number
}

export default function DeleteButtonView({ onDelete, className, size, children }: Props) {
  return (
    <button
      className={className}
      type="button"
      tabIndex={-1}
      onClick={onDelete}
    >
      <div className="d-flex gap-2 align-items-center">
        {<Trash2 size={size} />}
        <span>{children}</span>
      </div>
    </button>
  );
}
