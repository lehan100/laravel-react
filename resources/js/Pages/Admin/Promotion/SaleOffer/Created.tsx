import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import SaleOfferFormView from './Components/SaleOfferFormView';

export default function CreatedPage() {
  const { trans } = useTrans();
  const { itemsCategoryActive, itemsCampaignActive, itemsSelectedProducts }: any = usePage().props;
  const { data, setData, errors, post, processing } = useForm({
    code: '',
    name: '',
    description: '',
    campaign_id: '',
    discount_type: 'percent',
    discount_value: 0,
    max_discount_amount: '',
    starts_at: '',
    ends_at: '',
    priority: 100,
    product_ids: [],
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
    post(route('saleoffer.store'));
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
      itemsCampaignActive={itemsCampaignActive || []}
      itemsSelectedProducts={itemsSelectedProducts || []}
      undo={undo}
      handleUndo={handleUndo}
      onSubmit={handleSubmit}
      trans={trans}
    />
  );
}

CreatedPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.promotion.saleoffer.name" children={page} />
);
