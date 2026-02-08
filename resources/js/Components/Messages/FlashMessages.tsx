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
      className="pointer-events-none fixed inset-0 z-[100] flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
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
          <div className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 border-l-4 ${type === 'success' ? 'border-green-500' : 'border-red-500'
            }`}>
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">
                    {type === 'success' ? trans('hancms.title.success') : trans('hancms.title.error')}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{message}</p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setShow(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
