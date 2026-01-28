import { ComponentProps } from 'react';
import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
interface Props extends ComponentProps<'button'> {
  className?: string;
  href: string;
}
export default function EditButtonView({ className, href, children }: Props) {
  return (
    <Link
      className={className}
      href={href}
    >
      <div className="d-flex gap-2 align-items-center">
        {<Pencil size={14} />}
        <span>{children}</span>
      </div>
    </Link>
  );
}
