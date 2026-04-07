import { useTrans } from '@/Hooks/useTrans';

export default function Card({ title, children, className }: any) {
    const { trans } = useTrans();

    return (
        <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur ${className || ''}`}>
            {title && <div className="border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-900 px-5 py-4 text-white">
                <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/80">{trans('hancms.section')}</div>
                <div className="mt-1 text-sm font-semibold tracking-wide">
                {title}
                </div>
            </div>
            }
            <div className="overflow-x-auto">
                {children}
            </div>
        </div>
    )
}
