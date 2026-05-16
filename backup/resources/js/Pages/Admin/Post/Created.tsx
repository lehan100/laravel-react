import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import PostFormView from './Components/PostFormView';

function CreatedPage() {
    const { trans } = useTrans();
    const { langs, itemsCategoryActive, item, locale }: any = usePage().props;
    const langList = langs?.data || (Array.isArray(langs) ? langs : Object.values(langs || {}));

    const initialTranslations = langList.reduce((result: any, lang: any) => {
        const localeCode = lang.code;
        const existing = item?.translations?.[localeCode];
        result[localeCode] = {
            name: existing?.name || '',
            slug: existing?.slug || '',
            description: existing?.description || '',
            content: existing?.content || '',
            seo_title: existing?.seo_title || '',
            seo_keyword: existing?.seo_keyword || '',
            seo_description: existing?.seo_description || '',
        };
        return result;
    }, {});

    const { data, setData, errors, post, processing } = useForm({
        category_id: item?.category_id || '',
        photo: item?.photo || '',
        type: item?.type || '',
        status: item?.status ?? 0,
        order: item?.order ?? 0,
        hit_viewer: item?.hit_viewer ?? 0,
        undo: 0,
        translations: initialTranslations,
    });

    const [undo, setUndo] = useState(0);
    const handleUndo = (status: number) => {
        setUndo(status);
        setData('undo', status);
    };

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('post.store'));
    }

    return (
        <PostFormView
            title={trans('hancms.catalog.post.name')}
            backHref={route('post.index')}
            submitLabel={trans('hancms.button.save')}
            item={item}
            data={data}
            setData={setData}
            errors={errors}
            trans={trans}
            langList={langList}
            langCode={locale}
            itemsCategoryActive={itemsCategoryActive || []}
            onSubmit={handleSubmit}
            processing={processing}
            undo={undo}
            handleUndo={handleUndo}
        />
    );
}

CreatedPage.layout = (page: React.ReactNode) => (
    <MainLayout title="hancms.catalog.post.created" children={page} />
);

export default CreatedPage;
