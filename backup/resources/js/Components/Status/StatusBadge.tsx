import classNames from 'classnames';

interface StatusBadgeProps {
  value: number | string | boolean;
  activeLabel: string;
  inactiveLabel: string;
  className?: string;
}

export default function StatusBadge({
  value,
  activeLabel,
  inactiveLabel,
  className,
}: StatusBadgeProps) {
  const isActive = value === 1 || value === '1' || value === true;

  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ring-1',
        isActive
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
          : 'bg-rose-50 text-rose-700 ring-rose-200',
        className
      )}
    >
      <span
        className={classNames(
          'h-1.5 w-1.5 rounded-full',
          isActive ? 'bg-emerald-500' : 'bg-rose-500'
        )}
      />
      <span className="tracking-normal uppercase">
        {isActive ? activeLabel : inactiveLabel}
      </span>
    </span>
  );
}
