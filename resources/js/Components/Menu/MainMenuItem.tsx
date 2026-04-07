import { Link } from '@inertiajs/react';
import classNames from 'classnames';

interface MainMenuItemProps {
  icon?: React.ReactNode;
  link: string;
  text: string;
}

export default function MainMenuItem({ icon, link, text }: MainMenuItemProps) {
  const isActive = route().current(link + '*');

  const iconClasses = classNames({
    'text-white': isActive,
    'text-slate-400 group-hover:text-slate-100': !isActive
  });

  const textClasses = classNames({
    'text-white': isActive,
    'text-slate-300 group-hover:text-white': !isActive
  });

  return (
    <div className="mb-2 last:mb-0">
      <Link
        href={route(link)}
        className={classNames(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200',
          isActive
            ? 'bg-white/10 shadow-sm ring-1 ring-white/10'
            : 'hover:bg-white/5'
        )}
      >
        <div className={classNames('flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-colors', iconClasses)}>
          {icon}
        </div>
        <div className={classNames('text-sm font-medium transition-colors', textClasses)}>{text}</div>
      </Link>
    </div>
  );
}
