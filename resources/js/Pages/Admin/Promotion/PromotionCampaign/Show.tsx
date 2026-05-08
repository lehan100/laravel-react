import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import Card from '@/Components/Main/Card';
import StatusBadge from '@/Components/Status/StatusBadge';
import { useTrans } from '@/Hooks/useTrans';

export default function ShowPage() {
  const { trans } = useTrans();
  const { item, itemsProductsApplied }: any = usePage().props;
  const rows = itemsProductsApplied?.data || [];

  return (
    <>
      <Head title={item?.name || trans('hancms.promotion.campaign.name')} />
      <div className="space-y-6">
        <Card title={item?.name || trans('hancms.promotion.campaign.name')}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-slate-400">{trans('hancms.column.slug')}</div>
              <div className="mt-1 font-semibold text-slate-900">{item?.slug}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-slate-400">{trans('hancms.column.status')}</div>
              <div className="mt-1">
                <StatusBadge
                  value={item?.is_active ? 1 : 0}
                  activeLabel={trans('hancms.status.active')}
                  inactiveLabel={trans('hancms.status.inactive')}
                />
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-slate-400">{trans('hancms.promotion.campaign.fields.starts_at')}</div>
              <div className="mt-1 font-semibold text-slate-900">{item?.starts_at || '-'}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-slate-400">{trans('hancms.promotion.campaign.fields.ends_at')}</div>
              <div className="mt-1 font-semibold text-slate-900">{item?.ends_at || '-'}</div>
            </div>
          </div>
        </Card>

        <Card title={trans('hancms.promotion.campaign.fields.apply_products') || trans('hancms.column.product')}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">ID</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.sku')}</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.name')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-slate-400">
                      {trans('hancms.no_data')}
                    </td>
                  </tr>
                ) : (
                  rows.map((row: any) => (
                    <tr key={row.id}>
                      <td className="px-3 py-2">{row.id}</td>
                      <td className="px-3 py-2">{row.sku}</td>
                      <td className="px-3 py-2">{row.name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}

ShowPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.promotion.campaign.name" children={page} />
);
