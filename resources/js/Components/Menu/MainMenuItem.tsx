import { Link } from '@inertiajs/react';
import classNames from 'classnames';

interface MainMenuItemProps {
  icon?: React.ReactNode;
  link: string;
  text: string;
  mobile?: boolean;
  onNavigate?: () => void;
}

export default function MainMenuItem({ icon, link, text, mobile = false, onNavigate }: MainMenuItemProps) {
  const isActive = link !== '#' ? route().current(link + '*') : false;

  const iconClasses = classNames(
    'transition-colors',
    isActive
      ? 'text-white'
      : mobile
        ? 'text-cyan-200 group-hover:text-white'
        : 'text-slate-400 group-hover:text-slate-100'
  );

  const textClasses = classNames(
    'font-medium transition-colors',
    isActive
      ? 'text-white'
      : mobile
        ? 'text-slate-200 group-hover:text-white'
        : 'text-slate-300 group-hover:text-white'
  );

  return (
    <div className="mb-2 last:mb-0">
      <Link
        href={link === '#' ? '#' : route(link)}
        onClick={onNavigate}
        className={classNames(
          'group flex items-center gap-3 rounded-xl transition-all duration-200',
          mobile ? 'px-4 py-3.5' : 'px-3 py-2.5',
            isActive
              ? mobile
              ? 'bg-gradient-to-r from-cyan-400/20 to-sky-500/10 ring-1 ring-cyan-300/20 shadow-sm'
              : 'bg-white/10 shadow-sm ring-1 ring-white/10'
            : mobile
              ? 'bg-white/5 hover:bg-white/10'
              : 'hover:bg-white/5'
        )}
      >
        <div
          className={classNames(
            'flex items-center justify-center rounded-lg bg-white/5 transition-colors',
            mobile ? 'h-9 w-9 shrink-0' : 'h-8 w-8',
            iconClasses
          )}
        >
          {icon}
        </div>
        <div className={classNames('text-sm transition-colors', textClasses)}>{text}</div>
      </Link>
    </div>
  );
}
