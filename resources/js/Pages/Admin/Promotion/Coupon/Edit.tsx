import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import CouponFormView from './Components/CouponFormView';

export default function EditPage() {
  const { trans } = useTrans();
  const { item, itemsCategoryActive, itemsCampaignActive, itemsSelectedProducts }: any = usePage().props;

  const { data, setData, errors, put, processing } = useForm({
    code: item?.code || '',
    name: item?.name || '',
    description: item?.description || '',
    campaign_id: item?.campaign_id || '',
    discount_type: item?.discount_type || 'percent',
    discount_value: item?.discount_value ?? 0,
    max_discount_amount: item?.max_discount_amount ?? '',
    min_order_amount: item?.min_order_amount ?? '',
    max_order_amount: item?.max_order_amount ?? '',
    first_order_only: item?.first_order_only ?? false,
    usage_limit_total: item?.usage_limit_total ?? '',
    usage_limit_per_user: item?.usage_limit_per_user ?? '',
    starts_at: item?.starts_at ?? '',
    ends_at: item?.ends_at ?? '',
    category_ids: item?.category_ids || [],
    product_ids: item?.product_ids || [],
    is_active: item?.is_active ?? true,
    is_public: item?.is_public ?? true,
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
    put(route('coupon.update', item.id));
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

EditPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.promotion.coupon.name" children={page} />
);
