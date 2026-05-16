import { useState } from 'react'
import { InputGroup } from '@/Components/Form/HancmsInput'
import MessageError from '@/Components/Form/MessageError'
import ModalTable from '@/Components/Modal/Modal'
import Card from '@/Components/Main/Card'
import StatusSwitch from '@/Components/Status/StatusSwitch'
import { useTrans } from '@/Hooks/useTrans'

type LocaleItem = {
    locale?: string
    code?: string
    name?: string
    label?: string
    title?: string
    photo?: string
}

type BrandInfo = {
    company?: string
    phone?: string
    address?: string
    tax?: string
    logo?: string
    logo_url?: string
    copyright?: string
}

type MailTemplateTranslation = {
    locale: string
    name: string
    subject: string
    body_html: string
}

export type MailTemplateFormState = {
    key: string
    module: string
    fallback_locale: string
    variables: string[]
    is_active: boolean
    translations: Record<string, MailTemplateTranslation>
}

type MailTemplateResource = {
    id?: number
    key?: string
    module?: string | null
    fallback_locale?: string | null
    variables?: string[] | null
    is_active?: boolean
    translations?: Record<string, Partial<MailTemplateTranslation>> | Array<Partial<MailTemplateTranslation>>
}

type SetMailTemplateFormData = {
    (field: keyof MailTemplateFormState, value: MailTemplateFormState[keyof MailTemplateFormState]): void
    (data: MailTemplateFormState): void
    (callback: (data: MailTemplateFormState) => MailTemplateFormState): void
}

type MailTemplateFormViewProps = {
    data: MailTemplateFormState
    setData: SetMailTemplateFormData
    onStatusChange?: (value: number) => void
    errors: Record<string, string>
    processing: boolean
    langs: LocaleItem[]
    item?: MailTemplateResource | null
    brand?: BrandInfo | null
    sampleTemplates?: Array<{
        key: string
        label: string
        template: MailTemplateFormState
    }>
    sampleTemplate?: MailTemplateFormState | null
    currentLocale?: string | null
    isPreviewOpen: boolean
    onPreviewOpenChange: (isOpen: boolean) => void
}

function getLocaleKey(lang: LocaleItem): string {
    return String(lang.code ?? lang.locale ?? '').trim().toLowerCase()
}

function normalizeLocale(value: string | null | undefined): string {
    return String(value ?? '').trim().toLowerCase()
}

function getLocaleLabel(lang: LocaleItem): string {
    return lang.name ?? lang.label ?? lang.title ?? getLocaleKey(lang).toUpperCase()
}

function getLocaleFlag(lang: LocaleItem): string {
    switch (getLocaleKey(lang)) {
        case 'vi':
            return '🇻🇳'
        case 'en':
            return '🇬🇧'
        case 'ja':
            return '🇯🇵'
        default:
            return '🌐'
    }
}

function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => {
        switch (character) {
            case '&':
                return '&amp;'
            case '<':
                return '&lt;'
            case '>':
                return '&gt;'
            case '"':
                return '&quot;'
            case "'":
                return '&#39;'
            default:
                return character
        }
    })
}

function replaceTemplateTokens(content: string, replacements: Record<string, string>, rawTokens: string[] = []): string {
    const rawTokenSet = new Set(rawTokens)

    return content.replace(/{{\s*([a-zA-Z0-9_.-]+)\s*}}/g, (_match, token: string) => {
        const value = replacements[token]

        if (value === undefined) {
            return `[${token}]`
        }

        return rawTokenSet.has(token) ? value : escapeHtml(value)
    })
}

function normalizeTranslations(translations: MailTemplateResource['translations']): Array<Partial<MailTemplateTranslation>> {
    if (!translations) {
        return []
    }

    if (Array.isArray(translations)) {
        return translations
    }

    return Object.entries(translations).map(([locale, translation]) => ({
        ...translation,
        locale,
    }))
}

