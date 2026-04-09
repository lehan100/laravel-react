import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import BuyToGiftFormView from './Components/BuyToGiftFormView';

export default function CreatedPage() {
  const { trans } = useTrans();
  const { itemsCategoryActive, itemsSelectedBuyProducts, itemsSelectedGiftProducts }: any = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    code: '',
    name: '',
    description: '',
    condition_type: 'order_amount',
    min_order_amount: '',
    max_sets_per_order: '',
    starts_at: '',
    ends_at: '',
    priority: 100,
    buy_product_ids: [],
    buy_qty: 1,
    gift_product_ids: [],
    gift_qty: 1,
    rules: [
      {
        id: null,
        condition_type: 'order_amount',
        min_order_amount: '',
        max_sets_per_order: '',
        buy_product_ids: [],
        buy_qty: 1,
        gift_product_ids: [],
        gift_qty: 1,
        is_active: true,
        stackable: false,
        priority: 100,
      },
    ],
    is_active: true,
    stackable: false,
    undo: 0,
  });

  const [undo, setUndo] = useState(0);
  const handleUndo = (status: number) => {
    setUndo(status);
    setData('undo', status);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post(route('buytogift.store'));
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

CreatedPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.promotion.buytogift.name" children={page} />
);
