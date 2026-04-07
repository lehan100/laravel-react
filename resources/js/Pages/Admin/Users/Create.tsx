import { Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Save, Undo } from 'lucide-react';
import SaveButton from '@/Components/Button/SaveButton';
import { useTrans } from '@/Hooks/useTrans';
import MainLayout from '@/Layouts/MainLayout';
import { InputGroup } from '@/Components/Form/HancmsInput';
import HeaderToolbar from '@/Components/Main/HeaderToolbar';
import Card from '@/Components/Main/Card';
import StatusSwitch from '@/Components/Status/StatusSwitch';
function CreatedPage() {
  const { trans } = useTrans();
  const { data, setData, errors, post, processing } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    group: '0',
    status: '0',
    owner: 0,
    password: '',
    undo: 0,
  });

  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState('');
  const [active, setActive] = useState(data.status);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchError, setMatchError] = useState(false);
  const [undo, setUndo] = useState(0);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    if (password !== confirmPassword) {
      setMatchError(true);
      return;
    }

    setMatchError(false);
    // Inertia useForm post
    post(route('users.store'));
  };

  const handleUndo = (status: number) => {
    setUndo(status);
  };

  // Đồng bộ state cục bộ vào data của useForm
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      undo: undo,
      status: active,
      password: password
    }));
  }, [undo, active, password]);

  // Lớp CSS dùng chung cho Input để code gọn hơn
  const inputClass = (fieldName: string) => `
        w-full border rounded-md p-2 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500
        ${(errors[fieldName as keyof typeof errors]) || (fieldName === 'confirm' && matchError)
      ? 'border-red-500 bg-red-50'
      : 'border-gray-300 focus:border-indigo-500'}
    `;

  return (
    <div className='content'>
      <HeaderToolbar
        title={
          <>
            {trans('hancms.users.created')}
            {(data.first_name || data.last_name) && <span className='text-cyan-600 ml-2'>: {data.first_name} {data.last_name}</span>}
          </>
        }>
        <SaveButton
          loading={processing}
          undo={0}
          icon={<Save size={20} />}
          sendDataStatusUndo={handleUndo}
          form='my-form'
        >
          {trans('hancms.button.save')}
        </SaveButton>

        <Link
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
          href={route('users.index')}
        >
          <Undo size={20} />
          <span>{trans('hancms.button.back')}</span>
        </Link>
      </HeaderToolbar>
      <form id='my-form' noValidate onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={trans('hancms.title.infomation')}>
          <div className="p-6 space-y-6">
            <StatusSwitch
              value={active}
              onChange={(value) => setActive(String(value))}
              activeLabel={trans('hancms.status.active')}
              inactiveLabel={trans('hancms.status.inactive')}
            />
            {/* Account Name */}
            <div className="grid grid-cols-12 gap-4 items-start">
              <label className="col-span-12 sm:col-span-3 pt-2 text-sm font-bold text-gray-700">
                {trans('hancms.column.account_name')}
              </label>
              <div className="col-span-12 sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type='text' required
                    className={inputClass('first_name')}
                    onChange={e => setData('first_name', e.target.value)}
                    placeholder={trans('hancms.column.first_name')}
                  />
                  {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                </div>
                <div>
                  <input
                    type='text' required
                    className={inputClass('last_name')}
                    onChange={e => setData('last_name', e.target.value)}
                    placeholder={trans('hancms.column.last_name')}
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Card title={trans('hancms.title.setting')}>
          <div className="p-6 space-y-6">
            {/* Email Row */}
            <InputGroup label={trans('hancms.column.email')}>
              <input
                type='email' required
                className={inputClass('email')}
                onChange={e => setData('email', e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </InputGroup>
            {/* Password Row */}
            <InputGroup label={trans('hancms.column.password')}>
              <input
                type="password" required
                className={inputClass('password')}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </InputGroup>
            {/* Confirm Password Row */}
            <InputGroup label={trans('hancms.column.password_confirm')}>
              <input
                type="password" required
                value={confirmPassword}
                className={inputClass('confirm')}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {matchError && (
                <p className="text-red-500 text-xs mt-1">
                  {trans('hancms.message.error.password_confirm')}
                </p>
              )}
            </InputGroup>
            {/* Assign Group */}
            <InputGroup label={trans('hancms.column.assign_group')}>
              <select
                className={inputClass('group')}
                required defaultValue='0'
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

CreatedPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.users.created" children={page} />
);

export default CreatedPage;
