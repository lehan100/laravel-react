import { Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import { PageProps } from '@/types';
import { ArrowRight, Box, FolderTree, Users, Sparkles } from 'lucide-react';

function DashboardPage() {
  const { trans } = useTrans();
  const { auth } = usePage<PageProps>().props;
  const userName = `${auth.user.first_name} ${auth.user.last_name}`.trim();

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 text-white shadow-2xl shadow-slate-950/10">
        <div className="relative px-6 py-8 sm:px-8 sm:py-10">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
          </div>
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.5fr_0.9fr] lg:items-end">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-100">
                <Sparkles size={12} />
                {trans('hancms.dashboard.main')}
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Xin chào, {userName}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 sm:text-base">
                {trans('hancms.message.dashboard.welcome')}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Link
                href={route('product.index')}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-4 transition hover:bg-white/15"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <Box size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Sản phẩm</div>
                    <div className="text-xs text-slate-300">Đi tới danh sách sản phẩm</div>
                  </div>
                </div>
                <ArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-white" size={18} />
              </Link>

              <Link
                href={route('category.index')}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-4 transition hover:bg-white/15"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <FolderTree size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Danh mục</div>
                    <div className="text-xs text-slate-300">Sắp xếp cây danh mục</div>
                  </div>
                </div>
                <ArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-white" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Nhanh hơn, sạch hơn</h2>
              <p className="text-sm text-slate-500">Luồng quản trị tập trung, ít phải đoán vị trí thao tác.</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Tip</div>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Giữ bố cục nhất quán</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Các màn hình admin giờ dùng cùng một hệ khung, nên khi mở trang mới bạn sẽ thấy rõ phần nào là điều hướng, phần nào là thao tác chính.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-[0_12px_40px_-30px_rgba(15,23,42,0.35)]">
          <div className="text-[11px] uppercase tracking-[0.28em] text-amber-700/70">Shortcut</div>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Đi tiếp nhanh</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Dùng sidebar để vào nhóm sản phẩm, media, người dùng hoặc cài đặt mà không phải quay lại homepage.
          </p>
        </div>
      </section>
    </div>
  );
}

/**
 * Persistent Layout (Inertia.js)
 *
 * [Learn more](https://inertiajs.com/pages#persistent-layouts)
 */
DashboardPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.dashboard.main" children={page} />
);

export default DashboardPage;
