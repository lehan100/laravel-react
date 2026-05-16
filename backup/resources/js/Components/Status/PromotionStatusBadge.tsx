import classNames from 'classnames';
import { CheckCircle2, Clock3, CircleAlert, PauseCircle } from 'lucide-react';

type PromotionStatus = 'active' | 'upcoming' | 'expired' | 'inactive';

type PromotionStatusBadgeProps = {
  value: PromotionStatus;
  labels: Record<PromotionStatus, string>;
  className?: string;
};

const config: Record<PromotionStatus, { wrapper: string; dot: string; Icon: typeof CheckCircle2 }> = {
  active: {
    wrapper: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500',
    Icon: CheckCircle2,
  },
  upcoming: {
    wrapper: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-500',
    Icon: Clock3,
  },
  expired: {
    wrapper: 'bg-rose-50 text-rose-700 ring-rose-200',
    dot: 'bg-rose-500',
    Icon: CircleAlert,
  },
  inactive: {
    wrapper: 'bg-slate-100 text-slate-600 ring-slate-200',
    dot: 'bg-slate-400',
    Icon: PauseCircle,
  },
};

export default function PromotionStatusBadge({ value, labels, className }: PromotionStatusBadgeProps) {
  const state = config[value] || config.inactive;
  const Icon = state.Icon;

  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ring-1',
        state.wrapper,
        className,
      )}
    >
      <span className={classNames('h-1.5 w-1.5 rounded-full', state.dot)} />
      <Icon size={12} className="shrink-0" />
      <span className="tracking-normal uppercase">{labels[value] || labels.inactive}</span>
    </span>
  );
}
