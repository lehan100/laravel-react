import { Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import { PageProps } from '@/types';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Box,
  FolderTree,
  PackageCheck,
  ShoppingCart,
  Sparkles,
  Tags,
  Users,
} from 'lucide-react';

type DashboardMetric = {
  label: string;
  value: string | number;
  hint: string;
  tone: string;
};

type DashboardProps = PageProps<{
  dashboard: {
    metrics: DashboardMetric[];
    summary: Record<string, number>;
    revenueChart: Array<{
      date: string;
      label: string;
      revenue: number;
      revenue_label: string;
      orders: number;
    }>;
    orderStatusChart: Array<{
      status: string;
      label: string;
      value: number;
    }>;
    topProducts: Array<{
      name: string;
      sku: string | null;
      sold_quantity: number;
      revenue: string;
    }>;
    stockAlerts: Array<{
      id: number;
      name: string;
      sku: string | null;
      quantity: number;
    }>;
    recentOrders: Array<{
      id: number;
      order_number: string;
      customer_name: string;
      grand_total: string;
      order_status: string;
      order_status_label: string;
      payment_status: string;
      payment_status_label: string;
      placed_at: string | null;
    }>;
  };
}>;

const metricToneClasses: Record<string, string> = {
  cyan: 'from-cyan-50 to-white text-cyan-900 ring-cyan-100',
  emerald: 'from-emerald-50 to-white text-emerald-900 ring-emerald-100',
  amber: 'from-amber-50 to-white text-amber-900 ring-amber-100',
  slate: 'from-slate-50 to-white text-slate-900 ring-slate-100',
};

const orderStatusToneClasses: Record<string, { badge: string; bar: string; text: string }> = {
  pending: {
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    bar: 'from-amber-400 to-amber-600',
    text: 'text-amber-700',
  },
  confirmed: {
    badge: 'bg-sky-50 text-sky-700 ring-sky-200',
    bar: 'from-sky-400 to-sky-700',
    text: 'text-sky-700',
  },
  processing: {
    badge: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    bar: 'from-indigo-400 to-indigo-700',
    text: 'text-indigo-700',
  },
  completed: {
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    bar: 'from-emerald-400 to-emerald-700',
    text: 'text-emerald-700',
  },
  cancelled: {
    badge: 'bg-rose-50 text-rose-700 ring-rose-200',
    bar: 'from-rose-400 to-rose-700',
    text: 'text-rose-700',
  },
};

const paymentStatusToneClasses: Record<string, string> = {
  unpaid: 'bg-amber-50 text-amber-700 ring-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  refunded: 'bg-violet-50 text-violet-700 ring-violet-200',
  failed: 'bg-rose-50 text-rose-700 ring-rose-200',
};

const fallbackStatusTone = {
  badge: 'bg-slate-100 text-slate-700 ring-slate-200',
  bar: 'from-slate-400 to-slate-700',
  text: 'text-slate-700',
};

