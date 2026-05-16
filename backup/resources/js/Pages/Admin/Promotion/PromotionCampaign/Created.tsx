import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import PromotionCampaignFormView from './Components/PromotionCampaignFormViewV2';

function buildTranslations(langList: any[], values: Record<string, { name?: string; slug?: string; description?: string }> = {}) {
  return (Array.isArray(langList) ? langList : []).reduce((carry: Record<string, { name: string; slug: string; description: string }>, lang: any) => {
    const locale = String(lang?.code || lang?.locale || lang?.id || 'vi');
    carry[locale] = {
      name: values[locale]?.name || '',
      slug: values[locale]?.slug || '',
      description: values[locale]?.description || '',
    };

    return carry;
  }, {});
}

export default function CreatedPage() {
  const { trans } = useTrans();
  const { itemsCouponActive, itemsSaleOfferActive, itemsBuyToGiftActive, langs }: any = usePage().props;
  const langList = Array.isArray(langs?.data) ? langs.data : Array.isArray(langs) ? langs : Object.values(langs || {});
  const { data, setData, errors, post, processing } = useForm({
    translations: buildTranslations(langList),
    starts_at: '',
    ends_at: '',
    priority: 100,
    coupon_ids: [],
    saleoffer_ids: [],
    buytogift_ids: [],
    sync_module_ends_at: true,
    is_active: true,
    undo: 0,
  });

  const [undo, setUndo] = useState(0);
  const handleUndo = (status: number) => {
    setUndo(status);
    setData('undo', status);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    post(route('promotion-campaign.store'));
  }

  return (
    <PromotionCampaignFormView
      title={trans('hancms.promotion.campaign.name')}
      backHref={route('promotion-campaign.index')}
      submitLabel={trans('hancms.button.save')}
      data={data}
      setData={setData as any}
      errors={errors as any}
      processing={processing}
      itemsCouponActive={itemsCouponActive || []}
      itemsSaleOfferActive={itemsSaleOfferActive || []}
      itemsBuyToGiftActive={itemsBuyToGiftActive || []}
      undo={undo}
      handleUndo={handleUndo}
      onSubmit={handleSubmit}
      trans={trans}
    />
  );
}

CreatedPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.promotion.campaign.name" children={page} />
);
