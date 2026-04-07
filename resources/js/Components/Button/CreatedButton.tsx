import { ComponentProps } from 'react';
import { Link } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
interface Props extends ComponentProps<'button'> {
    className?: string;
    href: string;
}
export default function CreatedButton({ href, children }: Props) {
    return (
        <Link
            className='inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3.5 text-base font-semibold text-white no-underline shadow-xl shadow-emerald-950/10 ring-1 ring-emerald-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-500 hover:to-teal-500 hover:shadow-2xl hover:shadow-emerald-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2'
            href={href}
        >
            <PlusCircle size={19} />
            <span>{children}</span>
        </Link>
    );
}