function extractTemplateVariables(...content: Array<string | undefined>): string[] {
    const matches = content.flatMap((value) => {
        if (!value) {
            return []
        }

        const pattern = /{{\s*([a-zA-Z0-9_.-]+)\s*}}/g
        const found: string[] = []
        let match: RegExpExecArray | null

        while ((match = pattern.exec(value)) !== null) {
            found.push(match[1])
        }

        return found
    })

    return Array.from(new Set(matches)).sort()
}

export function buildMailTemplateFormState(item: MailTemplateResource | null | undefined, langs: LocaleItem[]): MailTemplateFormState {
    const translationList = normalizeTranslations(item?.translations)
    const fallbackLocale = item?.fallback_locale ?? langs[0]?.code ?? langs[0]?.locale ?? 'vi'

    return {
        key: item?.key ?? '',
        module: item?.module ?? '',
        fallback_locale: fallbackLocale,
        variables: item?.variables ?? [],
        is_active: item?.is_active ?? true,
        translations: langs.reduce((carry: Record<string, MailTemplateTranslation>, lang, index) => {
            const locale = getLocaleKey(lang)
            const translation = translationList.find((entry) => {
                const entryLocale = String(entry?.locale ?? '').toLowerCase()
                return entryLocale === locale || entryLocale === String(index)
            })

            carry[locale] = {
                locale,
                name: translation?.name ?? '',
                subject: translation?.subject ?? '',
                body_html: translation?.body_html ?? '',
            }

            return carry
        }, {}),
    }
}

