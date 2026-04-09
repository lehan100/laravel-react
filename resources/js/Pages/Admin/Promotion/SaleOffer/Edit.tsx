import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import SaleOfferFormView from './Components/SaleOfferFormView';

export default function EditPage() {
  const { trans } = useTrans();
  const { item, itemsCategoryActive, itemsSelectedProducts }: any = usePage().props;

  const { data, setData, errors, put, processing } = useForm({
    code: item?.code || '',
    name: item?.name || '',
    description: item?.description || '',
    discount_type: item?.discount_type || 'percent',
    discount_value: item?.discount_value ?? 0,
    max_discount_amount: item?.max_discount_amount ?? '',
    starts_at: item?.starts_at ?? '',
    ends_at: item?.ends_at ?? '',
    priority: item?.priority ?? 100,
    product_ids: item?.product_ids || [],
    is_active: item?.is_active ?? true,
    stackable: item?.stackable ?? false,
    undo: 0,
  });

  const [undo, setUndo] = useState(0);
  const handleUndo = (status: number) => {
    setUndo(status);
    setData('undo', status);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    put(route('saleoffer.update', item.id));
  }

  return (
    <SaleOfferFormView
      title={trans('hancms.promotion.saleoffer.name')}
      backHref={route('saleoffer.index')}
      submitLabel={trans('hancms.button.save')}
      data={data}
      setData={setData as any}
      errors={errors as any}
      processing={processing}
      itemsCategoryActive={itemsCategoryActive || []}
      itemsSelectedProducts={itemsSelectedProducts || []}
      undo={undo}
      handleUndo={handleUndo}
      onSubmit={handleSubmit}
      trans={trans}
    />
  );
}

EditPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.promotion.saleoffer.name" children={page} />
);
