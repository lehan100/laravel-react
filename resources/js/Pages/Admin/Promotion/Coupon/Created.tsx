import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import CouponFormView from './Components/CouponFormView';

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
    min_order_amount: '',
    max_order_amount: '',
    priority: 100,
    first_order_only: false,
    usage_limit_total: '',
    usage_limit_per_user: '',
    starts_at: '',
    ends_at: '',
    category_ids: [],
    product_ids: [],
    is_active: true,
    is_public: true,
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
    post(route('coupon.store'));
  }

  return (
    <CouponFormView
      title={trans('hancms.promotion.coupon.name')}
      backHref={route('coupon.index')}
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
  <MainLayout title="hancms.promotion.coupon.name" children={page} />
);
