import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useMemo, useState } from 'react';
import { BarChart3, CalendarDays, RefreshCw, Sparkles } from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import Card from '@/Components/Main/Card';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import PromotionStatusBadge from '@/Components/Status/PromotionStatusBadge';
import { useTrans } from '@/Hooks/useTrans';

type ReportMetric = {
  label: string;
  value: string | number;
  tone?: string;
};

type ReportColumn = {
  key: string;
  label: string;
};

type Report = {
  type: string;
  title: string;
  description: string;
  filters: {
    start_date: string;
    end_date: string;
  };
  metrics: ReportMetric[];
  charts: Record<string, any[]>;
  columns: ReportColumn[];
  rows: Array<Record<string, any> & { status_key?: string }>;
};

const metricToneClasses: Record<string, string> = {
  cyan: 'from-cyan-50 to-white text-cyan-800 ring-cyan-100',
  emerald: 'from-emerald-50 to-white text-emerald-800 ring-emerald-100',
  amber: 'from-amber-50 to-white text-amber-800 ring-amber-100',
  rose: 'from-rose-50 to-white text-rose-800 ring-rose-100',
  slate: 'from-slate-50 to-white text-slate-800 ring-slate-100',
};

const inventoryStatusBadgeClasses: Record<string, string> = {
  out_of_stock: 'border-rose-200 bg-rose-50 text-rose-700',
  low_stock: 'border-amber-200 bg-amber-50 text-amber-700',
  healthy: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export default function ReportIndexPage() {
  const { trans } = useTrans();
  const { report, analyzeRoute }: { report: Report; analyzeRoute: string } = usePage().props as any;
  const [startDate, setStartDate] = useState(report.filters.start_date);
  const [endDate, setEndDate] = useState(report.filters.end_date);
  const [analysis, setAnalysis] = useState('');
  const [analysisError, setAnalysisError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const analysisHtml = useMemo(() => sanitizeAnalysisHtml(analysis), [analysis]);

  const primaryChart = useMemo(() => {
    const chart = report.charts.daily || report.charts.top || report.charts.adjustments || report.charts.campaigns || [];
    const maxValue = Math.max(...chart.map((item: any) => Number(item.revenue ?? item.value ?? item.count ?? 0)), 1);

    return chart.slice(0, 10).map((item: any) => {
      const value = Number(item.revenue ?? item.value ?? item.count ?? 0);

      return {
        ...item,
        value,
        width: `${Math.max(8, Math.round((value / maxValue) * 100))}%`,
      };
    });
  }, [report.charts]);

  const applyFilter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    router.get(
      window.location.pathname,
      {
        start_date: startDate,
        end_date: endDate,
      },
      {
        preserveState: true,
        replace: true,
      }
    );
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysis('');
    setAnalysisError('');

    try {
      const response = await axios.post(analyzeRoute, {
        start_date: report.filters.start_date,
        end_date: report.filters.end_date,
      });
      const generatedAnalysis = String(response?.data?.analysis || '').trim();

      if (!generatedAnalysis) {
        setAnalysisError(response?.data?.message || trans('hancms.report.ai_empty'));
        return;
      }

      setAnalysis(generatedAnalysis);
    } catch (error: any) {
      setAnalysisError(error?.response?.data?.message || trans('hancms.report.ai_failed'));
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div>
      <HeaderToolbar title={report.title}>
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={analyzing}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 to-cyan-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/10 transition hover:from-slate-900 hover:to-cyan-800 disabled:pointer-events-none disabled:opacity-70"
        >
          {analyzing ? <RefreshCw className="animate-spin" size={17} /> : <Sparkles size={17} className="animate-pulse" />}
          {trans('hancms.report.ai_analyze')}
        </button>
      </HeaderToolbar>

      <div className="grid gap-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 p-6 text-white shadow-2xl shadow-slate-950/10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-100">
                <BarChart3 size={13} />
                {trans('hancms.report.center')}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-200 sm:text-base">
                {report.description}
              </p>
            </div>

            <form
              onSubmit={applyFilter}
              className="grid gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur sm:grid-cols-[1fr_1fr_auto]"
            >
              <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                {trans('hancms.report.from_date')}
                <input
                  type="date"
                  value={startDate}
                  onChange={event => setStartDate(event.target.value)}
                  className="rounded-lg border border-white/10 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900"
                />
              </label>
              <label className="grid gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                {trans('hancms.report.to_date')}
                <input
                  type="date"
                  value={endDate}
                  onChange={event => setEndDate(event.target.value)}
                  className="rounded-lg border border-white/10 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-900"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 self-end rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
              >
                <CalendarDays size={16} />
                {trans('hancms.report.filter')}
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {report.metrics.map((metric) => (
            <div
              key={metric.label}
              className={`rounded-2xl bg-gradient-to-br p-5 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.45)] ring-1 ${metricToneClasses[metric.tone || 'slate'] || metricToneClasses.slate}`}
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] opacity-70">
                {metric.label}
              </div>
              <div className="mt-3 text-2xl font-bold tracking-normal">
                {metric.value}
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
          <Card title={trans('hancms.report.trend')} contentClassName="p-5">
            <div className="grid gap-4">
              {primaryChart.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  {trans('hancms.report.empty_chart')}
                </div>
              )}
              {primaryChart.map((item: any) => (
                <div key={`${item.label}-${item.value}`} className="grid gap-2">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="min-w-0 truncate font-medium text-slate-700">{item.label}</span>
                    <span className="shrink-0 font-semibold text-slate-950">
                      {item.value_label || item.revenue_label || item.value}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-slate-900" style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title={trans('hancms.report.ai_insight')} contentClassName="p-5">
            <div className="min-h-[220px] rounded-2xl border border-slate-200 bg-slate-50 p-4">
              {!analysis && !analysisError && (
                <div className="flex h-full min-h-[180px] flex-col items-center justify-center text-center text-sm text-slate-500">
                  <Sparkles className="mb-3 text-cyan-700 animate-pulse" size={26} />
                  {trans('hancms.report.ai_hint')}
                </div>
              )}
              {analysisError && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                  {analysisError}
                </div>
              )}
              {analysis && (
                <div
                  className="space-y-4 text-sm leading-7 text-slate-700 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-3 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_p]:mb-3 [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: analysisHtml }}
                />
              )}
            </div>
          </Card>
        </section>

        <Card title={trans('hancms.report.details')} contentClassName="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="bg-slate-950 text-left text-white">
                {report.columns.map(column => (
                  <th key={column.key} className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.rows.length === 0 && (
                <tr>
                  <td colSpan={report.columns.length} className="px-4 py-12 text-center text-sm text-slate-500">
                    {trans('hancms.report.empty_rows')}
                  </td>
                </tr>
              )}
              {report.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-slate-200 odd:bg-white even:bg-slate-50/60">
                  {report.columns.map(column => (
                    <td key={column.key} className="px-4 py-3 text-sm text-slate-700">
                      {report.type === 'inventory' && column.key === 'status_label' ? (
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                            inventoryStatusBadgeClasses[row.status_key] || 'border-slate-200 bg-slate-100 text-slate-700'
                          }`}
                        >
                          {row[column.key] ?? 'N/A'}
                        </span>
                      ) : report.type === 'promotion' && column.key === 'status_label' ? (
                        <PromotionStatusBadge
                          value={row.status_key || 'inactive'}
                          labels={{
                            active: trans('hancms.report.status_labels.active'),
                            upcoming: trans('hancms.report.status_labels.upcoming'),
                            expired: trans('hancms.report.status_labels.expired'),
                            inactive: trans('hancms.report.status_labels.inactive'),
                          }}
                        />
                      ) : (
                        row[column.key] ?? 'N/A'
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

ReportIndexPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.report.name" children={page} />
);

function sanitizeAnalysisHtml(html: string): string {
  if (typeof window === 'undefined') {
    return html;
  }

  const normalized = String(html || '').trim();

  if (!normalized) {
    return '';
  }

  if (!/<[a-z][\s\S]*>/i.test(normalized)) {
    return normalized
      .split(/\n{2,}/)
      .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br />')}</p>`)
      .join('');
  }

  const parser = new DOMParser();
  const documentFragment = parser.parseFromString(`<div>${normalized}</div>`, 'text/html');
  const root = documentFragment.body.firstElementChild as HTMLElement | null;

  if (!root) {
    return '';
  }

  root.querySelectorAll('script, style, iframe, object, embed, link, meta').forEach((node) => node.remove());
  root.querySelectorAll('*').forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      if (attribute.name.toLowerCase().startsWith('on')) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return root.innerHTML;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
