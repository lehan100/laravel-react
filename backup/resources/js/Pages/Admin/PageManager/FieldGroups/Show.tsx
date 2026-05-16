import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import { Link, usePage } from '@inertiajs/react';
import BackButton from '@/Components/Button/BackButton';
import Card from '@/Components/Main/Card';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import StatusBadge from '@/Components/Status/StatusBadge';
import { edit, index as indexRoute } from '@/routes/page-schemas';
import { Pencil } from 'lucide-react';

type Props = {
    fieldGroup: {
        id: number;
        title: string;
        status: boolean;
        fields_schema?: Array<{
            key: string;
            label: string;
            type: string;
            required?: boolean;
            translatable?: boolean;
        }>;
        pages_count?: number;
    };
};

export default function Show() {
    const { trans } = useTrans();
    const { fieldGroup } = usePage().props as unknown as Props;
    const fields = fieldGroup.fields_schema || [];

    const getFieldTypeLabel = (type: string): string => {
        const translationKey = `hancms.page.field_types.${type}`;

        return trans(translationKey) !== translationKey ? trans(translationKey) : type;
    };

    return (
        <div className="space-y-6">
            <HeaderToolbar title={fieldGroup.title}>
                <Link
                    href={edit.url({ field_group: fieldGroup.id })}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3.5 text-base font-semibold text-white no-underline shadow-xl shadow-amber-950/10 ring-1 ring-amber-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-amber-400 hover:to-orange-400 hover:shadow-2xl hover:shadow-amber-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
                >
                    <Pencil size={19} />
                    <span>{trans('hancms.button.edit')}</span>
                </Link>
                <BackButton href={indexRoute.url()}>{trans('hancms.button.back')}</BackButton>
            </HeaderToolbar>

            <Card title={trans('hancms.title.infomation')} contentClassName="overflow-visible">
                <div className="grid gap-4 p-6 md:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">ID</div>
                        <div className="mt-2 font-mono text-sm font-semibold text-slate-900">#{fieldGroup.id}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.page.field_count')}</div>
                        <div className="mt-2 text-sm font-semibold text-slate-900">{fields.length}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.status')}</div>
                        <div className="mt-2">
                            <StatusBadge
                                value={fieldGroup.status}
                                activeLabel={trans('hancms.status.active')}
                                inactiveLabel={trans('hancms.status.inactive')}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <Card title={trans('hancms.page.field_builder')} contentClassName="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-950 text-left text-white">
                                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.column.key')}</th>
                                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.column.name')}</th>
                                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.column.type')}</th>
                                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.page.required')}</th>
                                <th className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">{trans('hancms.page.translatable')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field) => (
                                <tr key={field.key} className="border-t border-slate-200/80 odd:bg-white even:bg-slate-50/60">
                                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-600">{field.key}</td>
                                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">{field.label}</td>
                                    <td className="px-4 py-3 text-sm text-slate-700">{getFieldTypeLabel(field.type)}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge
                                            value={Boolean(field.required)}
                                            activeLabel={trans('hancms.page.required')}
                                            inactiveLabel={trans('hancms.status.inactive')}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge
                                            value={Boolean(field.translatable)}
                                            activeLabel={trans('hancms.page.translatable')}
                                            inactiveLabel={trans('hancms.status.inactive')}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {!fields.length ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                                        {trans('hancms.message.nodata')}
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

Show.layout = (page: React.ReactNode) => <MainLayout title="hancms.content.field_design">{page}</MainLayout>;
