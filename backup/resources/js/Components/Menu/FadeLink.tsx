import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import classNames from 'classnames';

type FadeLinkProps = {
  mobile?: boolean;
  onNavigate?: () => void;
  [key: string]: any;
};

export default function FadeLink({ mobile = false, onNavigate, ...props }: FadeLinkProps) {
  const [openRoute, setOpenRoute] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (props.index != undefined && props.index > -1) {
      setOpenRoute(true);
      setOpen(false);
    } else {
      setOpenRoute(false);
    }
  }, [props.index]);

  return (
    <div
      className={classNames(
        'mb-3 rounded-2xl border p-1',
        mobile
          ? 'border-white/10 bg-white/5 shadow-lg shadow-slate-950/10'
          : 'border-white/10 bg-white/5',
        open || openRoute ? 'ring-1 ring-cyan-400/30' : ''
      )}
    >
      <Link
        onClick={() => {
          setOpen(!open);
          onNavigate?.();
        }}
        href={props.href}
        className={classNames(
          'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/5 hover:text-white',
          mobile ? 'text-slate-100' : 'text-slate-200',
          open || openRoute ? 'bg-white/10 text-white' : ''
        )}
      >
        <div className="flex items-center gap-2 p-3">
          {props.icon}
          <span className="font-medium">{props.title}</span>
        </div>
      </Link>
    </div>
  );
}
