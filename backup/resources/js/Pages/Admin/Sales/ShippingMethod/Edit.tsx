import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import ShippingMethodFormView from './Components/ShippingMethodFormView';

export default function EditPage() {
  const { trans } = useTrans();
  const { item }: any = usePage().props;
  const { data, setData, errors, put, processing } = useForm({
    code: item?.code || '',
    provider: item?.provider || item?.code || '',
    name: item?.name || '',
    description: item?.description || '',
    settings: item?.settings || {},
    sort_order: item?.sort_order ?? 0,
    is_active: item?.is_active ?? true,
    undo: 0,
  });

  const [undo, setUndo] = useState(0);
  const handleUndo = (status: number) => {
    setUndo(status);
    setData('undo', status);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    put(route('shipping-methods.update', item.id));
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

EditPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.sales.shipping_methods.name" children={page} />
);
