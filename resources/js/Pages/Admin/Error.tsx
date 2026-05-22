import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Home, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

type ErrorPageProps = PageProps<{
  status: number;
  message?: string;
}>;

export default function AdminErrorPage({ status, message }: ErrorPageProps) {
  const { t } = useLaravelReactI18n();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2 lg:px-8">
      <Head title={t('cms.error.page_title', { status: status.toString() })} />
      
      <div className="w-full max-w-lg text-center space-y-8 bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-900/30 shadow-sm border border-red-500/30 mb-2">
            <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>

        <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {t('cms.error.title', { status: status.toString() })}
            </h1>
            <div className="p-4 bg-slate-900 rounded-lg border border-red-500/20 text-left">
                <code className="text-red-400 font-mono text-sm break-words whitespace-pre-wrap">
                    {message || t('cms.error.unknown_system_error')}
                </code>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
            <button 
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-sm font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 focus:outline-none transition-colors duration-200"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('cms.button.back')}
            </button>
            <button 
                onClick={() => window.location.href = '/admin123/dashboard'}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none transition-colors duration-200"
            >
                <Home className="w-4 h-4 mr-2" />
                {t('cms.button.dashboard')}
            </button>
        </div>
      </div>
    </div>
  );
}
