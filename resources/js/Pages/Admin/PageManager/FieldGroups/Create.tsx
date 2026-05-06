import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import { store } from '@/actions/App/Http/Controllers/Admin/PageManager/FieldGroupController';
import { index } from '@/routes/page-schemas';
import FieldGroupFormView, { PageFieldSchema } from './Components/FieldGroupFormView';

type FieldGroupFormState = {
    title: string;
    status: boolean;
    fields: PageFieldSchema[];
};

export default function Create() {
    const { trans } = useTrans();
    const [undo, setUndo] = useState(0);
    const form = useForm<FieldGroupFormState>({
        title: '',
        status: true,
        fields: [
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
            submitLabel={trans('hancms.button.created')}
            data={form.data}
            setData={form.setData}
            errors={form.errors}
            processing={form.processing}
            undo={undo}
            handleUndo={handleUndo}
            trans={trans}
            onSubmit={(event) => {
                event.preventDefault();
                form.post(store.url());
            }}
        />
    );
}

Create.layout = (page: React.ReactNode) => <MainLayout title="hancms.content.field_design">{page}</MainLayout>;
