import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Home, ArrowLeft } from 'lucide-react';
import { useLaravelReactI18n } from 'laravel-react-i18n';

type ErrorPageProps = PageProps<{
  status: number;
}>;

export default function ErrorPage({ status }: ErrorPageProps) {
  const { t } = useLaravelReactI18n();
  const is404 = status === 404;

  const content = {
    503: {
      title: t('error.503_title'),
      description: t('error.503_description'),
      illustration: '⚙️'
    },
    500: {
      title: t('error.500_title'),
      description: t('error.500_description'),
      illustration: '🌩️'
    },
    404: {
      title: t('error.404_title'),
      description: t('error.404_description'),
      illustration: '🔎'
    },
    403: {
      title: t('error.403_title'),
      description: t('error.403_description'),
      illustration: '🔒'
    }
  }[status] || {
    title: t('error.default_title'),
    description: t('error.default_description'),
    illustration: '⚠️'
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2 lg:px-8">
      <Head title={content.title as string} />
      
      <div className="w-full max-w-lg text-center space-y-8">
        {/* Soft Illustration Area */}
        <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full bg-indigo-50 shadow-sm border border-indigo-100 mb-4">
            <span className="text-6xl animate-bounce" style={{ animationDuration: '3s' }}>
                {content.illustration}
            </span>
        </div>

        {/* Content */}
        <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                {is404 ? t('error.oops') : t('error.error_code', { code: status.toString() })}
            </h1>
            <h2 className="text-xl font-semibold text-slate-700">
                {content.title as string}
            </h2>
            <p className="text-base text-slate-500 max-w-sm mx-auto leading-relaxed">
                {content.description as string}
            </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
            <button 
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-full hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('error.back_button')}
            </button>
            <a 
                href="/"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm shadow-indigo-200"
            >
                <Home className="w-4 h-4 mr-2" />
                {t('error.home_button')}
            </a>
        </div>
      </div>
    </div>
  );
}
