import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';

type Props = {
  item: {
    name?: string;
    slug?: string;
    description?: string;
    starts_at?: string | null;
    ends_at?: string | null;
    public_url?: string;
  };
  itemsProductsApplied?: {
    data?: Array<{ id: number; sku?: string; name?: string; price?: number }>;
  };
};

function formatTimeLeft(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const days = Math.floor(safeSeconds / 86400);
  const hours = Math.floor((safeSeconds % 86400) / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export default function CampaignShow({ item, itemsProductsApplied }: Props) {
  const rows = itemsProductsApplied?.data || [];
  const endsAt = useMemo(() => (item?.ends_at ? new Date(item.ends_at) : null), [item?.ends_at]);
  const [timeLeft, setTimeLeft] = useState('00d 00h 00m 00s');

  useEffect(() => {
    if (!endsAt) {
      return undefined;
    }

    const updateCountdown = () => {
      const diff = Math.floor((endsAt.getTime() - Date.now()) / 1000);
      setTimeLeft(formatTimeLeft(diff));
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, [endsAt]);

  return (
    <StorefrontLayout title={item?.name || 'Promotion Campaign'}>
      <Head title={item?.name || 'Promotion Campaign'} />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Flash sale</p>
          <h1 className="mt-2 text-3xl font-bold">{item?.name}</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">{item?.description}</p>
          <div className="mt-6 inline-flex rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold">
            Countdown: {timeLeft}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <article key={row.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">#{row.id}</div>
              <h2 className="mt-1 text-base font-semibold text-slate-900">{row.name}</h2>
              <div className="mt-2 text-sm text-slate-500">{row.sku}</div>
              <div className="mt-4 text-lg font-bold text-rose-600">
                {Number(row.price || 0).toLocaleString('vi-VN')} đ
              </div>
            </article>
          ))}
        </div>
      </section>
    </StorefrontLayout>
  );
}
