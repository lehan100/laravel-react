import CreatedButton from "@/Components/Button/CreatedButton";
import Card from "@/Components/Main/Card";
import HeaderToolbar from "@/Components/Main/HeaderToolbar";
import { useTrans } from "@/Hooks/useTrans";
import MainLayout from "@/Layouts/MainLayout"
import CategoryTree from "./Components/CategoryTree";
import { Save, Undo } from "lucide-react";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import { Category } from "@/types";
import CategoryFormView from "./Components/CategoryFormView";
import SaveButton from "@/Components/Button/SaveButton";

function CreatedPage() {
    const { trans } = useTrans();
    const { itemsCategory, locale }: any = usePage().props;
    const currentLocale = (locale as string) || 'vi';

    const { langs, item, config_path, languageConfigPath, itemsCategoryActive }: any = usePage<{
        item: Category;
    }>().props;
    const langList = langs?.data || (Array.isArray(langs) ? langs : Object.values(langs || {}));
    const initialTranslations = langList.reduce((result: any, lang: any) => {
        const locale = lang.code;
        const existing = item?.translations?.[locale];
        result[locale] = {
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

    const { data, setData, errors, put, processing } = useForm({
        id: item?.id ?? 0,
        status: item?.status ?? 0,
        parent_id: item?.parent_id ?? 0,
        photo: item?.photo ?? '',
        undo: item?.undo ?? 0,
        translations: initialTranslations,
    });
    const commonProps = { data, setData, trans, config_path, languageConfigPath, errors, langCode: currentLocale, itemsCategoryActive: itemsCategoryActive };
    const [activeId, setActiveId] = useState<number | null>(data.id);
    const [undo, setUndo] = useState(0);
    const handleUndo = (status: number) => setUndo(status);
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route('category.update', item.id));
    }
    return (
        <div className="category-manager p-2">
            <HeaderToolbar title={trans('hancms.catalog.category.name')}>
                <SaveButton
                    loading={processing}
                    undo={0}
                    icon={<Save size={18} />}
                    sendDataStatusUndo={handleUndo}
                    form='my-form'
                >
                    {trans('hancms.button.save')}
                </SaveButton>
                <CreatedButton
                    href={route("category.create")}
                >
                    {trans('hancms.button.created')}
                </CreatedButton>
            </HeaderToolbar>
            <div className="grid grid-cols-12 gap-6 mt-4">
                <div className="col-span-12 lg:col-span-4 h-full">
                    <Card title={trans('hancms.catalog.category.tree_structure')} className='h-full'>
                        <div className="overflow-y-auto pr-1 custom-scrollbar">
                            <CategoryTree
                                data={itemsCategory || []}
                                onDelete={(id: number) => router.delete(route('category.destroy', id))}
                                activeId={activeId ?? undefined}
                                locale={currentLocale} />

                        </div>
                    </Card>
                </div>

                <div className="col-span-12 lg:col-span-8">
                    <form id='my-form' noValidate onSubmit={handleSubmit}>
                        <CategoryFormView {...commonProps} langList={langList} />
                    </form>
                </div>
            </div>
        </div>
    )
}
CreatedPage.layout = (page: React.ReactNode) => <MainLayout title='hancms.catalog.category.created' children={page} />
export default CreatedPage;
