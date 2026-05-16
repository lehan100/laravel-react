import { ComponentProps } from 'react';
import { Link } from '@inertiajs/react';
import { Undo } from 'lucide-react';
interface Props extends ComponentProps<'button'> {
    className?: string;
    href: string;
}
export default function BackButton({ href, children }: Props) {
    return (
        <Link
            className='inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 px-5 py-3.5 text-base font-semibold text-white no-underline shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-slate-600 hover:to-slate-800 hover:shadow-2xl hover:shadow-slate-900/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2'
            href={href}
        >
            <Undo size={19} />
            <span>{children}</span>
        </Link>
    );
}
