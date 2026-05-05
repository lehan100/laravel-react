import MainLayout from '@/Layouts/MainLayout';
import { usePage, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { useTrans } from '@/Hooks/useTrans';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import Card from '@/Components/Main/Card';
import TableView from '@/Components/Table/TableViewAll';
import Pagination from '@/Components/Pagination/Pagination';
import BackButton from '@/Components/Button/BackButton';
import { Search } from 'lucide-react';

function ShowPage() {
  const { trans } = useTrans();
  const { province, wards, filters, summary }: any = usePage().props;
  const { meta: { links } }: any = wards;
  const [search, setSearch] = useState(filters?.search || '');

  const columns = useMemo(
    () => [
      { label: 'Code', name: 'code' },
      { label: trans('hancms.column.name'), name: 'name' },
      { label: trans('hancms.column.full_name'), name: 'full_name' },
      { label: trans('hancms.column.administrative_unit'), name: 'administrative_unit_name' },
      { label: trans('hancms.column.province'), name: 'province_name' },
    ],
    [trans],
  );

  function handleSearch(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    router.get(route('locations.show', province.code), {
      search,
      per_page: filters?.per_page || 50,
    }, {
      preserveScroll: true,
      preserveState: true,
      replace: true,
    });
  }

  return (
    <div className="space-y-6">
      <HeaderToolbar title={province.full_name}>
        <BackButton href={route('locations.index')}>
          {trans('hancms.button.back')}
        </BackButton>
      </HeaderToolbar>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="p-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{trans('hancms.column.code')}</div>
            <div className="mt-3 break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{province.code}</div>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{trans('hancms.column.administrative_unit')}</div>
            <div className="mt-3 break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {province.administrative_unit_name || '—'}
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{trans('hancms.settings.locations.summary.wards')}</div>
            <div className="mt-3 break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{summary?.wards ?? 0}</div>
          </div>
        </Card>
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_120px]">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={trans('hancms.filter.search')}
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {trans('hancms.button.filter')}
        </button>
      </form>

      <Card>
        <TableView
          columns={columns}
          rows={wards.data}
          sendDataSelectItems={() => undefined}
        />
        <Pagination links={links} />
      </Card>
    </div>
  );
}

ShowPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.settings.locations.name" children={page} />
);

export default ShowPage;
