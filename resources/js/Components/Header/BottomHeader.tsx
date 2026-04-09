import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ChevronDown, UserCircle2, PanelLeft, PanelLeftClose } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
import { Language } from '@/types';
type BottomHeaderProps = {
  mobileMenuOpened: boolean;
  sidebarVisible: boolean;
  onToggleSidebar: () => void;
};

export default ({ mobileMenuOpened, sidebarVisible, onToggleSidebar }: BottomHeaderProps) => {
  const { trans } = useTrans();
  const { auth } = usePage<PageProps>().props;
  const { langs }: any = usePage<{
    langs: Language;

  }>().props;
  const { props } = usePage();
  const currentLang = props.locale;
  const [menuOpened, setMenuOpened] = useState(false);
  const can = (permission: any) => auth.permissions.includes(permission);
  const handleSwitchLang = (e: any, locale: any) => {
    e.preventDefault();
    router.get(route('lang.switch', locale), {}, {
      onSuccess: () => {
        window.location.reload();
      },
    });
  };
  return (
    <div className={`${mobileMenuOpened ? 'hidden' : 'flex'} w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 py-4 text-sm backdrop-blur md:flex md:px-8 lg:px-10`}>
      <div className="mr-4 hidden min-h-[1px] md:block">
        <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
          Workspace
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-700">
          <span>{trans('hancms.dashboard.main')}</span>
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            {sidebarVisible ? <PanelLeftClose size={14} /> : <PanelLeft size={14} />}
            <span>{sidebarVisible ? trans('hancms.sidebar.hide') : trans('hancms.sidebar.show')}</span>
          </button>
        </div>
      </div>
      <div className="relative ml-auto">
        <div
          className="flex cursor-pointer select-none items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm transition hover:border-slate-300 hover:bg-white"
          onClick={() => setMenuOpened(true)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-cyan-700 text-white shadow-md shadow-slate-900/20">
            <UserCircle2 size={20} />
          </div>
          <div className="whitespace-nowrap">
            <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Signed in</div>
            <div className="text-sm font-semibold text-slate-800">
              <span>{auth.user.first_name}</span>
              <span className="hidden ml-1 md:inline">{auth.user.last_name}</span>
            </div>
          </div>
          <ChevronDown size={18} className="text-slate-500" />
        </div>
        <div className={menuOpened ? '' : 'hidden'}>
          <div className="absolute right-0 left-auto z-20 mt-4 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
            <Link
              href={route('users.edit', auth.user.id)}
              className="block px-5 py-3 text-sm text-slate-700 transition hover:bg-slate-900 hover:text-white"
              onClick={() => setMenuOpened(false)}
            >
              {trans("hancms.users.profile")}
            </Link>
            <Link
              href={route('users.index')}
              className="block px-5 py-3 text-sm text-slate-700 transition hover:bg-slate-900 hover:text-white"
              onClick={() => setMenuOpened(false)}
            >
              {trans("hancms.users.manage")}
            </Link>
            <Link
              as="button"
              href={route('auth.logout')}
              method="get"
              className="block w-full px-5 py-3 text-left text-sm text-slate-700 transition focus:outline-none hover:bg-slate-900 hover:text-white"
            >
              {trans("hancms.users.logout")}
            </Link>
            <div className="border-t border-slate-100 px-5 py-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{trans("hancms.languages.name")}</p>
            </div>
            {langs.data.map((row: any) => {
              const langCode = row.code;
              const langName = row.name
              return (
                <button
                  key={langCode}
                  type="button"
                  onClick={(e) => handleSwitchLang(e, langCode)}
                  className={`
      block w-full px-5 py-3 text-left text-sm font-medium transition-all duration-200 outline-none
      ${currentLang === langCode
                      ? 'bg-slate-900 text-white shadow-inner'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }
    `}
                >
                  {langName}
                </button>
              )
            })}
          </div>
          <div
            onClick={() => {
              setMenuOpened(false);
            }}
            className="fixed inset-0 z-10 bg-slate-950/20 backdrop-blur-[1px]"
          ></div>
        </div>
      </div>
    </div>
  );
};
