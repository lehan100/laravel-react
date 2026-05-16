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

function VariantStockForm({
  variant,
  trans,
}: {
  variant: any;
  trans: (key: string) => string;
}) {
  const formId = `variant-stock-form-${variant.id}`;
  const currentStock = Number(variant.quantity ?? variant.stock ?? 0);
  const form = useForm<WarehouseFormData>({
    action: 'set',
    set_quantity: currentStock,
    adjust_delta: 0,
    reason: '',
    undo: 0,
  });
  const { data, setData, put, processing, errors, isDirty } = form;

  const inputClass = (field: WarehouseFieldName) => `w-full rounded-md border px-3 py-2 text-sm ${errors[field] ? 'border-rose-500 bg-rose-50' : 'border-slate-300'}`;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    put(route('warehouse.variants.update', variant.id), {
      preserveScroll: true,
      onSuccess: () => {
        form.setDefaults({
          action: data.action,
          set_quantity: data.set_quantity,
          adjust_delta: data.adjust_delta,
          reason: data.reason,
          undo: data.undo,
        });
      },
    });
  };

  return (
    <form id={formId} onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{variant.name || variant.sku || `#${variant.id}`}</div>
          <div className="mt-1 text-xs text-slate-500">{variant.sku}</div>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {trans('hancms.sales.warehouse.fields.current_stock')}: {currentStock}
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <InputGroup label={trans('hancms.sales.warehouse.fields.update_method')}>
          <select className={inputClass('action')} value={data.action} onChange={(e) => setData('action', e.target.value)}>
            <option value="set">{trans('hancms.sales.warehouse.fields.set_new_stock')}</option>
            <option value="adjust">{trans('hancms.sales.warehouse.fields.adjust_delta')}</option>
          </select>
        </InputGroup>

        {data.action === 'set' ? (
          <InputGroup label={trans('hancms.sales.warehouse.fields.new_stock')}>
            <input
              type="number"
              min={0}
              className={inputClass('set_quantity')}
              value={data.set_quantity}
              onChange={(e) => setData('set_quantity', Number(e.target.value))}
            />
            {errors.set_quantity && <MessageError>{errors.set_quantity}</MessageError>}
          </InputGroup>
        ) : (
          <InputGroup label={trans('hancms.sales.warehouse.fields.delta')}>
            <input
              type="number"
              className={inputClass('adjust_delta')}
              value={data.adjust_delta}
              onChange={(e) => setData('adjust_delta', Number(e.target.value))}
            />
            {errors.adjust_delta && <MessageError>{errors.adjust_delta}</MessageError>}
          </InputGroup>
        )}

        <InputGroup label={trans('hancms.sales.warehouse.fields.reason')}>
          <textarea
            rows={3}
            className={inputClass('reason')}
            value={data.reason}
            onChange={(e) => setData('reason', e.target.value)}
            placeholder={trans('hancms.sales.warehouse.placeholders.reason')}
          />
          {errors.reason && <MessageError>{errors.reason}</MessageError>}
        </InputGroup>

        <div className="flex items-center justify-end">
          <SaveButton
            loading={processing}
            undo={0}
            icon={<Save size={18} />}
            sendDataStatusUndo={() => {}}
            form={formId}
            className="px-4 py-3 text-sm"
            disabled={!isDirty}
          >
            {trans('hancms.sales.warehouse.actions.save_stock')}
          </SaveButton>
        </div>
      </div>
    </form>
  );
}

export default function WarehouseEditPage() {
  const { trans } = useTrans();
  const { item, histories, warehouse_name }: any = usePage().props;

  const form = useForm<WarehouseFormData>({
    action: 'set',
    set_quantity: item?.quantity ?? 0,
    adjust_delta: 0,
    reason: '',
    undo: 0,
  });
  const { data, setData, put, processing, errors, isDirty } = form;

  const [undo, setUndo] = useState(0);

  const inputClass = (field: WarehouseFieldName) => `w-full rounded-md border px-3 py-2 text-sm ${errors[field] ? 'border-rose-500 bg-rose-50' : 'border-slate-300'}`;
  const isVariant = item?.type === 'variant';
  const hasVariants = !isVariant && Array.isArray(item?.variants) && item.variants.length > 0;
  const currentStock = hasVariants
    ? item.variants.reduce((total: number, variant: any) => total + Number(variant.quantity ?? variant.stock ?? 0), 0)
    : Number(item?.quantity ?? 0);
  const updateRoute = isVariant ? route('warehouse.variants.update', item.id) : route('warehouse.update', item.id);
  const title = isVariant
    ? `${warehouse_name || trans('hancms.sales.warehouse.default_name')}: ${item?.product_name || item?.product_sku || ''} / ${item?.name || item?.sku || `#${item?.id}`}`
    : `${warehouse_name || trans('hancms.sales.warehouse.default_name')}: ${item?.name || item?.sku || `#${item?.id}`}`;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    put(updateRoute, {
      onSuccess: () => {
        form.setDefaults({
          action: data.action,
          set_quantity: data.set_quantity,
          adjust_delta: data.adjust_delta,
          reason: data.reason,
          undo: data.undo,
        });
      },
    });
  };

  return (
    <div className="p-6 space-y-6">
      <HeaderToolbar title={title}>
        {!hasVariants && (
          <SaveButton
            loading={processing}
            undo={undo}
            icon={<Save size={18} />}
            sendDataStatusUndo={(status) => {
              setUndo(status);
              setData('undo', status);
            }}
            form="warehouse-form"
            disabled={!isDirty}
          >
            {trans('hancms.sales.warehouse.actions.save_stock')}
          </SaveButton>
        )}
        <BackButton href={route('warehouse.index')}>{trans('hancms.button.back')}</BackButton>
      </HeaderToolbar>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title={trans('hancms.sales.warehouse.titles.update_stock')}>
          <div className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 text-sm">
              <div><span className="text-slate-500">SKU:</span> <span className="font-semibold">{item.sku}</span></div>
              <div><span className="text-slate-500">{trans('hancms.sales.warehouse.fields.current_stock')}:</span> <span className="font-semibold">{currentStock}</span></div>
              {isVariant && (
                <>
                  <div><span className="text-slate-500">{trans('hancms.catalog.product.tabs.variants')}:</span> <span className="font-semibold">{item.name || '-'}</span></div>
                  <div><span className="text-slate-500">{trans('hancms.catalog.product.name')}:</span> <span className="font-semibold">{item.product_name || item.product_sku || '-'}</span></div>
                </>
              )}
            </div>

            {hasVariants ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  {trans('hancms.sales.warehouse.messages.parent_stock_managed_by_variants')}
                </div>

                <div className="flex flex-col gap-4">
                  {Array.isArray(item?.variants) && item.variants.length > 0 ? (
                    item.variants.map((variant: any) => (
                      <VariantStockForm
                        key={variant.id}
                        variant={variant}
                        trans={trans}
                      />
                    ))
                  ) : null}
                </div>
              </div>
            ) : (
              <form id="warehouse-form" onSubmit={submit} className="space-y-4">
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
              </form>
            )}
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
      </div>
    </div>
    );
}

WarehouseEditPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.sales.warehouse.name" children={page} />
);
