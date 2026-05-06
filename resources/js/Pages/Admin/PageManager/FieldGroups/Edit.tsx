import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import { update } from '@/actions/App/Http/Controllers/Admin/PageManager/FieldGroupController';
import { index } from '@/routes/page-schemas';
import FieldGroupFormView, { PageFieldSchema } from './Components/FieldGroupFormView';

type FieldGroupProps = {
    fieldGroup: {
        id: number;
        title: string;
        status: boolean;
        fields_schema?: PageFieldSchema[];
    };
};

type FieldGroupFormState = {
    title: string;
    status: boolean;
    fields: PageFieldSchema[];
};

export default function Edit() {
    const { trans } = useTrans();
    const [undo, setUndo] = useState(0);
    const { fieldGroup } = usePage().props as unknown as FieldGroupProps;
    const form = useForm<FieldGroupFormState>({
        title: fieldGroup.title || '',
        status: fieldGroup.status ?? true,
        fields: fieldGroup.fields_schema?.length
            ? fieldGroup.fields_schema
            : [
                {
                    key: 'field_1',
                    label: '',
                    type: 'text',
                    translatable: true,
                    required: true,
                },
            ],
    });

    const handleUndo = (status: number): void => {
        setUndo(status);
    };

    return (
        <FieldGroupFormView
            title={trans('hancms.content.field_design')}
            backHref={index.url()}
            submitLabel={trans('hancms.button.edit')}
            data={form.data}
            setData={form.setData}
            errors={form.errors}
            processing={form.processing}
            undo={undo}
            handleUndo={handleUndo}
            trans={trans}
            onSubmit={(event) => {
                event.preventDefault();
                form.put(update.url({ field_group: fieldGroup.id }));
            }}
        />
    );
}

Edit.layout = (page: React.ReactNode) => <MainLayout title="hancms.content.field_design">{page}</MainLayout>;
