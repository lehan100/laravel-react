import React from 'react';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import Logo from '@/Components/Logo/Logo';
import LoadingButton from '@/Components/Button/LoadingButton';
import TextInput from '@/Components/Form/TextInput';
import FieldGroup from '@/Components/Form/FieldGroup';
import { CheckboxInput } from '@/Components/Form/CheckboxInput';
import { usePage } from '@inertiajs/react';
import { AlertTriangle, LogIn } from 'lucide-react';
export default function LoginPage() {
  const { data, setData, errors, post, processing } = useForm({
    email: 'lehan100@gmail.com',
    password: 'secret',
    remember: true
  });
  const { props } = usePage();
  const flash = props.flash as any;

  
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    post(route('auth.post-login'));
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-indigo-900">
      <Head title="Login" />
      <div className="w-full max-w-md">
        <Logo
          className="block w-full max-w-xs mx-auto text-white fill-current"
          height={50}
        />
        <form
          onSubmit={handleSubmit}
          className="mt-8 overflow-hidden bg-white rounded-lg shadow-xl"
        >
          <div className="px-10 py-12">
            <h1 className="text-3xl font-bold text-center">Welcome Back!</h1>
            <div className="w-24 mx-auto mt-6 border-b-2" />
            {/* Thông báo lỗi khi bị logout từ nơi khác */}
            {flash?.message && (
              <div className="mt-6 mb-2 p-3 bg-amber-50 border border-amber-200 text-amber-700 text-[13px] font-medium rounded-md shadow-sm flex items-center gap-2 animate-fade-in">
                <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                <span className="leading-tight">{flash.message}</span>
              </div>
            )}
            <div className="grid gap-6">
              <FieldGroup label="Email" name="email" error={errors.email}>
                <TextInput
                  name="email"
                  type="email"
                  error={errors.email}
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                />
              </FieldGroup>

              <FieldGroup
                label="Password"
                name="password"
                error={errors.password}
              >
                <TextInput
                  type="password"
                  error={errors.password}
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                />
              </FieldGroup>

              <FieldGroup>
                <CheckboxInput
                  label="Remember Me"
                  name="remember"
                  id="remember"
                  checked={data.remember}
                  onChange={e => setData('remember', e.target.checked)}
                />
              </FieldGroup>
            </div>
          </div>
          <div className="px-10 py-6 bg-gray-100 border-t border-gray-200 flex flex-col gap-4">
            <LoadingButton
              type="submit"
              loading={processing}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-md transition-all hover:bg-indigo-700 active:scale-[0.98]"
            >
              <LogIn size={18} />
              Login
            </LoadingButton>
            <div className="text-center">
              <a className="hover:underline text-sm text-gray-600" tabIndex={-1} href="#reset-password">
                Forgot password?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
