import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import PaymentMethodFormView from './Components/PaymentMethodFormView';

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
    put(route('payment-methods.update', item.id));
  }

  return (
    <PaymentMethodFormView
      title={trans('hancms.sales.payment_methods.name')}
      backHref={route('payment-methods.index')}
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
  <MainLayout title="hancms.sales.payment_methods.name" children={page} />
);
