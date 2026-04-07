import { usePage, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Save } from 'lucide-react';
import SaveButton from '@/Components/Button/SaveButton';
import BackButton from '@/Components/Button/BackButton';
import { User } from '@/types';
import { useTrans } from '@/Hooks/useTrans';
import { InputGroup } from '@/Components/Form/HancmsInput';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import Card from '@/Components/Main/Card';
import StatusSwitch from '@/Components/Status/StatusSwitch';

function EditPage() {
  const { trans } = useTrans();
  const { item } = usePage<{
    item: User & { password: string | null };
  }>().props;

  const { data, setData, errors, put, processing } = useForm({
    first_name: item.first_name || '',
    last_name: item.last_name || '',
    email: item.email || '',
    group: item.group || 0,
    status: item.status || 0,
    owner: item.owner ? 1 : 0 || 0,
    password: item.password || '',
    undo: 0,
    _method: 'put'
  });
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState('');
  const [active, setActive] = useState(data.status);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchError, setMatchError] = useState(false);
  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    // Custom password match validation
    if (password != confirmPassword) {
      setMatchError(true);
    } else {
      setMatchError(false);


      data.password = password;
      data.status = active;
      const payload: Partial<typeof data> = { ...data };

      if (!payload.password || payload.password.trim() === '') {
        delete payload.password;
      }

      put(route('users.update', item.id), {
        data: payload, // Một số phiên bản Inertia dùng tham số thứ 2 là data
        onSuccess: () => {
          setValidated(false);
        },
        onError: (err) => {
          console.log(err); // Kiểm tra lỗi trả về trong console
          setValidated(true);
        }
      });
    }
    setValidated(true);
  };
  const inputClass = (fieldName: string) => `
        w-full rounded-2xl border bg-white px-4 py-3 text-sm transition-all outline-none focus:ring-4
        ${(errors[fieldName as keyof typeof errors]) || (fieldName === 'confirm' && matchError)
      ? 'border-rose-400 bg-rose-50 ring-rose-100'
      : 'border-slate-200 focus:border-slate-300 focus:ring-slate-200'}
    `;
  // Callback function to receive data
  const handleChildData = (data: any) => {

  };
  const [undo, setUndo] = useState(0);
  const handleUndo = (status: number) => {
    setUndo(status);
  }
  useEffect(() => {
    data.undo = undo;
    if (active != data.status) {
      data.status = active;
    }
  }, [data, undo, active]);
  return (
    <div className="space-y-6 p-4 text-sm">
      <HeaderToolbar title={
        <>
          {trans('hancms.users.edit')}
          <span className='ml-2 text-cyan-600'>/ {item.name}</span>
        </>
      }>
        <SaveButton
          loading={processing}
          undo={undo}
          icon={<Save size={18} />}
          sendDataStatusUndo={handleUndo}
          form='my-form'
        >
          {trans('hancms.button.save')}
        </SaveButton>
        <BackButton href={route('users.index')}>
          {trans('hancms.button.back')}
        </BackButton>
      </HeaderToolbar>

      <form id='my-form' noValidate onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title={trans('hancms.title.infomation')}>
          <div className="space-y-6 p-6">
            <StatusSwitch
              value={active}
              onChange={(value) => setActive(String(value))}
              activeLabel={trans('hancms.status.active')}
              inactiveLabel={trans('hancms.status.inactive')}
            />

            <div className="grid grid-cols-12 gap-4 items-start">
              <label className="col-span-12 pt-2 text-sm font-semibold text-slate-700 sm:col-span-3">
                {trans('hancms.column.account_name')}
              </label>
              <div className="col-span-12 grid grid-cols-1 gap-4 sm:col-span-9 sm:grid-cols-2">
                <div>
                  <input
                    type='text'
                    required
                    className={inputClass('first_name')}
                    defaultValue={data.first_name}
                    onChange={e => setData('first_name', e.target.value)}
                    placeholder={trans('hancms.column.first_name')}
                  />
                  {errors.first_name && <p className="mt-1 text-xs text-rose-500">{errors.first_name}</p>}
                </div>
                <div>
                  <input
                    type='text'
                    required
                    className={inputClass('last_name')}
                    onChange={e => setData('last_name', e.target.value)}
                    defaultValue={data.last_name}
                    placeholder={trans('hancms.column.last_name')}
                  />
                  {errors.last_name && <p className="mt-1 text-xs text-rose-500">{errors.last_name}</p>}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title={trans('hancms.title.setting')}>
          <div className="space-y-6 p-6">
            <InputGroup label={trans('hancms.column.email')}>
              <input
                type='email'
                required
                className={inputClass('email')}
                onChange={e => setData('email', e.target.value)}
                defaultValue={item.email}
              />
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email}</p>}
            </InputGroup>

            <InputGroup label={trans('hancms.column.password')}>
              <input
                type="password"
                className={inputClass('password')}
                placeholder={trans('hancms.column.password')}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>

            <InputGroup label={trans('hancms.column.password_confirm')}>
              <input
                type="password"
                className={inputClass('confirm')}
                placeholder={trans('hancms.column.password_confirm')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {matchError && <p className="mt-1 text-xs text-rose-500">{trans('hancms.message.error.password_confirm')}</p>}
            </InputGroup>

            <InputGroup label={trans('hancms.column.assign_group')}>
              <select
                className={inputClass('group')}
                defaultValue={item.group}
                onChange={e => setData('group', e.target.value)}
              >
                <option value="0">Not Access</option>
                <option value="1">Administrators</option>
                <option value="2">Admin</option>
                <option value="3">Moderator</option>
                <option value="4">Api</option>
              </select>
            </InputGroup>
          </div>
        </Card>
      </form>
    </div>
  );
}
EditPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.users.edit" children={page} />
);

export default EditPage;
