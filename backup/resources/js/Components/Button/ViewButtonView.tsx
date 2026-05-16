import { ComponentProps } from 'react';
import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';

interface Props extends ComponentProps<'button'> {
    className?: string;
    href: string;
}

export default function ViewButtonView({ href, children }: Props) {
    return (
        <Link
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-sky-600 px-2.5 py-1.5 text-[11px] font-semibold text-white no-underline shadow-md shadow-cyan-950/10 ring-1 ring-cyan-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-cyan-500 hover:to-sky-500 hover:shadow-lg hover:shadow-cyan-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
            href={href}
        >
            <div className="flex items-center gap-1.5">
                <Eye size={13} />
                <span>{children}</span>
            </div>
        </Link>
    );
}