export default function MailTemplateFormView({
    data,
    setData,
    onStatusChange,
    errors,
    processing,
    langs,
    item,
    brand,
    sampleTemplates = [],
    sampleTemplate,
    currentLocale,
    isPreviewOpen,
    onPreviewOpenChange,
}: MailTemplateFormViewProps) {
    const { trans } = useTrans()
    const [activeLocale, setActiveLocale] = useState(() => {
        const normalizedCurrentLocale = normalizeLocale(currentLocale)

        if (normalizedCurrentLocale !== '' && langs.some((lang) => getLocaleKey(lang) === normalizedCurrentLocale)) {
            return normalizedCurrentLocale
        }

        return langs[0] ? getLocaleKey(langs[0]) : 'vi'
    })
    const [selectedSampleKey, setSelectedSampleKey] = useState(sampleTemplates[0]?.key ?? sampleTemplate?.key ?? '')

    const inputClass = (fieldName: string): string =>
        `w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 ${
            errors[fieldName] ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
        }`

    const updateTranslation = (locale: string, field: keyof Omit<MailTemplateTranslation, 'locale'>, value: string): void => {
        setData('translations', {
            ...data.translations,
            [locale]: {
                ...data.translations[locale],
                [field]: value,
            },
        })
    }

    const updateVariables = (value: string): void => {
        const variables = value
            .split(',')
            .map((entry) => entry.trim())
            .filter(Boolean)

        setData('variables', variables)
    }

    const applySampleTemplate = (): void => {
        const sample = sampleTemplates.find((entry) => entry.key === selectedSampleKey)?.template ?? sampleTemplate

        if (!sample) {
            return
        }

        const currentLocale = data.translations[activeLocale] ? activeLocale : ''
        const sampleLocale = currentLocale !== ''
            ? currentLocale
            : (sample.fallback_locale && sample.translations[sample.fallback_locale]
                ? sample.fallback_locale
                : getLocaleKey(langs[0] ?? { code: 'vi' }))
        const translationContents = Object.values(sample.translations).flatMap((translation) => [
            translation.name,
            translation.subject,
            translation.body_html,
        ])
        const sampleVariables = Array.from(new Set([
            ...(sample.variables ?? []),
            ...extractTemplateVariables(...translationContents),
        ]))

        setData((current: MailTemplateFormState) => ({
            ...current,
            key: sample.key,
            module: sample.module,
            fallback_locale: sample.fallback_locale,
            variables: sampleVariables,
            is_active: sample.is_active,
            translations: sample.translations,
        }))
        onStatusChange?.(sample.is_active ? 1 : 0)
        setActiveLocale(sampleLocale)
    }

    const activeTranslation = data.translations[activeLocale] ?? {
        locale: activeLocale,
        name: '',
        subject: '',
        body_html: '',
    }

    const activeBrand = brand ?? {}
    const brandFooterLabels = (() => {
        switch (activeLocale) {
            case 'en':
                return { phone: 'Phone', address: 'Address', tax: 'Tax' }
            case 'ja':
                return { phone: '電話', address: '住所', tax: '税番号' }
            default:
                return { phone: 'Điện thoại', address: 'Địa chỉ', tax: 'Mã số thuế' }
        }
    })()
    const mailPreviewLabels = (() => {
        switch (activeLocale) {
            case 'en':
                return {
                    order_code_label: 'Order code',
                    customer_label: 'Customer',
                    payment_method_label: 'Payment method',
                    shipping_method_label: 'Shipping method',
                    paid_amount_label: 'Paid amount',
                    order_total_label: 'Order total',
                    cancellation_reason_label: 'Cancellation reason',
                    new_status_label: 'New status',
                    tracking_number_label: 'Tracking number',
                    items_heading: 'Purchased items',
                    items_item_label: 'Item',
                    items_qty_label: 'Qty',
                    items_amount_label: 'Amount',
                    order_cta_label: 'View order',
                    update_cta_label: 'View update',
                    pay_cta_label: 'View order',
                    track_cta_label: 'Track shipment',
                }
            case 'ja':
                return {
                    order_code_label: '注文番号',
                    customer_label: '顧客名',
                    payment_method_label: '支払い方法',
                    shipping_method_label: '配送方法',
                    paid_amount_label: '支払い金額',
                    order_total_label: '合計金額',
                    cancellation_reason_label: 'キャンセル理由',
                    new_status_label: '新しい状態',
                    tracking_number_label: '追跡番号',
                    items_heading: '購入商品',
                    items_item_label: '商品',
                    items_qty_label: '数量',
                    items_amount_label: '金額',
                    order_cta_label: '注文を見る',
                    update_cta_label: '更新を見る',
                    pay_cta_label: '注文を見る',
                    track_cta_label: '注文を追跡',
                }
            default:
                return {
                    order_code_label: 'Mã đơn hàng',
                    customer_label: 'Khách hàng',
                    payment_method_label: 'Phương thức thanh toán',
                    shipping_method_label: 'Phương thức vận chuyển',
                    paid_amount_label: 'Số tiền đã thanh toán',
                    order_total_label: 'Tổng thanh toán',
                    cancellation_reason_label: 'Lý do hủy',
                    new_status_label: 'Trạng thái mới',
                    tracking_number_label: 'Mã vận đơn',
                    items_heading: 'Sản phẩm đã mua',
                    items_item_label: 'Sản phẩm',
                    items_qty_label: 'SL',
                    items_amount_label: 'Thành tiền',
                    order_cta_label: 'Xem đơn hàng',
                    update_cta_label: 'Xem cập nhật',
                    pay_cta_label: 'Xem đơn hàng',
                    track_cta_label: 'Theo dõi đơn hàng',
                }
        }
    })()
    const mailPreviewCopy = (() => {
        switch (activeLocale) {
            case 'en':
                return {
                    mail_headline: 'New Order',
                    mail_intro: 'Hello {{customer_name}}, your order has been successfully received.',
                    mail_footer: 'If you did not place this order, please contact our support team immediately.',
                }
            case 'ja':
                return {
                    mail_headline: '新しい注文',
                    mail_intro: '{{customer_name}} 様、ご注文は正常に受け付けられました。',
                    mail_footer: 'この注文に心当たりがない場合は、すぐにサポートまでご連絡ください。',
                }
            default:
                return {
                    mail_headline: 'Đơn hàng mới',
                    mail_intro: 'Xin chào {{customer_name}}, đơn hàng của bạn đã được tiếp nhận thành công.',
                    mail_footer: 'Nếu bạn không đặt đơn hàng này, vui lòng liên hệ ngay với bộ phận hỗ trợ.',
                }
        }
    })()
    const previewSubject = activeTranslation.subject || activeTranslation.name || data.key || trans('hancms.settings.mail_template.name')
    const previewIntro = activeTranslation.subject || 'This preview uses the current form values and sample data.'
    const previewReplacements: Record<string, string> = {
        brand_company: activeBrand.company ?? 'Ukimua',
        brand_phone: activeBrand.phone ?? '',
        brand_address: activeBrand.address ?? '',
        brand_phone_label: brandFooterLabels.phone,
        brand_address_label: brandFooterLabels.address,
        brand_tax_label: brandFooterLabels.tax,
        brand_tax: activeBrand.tax ?? '',
        brand_logo_url: activeBrand.logo_url ?? activeBrand.logo ?? '',
        brand_copyright: activeBrand.copyright ?? '',
        ...mailPreviewCopy,
        ...mailPreviewLabels,
        order_code: 'ORD-20260513-001',
        customer_name: 'Nguyễn Văn A',
        customer_email: 'customer@example.com',
        customer_phone: '+84 912 345 678',
        customer_address: 'Hà Nội, Việt Nam',
        order_status: 'Đang xử lý',
        order_total: '1.250.000 đ',
        amount_paid: '1.250.000 đ',
        payment_method: 'COD',
        shipping_method: 'Giao hàng nhanh',
        cancellation_reason: 'Out of stock',
        tracking_number: 'TRK-20260513-001',
        tracking_url: 'https://example.com/track/TRK-20260513-001',
        order_url: 'https://example.com/orders/ORD-20260513-001',
        items_count: '2',
        items_text: '1 x Áo thun basic - 250.000 đ\n1 x Son dưỡng - 1.000.000 đ',
        items_html: `
            <tr>
                <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">Áo thun basic</td>
                <td align="center" style="padding:12px 0;border-bottom:1px solid #e2e8f0;">1</td>
                <td align="right" style="padding:12px 0;border-bottom:1px solid #e2e8f0;">250.000 đ</td>
            </tr>
            <tr>
                <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;">Son dưỡng</td>
                <td align="center" style="padding:12px 0;border-bottom:1px solid #e2e8f0;">1</td>
                <td align="right" style="padding:12px 0;border-bottom:1px solid #e2e8f0;">1.000.000 đ</td>
            </tr>
        `.trim(),
    }
    const previewSource = activeTranslation.body_html.trim() !== ''
        ? activeTranslation.body_html
        : `<div style="font-size:14px;line-height:1.8;color:#334155;">${escapeHtml('Email preview content will appear here.').replace(/\n/g, '<br />')}</div>`
    const previewBody = replaceTemplateTokens(previewSource, previewReplacements, ['items_html'])
    const previewHtml = replaceTemplateTokens(`<!doctype html>
<html lang="${activeLocale}">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
        html, body {
            margin: 0;
            padding: 0;
            overflow-y: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            background: #ffffff;
        }

        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
            display: none;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
    </style>
</head>
<body style="margin:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#f3f6fb;">
        <tr>
            <td align="center" style="padding:32px 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:720px;border-collapse:separate;border-spacing:0;overflow:hidden;border-radius:24px;background:#fff;box-shadow:0 20px 50px rgba(15,23,42,.12);">
                    <tr>
                        <td style="padding:28px 32px;background:linear-gradient(135deg,#0f172a 0%,#0b5f6b 100%);color:#fff;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                <tr>
                                    <td valign="middle">
                                        <div style="font-size:11px;letter-spacing:.24em;text-transform:uppercase;opacity:.7;">Mail from</div>
                                        <div style="margin-top:6px;font-size:24px;font-weight:800;">{{brand_company}}</div>
                                    </td>
                                    <td align="right" valign="middle">
                                        <img src="{{brand_logo_url}}" alt="{{brand_company}}" style="display:block;max-width:200px;max-height:200px;object-fit:contain;border-radius:16px;background:rgba(255,255,255,.12);padding:8px;">
                                    </td>
                                </tr>
                            </table>
                            <h1 style="margin:22px 0 0;font-size:28px;line-height:1.2;">{{mail_headline}}</h1>
                            <p style="margin:12px 0 0;font-size:15px;line-height:1.8;opacity:.95;">{{mail_intro}}</p>
                        </td>
                    </tr>
                    ${previewBody}
                    <tr>
                        <td style="padding:20px 32px 28px;border-top:1px solid #e2e8f0;background:#f8fafc;color:#64748b;font-size:13px;line-height:1.7;">
                            <div style="font-weight:700;color:#0f172a;">{{brand_company}}</div>
                            <div style="margin-top:6px;">{{mail_footer}}</div>
                            <div style="margin-top:6px;">{{brand_phone_label}}: {{brand_phone}}</div>
                            <div>{{brand_address_label}}: {{brand_address}}</div>
                            <div>{{brand_tax_label}}: {{brand_tax}}</div>
                            <div style="margin-top:8px;">{{brand_copyright}}</div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`, previewReplacements, ['items_html'])

    return (
        <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-6">
                    <Card
                        title={trans('hancms.settings.mail_template.admin.name')}
                        action={(
                            <div className="flex items-center gap-3">
                                <StatusSwitch
                                    value={data.is_active ? 1 : 0}
                                    onChange={(value) => {
                                        setData('is_active', value === 1)
                                        onStatusChange?.(value)
                                    }}
                                    activeLabel={trans('hancms.status.active')}
                                    inactiveLabel={trans('hancms.status.inactive')}
                                />
                            </div>
                        )}
                        contentClassName="p-6"
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <InputGroup className="gap-3 mb-3" label={trans('hancms.settings.mail_template.fields.key')} required htmlFor="mail-template-key" stacked>
                                <input
                                    id="mail-template-key"
                                    type="text"
                                    value={data.key}
                                    onChange={(event) => setData('key', event.target.value)}
                                    className={inputClass('key')}
                                    placeholder="order_created"
                                />
                                {errors.key ? <MessageError>{errors.key}</MessageError> : null}
                            </InputGroup>

                            <InputGroup className="gap-3 mb-3" label={trans('hancms.settings.mail_template.fields.module')} htmlFor="mail-template-module" stacked>
                                <input
                                    id="mail-template-module"
                                    type="text"
                                    value={data.module}
                                    onChange={(event) => setData('module', event.target.value)}
                                    className={inputClass('module')}
                                    placeholder="sales"
                                />
                                {errors.module ? <MessageError>{errors.module}</MessageError> : null}
                            </InputGroup>

                            <InputGroup className="gap-3 mb-3" label={trans('hancms.settings.mail_template.fields.fallback_locale')} htmlFor="mail-template-fallback-locale" stacked>
                                <select
                                    id="mail-template-fallback-locale"
                                    value={data.fallback_locale}
                                    onChange={(event) => setData('fallback_locale', event.target.value)}
                                    className={inputClass('fallback_locale')}
                                >
                                    {langs.map((lang) => {
                                        const locale = getLocaleKey(lang)

                                        return (
                                            <option key={locale} value={locale}>
                                                {getLocaleLabel(lang)}
                                            </option>
                                        )
                                    })}
                                </select>
                                {errors.fallback_locale ? <MessageError>{errors.fallback_locale}</MessageError> : null}
                            </InputGroup>

                            <InputGroup className="gap-3 mb-3" label={trans('hancms.settings.mail_template.fields.variables')} htmlFor="mail-template-variables" stacked>
                                <textarea
                                    id="mail-template-variables"
                                    value={data.variables.join(', ')}
                                    onChange={(event) => updateVariables(event.target.value)}
                                    rows={3}
                                    className={inputClass('variables')}
                                    placeholder="order_code, customer_name, total_amount"
                                />
                                <p className="mt-1 text-xs text-slate-500">{trans('hancms.settings.mail_template.hints.variables')}</p>
                                {errors.variables ? <MessageError>{errors.variables}</MessageError> : null}
                            </InputGroup>
                        </div>
                    </Card>

                    <Card
                        title={trans('hancms.settings.mail_template.name')}
                        contentClassName="p-6"
                    >
                        {sampleTemplates.length > 0 ? (
                            <div className="mb-6 rounded-2xl border border-violet-200 bg-violet-50/70 p-4 shadow-sm">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-violet-700">
                                            {trans('hancms.settings.mail_template.actions.load_sample')}
                                        </p>
                                        <p className="mt-1 text-sm text-violet-700/80">
                                            {trans('hancms.settings.mail_template.actions.load_sample_hint')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                                    <select
                                        value={selectedSampleKey}
                                        onChange={(event) => setSelectedSampleKey(event.target.value)}
                                        className="min-w-0 flex-1 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                                    >
                                        {sampleTemplates.map((sample) => (
                                            <option key={sample.key} value={sample.key}>
                                                {sample.label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={applySampleTemplate}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-950 to-cyan-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-950/10 transition hover:from-slate-900 hover:to-cyan-800 disabled:pointer-events-none disabled:opacity-70 sm:h-[46px]"
                                    >
                                        {trans('hancms.settings.mail_template.actions.load_sample')}
                                    </button>
                                </div>
                            </div>
                        ) : null}

                        <div className="border-b border-slate-200 pb-6">
                            <div className="flex flex-wrap gap-3">
                                {langs.map((lang) => {
                                    const locale = getLocaleKey(lang)
                                    const isActive = activeLocale === locale

                                    return (
                                        <button
                                            key={locale}
                                            type="button"
                                            onClick={() => setActiveLocale(locale)}
                                            className={`flex items-center gap-2 rounded-md border-2 px-4 py-3 text-[12px] font-black uppercase transition-all ${
                                                isActive
                                                    ? 'bg-indigo-900 text-white shadow-lg border-indigo-900 scale-105'
                                                    : 'border-transparent bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }`}
                                        >
                                            <span className="text-sm leading-none" aria-hidden="true">
                                                {getLocaleFlag(lang)}
                                            </span>
                                            {getLocaleLabel(lang)}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="mt-6 space-y-6">
                            <div className="border-b border-slate-200 pb-6">
                                <InputGroup className="gap-3 mb-3" label={trans('hancms.settings.mail_template.fields.name')} required htmlFor={`mail-template-name-${activeLocale}`} stacked>
                                    <input
                                        id={`mail-template-name-${activeLocale}`}
                                        type="text"
                                        value={activeTranslation.name}
                                        onChange={(event) => updateTranslation(activeLocale, 'name', event.target.value)}
                                        className={inputClass(`translations.${activeLocale}.name`)}
                                    />
                                    {errors[`translations.${activeLocale}.name`] ? (
                                        <MessageError>{errors[`translations.${activeLocale}.name`]}</MessageError>
                                    ) : null}
                                </InputGroup>

                                <InputGroup className="gap-3 mb-3" label={trans('hancms.settings.mail_template.fields.subject')} required htmlFor={`mail-template-subject-${activeLocale}`} stacked>
                                    <input
                                        id={`mail-template-subject-${activeLocale}`}
                                        type="text"
                                        value={activeTranslation.subject}
                                        onChange={(event) => updateTranslation(activeLocale, 'subject', event.target.value)}
                                        className={inputClass(`translations.${activeLocale}.subject`)}
                                    />
                                    {errors[`translations.${activeLocale}.subject`] ? (
                                        <MessageError>{errors[`translations.${activeLocale}.subject`]}</MessageError>
                                    ) : null}
                                </InputGroup>

                                <InputGroup className="gap-3 mb-3" label={trans('hancms.settings.mail_template.fields.body_html')} htmlFor={`mail-template-body-html-${activeLocale}`} stacked>
                                    <textarea
                                        id={`mail-template-body-html-${activeLocale}`}
                                        value={activeTranslation.body_html}
                                        onChange={(event) => updateTranslation(activeLocale, 'body_html', event.target.value)}
                                        rows={10}
                                        className={inputClass(`translations.${activeLocale}.body_html`)}
                                    />
                                    {errors[`translations.${activeLocale}.body_html`] ? (
                                        <MessageError>{errors[`translations.${activeLocale}.body_html`]}</MessageError>
                                    ) : null}
                                </InputGroup>
                            </div>

                        </div>
                    </Card>
                </div>

                <aside className="space-y-6">
                    <Card title={trans('hancms.column.overview')} contentClassName="p-5">
                        <dl className="space-y-4 px-5 py-5 text-sm">
                            <div>
                                <dt className="text-slate-500">{trans('hancms.settings.mail_template.fields.key')}</dt>
                                <dd className="mt-1 font-semibold text-slate-950">{data.key || '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">{trans('hancms.settings.mail_template.fields.module')}</dt>
                                <dd className="mt-1 font-semibold text-slate-950">{data.module || '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">{trans('hancms.settings.mail_template.fields.fallback_locale')}</dt>
                                <dd className="mt-1 font-semibold text-slate-950">{data.fallback_locale || '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">{trans('hancms.settings.mail_template.fields.variables')}</dt>
                                <dd className="mt-1 font-semibold text-slate-950">
                                    {data.variables.length > 0 ? data.variables.join(', ') : '—'}
                                </dd>
                            </div>
                        </dl>
                    </Card>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <h3 className="text-base font-semibold text-slate-950">{trans('hancms.settings.mail_template.admin.name')}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            {item?.id
                                ? trans('hancms.settings.mail_template.hints.update')
                                : trans('hancms.settings.mail_template.hints.create')}
                        </p>
                    </div>
                </aside>
            </div>

            <ModalTable
                show={isPreviewOpen}
                onHide={() => onPreviewOpenChange(false)}
                title={trans('hancms.settings.mail_template.actions.preview')}
                disableScroll
            >
                <div className="space-y-4">
                    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                        <div className="bg-gradient-to-r from-slate-950 to-cyan-900 px-6 py-5 text-white">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 items-center gap-4">
                                    {activeBrand.logo_url ? (
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/95 p-2 shadow-sm ring-1 ring-white/20">
                                            <img
                                                src={activeBrand.logo_url}
                                                alt={activeBrand.company || 'Brand logo'}
                                                className="max-h-12 max-w-12 object-contain"
                                            />
                                        </div>
                                    ) : null}
                                    <div className="min-w-0">
                                        <div className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-200">
                                            {trans('hancms.settings.mail_template.actions.preview')}
                                        </div>
                                        <div className="mt-1 truncate text-lg font-semibold">
                                            {activeBrand.company || trans('hancms.settings.mail_template.admin.name')}
                                        </div>
                                        <div className="mt-1 text-xs leading-5 text-cyan-100/90">
                                            {activeBrand.phone || ''}
                                            {activeBrand.phone && activeBrand.address ? ' · ' : ''}
                                            {activeBrand.address || ''}
                                            {activeBrand.tax ? ` · ${activeBrand.tax}` : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-100">
                                    {data.key || 'mail-template'}
                                </div>
                            </div>
                            <h4 className="mt-2 text-2xl font-semibold leading-tight">{previewSubject}</h4>
                            <p className="mt-2 text-sm leading-6 text-cyan-100">{previewIntro}</p>
                        </div>

                        <div className="bg-[#f8fafc] px-5 py-6">
                            <div className="mx-auto max-w-[760px] overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-slate-200">
                                <iframe
                                    title={previewSubject}
                                    srcDoc={previewHtml}
                                    className="block h-[980px] w-full border-0 bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ModalTable>
        </div>
    )
}
