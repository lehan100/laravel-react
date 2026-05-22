import { useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import Card from '@/Components/Main/Card';
import CreatedButton from '@/Components/Button/CreatedButton';
import DeleteButtonView from '@/Components/Button/DeleteButtonView';
import EditButtonView from '@/Components/Button/EditButtonView';

type BatchRow = {
    token: string;
    topic?: string;
    locale?: string;
    category_id?: number | string | null;
    total_items?: number;
    due_items?: number;
    upcoming_items?: number;
    progress?: number;
    created_at?: string;
    items?: Array<{
        draft_id: string;
        title?: string;
        description?: string;
        content?: string;
        photo?: string;
        photo_url?: string;
        published_at?: string;
    }>;
};

export default function PostAssistantIndexPage() {
    const { trans } = useTrans();
    const { batches, batchSummary, itemsCategoryActive }: any = usePage().props;
    const rows: BatchRow[] = Array.isArray(batches) ? batches : [];
    const categoryOptions = Array.isArray(itemsCategoryActive) ? itemsCategoryActive : [];

    function getCategoryLabel(categoryId?: number | string | null): string {
        if (categoryId === null || categoryId === undefined || categoryId === '') {
            return '---';
        }

        const category = categoryOptions.find((item: any) => String(item.id) === String(categoryId));

        return category?.name_with_depth
            || category?.translations?.vi?.name
            || category?.translations?.en?.name
            || category?.name
            || `#${categoryId}`;
    }

    const summaryCards = useMemo(
        () => [
            {
                label: trans('hancms.ai_assistant.post_assistant.groups'),
                value: batchSummary?.groups ?? rows.length,
                description: trans('hancms.ai_assistant.post_assistant.groups_hint'),
            },
            {
                label: trans('hancms.ai_assistant.post_assistant.drafts'),
                value: batchSummary?.drafts ?? rows.reduce((sum, batch) => sum + (batch.total_items || 0), 0),
                description: trans('hancms.ai_assistant.post_assistant.total_drafts_hint'),
            },
            {
                label: trans('hancms.ai_assistant.post_assistant.ready_label'),
                value: batchSummary?.ready_to_public ?? rows.reduce((sum, batch) => sum + (batch.due_items || 0), 0),
                description: trans('hancms.ai_assistant.post_assistant.ready_hint'),
                tone: 'emerald',
            },
            {
                label: trans('hancms.ai_assistant.post_assistant.upcoming_label'),
                value: batchSummary?.upcoming ?? rows.reduce((sum, batch) => sum + (batch.upcoming_items || 0), 0),
                description: trans('hancms.ai_assistant.post_assistant.upcoming_hint'),
                tone: 'cyan',
            },
        ],
        [batchSummary, rows, trans]
    );

    return (
        <div className="space-y-6">
            <HeaderToolbar title={trans('hancms.ai_assistant.post_assistant.name')}>
                <CreatedButton href={route('ai.post-assistant.create')}>
                    {trans('hancms.button.created')}
                </CreatedButton>
            </HeaderToolbar>

            <Card title={trans('hancms.ai_assistant.post_assistant.statistics_title')}>
                <div className="p-6">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {summaryCards.map((card) => (
                            <div key={card.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{card.label}</div>
                                <div className={`mt-2 text-2xl font-semibold ${card.tone === 'emerald' ? 'text-emerald-700' : card.tone === 'cyan' ? 'text-cyan-700' : 'text-slate-900'}`}>
                                    {card.value}
                                </div>
                                <p className="mt-1 text-sm text-slate-500">{card.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <Card title={trans('hancms.ai_assistant.post_assistant.group_list_title')}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-950 text-white">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">#</th>
                                <th className="whitespace-nowrap px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.ai_assistant.post_assistant.group_label')}</th>
                                <th className="whitespace-nowrap px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.ai_assistant.post_assistant.category_label')}</th>
                                <th className="whitespace-nowrap px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.ai_assistant.post_assistant.locale_label')}</th>
                                <th className="whitespace-nowrap px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.ai_assistant.post_assistant.drafts')}</th>
                                <th className="whitespace-nowrap px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.ai_assistant.post_assistant.ready_label')}</th>
                                <th className="whitespace-nowrap px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.ai_assistant.post_assistant.progress_label')}</th>
                                <th className="whitespace-nowrap px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.ai_assistant.post_assistant.created_label')}</th>
                                <th className="whitespace-nowrap px-4 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.column.action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {rows.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-16 text-center text-slate-500">
                                        {trans('hancms.ai_assistant.post_assistant.empty_groups_title')}
                                    </td>
                                </tr>
                            ) : rows.map((batch, index) => {
                                const progress = Number(batch.progress || 0);

                                return (
                                    <tr key={batch.token} className="align-top transition hover:bg-slate-50/80">
                                        <td className="px-4 py-4 text-slate-700">{index + 1}</td>
                                        <td className="px-4 py-4 text-slate-900">
                                            <div className="font-semibold">{batch.topic || 'Untitled topic'}</div>
                                            <div className="mt-1 font-mono text-xs text-slate-500">{batch.token}</div>
                                        </td>
                                        <td className="px-4 py-4 text-slate-700">
                                            <div className="max-w-[220px] truncate font-medium text-slate-900">
                                                {getCategoryLabel((batch as any).category_id)}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-slate-700">
                                            <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                                                {batch.locale || 'vi'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-slate-700">{batch.total_items || 0}</td>
                                        <td className="px-4 py-4 text-emerald-700">{batch.due_items || 0}</td>
                                        <td className="px-4 py-4 text-slate-700">
                                            <div className="min-w-[160px]">
                                                <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                                                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-slate-700">
                                            {batch.created_at ? batch.created_at.replace('T', ' ').slice(0, 19) : '---'}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                <EditButtonView href={route('ai.post-assistant.edit', batch.token)}>
                                                    {trans('hancms.button.view')}
                                                </EditButtonView>
                                                <DeleteButtonView
                                                    size_icon={14}
                                                    onDelete={() => {
                                                        if (!window.confirm(trans('hancms.ai_assistant.post_assistant.confirm_delete_batch'))) {
                                                            return;
                                                        }

                                                        router.delete(route('ai.post-assistant.destroy', batch.token));
                                                    }}
                                                >
                                                    {trans('hancms.button.delete')}
                                                </DeleteButtonView>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

PostAssistantIndexPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.ai_assistant.post_assistant.name" children={page} />
);
