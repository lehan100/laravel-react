import { ComponentProps } from 'react';
import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
interface Props extends ComponentProps<'button'> {
  className?: string;
  href: string;
}
export default function EditButtonView({  href, children }: Props) {
  return (
    <Link
       className='inline-flex items-center gap-2 px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded-md transition-colors duration-200 no-underline shadow-sm'
      href={href}
    >
      <div className="flex items-center gap-2">
        {<Pencil size={14} />}
        <span>{children}</span>
      </div>
    </Link>
  );
}
