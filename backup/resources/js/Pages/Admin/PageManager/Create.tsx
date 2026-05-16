import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import { store } from '@/actions/App/Http/Controllers/Admin/PageManager/PageController';
import { index } from '@/routes/pages';
import PageValueFormView from './Components/PageValueFormView';

type PageManagerProps = {
    fieldGroups: Array<{ id: number; title: string; fields_schema?: Array<any>; pages_count?: number }>;
    languages: Array<{ code: string; name: string; photo?: string }>;
    posts: Array<{ id: number; label: string }>;
    products: Array<{ id: number; label: string }>;
    bannerPositions: Array<{ id: number; name: string; code?: string }>;
};

type PageFormState = {
    status: boolean;
    field_group_id: number | string;
    translations: Record<string, {
        title: string;
        slug: string;
    }>;
    content: Record<string, Record<string, any>>;
};

export default function Create() {
    const { trans } = useTrans();
    const { fieldGroups, languages, posts, products, bannerPositions }: any = usePage().props as unknown as PageManagerProps;
    const [undo, setUndo] = useState(0);
    const form = useForm<PageFormState>({
        status: true,
        field_group_id: '',
        translations: (languages || []).reduce((carry: Record<string, { title: string; slug: string }>, language: any) => {
            carry[language.code] = {
                title: '',
                slug: '',
            };
            return carry;
        }, {}),
        content: (languages || []).reduce((carry: Record<string, Record<string, any>>, language: any) => {
            carry[language.code] = {};
            return carry;
        }, {}),
    });

    const handleUndo = (status: number): void => {
        setUndo(status);
    };

    return (
        <PageValueFormView
            title={trans('hancms.content.field_values')}
            backHref={index.url()}
            submitLabel={trans('hancms.button.save')}
            data={form.data}
            setData={form.setData}
            errors={form.errors}
            processing={form.processing}
            undo={undo}
            handleUndo={handleUndo}
            languages={languages || []}
            fieldGroups={fieldGroups || []}
            posts={posts || []}
            products={products || []}
            bannerPositions={bannerPositions || []}
            trans={trans}
            allowFieldGroupChange
            onSubmit={(event) => {
                event.preventDefault();
                form.post(store.url());
            }}
        />
    );
}

Create.layout = (page: React.ReactNode) => <MainLayout title="hancms.content.field_values">{page}</MainLayout>;
