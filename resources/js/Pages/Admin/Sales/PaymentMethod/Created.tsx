import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { useTrans } from '@/Hooks/useTrans';
import PaymentMethodFormView from './Components/PaymentMethodFormView';

export default function CreatedPage() {
  const { trans } = useTrans();
  const { data, setData, errors, post, processing } = useForm({
    code: 'momo',
    provider: 'momo',
    name: 'MoMo',
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
    post(route('payment-methods.store'));
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

CreatedPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.sales.payment_methods.name" children={page} />
);
