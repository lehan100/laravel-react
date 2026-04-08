import { useState, useEffect, Fragment } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Transition } from '@headlessui/react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import { useTrans } from '@/Hooks/useTrans';
export default function FlashedMessages() {
  const { trans } = useTrans();
  const { flash, errors } = usePage<PageProps>().props;
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | 'warning'>('success');

  const formErrorCount = Object.keys(errors).length;

  useEffect(() => {
    if (formErrorCount > 0) {
      setMessage(`There are ${formErrorCount} form errors.`);
      setType('error');
      setShow(true);
    } else if (flash.error) {
      setMessage(flash.error);
      setType('error');
      setShow(true);
    } else if (flash.success) {
      setMessage(flash.success);
      setType('success');
      setShow(true);
    }

    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, [flash, errors, formErrorCount]);

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-x-0 top-4 z-[10050] flex justify-center px-4 sm:px-6"
    >
      <div className="flex w-full max-w-xl flex-col gap-3">
        <Transition
          show={show}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`pointer-events-auto overflow-hidden rounded-2xl border bg-white/95 shadow-2xl shadow-slate-950/10 ring-1 ring-slate-900/5 backdrop-blur ${
              type === 'success'
                ? 'border-emerald-200'
                : type === 'warning'
                  ? 'border-amber-200'
                  : 'border-rose-200'
            }`}
          >
            <div className="flex items-start gap-4 px-4 py-4 sm:px-5">
              <div className="mt-0.5 flex-shrink-0">
                  {type === 'success' ? (
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-rose-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {type === 'success' ? trans('hancms.title.success') : trans('hancms.title.error')}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{message}</p>
                </div>
                <div className="flex flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 focus:outline-none"
                    onClick={() => setShow(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
