import BackButton from '@/Components/Button/BackButton';
import SaveButton from '@/Components/Button/SaveButton';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import Card from '@/Components/Main/Card';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import StatusSwitch from '@/Components/Status/StatusSwitch';
import { Save } from 'lucide-react';

type PaymentMethodFormViewProps = {
  title: string;
  backHref: string;
  submitLabel: string;
  data: any;
  setData: (key: string, value: any) => void;
  errors: Record<string, string>;
  processing: boolean;
  undo: number;
  handleUndo: (status: number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  trans: (key: string, params?: Record<string, any>) => string;
};

export default function PaymentMethodFormView({
  title,
  backHref,
  submitLabel,
  data,
  setData,
  errors,
  processing,
  undo,
  handleUndo,
  onSubmit,
  trans,
}: PaymentMethodFormViewProps) {
  const providerOptions = [
    { value: 'cash_on_delivery', label: trans('hancms.sales.payment_methods.providers.cash_on_delivery') },
    { value: 'momo', label: trans('hancms.sales.payment_methods.providers.momo') },
    { value: 'zalopay', label: trans('hancms.sales.payment_methods.providers.zalopay') },
    { value: 'vnpay', label: trans('hancms.sales.payment_methods.providers.vnpay') },
    { value: 'paypal', label: trans('hancms.sales.payment_methods.providers.paypal') },
  ];

  const updateSetting = (key: string, value: string) => {
    setData('settings', {
      ...(data.settings || {}),
      [key]: value,
    });
  };

  const renderSettingError = (fieldName: string) => {
    if (!errors[fieldName]) {
      return null;
    }

    return <MessageError>{errors[fieldName]}</MessageError>;
  };

  const renderGatewaySettings = () => {
    const provider = data.provider || data.code;

    if (provider === 'momo') {
      return (
        <>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.partner_code')}><input type="text" className={inputClass('settings.partner_code')} value={data.settings?.partner_code || ''} onChange={(e) => updateSetting('partner_code', e.target.value)} />{renderSettingError('settings.partner_code')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.access_key')}><input type="text" className={inputClass('settings.access_key')} value={data.settings?.access_key || ''} onChange={(e) => updateSetting('access_key', e.target.value)} />{renderSettingError('settings.access_key')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.secret_key')}><input type="text" className={inputClass('settings.secret_key')} value={data.settings?.secret_key || ''} onChange={(e) => updateSetting('secret_key', e.target.value)} />{renderSettingError('settings.secret_key')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.endpoint')}><input type="text" className={inputClass('settings.endpoint')} value={data.settings?.endpoint || ''} onChange={(e) => updateSetting('endpoint', e.target.value)} />{renderSettingError('settings.endpoint')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.return_url')}><input type="text" className={inputClass('settings.return_url')} value={data.settings?.return_url || ''} onChange={(e) => updateSetting('return_url', e.target.value)} />{renderSettingError('settings.return_url')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.ipn_url')}><input type="text" className={inputClass('settings.ipn_url')} value={data.settings?.ipn_url || ''} onChange={(e) => updateSetting('ipn_url', e.target.value)} />{renderSettingError('settings.ipn_url')}</InputGroup>
        </>
      );
    }

    if (provider === 'zalopay') {
      return (
        <>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.app_id')}><input type="text" className={inputClass('settings.app_id')} value={data.settings?.app_id || ''} onChange={(e) => updateSetting('app_id', e.target.value)} />{renderSettingError('settings.app_id')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.key1')}><input type="text" className={inputClass('settings.key1')} value={data.settings?.key1 || ''} onChange={(e) => updateSetting('key1', e.target.value)} />{renderSettingError('settings.key1')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.key2')}><input type="text" className={inputClass('settings.key2')} value={data.settings?.key2 || ''} onChange={(e) => updateSetting('key2', e.target.value)} />{renderSettingError('settings.key2')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.endpoint')}><input type="text" className={inputClass('settings.endpoint')} value={data.settings?.endpoint || ''} onChange={(e) => updateSetting('endpoint', e.target.value)} />{renderSettingError('settings.endpoint')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.callback_url')}><input type="text" className={inputClass('settings.callback_url')} value={data.settings?.callback_url || ''} onChange={(e) => updateSetting('callback_url', e.target.value)} />{renderSettingError('settings.callback_url')}</InputGroup>
        </>
      );
    }

    if (provider === 'vnpay') {
      return (
        <>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.tmn_code')}><input type="text" className={inputClass('settings.tmn_code')} value={data.settings?.tmn_code || ''} onChange={(e) => updateSetting('tmn_code', e.target.value)} />{renderSettingError('settings.tmn_code')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.hash_secret')}><input type="text" className={inputClass('settings.hash_secret')} value={data.settings?.hash_secret || ''} onChange={(e) => updateSetting('hash_secret', e.target.value)} />{renderSettingError('settings.hash_secret')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.endpoint')}><input type="text" className={inputClass('settings.endpoint')} value={data.settings?.endpoint || ''} onChange={(e) => updateSetting('endpoint', e.target.value)} />{renderSettingError('settings.endpoint')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.return_url')}><input type="text" className={inputClass('settings.return_url')} value={data.settings?.return_url || ''} onChange={(e) => updateSetting('return_url', e.target.value)} />{renderSettingError('settings.return_url')}</InputGroup>
        </>
      );
    }

    if (provider === 'paypal') {
      return (
        <>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.client_id')}><input type="text" className={inputClass('settings.client_id')} value={data.settings?.client_id || ''} onChange={(e) => updateSetting('client_id', e.target.value)} />{renderSettingError('settings.client_id')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.client_secret')}><input type="text" className={inputClass('settings.client_secret')} value={data.settings?.client_secret || ''} onChange={(e) => updateSetting('client_secret', e.target.value)} />{renderSettingError('settings.client_secret')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.mode')}><input type="text" className={inputClass('settings.mode')} value={data.settings?.mode || ''} onChange={(e) => updateSetting('mode', e.target.value)} />{renderSettingError('settings.mode')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.endpoint')}><input type="text" className={inputClass('settings.endpoint')} value={data.settings?.endpoint || ''} onChange={(e) => updateSetting('endpoint', e.target.value)} />{renderSettingError('settings.endpoint')}</InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.webhook_id')}><input type="text" className={inputClass('settings.webhook_id')} value={data.settings?.webhook_id || ''} onChange={(e) => updateSetting('webhook_id', e.target.value)} />{renderSettingError('settings.webhook_id')}</InputGroup>
        </>
      );
    }

    if (provider === 'cash_on_delivery') {
      return (
        <>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.instructions')}>
            <input type="text" className={inputClass('settings.instructions')} value={data.settings?.instructions || ''} onChange={(e) => updateSetting('instructions', e.target.value)} />
            {renderSettingError('settings.instructions')}
          </InputGroup>
          <InputGroup label={trans('hancms.sales.payment_methods.fields.cod_fee')}>
            <input type="text" className={inputClass('settings.cod_fee')} value={data.settings?.cod_fee || ''} onChange={(e) => updateSetting('cod_fee', e.target.value)} />
            {renderSettingError('settings.cod_fee')}
          </InputGroup>
        </>
      );
    }

    return null;
  };

  const inputClass = (fieldName: string) =>
    `w-full border rounded-md p-2 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
    }`;

  return (
    <div>
      <HeaderToolbar title={title}>
        <SaveButton
          loading={processing}
          undo={undo}
          icon={<Save size={18} />}
          sendDataStatusUndo={handleUndo}
          form="payment-method-form"
        >
          {submitLabel}
        </SaveButton>
        <BackButton href={backHref}>{trans('hancms.button.back')}</BackButton>
      </HeaderToolbar>

      <form id="payment-method-form" onSubmit={onSubmit}>
        <Card title={trans('hancms.title.infomation')} contentClassName="overflow-visible">
          <div className="space-y-5 p-6">
            <StatusSwitch
              value={data.is_active}
              onChange={(value) => setData('is_active', value)}
              activeLabel={trans('hancms.status.active')}
              inactiveLabel={trans('hancms.status.inactive')}
            />

            <InputGroup label={trans('hancms.column.code')}>
              <select
                className={inputClass('code')}
                value={data.code}
                onChange={(e) => {
                  const provider = e.target.value;
                  const selected = providerOptions.find((item) => item.value === provider);
                  setData('code', provider);
                  setData('provider', provider);
                  if (!data.name || providerOptions.some((item) => item.label === data.name)) {
                    setData('name', selected?.label || provider);
                  }
                }}
              >
                {providerOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              {errors.code && <MessageError>{errors.code}</MessageError>}
            </InputGroup>

            <InputGroup label={trans('hancms.column.name')}>
              <input type="text" required className={inputClass('name')} value={data.name} onChange={(e) => setData('name', e.target.value)} />
              {errors.name && <MessageError>{errors.name}</MessageError>}
            </InputGroup>

            <InputGroup label={trans('hancms.column.description')}>
              <textarea rows={4} className={inputClass('description')} value={data.description || ''} onChange={(e) => setData('description', e.target.value)} />
              {errors.description && <MessageError>{errors.description}</MessageError>}
            </InputGroup>

            <InputGroup label={trans('hancms.column.order')}>
              <input type="number" min={0} className={inputClass('sort_order')} value={data.sort_order ?? 0} onChange={(e) => setData('sort_order', Number(e.target.value || 0))} />
              {errors.sort_order && <MessageError>{errors.sort_order}</MessageError>}
            </InputGroup>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">{trans('hancms.sales.payment_methods.sections.gateway_settings')}</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {renderGatewaySettings()}
              </div>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
