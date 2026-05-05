import { store, update } from '@/actions/App/Http/Controllers/Admin/Catalog/AttributeController'
import { storeAttribute } from '@/actions/App/Http/Controllers/ImageUploadController'
import { InputGroup } from '@/Components/Form/HancmsInput'
import MessageError from '@/Components/Form/MessageError'
import StatusSwitch from '@/Components/Status/StatusSwitch'
import { useTrans } from '@/Hooks/useTrans'
import { Head, router, usePage } from '@inertiajs/react'
import type { FormEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { GripVertical, Image as ImageIcon } from 'lucide-react'

type LocaleItem = {
    locale?: string
    code?: string
    name?: string
    label?: string
    title?: string
    photo?: string
}

type AttributeTranslation = {
    locale: string
    name: string
}

type AttributeValueTranslation = {
    locale: string
    value: string
}

type AttributeValueForm = {
    id?: number | null
    translations: AttributeValueTranslation[]
    image: string | null
    image_url: string | null
    color: string | null
    order: number | null
}

type AttributeFormState = {
    translations: AttributeTranslation[]
    code: string
    type: 'text' | 'image' | 'color'
    status: number
    values: AttributeValueForm[]
}

type AttributeValueResource = {
    id: number
    translations?: Array<{ locale: string; value?: string; name?: string }>
    image?: string | null
    image_url?: string | null
    color?: string | null
    order?: number | null
}

type AttributeResource = {
    id: number
    code?: string | null
    translations?: Array<{ locale: string; name?: string }> | Record<string, { locale: string; name?: string }>
    type?: 'text' | 'image' | 'color'
    status?: number
    order?: number | null
    values?: AttributeValueResource[]
}

type PageProps = {
    langs?: LocaleItem[]
    config_path?: string
    languageConfigPath?: { path?: string }
    item?: AttributeResource | { data?: AttributeResource | null } | null
    attribute?: AttributeResource | null
    errors?: Record<string, string>
}

type AttributeFormViewProps = {
    attribute?: AttributeResource | { data?: AttributeResource | null } | null
    undo?: number
    onProcessingChange?: (processing: boolean) => void
}

type LangCollection = LocaleItem[] | { data?: LocaleItem[] } | Record<string, LocaleItem>
type TranslationCollection<T> = Array<T> | Record<string, T> | undefined | null

function getLocaleKey(item: LocaleItem): string {
    return item.locale ?? item.code ?? ''
}

function getLocaleLabel(item: LocaleItem): string {
    return item.name ?? item.label ?? item.title ?? getLocaleKey(item).toUpperCase()
}

function normalizeLangList(langs: LangCollection | undefined): LocaleItem[] {
    if (!langs) {
        return []
    }

    if (Array.isArray(langs)) {
        return langs
    }

    if ('data' in langs && Array.isArray(langs.data)) {
        return langs.data
    }

    return Object.values(langs)
}

function normalizeTranslationList<T extends { locale: string }>(translations: TranslationCollection<T>): T[] {
    if (!translations) {
        return []
    }

    if (Array.isArray(translations)) {
        return translations
    }

    return Object.values(translations)
}

function findTranslationByLocale<T extends { locale: string }>(
    translations: T[],
    locale: string,
    index: number
): T | undefined {
    const normalizedLocale = String(locale)
    const fallbackLocale = String(index)

    return (
        translations.find((item) => String(item.locale) === normalizedLocale) ??
        translations.find((item) => String(item.locale) === fallbackLocale) ??
        translations[index]
    )
}

function unwrapAttributeResource(attribute: AttributeFormViewProps['attribute']): AttributeResource | null {
    if (!attribute) {
        return null
    }

    if ('data' in attribute) {
        return attribute.data ?? null
    }

    return attribute as AttributeResource
}

function getLanguageLogoUrl(lang: LocaleItem, languageConfigPath?: { path?: string }): string {
    if (!lang.photo) {
        return ''
    }

    if (lang.photo.startsWith('http://') || lang.photo.startsWith('https://')) {
        return lang.photo
    }

    const languagePath = languageConfigPath?.path

    if (!languagePath) {
        return `/${String(lang.photo).replace(/^\/+/, '')}`
    }

    return `/${String(languagePath).replace(/^\/+|\/+$/g, '')}/${String(lang.photo).replace(/^\/+/, '')}`
}

function createEmptyValue(langs: LocaleItem[]): AttributeValueForm {
    return {
        translations: langs.map((lang) => ({
            locale: getLocaleKey(lang),
            value: '',
        })),
        image: null,
        image_url: null,
        color: null,
        order: null,
    }
}

function buildInitialState(attribute: AttributeResource | null | undefined, langs: LocaleItem[]): AttributeFormState {
    const attributeTranslations = normalizeTranslationList(attribute?.translations)
    const translations = langs.map((lang) => {
        const locale = getLocaleKey(lang)
        const translation = findTranslationByLocale(attributeTranslations, locale, langs.indexOf(lang))

        return {
            locale,
            name: translation?.name ?? '',
        }
    })

    const values = attribute?.values?.length
        ? attribute.values.map((value) => {
              const valueTranslations = normalizeTranslationList(value.translations)

              return {
                  id: value.id,
                  translations: langs.map((lang) => {
                      const locale = getLocaleKey(lang)
                      const translation = findTranslationByLocale(valueTranslations, locale, langs.indexOf(lang))

                      return {
                          locale,
                          value: translation?.value ?? translation?.name ?? '',
                      }
                  }),
                  image: value.image ?? null,
                  image_url: value.image_url ?? null,
                  color: value.color ?? null,
                  order: value.order ?? null,
              }
          })
        : [createEmptyValue(langs)]

    return {
        translations,
        code: attribute?.code ?? '',
        type: attribute?.type ?? 'text',
        status: attribute?.status ?? 1,
        values,
    }
}

function buildImageUrl(
    configPath: string | { path?: string } | undefined,
    image: string | null | undefined
): string | null {
    if (!image) {
        return null
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image
    }

    const basePath = typeof configPath === 'string' ? configPath : configPath?.path ?? '/media/attribute'
    const normalizedBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
    const prefixedBasePath = normalizedBasePath.startsWith('/') ? normalizedBasePath : `/${normalizedBasePath}`

    return `${prefixedBasePath}/${image}`
}

function resolveValueImageSrc(
    configPath: string | { path?: string } | undefined,
    image: string | null | undefined,
    imageUrl: string | null | undefined
): string | null {
    return imageUrl ?? buildImageUrl(configPath, image)
}

async function uploadAttributeImage(file: File): Promise<{ file_name: string; url: string }> {
    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? ''
    const formData = new FormData()
    formData.append('photo', file)

    const response = await fetch(storeAttribute().url, {
        method: storeAttribute().method.toUpperCase(),
        headers: {
            Accept: 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest',
        },
        body: formData,
    })

    if (!response.ok) {
        throw new Error('Unable to upload attribute image')
    }

    return response.json()
}

export default function AttributeFormView({ attribute, undo = 0, onProcessingChange }: AttributeFormViewProps) {
    const { langs, config_path: configPath = '/media/attribute', languageConfigPath, errors = {}, item } = usePage<PageProps>().props
    const { trans } = useTrans()
    const langList = normalizeLangList(langs)
    const resolvedAttribute = unwrapAttributeResource(attribute ?? item ?? null)
    const initialState = useMemo(() => buildInitialState(resolvedAttribute, langList), [resolvedAttribute, langList])
    const [data, setData] = useState<AttributeFormState>(initialState)
    const [uploading, setUploading] = useState(false)
    const [draggedValueIndex, setDraggedValueIndex] = useState<number | null>(null)
    const initialAttributeId = useRef<number | null>(resolvedAttribute?.id ?? null)

    const submitAction = resolvedAttribute ? update(resolvedAttribute.id) : store()
    const isEditMode = Boolean(resolvedAttribute)
    const inputClass = (fieldName: string) => `w-full rounded-xl border text-sm shadow-sm transition focus:border-sky-500 focus:ring-sky-500 ${
        errors[fieldName] ? 'border-red-400 bg-red-50' : 'border-slate-300'
    }`

    useEffect(() => {
        if (resolvedAttribute?.id !== initialAttributeId.current) {
            initialAttributeId.current = resolvedAttribute?.id ?? null
            setData(initialState)
        }
    }, [initialState, resolvedAttribute?.id])

    const updateTranslation = (index: number, value: string) => {
        setData((current) => {
            const translations = current.translations.slice()
            translations[index] = {
                ...translations[index],
                name: value,
            }

            return {
                ...current,
                translations,
            }
        })
    }

    const updateValueTranslation = (valueIndex: number, translationIndex: number, value: string) => {
        setData((current) => {
            const values = current.values.slice()
            const translations = values[valueIndex].translations.slice()
            translations[translationIndex] = {
                ...translations[translationIndex],
                value,
            }
            values[valueIndex] = {
                ...values[valueIndex],
                translations,
            }

            return {
                ...current,
                values,
            }
        })
    }

    const updateValue = (valueIndex: number, key: keyof AttributeValueForm, value: string | number | null) => {
        setData((current) => {
            const values = current.values.slice()
            values[valueIndex] = {
                ...values[valueIndex],
                [key]: value,
            }

            return {
                ...current,
                values,
            }
        })
    }

    const appendValue = () => {
        setData((current) => ({
            ...current,
            values: [...current.values, createEmptyValue(langList)],
        }))
    }

    const removeValue = (valueIndex: number) => {
        setData((current) => ({
            ...current,
            values: current.values.filter((_, index) => index !== valueIndex),
        }))
    }

    const moveValue = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) {
            return
        }

        setData((current) => {
            const values = current.values.slice()
            const [moved] = values.splice(fromIndex, 1)

            if (!moved) {
                return current
            }

            values.splice(toIndex, 0, moved)

            return {
                ...current,
                values,
            }
        })
    }

    const handleUpload = async (valueIndex: number, file: File | null) => {
        if (!file) {
            return
        }

        setUploading(true)

        try {
            const response = await uploadAttributeImage(file)
            setData((current) => {
                const values = current.values.slice()
                values[valueIndex] = {
                    ...values[valueIndex],
                    image: response.file_name,
                    image_url: response.url,
                }

                return {
                    ...current,
                    values,
                }
            })
        } finally {
            setUploading(false)
        }
    }

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const payload = {
            ...data,
            undo,
            values: data.values.map((value, index) => ({
                ...value,
                order: index,
            })),
        }

        if (submitAction.method === 'put') {
            router.put(submitAction.url, payload, {
                preserveScroll: true,
                onStart: () => onProcessingChange?.(true),
                onFinish: () => onProcessingChange?.(false),
            })
            return
        }

        router.post(submitAction.url, payload, {
            preserveScroll: true,
            onStart: () => onProcessingChange?.(true),
            onFinish: () => onProcessingChange?.(false),
        })
    }

    return (
        <div>
            <Head title={isEditMode ? trans('hancms.catalog.attribute.edit') : trans('hancms.catalog.attribute.created')} />

            <form id="attribute-form" onSubmit={submit}>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                {isEditMode ? trans('hancms.catalog.attribute.edit') : trans('hancms.catalog.attribute.created')}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {isEditMode
                                    ? trans('hancms.catalog.attribute.edit_hint')
                                    : trans('hancms.catalog.attribute.create_hint')}
                            </p>
                        </div>

                        <div className="text-sm text-slate-500">
                            {uploading ? trans('hancms.catalog.attribute.uploading') : null}
                        </div>
                    </div>

                    <div className="mt-6 space-y-5">
                        <InputGroup label={trans('hancms.catalog.attribute.fields.code')} htmlFor="attribute-code">
                            <input
                                id="attribute-code"
                                className={inputClass('code')}
                                value={data.code}
                                onChange={(event) =>
                                    setData((current) => ({
                                        ...current,
                                        code: event.target.value,
                                    }))
                                }
                                placeholder={trans('hancms.catalog.attribute.fields.code_placeholder')}
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                {trans('hancms.catalog.attribute.fields.code_hint')}
                            </p>
                            {errors.code ? <MessageError>{errors.code}</MessageError> : null}
                        </InputGroup>

                        <InputGroup label={trans('hancms.catalog.attribute.fields.type')} htmlFor="attribute-type">
                            <select
                                id="attribute-type"
                                className={inputClass('type')}
                                value={data.type}
                                onChange={(event) =>
                                    setData((current) => ({
                                        ...current,
                                        type: event.target.value as AttributeFormState['type'],
                                    }))
                                }
                            >
                                <option value="text">{trans('hancms.catalog.attribute.fields.text')}</option>
                                <option value="image">{trans('hancms.catalog.attribute.fields.image')}</option>
                                <option value="color">{trans('hancms.catalog.attribute.fields.color')}</option>
                            </select>
                            <p className="mt-2 text-xs text-slate-500">
                                {trans('hancms.catalog.attribute.fields.type_hint')}
                            </p>
                            {errors.type ? <MessageError>{errors.type}</MessageError> : null}
                        </InputGroup>

                        <InputGroup label={trans('hancms.column.status')} align="center">
                            <StatusSwitch
                                value={data.status}
                                onChange={(value) =>
                                    setData((current) => ({
                                        ...current,
                                        status: value,
                                    }))
                                }
                                activeLabel={trans('hancms.catalog.attribute.fields.active')}
                                inactiveLabel={trans('hancms.catalog.attribute.fields.inactive')}
                            />
                            {errors.status ? <MessageError>{errors.status}</MessageError> : null}
                        </InputGroup>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">{trans('hancms.catalog.attribute.sections.translations')}</h3>
                            <p className="text-sm text-slate-500">{trans('hancms.catalog.attribute.fields.localized_name_hint')}</p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-3">
                        {langList.map((lang, index) => {
                            const locale = getLocaleKey(lang)
                            const logoUrl = getLanguageLogoUrl(lang, languageConfigPath)
                            const errorKey = `translations.${index}.name`

                            return (
                                <InputGroup
                                    key={locale || index}
                                    stacked
                                    label={(
                                        <span className="flex items-center gap-2">
                                            {logoUrl ? (
                                                <img alt={getLocaleLabel(lang)} className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-200" src={logoUrl} />
                                            ) : null}
                                            <span>{getLocaleLabel(lang)}</span>
                                        </span>
                                    )}
                                    htmlFor={`attribute-name-${locale || index}`}
                                >
                                    <input
                                        id={`attribute-name-${locale || index}`}
                                        className={inputClass(errorKey)}
                                        value={data.translations[index]?.name ?? ''}
                                        onChange={(event) => updateTranslation(index, event.target.value)}
                                    />
                                    {errors[errorKey] ? <MessageError>{errors[errorKey]}</MessageError> : null}
                                </InputGroup>
                            )
                        })}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">{trans('hancms.catalog.attribute.sections.values')}</h3>
                            <p className="text-sm text-slate-500">
                                {data.type === 'image'
                                    ? trans('hancms.catalog.attribute.fields.image_hint')
                                    : data.type === 'color'
                                        ? trans('hancms.catalog.attribute.fields.color_hint')
                                        : trans('hancms.catalog.attribute.fields.localized_value_hint')}
                            </p>
                        </div>

                        <button
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                            type="button"
                            onClick={appendValue}
                        >
                            {trans('hancms.catalog.attribute.fields.add_value')}
                        </button>
                    </div>

                    <div className="mt-6 space-y-3">
                        {data.values.map((value, valueIndex) => (
                            <div
                                key={value.id ?? valueIndex}
                                className="rounded-2xl border border-slate-200 bg-slate-50/40 px-5 py-5 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.25)]"
                            >
                                <div
                                    className={`grid gap-4 xl:grid-cols-[40px_minmax(0,1fr)_minmax(220px,260px)_auto] xl:items-end ${draggedValueIndex === valueIndex ? 'opacity-70' : ''}`}
                                    draggable
                                    onDragStart={() => setDraggedValueIndex(valueIndex)}
                                    onDragEnd={() => setDraggedValueIndex(null)}
                                    onDragOver={(event) => {
                                        event.preventDefault()
                                    }}
                                    onDrop={(event) => {
                                        event.preventDefault()
                                        if (draggedValueIndex === null) {
                                            return
                                        }
                                        moveValue(draggedValueIndex, valueIndex)
                                        setDraggedValueIndex(null)
                                    }}
                                >
                                    <button
                                        className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                                        type="button"
                                        aria-label={trans('hancms.column.order')}
                                        onPointerDown={() => setDraggedValueIndex(valueIndex)}
                                    >
                                        <GripVertical size={18} />
                                    </button>

                                    <div className="grid min-w-0 gap-4 md:grid-cols-3 xl:gap-5">
                                        {langList.map((lang, translationIndex) => {
                                            const locale = getLocaleKey(lang)
                                            const logoUrl = getLanguageLogoUrl(lang, languageConfigPath)
                                            const errorKey = `values.${valueIndex}.translations.${translationIndex}.value`

                                            return (
                                                <InputGroup
                                                    key={locale || translationIndex}
                                                    stacked
                                                    label={(
                                                        <span className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                                                            {logoUrl ? (
                                                                <img
                                                                    alt={getLocaleLabel(lang)}
                                                                    className="h-4 w-4 rounded-full object-cover ring-1 ring-slate-200"
                                                                    src={logoUrl}
                                                                />
                                                            ) : null}
                                                            <span>{getLocaleLabel(lang)}</span>
                                                        </span>
                                                    )}
                                                    className="min-w-0"
                                                    htmlFor={`attribute-value-${valueIndex}-${locale || translationIndex}`}
                                                >
                                                    <input
                                                        id={`attribute-value-${valueIndex}-${locale || translationIndex}`}
                                                        className={inputClass(errorKey)}
                                                        value={value.translations[translationIndex]?.value ?? ''}
                                                        onChange={(event) =>
                                                            updateValueTranslation(valueIndex, translationIndex, event.target.value)
                                                        }
                                                    />
                                                    {errors[errorKey] ? <MessageError>{errors[errorKey]}</MessageError> : null}
                                                </InputGroup>
                                            )
                                        })}
                                    </div>

                                    <div className="flex min-w-0 flex-col gap-4 xl:w-[240px] xl:self-center">
                                        {data.type === 'image' ? (
                                            <InputGroup
                                                stacked
                                                label={trans('hancms.catalog.attribute.fields.image')}
                                                className="xl:self-center"
                                            >
                                                <label className="group flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white transition hover:border-sky-400 hover:bg-sky-50/40 xl:ml-auto">
                                                    <input
                                                        className="sr-only"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(event) => handleUpload(valueIndex, event.target.files?.[0] ?? null)}
                                                    />

                                                    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-white p-1">
                                                        {resolveValueImageSrc(configPath, value.image, value.image_url) ? (
                                                            <img
                                                                alt={trans('hancms.catalog.attribute.fields.image')}
                                                                className="h-full w-full object-contain"
                                                                src={resolveValueImageSrc(configPath, value.image, value.image_url) ?? ''}
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-slate-400 transition group-hover:text-slate-700">
                                                                <ImageIcon size={22} strokeWidth={1.8} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </label>
                                                {errors[`values.${valueIndex}.image`] ? (
                                                    <MessageError>{errors[`values.${valueIndex}.image`]}</MessageError>
                                                ) : null}
                                            </InputGroup>
                                        ) : null}

                                        {data.type === 'color' ? (
                                            <InputGroup
                                                stacked
                                                label={trans('hancms.catalog.attribute.fields.color')}
                                                className="xl:self-center"
                                            >
                                                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-2 xl:w-fit">
                                                    <input
                                                        className="h-11 w-11 shrink-0 cursor-pointer rounded-lg border border-slate-200 p-1 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                                                        type="color"
                                                        value={value.color ?? '#000000'}
                                                        onChange={(event) => updateValue(valueIndex, 'color', event.target.value)}
                                                    />
                                                    <div className="min-w-0 text-sm font-medium text-slate-600">
                                                        {value.color ?? '#000000'}
                                                    </div>
                                                </div>
                                                {errors[`values.${valueIndex}.color`] ? (
                                                    <MessageError>{errors[`values.${valueIndex}.color`]}</MessageError>
                                                ) : null}
                                            </InputGroup>
                                        ) : null}
                                    </div>

                                    <div className="flex shrink-0 items-start justify-end xl:pt-0">
                                        <button
                                            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                                            type="button"
                                            onClick={() => removeValue(valueIndex)}
                                        >
                                            {trans('hancms.catalog.attribute.fields.remove')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </form>
        </div>
    )
}
