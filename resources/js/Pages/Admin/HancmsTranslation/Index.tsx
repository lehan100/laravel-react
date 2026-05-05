import BackButton from '@/Components/Button/BackButton';
import SaveButton from '@/Components/Button/SaveButton';
import Card from '@/Components/Main/Card';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import { useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useMemo, useState } from 'react';

type LanguageRow = {
  code: string;
  name: string;
  photo?: string | null;
};

type TranslationsMap = Record<string, Record<string, string>>;

export default function IndexPage() {
  const { trans } = useTrans();
  const { langs, config_path, translation_keys, translations }: any = usePage().props;

  const languageRows: LanguageRow[] = Array.isArray(langs) ? langs : langs?.data || [];
  const translationKeys: string[] = Array.isArray(translation_keys) ? translation_keys : [];
  const initialTranslations = (translations || {}) as TranslationsMap;

  const form = useForm({
    translations: initialTranslations,
    undo: 0,
  });

  const { data, setData, errors, post, processing } = form;
  const [undo, setUndo] = useState(0);

  const localeCodes = useMemo(() => languageRows.map((language) => language.code), [languageRows]);

  const handleUndo = (status: number) => {
    setUndo(status);
    setData('undo', status);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    post(route('hancms-translations.store'));
  };

  const updateTranslation = (locale: string, key: string, value: string) => {
    setData('translations', {
      ...(data.translations || {}),
      [locale]: {
        ...(data.translations?.[locale] || {}),
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <HeaderToolbar title={trans('hancms.translation.name')}>
        <SaveButton
          loading={processing}
          undo={undo}
          icon={<Save size={18} />}
          sendDataStatusUndo={handleUndo}
          form="hancms-translation-form"
        >
          {trans('hancms.button.save')}
        </SaveButton>
        <BackButton href={route('dashboard')}>{trans('hancms.button.back')}</BackButton>
      </HeaderToolbar>

      <form id="hancms-translation-form" onSubmit={handleSubmit} className="space-y-6">
        <Card title={trans('hancms.translation.admin.name')} contentClassName="overflow-x-auto">
          <div className="overflow-x-auto">
            <table className="min-w-full whitespace-nowrap text-sm">
              <thead className="bg-slate-950 text-white">
                <tr className="text-left">
                  <th className="w-56 max-w-56 px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                    {trans('hancms.column.key')}
                  </th>
                  {languageRows.map((language) => (
                    <th key={language.code} className="px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                      <div className="flex items-center gap-2">
                        {language.photo && (
                          <img
                            src={`/${config_path?.path || 'media/photo'}/${language.photo}`}
                            alt={language.name}
                            className="h-4 w-5 rounded-sm object-contain ring-1 ring-white/20"
                          />
                        )}
                        <span>{language.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {translationKeys.length > 0 ? (
                  translationKeys.map((key) => (
                    <tr key={key} className="border-t border-slate-200/80 odd:bg-white even:bg-slate-50/60 transition-colors hover:bg-cyan-50/50">
                      <td className="w-56 max-w-56 whitespace-normal break-words px-4 py-3 align-top font-mono text-xs italic text-slate-500">
                        {key}
                      </td>
                      {localeCodes.map((locale) => (
                        <td key={`${locale}-${key}`} className="min-w-[320px] px-4 py-3 align-top">
                          <input
                            type="text"
                            value={data.translations?.[locale]?.[key] || ''}
                            onChange={(event) => updateTranslation(locale, key, event.target.value)}
                            className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-slate-400 ${
                              errors[`translations.${locale}.${key}`]
                                ? 'border-rose-500 bg-rose-50'
                                : 'border-slate-300 bg-white'
                            }`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={Math.max(1, languageRows.length + 1)} className="px-4 py-6 text-center text-slate-500">
                      {trans('hancms.translation.messages.empty')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </form>
    </div>
  );
}

IndexPage.layout = (page: React.ReactNode) => <MainLayout title="hancms.translation.name" children={page} />;
