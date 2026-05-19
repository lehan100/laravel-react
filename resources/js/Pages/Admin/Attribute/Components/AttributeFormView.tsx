import AiButton from '@/Components/Button/AiButton';
import { store, update } from '@/actions/App/Http/Controllers/Admin/Catalog/AttributeController'
import { InputGroup } from '@/Components/Form/HancmsInput'
import MessageError from '@/Components/Form/MessageError'
import StatusSwitch from '@/Components/Status/StatusSwitch'
import { resolveMediaUrl } from '@/Components/Common/mediaUrl'
import { useTrans } from '@/Hooks/useTrans'
import { Head, router, usePage } from '@inertiajs/react'
import type { FormEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { GripVertical, Image as ImageIcon, Plus, Sparkles } from 'lucide-react'
import MediaLibraryModal from '@/Components/TinyMCE/MediaLibraryModal'
import axios from 'axios'
import { translate as translateLocaleFields } from '@/actions/App/Http/Controllers/Ai/LocaleTranslateController'

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

function normalizeLocaleKey(locale: string): string {
    return String(locale || '')
        .trim()
        .toLowerCase()
        .replace('_', '-')
        .split('-')[0]
}

function findTranslationByLocale<T extends { locale: string }>(
    translations: T[],
    locale: string,
    index: number
): T | undefined {
    const normalizedLocale = normalizeLocaleKey(locale)

    return (
        translations.find((item) => normalizeLocaleKey(String(item.locale)) === normalizedLocale) ??
        translations.find((item) => String(item.locale) === String(index)) ??
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

export default function AttributeFormView({ attribute, undo = 0, onProcessingChange }: AttributeFormViewProps) {
    const { langs, config_path: configPath = '/media/attribute', languageConfigPath, errors = {}, item } = usePage<PageProps>().props
    const { trans } = useTrans()
    const langList = normalizeLangList(langs)
    const resolvedAttribute = unwrapAttributeResource(attribute ?? item ?? null)
    const initialState = useMemo(() => buildInitialState(resolvedAttribute, langList), [resolvedAttribute, langList])
    const [data, setData] = useState<AttributeFormState>(initialState)
    const [draggedValueIndex, setDraggedValueIndex] = useState<number | null>(null)
    const [isImagePickerOpen, setIsImagePickerOpen] = useState(false)
    const [imageTarget, setImageTarget] = useState<number | null>(null)
    const initialAttributeId = useRef<number | null>(resolvedAttribute?.id ?? null)
    const [aiNameTranslating, setAiNameTranslating] = useState(false)
    const [aiNameTranslateError, setAiNameTranslateError] = useState('')
    const [aiValueTranslating, setAiValueTranslating] = useState(false)
    const [aiValueTranslateError, setAiValueTranslateError] = useState('')

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

    const applyNameTranslations = (translations: Record<string, any>) => {
        setData((current) => {
            const nextTranslations = current.translations.slice()

            Object.entries(translations).forEach(([locale, fields]) => {
                const translatedValue = String((fields as Record<string, any>).name || '').trim()

                if (translatedValue === '') {
                    return
                }

                const localeIndex = nextTranslations.findIndex((item) => String(item.locale) === String(locale))

                if (localeIndex >= 0) {
                    nextTranslations[localeIndex] = {
                        ...nextTranslations[localeIndex],
                        name: translatedValue,
                    }
                }
            })

            return {
                ...current,
                translations: nextTranslations,
            }
        })
    }

    const applyValueTranslations = (valueIndex: number, translations: Record<string, any>) => {
        setData((current) => {
            const values = current.values.slice()
            const nextTranslations = values[valueIndex]?.translations.slice() || []

            Object.entries(translations).forEach(([locale, fields]) => {
                const translatedValue = String((fields as Record<string, any>).value || '').trim()

                if (translatedValue === '') {
                    return
                }

                const localeIndex = nextTranslations.findIndex((item) => String(item.locale) === String(locale))

                if (localeIndex >= 0) {
                    nextTranslations[localeIndex] = {
                        ...nextTranslations[localeIndex],
                        value: translatedValue,
                    }
                }
            })

            values[valueIndex] = {
                ...values[valueIndex],
                translations: nextTranslations,
            }

            return {
                ...current,
                values,
            }
        })
    }

    const getLocalizedSource = (translations: Array<Record<string, any>>, field: 'name' | 'value') => {
        for (let index = 0; index < langList.length; index += 1) {
            const locale = getLocaleKey(langList[index])
            const matched = translations.find((item) => String(item.locale) === String(locale) || String(item.locale) === String(index))
            const value = String(matched?.[field] || '').trim()

            if (value !== '') {
                return {
                    locale,
                    value,
                }
            }
        }

        for (const translation of translations) {
            const value = String(translation?.[field] || '').trim()

            if (value !== '') {
                return {
                    locale: String(translation.locale),
                    value,
                }
            }
        }

        return null
    }

    const handleAiTranslateNames = async () => {
        setAiNameTranslateError('')

        const source = getLocalizedSource(data.translations || [], 'name')

        if (!source) {
            setAiNameTranslateError(trans('hancms.catalog.attribute.ai.missing_input') || 'Please enter a name in one language first.')
            return
        }

        const targetLocales = langList
            .map((lang) => getLocaleKey(lang))
            .filter((locale) => locale !== source.locale)

        if (!targetLocales.length) {
            setAiNameTranslateError(trans('hancms.catalog.attribute.ai.no_target_languages') || 'No target languages available.')
            return
        }

        setAiNameTranslating(true)

        try {
            const response = await axios.request({
                ...translateLocaleFields(),
                data: {
                    module: 'attribute',
                    source_locale: source.locale,
                    target_locales: targetLocales,
                    fields: {
                        name: source.value,
                    },
                },
            })

            const translations = response?.data?.translations || {}

            if (!Object.keys(translations).length) {
                setAiNameTranslateError(trans('hancms.catalog.attribute.ai.empty_response') || 'AI did not return translations.')
                return
            }

            applyNameTranslations(translations)
        } catch (error: any) {
            setAiNameTranslateError(error?.response?.data?.message || trans('hancms.catalog.attribute.ai.failed') || 'Unable to translate attribute names right now.')
        } finally {
            setAiNameTranslating(false)
        }
    }

    const handleAiTranslateValues = async () => {
        setAiValueTranslateError('')

        if (!data.values.length) {
            setAiValueTranslateError(trans('hancms.catalog.attribute.ai.missing_input') || 'Please add at least one value first.')
            return
        }

        setAiValueTranslating(true)

        try {
            for (let valueIndex = 0; valueIndex < data.values.length; valueIndex += 1) {
                const currentValue = data.values[valueIndex]
                const source = getLocalizedSource(currentValue.translations || [], 'value')

                if (!source) {
                    continue
                }

                const targetLocales = langList
                    .map((lang) => getLocaleKey(lang))
                    .filter((locale) => locale !== source.locale)

                if (!targetLocales.length) {
                    continue
                }

                const response = await axios.request({
                    ...translateLocaleFields(),
                    data: {
                        module: 'attribute',
                        source_locale: source.locale,
                        target_locales: targetLocales,
                        fields: {
                            value: source.value,
                        },
                    },
                })

                const translations = response?.data?.translations || {}

                if (Object.keys(translations).length) {
                    applyValueTranslations(valueIndex, translations)
                }
            }
        } catch (error: any) {
            setAiValueTranslateError(error?.response?.data?.message || trans('hancms.catalog.attribute.ai.failed') || 'Unable to translate attribute values right now.')
        } finally {
            setAiValueTranslating(false)
        }
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

    const openImagePicker = (valueIndex: number): void => {
        setImageTarget(valueIndex)
        setIsImagePickerOpen(true)
    }

    const handleImageSelected = (url: string): void => {
        if (imageTarget === null) {
            return
        }

        const resolvedUrl = resolveMediaUrl(url, configPath) ?? url

        setData((current) => {
            const values = current.values.slice()
            values[imageTarget] = {
                ...values[imageTarget],
                image: resolvedUrl,
                image_url: resolvedUrl,
            }

            return {
                ...current,
                values,
            }
        })

        setImageTarget(null)
        setIsImagePickerOpen(false)
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

                        <div className="text-sm text-slate-500" />
                    </div>

                    <div className="mt-6 space-y-5">
                        <InputGroup required label={trans('hancms.catalog.attribute.fields.code')} htmlFor="attribute-code">
                            <input
                                id="attribute-code"
                                required
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

                        <InputGroup required label={trans('hancms.catalog.attribute.fields.type')} htmlFor="attribute-type">
                            <select
                                id="attribute-type"
                                required
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

                        <InputGroup required label={trans('hancms.column.status')} align="center">
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
                        <div className="flex flex-col items-end gap-2">
                            <AiButton
                                type="button"
                                onClick={handleAiTranslateNames}
                                disabled={aiNameTranslating || langList.length < 2}
                                
                            >
                                
                                {aiNameTranslating ? (trans('hancms.catalog.attribute.ai.generating') || 'Generating...') : (trans('hancms.catalog.attribute.ai.translate_button') || 'AI dịch tự động')}
                            </AiButton>
                            {aiNameTranslateError && (
                                <div className="max-w-[20rem] text-right text-xs text-rose-600">
                                    {aiNameTranslateError}
                                </div>
                            )}
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
                                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                                            {logoUrl ? (
                                                <img alt={getLocaleLabel(lang)} className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-200" src={logoUrl} />
                                            ) : null}
                                            <span>{getLocaleLabel(lang)}</span>
                                        </span>
                                    )}
                                required
                                htmlFor={`attribute-name-${locale || index}`}
                            >
                                <input
                                    id={`attribute-name-${locale || index}`}
                                    required
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
                        <div className="flex flex-col items-end gap-2">
                            <AiButton
                                type="button"
                                onClick={handleAiTranslateValues}
                                disabled={aiValueTranslating || langList.length < 2}
                                
                            >
                                
                                {aiValueTranslating ? (trans('hancms.catalog.attribute.ai.generating') || 'Generating...') : (trans('hancms.catalog.attribute.ai.translate_button') || 'AI dịch tự động')}
                            </AiButton>
                            {aiValueTranslateError && (
                                <div className="max-w-[20rem] text-right text-xs text-rose-600">
                                    {aiValueTranslateError}
                                </div>
                            )}
                                <button
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
                                    type="button"
                                    onClick={appendValue}
                                >
                                    <Plus size={16} />
                                    {trans('hancms.catalog.attribute.fields.add_value')}
                                </button>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        {data.values.map((value, valueIndex) => {
                            const imageSrc = resolveMediaUrl(value.image_url || value.image, configPath)

                            return (
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
                                                    required
                                                    label={(
                                                        <span className="inline-flex items-center gap-2 whitespace-nowrap text-xs uppercase tracking-wide text-slate-500">
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
                                                        required
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
                                                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-3 xl:ml-auto xl:w-fit">
                                                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                                                        {imageSrc ? (
                                                            <img
                                                                alt={trans('hancms.catalog.attribute.fields.image')}
                                                                className="h-full w-full object-cover"
                                                                src={imageSrc}
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                                <ImageIcon size={22} strokeWidth={1.8} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => openImagePicker(valueIndex)}
                                                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                                                    >
                                                        <ImageIcon size={14} />
                                                        {trans('hancms.page.pick_image')}
                                                    </button>
                                                </div>
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
                        );
                        })}
                    </div>
                </div>

                <MediaLibraryModal
                    isOpen={isImagePickerOpen}
                    onClose={() => {
                        setImageTarget(null)
                        setIsImagePickerOpen(false)
                    }}
                    onSelect={handleImageSelected}
                />

            </form>
        </div>
    )
}
