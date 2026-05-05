import { create as createAttribute, destroy as destroyAttribute, destroyMany as destroyManyAttribute, edit as editAttribute } from '@/actions/App/Http/Controllers/Admin/Catalog/AttributeController'
import CreatedButton from '@/Components/Button/CreatedButton'
import Card from '@/Components/Main/Card'
import DeleteButton from '@/Components/Button/DeleteButton'
import DeleteButtonView from '@/Components/Button/DeleteButtonView'
import EditButtonView from '@/Components/Button/EditButtonView'
import HeaderToolbar from '@/Components/Main/HeaderToolbar'
import MainLayout from '@/Layouts/MainLayout'
import { useTrans } from '@/Hooks/useTrans'
import Pagination from '@/Components/Pagination/Pagination'
import StatusBadge from '@/Components/Status/StatusBadge'
import TableView from '@/Components/Table/TableViewAll'
import { Head, router, useForm, usePage } from '@inertiajs/react'
import { useMemo } from 'react'

type AttributeTranslation = {
    locale: string
    name?: string
}

type AttributeValue = {
    id: number
    value?: string
    image_url?: string | null
    color?: string | null
}

type Attribute = {
    id: number
    name?: string
    code?: string | null
    translations?: AttributeTranslation[]
    type?: 'text' | 'image' | 'color'
    status?: number
    values_count?: number
    values_preview?: AttributeValue[]
}

type PageProps = {
    items?: {
        data?: Attribute[]
        meta?: {
            links?: Array<{ url: string | null; label: string; active: boolean }>
        }
    }
    langs?: Array<{ locale?: string; code?: string; name?: string; label?: string }>
}

function getName(attribute: Attribute): string {
    return attribute.name ?? '-'
}

export default function AttributeIndex() {
    const { trans } = useTrans()
    const { items } = usePage<PageProps>().props
    const { data: selectedData, setData } = useForm({
        ids: '',
    })
    const data = Array.isArray(items) ? items : items?.data ?? []
    const links = Array.isArray(items) ? [] : items?.meta?.links ?? []

    const columns = useMemo(
        () => [
            {
                label: 'ID',
                name: 'id',
            },
            {
                label: trans('hancms.column.name'),
                name: 'name',
                renderCell: (attribute: Attribute) => (
                    <div className="font-semibold text-slate-900">{getName(attribute)}</div>
                ),
            },
            {
                label: trans('hancms.column.code'),
                name: 'code',
                renderCell: (attribute: Attribute) => attribute.code || '-',
            },
            {
                label: trans('hancms.column.type'),
                name: 'type',
                renderCell: (attribute: Attribute) => trans(`hancms.catalog.attribute.fields.${attribute.type ?? 'text'}`),
            },
            {
                label: trans('hancms.column.value'),
                name: 'values_preview',
                renderCell: (attribute: Attribute) => (
                    attribute.values_preview?.length ? (
                        <div className="flex flex-wrap gap-2">
                            {attribute.values_preview.slice(0, 3).map((value) => (
                                <span
                                    key={value.id}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                                >
                                    {value.image_url ? (
                                        <img
                                            alt={value.value ?? 'value'}
                                            className="h-4 w-4 rounded-full object-cover"
                                            src={value.image_url}
                                        />
                                    ) : value.color ? (
                                        <span
                                            className="h-3 w-3 rounded-full ring-1 ring-slate-200"
                                            style={{ backgroundColor: value.color }}
                                        />
                                    ) : null}
                                    <span>{value.value ?? trans('hancms.message.empty')}</span>
                                </span>
                            ))}
                            {attribute.values_preview.length > 3 ? (
                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                                    +{attribute.values_preview.length - 3}
                                </span>
                            ) : null}
                        </div>
                    ) : (
                        <span className="text-slate-400">{trans('hancms.message.empty')}</span>
                    )
                ),
            },
            {
                label: trans('hancms.column.status'),
                name: 'status',
                renderCell: (attribute: Attribute) => (
                    <StatusBadge
                        value={attribute.status ?? 0}
                        activeLabel={trans('hancms.status.active')}
                        inactiveLabel={trans('hancms.status.inactive')}
                    />
                ),
            },
            {
                label: trans('hancms.column.action'),
                name: 'action',
                renderCell: (attribute: Attribute) => (
                    <div className="flex gap-2">
                        <EditButtonView href={editAttribute(attribute.id).url}>
                            {trans('hancms.button.edit')}
                        </EditButtonView>
                        <DeleteButtonView size_icon={14} onDelete={() => destroy(attribute.id, getName(attribute))}>
                            {trans('hancms.button.delete')}
                        </DeleteButtonView>
                    </div>
                ),
            },
        ],
        [trans]
    )

    function destroy(id: number, name: string) {
        if (!window.confirm(trans('hancms.message.destroy', { name }))) {
            return
        }

        router.delete(destroyAttribute(id).url)
    }

    function destroyMany() {
        if (!selectedData.ids) {
            return
        }

        if (!window.confirm(trans('hancms.message.destroys'))) {
            return
        }

        router.delete(destroyManyAttribute({ ids: selectedData.ids }).url)
    }

    return (
        <div>
            <Head title={trans('hancms.catalog.attribute.name')} />

            <HeaderToolbar title={trans('hancms.catalog.attribute.admin.name')}>
                <CreatedButton href={createAttribute().url}>
                    {trans('hancms.button.created')}
                </CreatedButton>
                <DeleteButton onDelete={destroyMany} size={18}>
                    {trans('hancms.button.delete_selected')}
                </DeleteButton>
            </HeaderToolbar>

            <Card>
                <TableView
                    columns={columns}
                    rows={data}
                    sendDataSelectItems={(ids) => setData('ids', ids)}
                />
                {links.length > 0 ? <Pagination links={links} /> : null}
            </Card>
        </div>
    )
}

AttributeIndex.layout = (page: React.ReactNode) => <MainLayout title="hancms.catalog.attribute.admin.name" children={page} />
