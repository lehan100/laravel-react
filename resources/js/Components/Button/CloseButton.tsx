import { ComponentProps } from 'react';
import classNames from 'classnames';
import { X } from 'lucide-react';

interface CloseButtonProps extends ComponentProps<'button'> {
  color: string | 'red' | 'green';
}

export default function CloseButton({ color, onClick }: CloseButtonProps) {
  const className = classNames('block -mr-2 fill-current', {
    'text-red-700 group-hover:text-red-800': color === 'red',
    'text-green-700 group-hover:text-green-800': color === 'green'
  });
  return (
    <button
      onClick={onClick}
      type="button"
      className="group inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
    >
      <X size={16} className={className} />
    </button>
  );
}
