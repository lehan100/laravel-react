import { Link, usePage, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Save, Undo } from 'lucide-react';
import SaveButton from '@/Components/Button/SaveButton';
import { User } from '@/types';
import { useTrans } from '@/Hooks/useTrans';
import { Checkbox } from '@/Components/Form/HancmsCheckbox';
import { InputGroup } from '@/Components/Form/HancmsInput';

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
        w-full border rounded-md p-2 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500
        ${(errors[fieldName as keyof typeof errors]) || (fieldName === 'confirm' && matchError)
      ? 'border-red-500 bg-red-50'
      : 'border-gray-300 focus:border-indigo-500'}
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
    <div className='content p-4 text-sm'>
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="w-full md:flex-1 mb-3 md:mb-0">
          <h1 className="text-xl font-bold text-gray-800">
            {trans('hancms.users.edit')} / <span className='text-blue-600'>{item.name}</span>
          </h1>
        </div>
        <div className="w-full md:w-auto">
          <div className="flex gap-2">
            <SaveButton
              loading={processing}
              undo={0}
              icon={<Save size={18} />}
              sendDataStatusUndo={handleUndo}
              form='my-form'
            >
              {trans('hancms.button.save')}
            </SaveButton>
            <Link
              className="flex items-center gap-2 p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors no-underline text-sm"
              href={route('users.index')}
            >
              <Undo size={18} />
              <span>{trans('hancms.button.back')}</span>
            </Link>
          </div>
        </div>
      </div>

      <form id='my-form' noValidate onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className='py-3 px-4 bg-indigo-800 text-white font-semibold text-lg'>
            {trans('hancms.title.infomation')}
          </div>
          <div className="p-4 space-y-4">
            {/* Switch Status */}
            <Checkbox>
              <input
                type="checkbox"
                className="sr-only peer"
                checked={active == '1'}
                onChange={() => setActive(active == 1 ? 0 : 1)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              <span className={`ml-3 text-sm font-medium ${active == '1' ? 'text-green-600' : 'text-gray-500'}`}>
                {active == '1' ? trans('hancms.status.active') : trans('hancms.status.inactive')}
              </span>
            </Checkbox>
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
                    defaultValue={data.first_name}
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
                    defaultValue={data.last_name}
                    placeholder={trans('hancms.column.last_name')}
                  />
                  {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột 2: Cấu hình tài khoản */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className='py-3 px-4 bg-indigo-800 text-white font-semibold text-lg'>
            {trans('hancms.title.setting')}
          </div>
          <div className="p-4 space-y-4">
            {/* Email */}
            <InputGroup label={trans('hancms.column.email')}>
              <input
                type='text' required
                className={inputClass('email')}
                onChange={e => setData('email', e.target.value)}
                defaultValue={item.email}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </InputGroup>

            {/* Password */}
            <InputGroup label={trans('hancms.column.password')}>
              <input
                type="password"
                className={inputClass('confirm')}
                placeholder={trans('hancms.column.password')}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
            {/* Confirm Password */}
            <InputGroup label={trans('hancms.column.password_confirm')}>
              <input
                type="password"
                className={inputClass('confirm')}
                placeholder={trans('hancms.column.password_confirm')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {matchError && <p className="text-red-500 text-xs mt-1">{trans('hancms.message.error.password_confirm')}</p>}
            </InputGroup>
            {/* Group Assign */}
            <InputGroup label={trans('hancms.column.assign_group')}>
              <select
                className="w-full px-3 py-2 border rounded-md outline-none text-sm border-gray-300 focus:border-indigo-500"
                defaultValue={item.group}
                onChange={e => setData('group', e.target.value)}
              >
                <option value="0">Not Access</option>
                <option value="1">Administrators</option>
                <option value="2">Admin</option>
              </select>
            </InputGroup>
          </div>
        </div>
      </form>

    </div>
  );
}
EditPage.layout = (page: React.ReactNode) => (
  <MainLayout title="hancms.users.edit" children={page} />
);

export default EditPage;