function DashboardPage() {
  const { trans } = useTrans();
  const { auth, dashboard } = usePage<DashboardProps>().props;
  const userName = `${auth.user.first_name} ${auth.user.last_name}`.trim();

  const maxRevenue = useMemo(
    () => Math.max(...dashboard.revenueChart.map(item => Number(item.revenue || 0)), 1),
    [dashboard.revenueChart]
  );
  const maxStatus = useMemo(
    () => Math.max(...dashboard.orderStatusChart.map(item => Number(item.value || 0)), 1),
    [dashboard.orderStatusChart]
  );

  const quickActions = [
    {
      label: trans('hancms.catalog.product.name'),
      description: trans('hancms.dashboard.view_products'),
      href: route('product.index'),
      icon: <Box size={20} />,
    },
    {
      label: trans('hancms.catalog.category.name'),
      description: trans('hancms.dashboard.view_categories'),
      href: route('category.index'),
      icon: <FolderTree size={20} />,
    },
    {
      label: trans('hancms.sales.orders.name'),
      description: trans('hancms.dashboard.view_orders'),
      href: route('orders.index'),
      icon: <ShoppingCart size={20} />,
    },
    {
      label: trans('hancms.report.revenue.name'),
      description: trans('hancms.dashboard.view_reports'),
      href: route('report-revenue.index'),
      icon: <BarChart3 size={20} />,
    },
  ];

  const summaryItems = [
    ['products', trans('hancms.dashboard.summary.products'), <Box size={18} />],
    ['active_products', trans('hancms.dashboard.summary.active_products'), <PackageCheck size={18} />],
    ['categories', trans('hancms.dashboard.summary.categories'), <FolderTree size={18} />],
    ['users', trans('hancms.dashboard.summary.users'), <Users size={18} />],
    ['active_promotions', trans('hancms.dashboard.summary.active_promotions'), <Tags size={18} />],
    ['out_of_stock', trans('hancms.dashboard.summary.out_of_stock'), <AlertTriangle size={18} />],
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 text-white shadow-2xl shadow-slate-950/10">
        <div className="relative px-6 py-8 sm:px-8 sm:py-10">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
          </div>

          <div className="relative z-10 grid gap-8 xl:grid-cols-[1.35fr_1fr] xl:items-end">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-100">
                <Sparkles size={12} className="animate-pulse" />
                {trans('hancms.dashboard.main')}
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {trans('hancms.dashboard.hello', { name: userName || auth.user.email })}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
                {trans('hancms.message.dashboard.welcome')}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {quickActions.map(action => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-4 transition hover:bg-white/15"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                      {action.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{action.label}</div>
                      <div className="truncate text-xs text-slate-300">{action.description}</div>
                    </div>
                  </div>
                  <ArrowRight className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-white" size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboard.metrics.map(metric => (
          <div
            key={metric.label}
            className={`rounded-2xl bg-gradient-to-br p-5 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.45)] ring-1 ${metricToneClasses[metric.tone] || metricToneClasses.slate}`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-70">
              {metric.label}
            </div>
            <div className="mt-3 text-2xl font-bold tracking-normal">{metric.value}</div>
            <div className="mt-2 text-sm opacity-70">{metric.hint}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-700/70">
                Chart
              </div>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">
                {trans('hancms.dashboard.revenue_chart')}
              </h2>
            </div>
            <BarChart3 className="text-cyan-700" size={22} />
          </div>

          <div className="flex h-72 items-end gap-2 overflow-x-auto pb-2">
            {dashboard.revenueChart.map(item => {
              const height = Math.max(10, Math.round((Number(item.revenue || 0) / maxRevenue) * 100));

              return (
                <div key={item.date} className="flex min-w-[42px] flex-1 flex-col items-center gap-2">
                  <div className="flex h-56 w-full items-end rounded-t-2xl bg-slate-50 px-1">
                    <div
                      className="w-full rounded-t-2xl bg-gradient-to-t from-slate-950 to-cyan-500 shadow-lg shadow-cyan-950/10"
                      style={{ height: `${height}%` }}
                      title={`${item.revenue_label} - ${item.orders}`}
                    />
                  </div>
                  <div className="text-xs font-medium text-slate-500">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="mb-6">
            <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
              {trans('hancms.dashboard.operations')}
            </div>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">
              {trans('hancms.dashboard.order_status')}
            </h2>
          </div>

          <div className="grid gap-4">
            {dashboard.orderStatusChart.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                {trans('hancms.dashboard.empty')}
              </div>
            )}
            {dashboard.orderStatusChart.map(item => {
              const tone = orderStatusToneClasses[item.status] || fallbackStatusTone;

              return (
              <div key={item.status || item.label} className="grid gap-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className={`font-semibold capitalize ${tone.text}`}>{item.label}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${tone.badge}`}>{item.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${tone.bar}`}
                    style={{ width: `${Math.max(8, Math.round((item.value / maxStatus) * 100))}%` }}
                  />
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-900">{trans('hancms.dashboard.top_products')}</h2>
          <div className="mt-5 grid gap-3">
            {dashboard.topProducts.length === 0 && <EmptyState label={trans('hancms.dashboard.empty')} />}
            {dashboard.topProducts.map(product => (
              <div key={`${product.sku}-${product.name}`} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">{product.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{product.sku || 'N/A'} · {product.sold_quantity}</div>
                </div>
                <div className="shrink-0 text-sm font-semibold text-slate-950">{product.revenue}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-900">{trans('hancms.dashboard.stock_alerts')}</h2>
          <div className="mt-5 grid gap-3">
            {dashboard.stockAlerts.length === 0 && <EmptyState label={trans('hancms.dashboard.empty')} />}
            {dashboard.stockAlerts.map(product => (
              <Link
                key={product.id}
                href={route('product.edit', product.id)}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 transition hover:border-cyan-200 hover:bg-cyan-50/50"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">{product.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{product.sku || 'N/A'}</div>
                </div>
                <div className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${product.quantity <= 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                  {product.quantity}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-900">{trans('hancms.dashboard.recent_orders')}</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full whitespace-nowrap text-sm">
              <tbody>
                {dashboard.recentOrders.length === 0 && (
                  <tr>
                    <td className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-500">
                      {trans('hancms.dashboard.empty')}
                    </td>
                  </tr>
                )}
                {dashboard.recentOrders.map(order => {
                  const orderTone = orderStatusToneClasses[order.order_status] || fallbackStatusTone;
                  const paymentTone = paymentStatusToneClasses[order.payment_status] || fallbackStatusTone.badge;

                  return (
                  <tr key={order.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4">
                      <Link href={route('orders.show', order.id)} className="font-semibold text-slate-900 hover:text-cyan-700">
                        {order.order_number}
                      </Link>
                      <div className="mt-1 text-xs text-slate-500">{order.customer_name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${orderTone.badge}`}>
                        {order.order_status_label || order.order_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${paymentTone}`}>
                        {order.payment_status_label || order.payment_status}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right font-semibold text-slate-950">{order.grand_total}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {summaryItems.map(([key, label, icon]) => (
            <div key={String(key)} className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  {icon}
                </div>
                <div className="truncate text-sm font-semibold text-slate-700">{label}</div>
              </div>
              <div className="text-xl font-bold text-slate-950">{dashboard.summary[String(key)] ?? 0}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
      {label}
    </div>
  );
}

DashboardPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.dashboard.main" children={page} />
);

export default DashboardPage;
