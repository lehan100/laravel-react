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
       className='inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1.5 text-[11px] font-semibold text-white no-underline shadow-md shadow-amber-950/10 ring-1 ring-amber-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-amber-400 hover:to-orange-400 hover:shadow-lg hover:shadow-amber-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2'
      href={href}
    >
      <div className="flex items-center gap-1.5">
        <Pencil size={13} />
        <span>{children}</span>
      </div>
    </Link>
  );
}
