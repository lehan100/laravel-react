import { Head } from '@inertiajs/react';
import MainMenu from '@/Components/Menu/MainMenu';
import FlashMessages from '@/Components/Messages/FlashMessages';
import TopHeader from '@/Components/Header/TopHeader';
import BottomHeader from '@/Components/Header/BottomHeader';
import { useTrans } from '@/Hooks/useTrans';
interface MainLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function MainLayout({ title, children }: MainLayoutProps) {
  const { trans }: any = useTrans();

  return (
    <>
      <Head title={trans(title)} />
      <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-slate-300/40 blur-3xl" />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col">
          <div className="flex flex-col md:flex-row z-50">
            <TopHeader />
            <BottomHeader />
          </div>

          <div className="flex flex-1 overflow-hidden">
            <MainMenu className="hidden w-72 shrink-0 overflow-y-auto border-r border-white/10 bg-slate-950/95 px-4 py-5 shadow-2xl shadow-slate-950/20 md:block" />
            {/**
             * We need to scroll the content of the page, not the whole page.
             * So we need to add `scroll-region="true"` to the div below.
             *
             * [Read more](https://inertiajs.com/pages#scroll-regions)
             */}
            <div
              className="flex-1 overflow-hidden overflow-y-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-8"
              scroll-region="true"
            >
              <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <FlashMessages />
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
