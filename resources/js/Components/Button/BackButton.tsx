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
            className='inline-flex items-center gap-2 p-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-md transition-colors duration-200 no-underline shadow-sm'
            href={href}
        >
            {<Undo size={20} />}
            <span>{children}</span>
        </Link>
    );
}
