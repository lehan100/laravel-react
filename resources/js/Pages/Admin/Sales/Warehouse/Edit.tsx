import { useForm, usePage } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import SaveButton from '@/Components/Button/SaveButton';
import BackButton from '@/Components/Button/BackButton';
import Card from '@/Components/Main/Card';
import { InputGroup } from '@/Components/Form/HancmsInput';
import { useTrans } from '@/Hooks/useTrans';
import MessageError from '@/Components/Form/MessageError';

type WarehouseFormData = {
  action: string;
  set_quantity: number;
  adjust_delta: number;
  reason: string;
  undo: number;
};

type WarehouseFieldName = keyof WarehouseFormData;

export default function WarehouseEditPage() {
  const { trans } = useTrans();
  const { item, histories, warehouse_name }: any = usePage().props;

  const { data, setData, put, processing, errors } = useForm<WarehouseFormData>({
    action: 'set',
    set_quantity: item?.quantity ?? 0,
    adjust_delta: 0,
    reason: '',
    undo: 0,
  });

  const [undo, setUndo] = useState(0);

  const inputClass = (field: WarehouseFieldName) => `w-full rounded-md border px-3 py-2 text-sm ${errors[field] ? 'border-rose-500 bg-rose-50' : 'border-slate-300'}`;
  const isVariant = item?.type === 'variant';
  const updateRoute = isVariant ? route('warehouse.variants.update', item.id) : route('warehouse.update', item.id);
  const title = isVariant
    ? `${warehouse_name || trans('hancms.sales.warehouse.default_name')}: ${item?.product_name || item?.product_sku || ''} / ${item?.name || item?.sku || `#${item?.id}`}`
    : `${warehouse_name || trans('hancms.sales.warehouse.default_name')}: ${item?.name || item?.sku || `#${item?.id}`}`;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    put(updateRoute);
  };

  return (
    <div className="p-6 space-y-6">
      <HeaderToolbar title={title}>
        <SaveButton
          loading={processing}
          undo={undo}
          icon={<Save size={18} />}
          sendDataStatusUndo={(status) => {
            setUndo(status);
            setData('undo', status);
          }}
          form="warehouse-form"
        >
          {trans('hancms.sales.warehouse.actions.save_stock')}
        </SaveButton>
        <BackButton href={route('warehouse.index')}>{trans('hancms.button.back')}</BackButton>
      </HeaderToolbar>

      <form id="warehouse-form" onSubmit={submit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title={trans('hancms.sales.warehouse.titles.update_stock')}>
          <div className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 text-sm">
              <div><span className="text-slate-500">SKU:</span> <span className="font-semibold">{item.sku}</span></div>
              <div><span className="text-slate-500">{trans('hancms.sales.warehouse.fields.current_stock')}:</span> <span className="font-semibold">{item.quantity}</span></div>
              {isVariant && (
                <>
                  <div><span className="text-slate-500">{trans('hancms.catalog.product.tabs.variants')}:</span> <span className="font-semibold">{item.name || '-'}</span></div>
                  <div><span className="text-slate-500">{trans('hancms.catalog.product.name')}:</span> <span className="font-semibold">{item.product_name || item.product_sku || '-'}</span></div>
                </>
              )}
            </div>

            <InputGroup label={trans('hancms.sales.warehouse.fields.update_method')}>
              <select className={inputClass('action')} value={data.action} onChange={(e) => setData('action', e.target.value)}>
                <option value="set">{trans('hancms.sales.warehouse.fields.set_new_stock')}</option>
                <option value="adjust">{trans('hancms.sales.warehouse.fields.adjust_delta')}</option>
              </select>
            </InputGroup>

            {data.action === 'set' ? (
              <InputGroup label={trans('hancms.sales.warehouse.fields.new_stock')}>
                <input type="number" min={0} className={inputClass('set_quantity')} value={data.set_quantity} onChange={(e) => setData('set_quantity', Number(e.target.value))} />
                {errors.set_quantity && <MessageError>{errors.set_quantity}</MessageError>}
              </InputGroup>
            ) : (
              <InputGroup label={trans('hancms.sales.warehouse.fields.delta')}>
                <input type="number" className={inputClass('adjust_delta')} value={data.adjust_delta} onChange={(e) => setData('adjust_delta', Number(e.target.value))} />
                {errors.adjust_delta && <MessageError>{errors.adjust_delta}</MessageError>}
              </InputGroup>
            )}

            <InputGroup label={trans('hancms.sales.warehouse.fields.reason')}>
              <textarea rows={3} className={inputClass('reason')} value={data.reason} onChange={(e) => setData('reason', e.target.value)} placeholder={trans('hancms.sales.warehouse.placeholders.reason')} />
              {errors.reason && <MessageError>{errors.reason}</MessageError>}
            </InputGroup>
          </div>
        </Card>

        <Card title={trans('hancms.sales.warehouse.titles.recent_history')}>
          <div className="max-h-[560px] overflow-auto p-4">
            {Array.isArray(histories) && histories.length > 0 ? (
              <div className="space-y-3">
                {histories.map((h: any) => (
                  <div key={h.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-slate-800">
                        {h.action === 'set' ? trans('hancms.sales.warehouse.fields.set_label') : trans('hancms.sales.warehouse.fields.adjust_label')}: {h.old_quantity} → {h.new_quantity}
                      </div>
                      <div className={`text-xs font-semibold ${h.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {h.delta >= 0 ? `+${h.delta}` : h.delta}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{h.created_at} · {h.user_name || trans('hancms.sales.warehouse.system_user')}</div>
                    {h.reason && <div className="mt-2 text-xs text-slate-700">{trans('hancms.sales.warehouse.fields.reason')}: {h.reason}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500">{trans('hancms.sales.warehouse.empty_history')}</div>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
}

WarehouseEditPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.sales.warehouse.name" children={page} />
);
