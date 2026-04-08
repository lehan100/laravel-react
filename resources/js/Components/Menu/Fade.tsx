import { useEffect, useState } from 'react';
import classNames from 'classnames';

type FadeProps = {
  children?: React.ReactNode;
  mobile?: boolean;
  [key: string]: any;
};

export default function Face({ children, mobile = false, ...props }: FadeProps) {
  const [openRoute, setOpenRoute] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (props.index !== undefined && props.index > -1) {
      setOpenRoute(true);
      setOpen(false);
    } else {
      setOpenRoute(false);
    }
  }, [props.index]);

  const isOpen = open || openRoute;

  return (
    <div
      className={classNames(
        'rounded-2xl border p-1 transition-all duration-300',
        mobile
          ? 'mb-0 border-white/10 bg-white/5 shadow-lg shadow-slate-950/10'
          : 'mb-3 border-white/10 bg-white/5',
        isOpen ? 'ring-1 ring-cyan-400/30' : ''
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={isOpen}
        className={classNames(
          'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/5 hover:text-white',
          mobile ? 'text-slate-100' : 'text-slate-200'
        )}
      >
        <div className="flex items-center gap-2 px-2">
          {props.icon}
          <span className="font-medium">{props.title}</span>
        </div>

        <svg
          className={classNames('h-4 w-4 transition-transform duration-200', isOpen ? 'rotate-180' : '')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        id={props.id}
        className={classNames(
          'overflow-hidden ps-3 text-sm transition-all duration-300 ease-in-out',
          mobile ? 'text-slate-200' : 'text-slate-300',
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        {children}
      </div>
    </div>
  );
}
