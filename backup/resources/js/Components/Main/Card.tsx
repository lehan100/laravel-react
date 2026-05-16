import { useTrans } from '@/Hooks/useTrans';

type CardProps = {
    title?: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    surface?: 'white' | 'transparent';
    overflow?: 'hidden' | 'visible';
    contentOverflow?: 'auto' | 'visible';
};

export default function Card({
    title,
    action,
    children,
    className,
    contentClassName,
    surface = 'white',
    overflow = 'hidden',
    contentOverflow = 'auto',
}: CardProps) {
    const { trans } = useTrans();
    const isTransparent = surface === 'transparent';
    const overflowClassName = overflow === 'visible' ? 'overflow-visible' : 'overflow-hidden';
    const contentOverflowClassName = contentOverflow === 'visible' ? 'overflow-visible' : 'overflow-x-auto';
    const rootClassName = isTransparent
        ? `${overflowClassName} rounded-2xl ${className || ''}`
        : `${overflowClassName} rounded-2xl border border-slate-200 bg-white shadow-sm ${className || ''}`;

    return (
        <div className={rootClassName}>
            {title ? (
                <div className="border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-900 px-5 py-4 text-white">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/80">
                                {trans('hancms.section')}
                            </div>
                            <div className="mt-1 text-sm font-semibold tracking-wide">{title}</div>
                        </div>
                        {action ? <div className="shrink-0">{action}</div> : null}
                    </div>
                </div>
            ) : null}
            <div className={`${contentOverflowClassName} ${contentClassName || ''}`}>
                {children}
            </div>
        </div>
    );
}
