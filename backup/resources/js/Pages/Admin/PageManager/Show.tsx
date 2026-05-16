import { useMemo, useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import { Link, usePage } from '@inertiajs/react';
import BackButton from '@/Components/Button/BackButton';
import Card from '@/Components/Main/Card';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import StatusBadge from '@/Components/Status/StatusBadge';
import { edit, index as indexRoute } from '@/routes/pages';
import { PageFieldSchema, PageLocale } from './Components/PageFormView';
import { Pencil } from 'lucide-react';

type PickerItem = {
    id: number;
    label?: string;
    name?: string;
    sku?: string;
    type?: string;
    price?: number;
    quantity?: number | string;
    status?: number | boolean;
};

type BannerPosition = {
    id: number;
    name: string;
    code?: string;
};

type PageShowProps = {
    page: {
        id: number;
        title: string;
        slug: string;
        status: boolean;
        acf_data?: Record<string, Record<string, any>>;
        fieldGroup?: {
            title?: string;
            fields_schema?: PageFieldSchema[];
        };
    };
    fieldGroup?: {
        title?: string;
        fields_schema?: PageFieldSchema[];
    };
    posts: PickerItem[];
    products: PickerItem[];
    bannerPositions: BannerPosition[];
    fields: PageFieldSchema[];
    content: Record<string, Record<string, any>>;
    languages: Array<PageLocale & { photo?: string }>;
    translations: Record<string, any>;
};

export default function Show() {
    const { trans } = useTrans();
    const props = usePage().props as unknown as PageShowProps;
    const [activeLocale, setActiveLocale] = useState(props.languages[0]?.code || 'vi');
    const fields = useMemo(() => props.fieldGroup?.fields_schema || props.fields || [], [props.fieldGroup, props.fields]);
    const translatableFields = useMemo(() => fields.filter((field) => field.translatable), [fields]);
    const sharedFields = useMemo(() => fields.filter((field) => !field.translatable), [fields]);
    const content = props.page.acf_data || props.content || {};
    const sharedLocale = props.languages[0]?.code || activeLocale;
    const fieldGroupTitle = props.fieldGroup?.title || props.page.fieldGroup?.title || '-';
    const renderLanguageBadge = (language: PageLocale & { photo?: string }) => {
        if (language.photo) {
            return (
                <img
                    src={`/media/photo/${language.photo}`}
                    className="h-4 w-4 rounded-full object-cover"
                    alt={language.name}
                />
            );
        }

        return (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[9px] font-black uppercase text-slate-600">
                {language.code.slice(0, 2)}
            </span>
        );
    };

    const postMap = useMemo(
        () => new Map((props.posts || []).map((post) => [Number(post.id), post])),
        [props.posts]
    );
    const productMap = useMemo(
        () => new Map((props.products || []).map((product) => [Number(product.id), product])),
        [props.products]
    );
    const bannerMap = useMemo(
        () => new Map((props.bannerPositions || []).map((position) => [Number(position.id), position])),
        [props.bannerPositions]
    );
    const getFieldTypeLabel = (type: string): string => {
        const translationKey = `hancms.page.field_types.${type}`;

        return trans(translationKey) !== translationKey ? trans(translationKey) : type;
    };

    const getSelectedIds = (value: unknown): number[] => {
        if (Array.isArray(value)) {
            return value.map((item) => Number(item)).filter((item) => !Number.isNaN(item));
        }

        if (value === null || typeof value === 'undefined' || value === '') {
            return [];
        }

        const id = Number(value);

        return Number.isNaN(id) ? [] : [id];
    };

    const formatPrice = (price: number | undefined): string => {
        if (typeof price === 'undefined' || Number.isNaN(Number(price))) {
            return '-';
        }

        return Number(price).toLocaleString();
    };

    const renderSelectedItemsTable = (value: unknown, type: 'product' | 'post') => {
        const sourceMap = type === 'product' ? productMap : postMap;
        const selectedRows = getSelectedIds(value).map((id) => sourceMap.get(id) || { id });
        const isProduct = type === 'product';

        return (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">ID</th>
                            {isProduct ? <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.sku')}</th> : null}
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.name')}</th>
                            {isProduct ? <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.price')}</th> : null}
                            <th className="px-3 py-2 text-left font-semibold text-slate-600">{trans('hancms.column.status')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {!selectedRows.length ? (
                            <tr>
                                <td colSpan={isProduct ? 5 : 3} className="px-3 py-5 text-center text-slate-400">
                                    {trans('hancms.message.nodata')}
                                </td>
                            </tr>
                        ) : selectedRows.map((row) => (
                            <tr key={row.id}>
                                <td className="px-3 py-2 text-slate-700">{row.id}</td>
                                {isProduct ? <td className="px-3 py-2 text-slate-700">{row.sku || `#${row.id}`}</td> : null}
                                <td className="px-3 py-2 font-medium text-slate-800">{row.name || row.label || `#${row.id}`}</td>
                                {isProduct ? <td className="px-3 py-2 text-slate-700">{formatPrice(row.price)}</td> : null}
                                <td className="px-3 py-2">
                                    <StatusBadge
                                        value={row.status ?? true}
                                        activeLabel={trans('hancms.status.active')}
                                        inactiveLabel={trans('hancms.status.inactive')}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderValue = (field: PageFieldSchema, locale: string) => {
        const value = content?.[locale]?.[field.key];

        if (field.type === 'image') {
            return value ? (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <img src={value} alt={field.label || field.key} className="max-h-72 w-full object-cover" />
                </div>
            ) : (
                <EmptyValue />
            );
        }

        if (field.type === 'editorMCE') {
            return (
                <div
                    className="prose prose-slate max-w-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                    dangerouslySetInnerHTML={{ __html: value || '-' }}
                />
            );
        }

        if (field.type === 'relation_new') {
            return renderSelectedItemsTable(value, 'post');
        }

        if (field.type === 'product') {
            return renderSelectedItemsTable(value, 'product');
        }

        if (field.type === 'banner_position') {
            const position = bannerMap.get(Number(value));

            return (
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                    {position ? `${position.name}${position.code ? ` (${position.code})` : ''}` : '-'}
                </div>
            );
        }

        return (
            <div className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                {String(value ?? '-')}
            </div>
        );
    };

    const renderField = (field: PageFieldSchema, locale: string) => (
        <div key={`${locale}-${field.key}`} className="space-y-2 border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold text-slate-900">{field.label || field.key}</div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {getFieldTypeLabel(field.type)}
                    </span>
                </div>
            {renderValue(field, locale)}
        </div>
    );

    return (
        <div className="space-y-6">
            <HeaderToolbar title={props.page.title}>
                <Link
                    href={edit.url({ page: props.page.id })}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3.5 text-base font-semibold text-white no-underline shadow-xl shadow-amber-950/10 ring-1 ring-amber-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-amber-400 hover:to-orange-400 hover:shadow-2xl hover:shadow-amber-950/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
                >
                    <Pencil size={19} />
                    <span>{trans('hancms.button.edit')}</span>
                </Link>
                <BackButton href={indexRoute.url()}>{trans('hancms.button.back')}</BackButton>
            </HeaderToolbar>

            <Card contentClassName="overflow-visible">
                <div className="grid gap-4 p-5 md:grid-cols-3">
                    <InfoItem label={trans('hancms.page.group_title')} value={fieldGroupTitle} />
                    <InfoItem label={trans('hancms.page.field_count')} value={String(fields.length)} />
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.status')}</div>
                        <div className="mt-2">
                            <StatusBadge
                                value={props.page.status}
                                activeLabel={trans('hancms.status.active')}
                                inactiveLabel={trans('hancms.status.inactive')}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {sharedFields.length ? (
                <Card title={trans('hancms.page.shared_fields')} contentClassName="overflow-visible">
                    <div className="space-y-5 p-5">
                        {sharedFields.map((field) => renderField(field, sharedLocale))}
                    </div>
                </Card>
            ) : null}

            <Card title={trans('hancms.page.content')} contentClassName="overflow-visible">
                <div className="space-y-5 p-5">
                    <div className="flex flex-wrap gap-2">
                        {props.languages.map((language) => (
                            <button
                                key={language.code}
                                type="button"
                                onClick={() => setActiveLocale(language.code)}
                                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                                    activeLocale === language.code
                                        ? 'bg-slate-900 text-white'
                                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                {renderLanguageBadge(language)}
                                <span>{language.name}</span>
                                <span className="uppercase opacity-70">{language.code}</span>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-5">
                        {translatableFields.length ? translatableFields.map((field) => renderField(field, activeLocale)) : (
                            <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                {trans('hancms.message.nodata')}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
            <div className="mt-2 text-sm font-semibold text-slate-900">{value || '-'}</div>
        </div>
    );
}

function EmptyValue() {
    return (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
            -
        </div>
    );
}

Show.layout = (page: React.ReactNode) => <MainLayout title="hancms.page.title">{page}</MainLayout>;
