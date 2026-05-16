import { router, useForm, usePage } from '@inertiajs/react'
import { useMemo } from 'react'
import MainLayout from '@/Layouts/MainLayout'
import { useTrans } from '@/Hooks/useTrans'
import HeaderToolbar from '@/Components/Main/HeaderToolbar'
import Card from '@/Components/Main/Card'
import Pagination from '@/Components/Pagination/Pagination'
import TableView from '@/Components/Table/TableViewAll'
import CreatedButton from '@/Components/Button/CreatedButton'
import DeleteButton from '@/Components/Button/DeleteButton'
import DeleteButtonView from '@/Components/Button/DeleteButtonView'
import EditButtonView from '@/Components/Button/EditButtonView'
import StatusBadge from '@/Components/Status/StatusBadge'
import { create as createMailTemplate, destroy as destroyMailTemplate, destroyMany as destroyManyMailTemplate, edit as editMailTemplate } from '@/actions/App/Http/Controllers/Admin/Settings/MailTemplateController'

type MailTemplateRow = {
    id: number
    key?: string
    module?: string | null
    fallback_locale?: string | null
    variables?: string[] | null
    is_active?: boolean
    name?: string
    subject?: string
    created_at?: string | null
}

type PageProps = {
    items?: {
        data?: MailTemplateRow[]
        meta?: {
            links?: Array<{ url: string | null; label: string; active: boolean }>
        }
    }
}

export default function IndexPage(): JSX.Element {
    const { trans } = useTrans()
    const { items }: any = usePage<PageProps>().props
    const rows = items?.data || []
    const links = items?.meta?.links || []
    const { data, setData } = useForm({
        ids: '',
    })

    const columns = useMemo(
        () => [
            { label: 'ID', name: 'id' },
            { label: trans('hancms.settings.mail_template.fields.key'), name: 'key' },
            { label: trans('hancms.settings.mail_template.fields.name'), name: 'name' },
            { label: trans('hancms.settings.mail_template.fields.subject'), name: 'subject' },
            { label: trans('hancms.settings.mail_template.fields.module'), name: 'module' },
            { label: trans('hancms.settings.mail_template.fields.fallback_locale'), name: 'fallback_locale' },
            {
                label: trans('hancms.column.status'),
                name: 'is_active',
                renderCell: (row: MailTemplateRow) => (
                    <StatusBadge
                        value={row.is_active ? 1 : 0}
                        activeLabel={trans('hancms.status.active')}
                        inactiveLabel={trans('hancms.status.inactive')}
                    />
                ),
            },
            {
                label: trans('hancms.column.action'),
                name: 'action',
                renderCell: (row: MailTemplateRow) => (
                    <div className="flex gap-2">
                        <EditButtonView href={editMailTemplate.url({ mail_template: row.id })}>
                            {trans('hancms.button.edit')}
                        </EditButtonView>
                        <DeleteButtonView size_icon={14} onDelete={() => destroy(row.id)}>
                            {trans('hancms.button.delete')}
                        </DeleteButtonView>
                    </div>
                ),
            },
        ],
        [trans]
    )

    function destroy(id: number): void {
        if (!window.confirm(trans('hancms.message.destroy', { name: trans('hancms.settings.mail_template.name').toLowerCase() }))) {
            return
        }

        router.delete(destroyMailTemplate.url({ mail_template: id }))
    }

    function destroyMany(): void {
        if (!data.ids) {
            return
        }

        if (!window.confirm(trans('hancms.message.destroys'))) {
            return
        }

        router.delete(destroyManyMailTemplate.url({ query: { ids: data.ids } }))
    }

    return (
        <div>
            <HeaderToolbar title={trans('hancms.settings.mail_template.admin.name')}>
                <CreatedButton href={createMailTemplate.url()}>
                    {trans('hancms.button.created')}
                </CreatedButton>
                <DeleteButton onDelete={destroyMany} size={18}>
                    {trans('hancms.button.delete_selected')}
                </DeleteButton>
            </HeaderToolbar>

            <Card>
                <div className="overflow-x-auto">
                    <TableView columns={columns} rows={rows} sendDataSelectItems={(selectedIds) => setData('ids', selectedIds)} />
                </div>
                <Pagination links={links} />
            </Card>
        </div>
    )
}

IndexPage.layout = (page: React.ReactNode) => <MainLayout title="hancms.settings.mail_template.admin.name">{page}</MainLayout>
