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
            className='inline-flex items-center gap-2 p-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200 no-underline shadow-sm'
            href={href}
        >
            {<PlusCircle size={20} />}
            <span>{children}</span>
        </Link>
    );
}
