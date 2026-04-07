import classNames from 'classnames';
import StatusBadge from './StatusBadge';

interface StatusSwitchProps {
  value: number | string | boolean;
  onChange: (value: number) => void;
  activeLabel: string;
  inactiveLabel: string;
  className?: string;
}

export default function StatusSwitch({
  value,
  onChange,
  activeLabel,
  inactiveLabel,
  className,
}: StatusSwitchProps) {
  const isActive = value === 1 || value === '1' || value === true;

  return (
    <div className={classNames('flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm', className)}>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={isActive}
          onChange={(e) => onChange(e.target.checked ? 1 : 0)}
        />
        <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-200 peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white" />
      </label>
      <StatusBadge
        value={value}
        activeLabel={activeLabel}
        inactiveLabel={inactiveLabel}
      />
    </div>
  );
}
