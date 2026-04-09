import { Link } from '@inertiajs/react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import MainMenu from '@/Components/Menu/MainMenu';
import { Menu, X } from 'lucide-react';

type TopHeaderProps = {
  mobileMenuOpened: boolean;
  setMobileMenuOpened: (opened: boolean) => void;
  hideDesktop?: boolean;
};

export default function TopHeader({ mobileMenuOpened, setMobileMenuOpened, hideDesktop = false }: TopHeaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mobileMenu = mounted
    ? createPortal(
        <div className="md:hidden">
          <div
            className={`
              fixed inset-0 z-[2147483646] bg-slate-950/75 backdrop-blur-sm transition-opacity duration-200
              ${mobileMenuOpened ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}
            `}
            onClick={() => setMobileMenuOpened(false)}
          />

          <div
            className={`
              fixed inset-0 z-[2147483647] transition-all duration-200 ease-out
              ${mobileMenuOpened ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}
            `}
          >
            <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-950 p-4 pt-[88px] shadow-2xl shadow-slate-950/80">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-slate-950 to-amber-400/10" />
              <div className="pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="pointer-events-none absolute right-[-4rem] top-1/3 h-64 w-64 rounded-full bg-amber-300/10 blur-3xl" />

              <div className="relative mb-4 flex items-center justify-between border border-white/10 bg-white/5 px-4 py-3 text-white">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Navigation</div>
                  <div className="text-sm font-semibold">Menu quản trị</div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpened(false)}
                  className="inline-flex h-10 w-10 items-center justify-center bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative">
                <MainMenu
                  mobile
                  onNavigate={() => setMobileMenuOpened(false)}
                  className="pb-2"
                />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <div
        className={`relative flex items-center justify-between border-b border-white/10 bg-slate-950/95 px-4 py-4 text-white backdrop-blur md:w-72 md:flex-shrink-0 md:justify-start md:border-b-0 md:border-r md:px-6 ${hideDesktop ? 'md:hidden' : ''}`}
      >
        <Link className="flex items-center gap-3" href="/">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-slate-900 shadow-lg shadow-cyan-950/20 ring-1 ring-white/10">
            <span className="text-sm font-black tracking-[0.2em] text-white">HC</span>
          </div>
          <div className="hidden md:block">
            <div className="text-[16px] uppercase tracking-[0.35em] text-slate-400">Admin</div>
            <div className="mt-1 text-sm font-semibold text-white">Hancms Console</div>
          </div>
        </Link>

        <div className="relative md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpened(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10 transition hover:bg-white/15"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {mobileMenu}
    </>
  );
}
