import { useMemo } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import BackButton from '@/Components/Button/BackButton';
import SaveButton from '@/Components/Button/SaveButton';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import Card from '@/Components/Main/Card';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import StatusSwitch from '@/Components/Status/StatusSwitch';

export type PageFieldType = 'text' | 'image' | 'textarea' | 'editorMCE' | 'relation_new' | 'product' | 'banner_position';

export type PageFieldSchema = {
    key: string;
    label: string;
    type: PageFieldType;
    translatable: boolean;
    required: boolean;
};

type FieldGroupFormData = {
    title: string;
    status: boolean;
    fields: PageFieldSchema[];
};

type Props = {
    title: string;
    backHref: string;
    submitLabel: string;
    data: FieldGroupFormData;
    setData: (key: keyof FieldGroupFormData | string, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    undo: number;
    handleUndo: (status: number) => void;
    trans: (key: string, replace?: Record<string, any>) => string;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function FieldGroupFormView({
    title,
    backHref,
    submitLabel,
    data,
    setData,
    errors,
    processing,
    undo,
    handleUndo,
    trans,
    onSubmit,
}: Props) {
    const fieldTypeOptions = useMemo(
        () => [
            { value: 'text', label: trans('hancms.page.field_types.text') },
            { value: 'image', label: trans('hancms.page.field_types.image') },
            { value: 'textarea', label: trans('hancms.page.field_types.textarea') },
            { value: 'editorMCE', label: trans('hancms.page.field_types.editor') },
            { value: 'relation_new', label: trans('hancms.page.field_types.relation_new') },
            { value: 'product', label: trans('hancms.page.field_types.product') },
            { value: 'banner_position', label: trans('hancms.page.field_types.banner_position') },
        ],
        [trans]
    );

    const updateField = (index: number, patch: Partial<PageFieldSchema>): void => {
        setData(
            'fields',
            data.fields.map((field, fieldIndex) => (
                fieldIndex === index ? { ...field, ...patch } : field
            ))
        );
    };

    const addField = (): void => {
        setData('fields', [
            ...data.fields,
            {
                key: `field_${data.fields.length + 1}`,
                label: '',
                type: 'text',
                translatable: true,
                required: true,
            },
        ]);
    };

    const removeField = (index: number): void => {
        setData('fields', data.fields.filter((_, fieldIndex) => fieldIndex !== index));
    };

    const inputClass = (fieldName: string): string =>
        `w-full rounded-md border p-2 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
            errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
        }`;

    return (
        <div>
            <HeaderToolbar title={title}>
                <SaveButton
                    loading={processing}
                    undo={undo}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form="field-group-form"
                >
                        {submitLabel}
                </SaveButton>
                <BackButton href={backHref}>{trans('hancms.button.back')}</BackButton>
            </HeaderToolbar>

            <form id="field-group-form" onSubmit={onSubmit} className="space-y-6">
                <Card title={trans('hancms.title.infomation')} contentClassName="overflow-visible">
                    <div className="space-y-5 p-6">
                        <StatusSwitch
                            value={data.status}
                            onChange={(value) => setData('status', Boolean(value))}
                            activeLabel={trans('hancms.status.active')}
                            inactiveLabel={trans('hancms.status.inactive')}
                        />

                        <InputGroup label={trans('hancms.column.name')}>
                        <input
                            value={data.title}
                            onChange={(event) => setData('title', event.target.value)}
                                className={inputClass('title')}
                        />
                            {errors.title ? <MessageError>{errors.title}</MessageError> : null}
                        </InputGroup>
                    </div>
                </Card>

                <Card title={trans('hancms.page.field_builder')} contentClassName="overflow-visible">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
                    <div>
                            {/*<div className="text-sm font-semibold text-slate-900">{trans('hancms.page.field_count')}: {data.fields.length}</div>*/}
                            {/*<div className="mt-1 text-xs text-slate-500">{trans('hancms.page.field_builder_note')}</div>*/}
                    </div>
                    <button
                        type="button"
                        onClick={addField}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        <Plus className="h-4 w-4" />
                        {trans('hancms.page.add_field')}
                    </button>
                </div>

                    <div className="space-y-3 p-6">
                    {data.fields.map((field, index) => (
                            <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="grid gap-4 md:grid-cols-[1fr_1fr_180px_140px_96px]">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.key')}</label>
                                    <input
                                        value={field.key}
                                        onChange={(event) => updateField(index, { key: event.target.value })}
                                            className={inputClass(`fields.${index}.key`)}
                                    />
                                        {errors[`fields.${index}.key`] ? <MessageError>{errors[`fields.${index}.key`]}</MessageError> : null}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.name')}</label>
                                    <input
                                        value={field.label}
                                        onChange={(event) => updateField(index, { label: event.target.value })}
                                            className={inputClass(`fields.${index}.label`)}
                                    />
                                        {errors[`fields.${index}.label`] ? <MessageError>{errors[`fields.${index}.label`]}</MessageError> : null}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{trans('hancms.column.type')}</label>
                                    <select
                                        value={field.type}
                                        onChange={(event) => updateField(index, { type: event.target.value as PageFieldType })}
                                            className={inputClass(`fields.${index}.type`)}
                                    >
                                        {fieldTypeOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                        <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                                        <input
                                            type="checkbox"
                                            checked={field.translatable}
                                            onChange={(event) => updateField(index, { translatable: event.target.checked })}
                                            className="h-4 w-4 rounded border-slate-300"
                                        />
                                        {trans('hancms.page.translatable')}
                                    </label>
                                </div>
                                <div className="flex items-end justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeField(index)}
                                            className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-md shadow-rose-950/10 ring-1 ring-rose-950/5 transition-all duration-200 hover:-translate-y-0.5 hover:from-rose-500 hover:to-red-500"
                                    >
                                            <Trash2 size={13} />
                                        {trans('hancms.button.delete')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </Card>
        </form>
        </div>
    );
}
