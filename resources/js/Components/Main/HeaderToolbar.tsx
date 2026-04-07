export default function HeaderToolbar({ title, children }: any) {
    return (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Administration</div>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
            </div>
            <div className="md:w-auto">
                <div className="flex flex-wrap gap-2">
                    {children}
                </div>
            </div>
        </div>
    )
};
