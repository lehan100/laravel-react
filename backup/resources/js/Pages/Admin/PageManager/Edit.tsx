import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import { update } from '@/actions/App/Http/Controllers/Admin/PageManager/PageController';
import { index } from '@/routes/pages';
import PageValueFormView from './Components/PageValueFormView';

function createSlug(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/(\s+)/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '');
}

type PageManagerProps = {
    page: {
        id: number;
        status: boolean;
        field_group_id: number;
        translations?: Record<string, { title?: string; slug?: string }>;
        acf_data?: Record<string, Record<string, any>>;
    };
    fieldGroup: {
        id: number;
        title: string;
        fields_schema?: Array<any>;
    };
    pageTranslations?: Record<string, { title?: string; slug?: string }>;
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

export default function Edit() {
    const { trans } = useTrans();
    const props = usePage().props as unknown as PageManagerProps;
    const [undo, setUndo] = useState(0);
    const form = useForm<PageFormState>({
        status: props.page?.status ?? true,
        field_group_id: props.page?.field_group_id || props.fieldGroup?.id || '',
        translations: (props.languages || []).reduce((carry: Record<string, { title: string; slug: string }>, language: any) => {
            const translation = props.pageTranslations?.[language.code] || {};
            const title = translation.title || '';
            carry[language.code] = {
                title,
                slug: createSlug(translation.slug || title),
            };
            return carry;
        }, {}),
        content: props.page?.acf_data || {},
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
            languages={props.languages || []}
            fieldGroups={props.fieldGroups || []}
            posts={props.posts || []}
            products={props.products || []}
            bannerPositions={props.bannerPositions || []}
            trans={trans}
            onSubmit={(event) => {
                event.preventDefault();
                form.put(update.url({ page: props.page.id }));
            }}
        />
    );
}

Edit.layout = (page: React.ReactNode) => <MainLayout title="hancms.content.field_values">{page}</MainLayout>;
