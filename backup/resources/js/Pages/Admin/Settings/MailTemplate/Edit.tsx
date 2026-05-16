import { useForm, usePage } from '@inertiajs/react'
import MainLayout from '@/Layouts/MainLayout'
import { useTrans } from '@/Hooks/useTrans'
import HeaderToolbar from '@/Components/Main/HeaderToolbar'
import SaveButton from '@/Components/Button/SaveButton'
import BackButton from '@/Components/Button/BackButton'
import { Eye, Save } from 'lucide-react'
import { update as updateMailTemplate } from '@/actions/App/Http/Controllers/Admin/Settings/MailTemplateController'
import { index as mailTemplateIndex } from '@/routes/mail-templates'
import MailTemplateFormView, { buildMailTemplateFormState, MailTemplateFormState } from './Components/MailTemplateFormView'
import { useState } from 'react'

type LocaleItem = {
    code?: string
    locale?: string
    name?: string
    label?: string
    title?: string
}

type MailTemplateResource = {
    id: number
    key?: string
    module?: string | null
    fallback_locale?: string | null
    variables?: string[] | null
    is_active?: boolean
    translations?: Record<string, { locale: string; name?: string; subject?: string; body_html?: string }>
}

type PageProps = {
    item?: MailTemplateResource | null
    langs?: LocaleItem[] | { data?: LocaleItem[] }
    locale?: string
    brand?: {
        company?: string
        phone?: string
        address?: string
        tax?: string
        logo?: string
        logo_url?: string
        copyright?: string
    }
    sampleTemplates?: Array<{ key: string; label: string; template: MailTemplateFormState }>
}

function normalizeLangList(langs: PageProps['langs']): LocaleItem[] {
    if (!langs) {
        return []
    }

    if (Array.isArray(langs)) {
        return langs
    }

    return langs.data ?? []
}

export default function Edit(): JSX.Element {
    const { trans } = useTrans()
    const { item, langs, locale, brand, sampleTemplates }: any = usePage<PageProps>().props
    const langList = normalizeLangList(langs)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const form = useForm<MailTemplateFormState>(buildMailTemplateFormState(item, langList))
    const [undo, setUndo] = useState(form.data.is_active ? 1 : 0)

    const handleUndo = (status: number): void => {
        setUndo(status)
        form.setData('is_active', status === 1)
    }

    return (
        <div className="p-6 text-sm">
            <HeaderToolbar title={trans('hancms.settings.mail_template.admin.name')}>
                <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-100 px-4 py-2.5 text-base font-semibold text-amber-900 shadow-sm transition hover:border-amber-300 hover:bg-amber-200 hover:text-amber-950"
                >
                    <Eye size={16} />
                    {trans('hancms.settings.mail_template.actions.preview')}
                </button>
                <SaveButton
                    loading={form.processing}
                    undo={undo}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form="mail-template-form"
                >
                    {trans('hancms.button.save')}
                </SaveButton>
                <BackButton href={mailTemplateIndex.url()}>
                    {trans('hancms.button.back')}
                </BackButton>
            </HeaderToolbar>

            <form id="mail-template-form" noValidate onSubmit={(event) => {
                event.preventDefault()
                form.put(updateMailTemplate.url({ mail_template: item.id }))
            }}>
                <MailTemplateFormView
                    item={item ?? null}
                    data={form.data}
                    setData={form.setData as any}
                    onStatusChange={setUndo}
                    errors={form.errors as any}
                    processing={form.processing}
                    langs={langList}
                    brand={brand || null}
                    sampleTemplates={sampleTemplates || []}
                    currentLocale={locale}
                    isPreviewOpen={isPreviewOpen}
                    onPreviewOpenChange={setIsPreviewOpen}
                />
            </form>
        </div>
    )
}

Edit.layout = (page: React.ReactNode) => <MainLayout title="hancms.settings.mail_template.admin.name">{page}</MainLayout>
