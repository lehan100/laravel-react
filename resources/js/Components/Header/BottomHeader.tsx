import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { ChevronDown } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useTrans } from '@/Hooks/useTrans';
export default () => {
  const { trans } = useTrans();
  const { auth } = usePage<PageProps>().props;
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
    <div className="flex items-center justify-between w-full p-4 text-sm bg-white border-b md:py-0 md:px-12 d:text-md">
      <div className="mt-1 mr-4">
        &nbsp;
        {/* {auth.user.account.name} */}
      </div>
      <div className="relative">
        <div
          className="flex items-center cursor-pointer select-none group"
          onClick={() => setMenuOpened(true)}
        >
          <div className="mr-1 text-gray-800 whitespace-nowrap group-hover:text-indigo-600 focus:text-indigo-600">
            <span>{auth.user.first_name}</span>
            <span className="hidden ml-1 md:inline">{auth.user.last_name}</span>
          </div>
          <ChevronDown
            size={20}
            className="text-gray-800 group-hover:text-indigo-600"
          />
        </div>
        <div className={menuOpened ? '' : 'hidden'}>
          <div className="absolute top-0 right-0 left-auto z-20 py-2 mt-8 text-sm whitespace-nowrap bg-white rounded shadow-xl">
            <Link
              href={route('users.edit', auth.user.id)}
              className="block px-6 py-2 hover:bg-indigo-600 hover:text-white"
              onClick={() => setMenuOpened(false)}
            >
              {trans("hancms.users.profile")}
            </Link>
            <Link
              href={route('users.index')}
              className="block px-6 py-2 hover:bg-indigo-600 hover:text-white"
              onClick={() => setMenuOpened(false)}
            >
              {trans("hancms.users.manage")}
            </Link>
            <Link
              as="button"
              href={route('auth/logout')}
              method="get"
              className="block w-full px-6 py-2 text-left focus:outline-none hover:bg-indigo-600 hover:text-white"
            >
              {trans("hancms.users.logout")}
            </Link>
            <hr />
            <p className='block px-6 py-2'><strong>{trans("hancms.languages.name")}</strong></p>
            {['vi', 'en', 'ja'].map((langCode) => (
              <button
                key={langCode}
                type="button"
                onClick={(e) => handleSwitchLang(e, langCode)}
                className={`
      block w-full px-6 py-2.5 text-left text-sm font-medium transition-all duration-200 outline-none
      ${currentLang === langCode
                    ? 'bg-indigo-600 text-white shadow-inner'
                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }
    `}
              >
                {langCode === 'vi' && 'Tiếng Việt'}
                {langCode === 'en' && 'English'}
                {langCode === 'ja' && '日本'}
              </button>
            ))}
          </div>
          <div
            onClick={() => {
              setMenuOpened(false);
            }}
            className="fixed inset-0 z-10 bg-black opacity-25"
          ></div>
        </div>
      </div>
    </div>
  );
};
