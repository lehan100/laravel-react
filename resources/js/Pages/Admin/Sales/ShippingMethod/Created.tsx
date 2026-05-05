import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import ShippingMethodFormView from './Components/ShippingMethodFormView';

export default function CreatedPage() {
  const { trans } = useTrans();
  const { data, setData, errors, post, processing } = useForm({
    code: 'ghn',
    provider: 'ghn',
    name: 'GHN',
    description: '',
    settings: {},
    sort_order: 0,
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
    post(route('shipping-methods.store'));
  }

  return (
    <ShippingMethodFormView
      title={trans('hancms.sales.shipping_methods.name')}
      backHref={route('shipping-methods.index')}
      submitLabel={trans('hancms.button.save')}
      data={data}
      setData={setData as any}
      errors={errors as any}
      processing={processing}
      undo={undo}
      handleUndo={handleUndo}
      onSubmit={handleSubmit}
      trans={trans}
    />
  );
}

CreatedPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.sales.shipping_methods.name" children={page} />
);
