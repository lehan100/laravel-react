import BackButton from '@/Components/Button/BackButton';
import SaveButton from '@/Components/Button/SaveButton';
import { InputGroup } from '@/Components/Form/HancmsInput';
import MessageError from '@/Components/Form/MessageError';
import Card from '@/Components/Main/Card';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import StatusSwitch from '@/Components/Status/StatusSwitch';
import { Save } from 'lucide-react';

type ShippingMethodFormViewProps = {
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

export default function ShippingMethodFormView({
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
}: ShippingMethodFormViewProps) {
  const providerOptions = [
    { value: 'ghn', label: trans('hancms.sales.shipping_methods.providers.ghn') },
    { value: 'ghtk', label: trans('hancms.sales.shipping_methods.providers.ghtk') },
    { value: 'viettel_post', label: trans('hancms.sales.shipping_methods.providers.viettel_post') },
    { value: 'jnt', label: trans('hancms.sales.shipping_methods.providers.jnt') },
    { value: 'ninja_van', label: trans('hancms.sales.shipping_methods.providers.ninja_van') },
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

  const inputClass = (fieldName: string) =>
    `w-full border rounded-md p-2 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500'
    }`;

  const renderGatewaySettings = () => {
    const provider = data.provider || data.code;

    if (provider === 'ghn') {
      return (
        <>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.token')}><input type="text" className={inputClass('settings.token')} value={data.settings?.token || ''} onChange={(e) => updateSetting('token', e.target.value)} />{renderSettingError('settings.token')}</InputGroup>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.shop_id')}><input type="text" className={inputClass('settings.shop_id')} value={data.settings?.shop_id || ''} onChange={(e) => updateSetting('shop_id', e.target.value)} />{renderSettingError('settings.shop_id')}</InputGroup>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.endpoint')}><input type="text" className={inputClass('settings.endpoint')} value={data.settings?.endpoint || ''} onChange={(e) => updateSetting('endpoint', e.target.value)} />{renderSettingError('settings.endpoint')}</InputGroup>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.webhook_url')}><input type="text" className={inputClass('settings.webhook_url')} value={data.settings?.webhook_url || ''} onChange={(e) => updateSetting('webhook_url', e.target.value)} />{renderSettingError('settings.webhook_url')}</InputGroup>
        </>
      );
    }

    if (provider === 'ghtk') {
      return (
        <>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.token')}><input type="text" className={inputClass('settings.token')} value={data.settings?.token || ''} onChange={(e) => updateSetting('token', e.target.value)} />{renderSettingError('settings.token')}</InputGroup>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.endpoint')}><input type="text" className={inputClass('settings.endpoint')} value={data.settings?.endpoint || ''} onChange={(e) => updateSetting('endpoint', e.target.value)} />{renderSettingError('settings.endpoint')}</InputGroup>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.webhook_url')}><input type="text" className={inputClass('settings.webhook_url')} value={data.settings?.webhook_url || ''} onChange={(e) => updateSetting('webhook_url', e.target.value)} />{renderSettingError('settings.webhook_url')}</InputGroup>
        </>
      );
    }

    if (provider === 'viettel_post' || provider === 'jnt') {
      return (
        <>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.username')}><input type="text" className={inputClass('settings.username')} value={data.settings?.username || ''} onChange={(e) => updateSetting('username', e.target.value)} />{renderSettingError('settings.username')}</InputGroup>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.password')}><input type="text" className={inputClass('settings.password')} value={data.settings?.password || ''} onChange={(e) => updateSetting('password', e.target.value)} />{renderSettingError('settings.password')}</InputGroup>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.endpoint')}><input type="text" className={inputClass('settings.endpoint')} value={data.settings?.endpoint || ''} onChange={(e) => updateSetting('endpoint', e.target.value)} />{renderSettingError('settings.endpoint')}</InputGroup>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.webhook_url')}><input type="text" className={inputClass('settings.webhook_url')} value={data.settings?.webhook_url || ''} onChange={(e) => updateSetting('webhook_url', e.target.value)} />{renderSettingError('settings.webhook_url')}</InputGroup>
        </>
      );
    }

    if (provider === 'ninja_van') {
      return (
        <>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.client_id')}><input type="text" className={inputClass('settings.client_id')} value={data.settings?.client_id || ''} onChange={(e) => updateSetting('client_id', e.target.value)} />{renderSettingError('settings.client_id')}</InputGroup>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.client_secret')}><input type="text" className={inputClass('settings.client_secret')} value={data.settings?.client_secret || ''} onChange={(e) => updateSetting('client_secret', e.target.value)} />{renderSettingError('settings.client_secret')}</InputGroup>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.endpoint')}><input type="text" className={inputClass('settings.endpoint')} value={data.settings?.endpoint || ''} onChange={(e) => updateSetting('endpoint', e.target.value)} />{renderSettingError('settings.endpoint')}</InputGroup>
          <InputGroup label={trans('hancms.sales.shipping_methods.fields.webhook_url')}><input type="text" className={inputClass('settings.webhook_url')} value={data.settings?.webhook_url || ''} onChange={(e) => updateSetting('webhook_url', e.target.value)} />{renderSettingError('settings.webhook_url')}</InputGroup>
        </>
      );
    }

    return null;
  };

  return (
    <div>
      <HeaderToolbar title={title}>
        <SaveButton loading={processing} undo={undo} icon={<Save size={18} />} sendDataStatusUndo={handleUndo} form="shipping-method-form">
          {submitLabel}
        </SaveButton>
        <BackButton href={backHref}>{trans('hancms.button.back')}</BackButton>
      </HeaderToolbar>

      <form id="shipping-method-form" onSubmit={onSubmit}>
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
              <h3 className="mb-3 text-sm font-semibold text-slate-800">{trans('hancms.sales.shipping_methods.sections.gateway_settings')}</h3>
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
