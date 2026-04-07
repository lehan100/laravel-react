import { useState } from 'react';
import { Link } from '@inertiajs/react';
import MainMenu from '@/Components/Menu/MainMenu';
import { Menu, X } from 'lucide-react';

export default () => {
  const [menuOpened, setMenuOpened] = useState(false);
  return (
    <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/95 px-4 py-4 text-white backdrop-blur md:w-72 md:flex-shrink-0 md:justify-start md:px-6 md:border-b-0 md:border-r">
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
          onClick={() => setMenuOpened(true)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10 transition hover:bg-white/15"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className={`${menuOpened ? '' : 'hidden'} fixed inset-0 z-50 md:hidden`}>
          <div
            onClick={() => setMenuOpened(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <div className="absolute left-0 top-0 h-full w-[86vw] max-w-sm overflow-y-auto bg-slate-950 p-4 shadow-2xl shadow-slate-950/40">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
              <div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Navigation</div>
                <div className="text-sm font-semibold">Menu quản trị</div>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpened(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <MainMenu className="pb-2" />
          </div>
        </div>
      </div>
    </div>
  );
};
