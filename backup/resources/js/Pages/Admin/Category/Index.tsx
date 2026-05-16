import React, { useState, useMemo, useEffect } from 'react';
import { usePage, useForm, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import Card from '@/Components/Main/Card';
import CategoryTree from './Components/CategoryTree';
import { MousePointerClick } from 'lucide-react';
import CreatedButton from '@/Components/Button/CreatedButton';

function IndexPage() {
    const { trans } = useTrans();
    const { itemsCategory, locale }: any = usePage().props;
    const currentLocale = (locale as string) || 'vi';
    const [activeId, setActiveId] = useState<number | null>(null);
    return (
        <div className="category-manager p-2">
            <HeaderToolbar title={trans('hancms.catalog.category.name')}>
                <CreatedButton
                    href={route("category.create")}
                >
                    {trans('hancms.button.created')}
                </CreatedButton>
            </HeaderToolbar>

            <div className="grid grid-cols-12 gap-6 mt-4">
                <div className="col-span-12 lg:col-span-4 h-full">
                    <Card title={trans('hancms.catalog.category.tree_structure')} className='h-full'>
                        <div className="max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar">
                            <CategoryTree
                                data={itemsCategory || []}
                                onDelete={(id: number) => router.delete(route('category.destroy', id))}
                                activeId={activeId ?? undefined}
                                locale={currentLocale}
                            />
                        </div>
                    </Card>
                </div>

                <div className="col-span-12 lg:col-span-8">
                    <Card>
                        <div className="text-center opacity-30 group hover:opacity-50 p-12">
                            <MousePointerClick size={64} className="mx-auto mb-4 animate-bounce" />
                            <p className="text-lg font-bold italic">{trans('hancms.catalog.category.select_to_view')}</p>
                            <p className="text-sm mt-2">{trans('hancms.catalog.category.instruction_text')}</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

IndexPage.layout = (page: React.ReactNode) => <MainLayout title="hancms.catalog.category.name" children={page} />
export default IndexPage;
