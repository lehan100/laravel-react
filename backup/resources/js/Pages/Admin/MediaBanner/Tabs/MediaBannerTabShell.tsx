import type { ReactNode } from 'react';

type TabDefinition = {
    id: string;
    label: string;
};

type Props = {
    title: string;
    activeTab: string;
    tabs: TabDefinition[];
    trans: (key: string) => string;
    hasTabError: (tabId: string) => boolean;
    onTabChange: (tabId: string) => void;
    renderTabContent: () => ReactNode;
};

export default function MediaBannerTabShell({
    title,
    activeTab,
    tabs,
    trans,
    hasTabError,
    onTabChange,
    renderTabContent,
}: Props) {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-42px_rgba(15,23,42,0.45)]">
            <div className="flex flex-col md:flex-row">
                <div className="border-b border-slate-200 bg-gradient-to-b from-slate-950/[0.03] to-white p-3 md:w-72 md:border-b-0 md:border-r md:p-4">
                    <div className="mb-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                        <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{trans('hancms.tabs')}</div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">{title}</div>
                    </div>

                    <div className="flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible" role="tablist">
                        {tabs.map((tab) => {
                            const errorInTab = hasTabError(tab.id);
                            const active = activeTab === tab.id;

                            return (
                                <button
                                    type="button"
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className={`group flex min-w-[170px] items-center justify-between rounded-2xl border p-4 text-left transition-all duration-200 md:min-w-0 ${
                                        active
                                            ? 'border-slate-950 bg-slate-950 text-white shadow-[0_18px_45px_-24px_rgba(15,23,42,0.7)]'
                                            : errorInTab
                                                ? 'border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100'
                                                : 'border-slate-200 bg-white/90 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="mt-1 text-sm font-semibold">{tab.label}</span>
                                    </div>

                                    {errorInTab ? (
                                        <span className="ml-3 inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_0_4px_rgba(244,63,94,0.14)]" />
                                    ) : (
                                        <span className={`ml-3 text-xs font-semibold ${active ? 'text-cyan-200' : 'text-slate-300 group-hover:text-slate-500'}`}>
                                            {active ? trans('hancms.open') : trans('hancms.view')}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="min-w-0 flex-1 bg-gradient-to-b from-white to-slate-50/70">
                    <div className="border-b border-slate-200/80 bg-white/80 px-5 py-4 backdrop-blur sm:px-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">{trans('hancms.current_tab')}</div>
                                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                                    {tabs.find((tab) => tab.id === activeTab)?.label || trans(`hancms.layout.tabs.${activeTab}`)}
                                </h2>
                            </div>
                            <div className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 sm:inline-flex">
                                {hasTabError(activeTab) ? trans('hancms.needs_attention') : trans('hancms.ready')}
                            </div>
                        </div>
                    </div>

                    <div className="p-5 sm:p-6">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}
