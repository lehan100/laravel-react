import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import BuyToGiftFormView from './Components/BuyToGiftFormView';

export default function EditPage() {
  const { trans } = useTrans();
  const { item, itemsCategoryActive, itemsSelectedBuyProducts, itemsSelectedGiftProducts }: any = usePage().props;

  const { data, setData, errors, put, processing } = useForm({
    code: item?.code || '',
    name: item?.name || '',
    description: item?.description || '',
    condition_type: item?.condition_type || 'order_amount',
    min_order_amount: item?.min_order_amount ?? '',
    max_sets_per_order: item?.max_sets_per_order ?? '',
    starts_at: item?.starts_at ?? '',
    ends_at: item?.ends_at ?? '',
    priority: item?.priority ?? 100,
    buy_product_ids: item?.buy_product_ids || [],
    buy_qty: item?.buy_qty ?? 1,
    gift_product_ids: item?.gift_product_ids || [],
    gift_qty: item?.gift_qty ?? 1,
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
    put(route('buytogift.update', item.id));
  }

  return (
    <BuyToGiftFormView
      title={trans('hancms.promotion.buytogift.name')}
      backHref={route('buytogift.index')}
      submitLabel={trans('hancms.button.save')}
      data={data}
      setData={setData as any}
      errors={errors as any}
      processing={processing}
      itemsCategoryActive={itemsCategoryActive || []}
      itemsSelectedBuyProducts={itemsSelectedBuyProducts || []}
      itemsSelectedGiftProducts={itemsSelectedGiftProducts || []}
      undo={undo}
      handleUndo={handleUndo}
      onSubmit={handleSubmit}
      trans={trans}
    />
  );
}

EditPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.promotion.buytogift.name" children={page} />
);
