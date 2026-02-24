import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { LaravelReactI18nProvider } from 'laravel-react-i18n';
import '../css/app.css'; 
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
import axios from 'axios';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}
createInertiaApp({
  title: title => `${title} - ${appName}`,
  resolve: name =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob('./Pages/**/*.tsx')
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);
    const currentLocale = (props.initialPage.props.locale as string) || 'vi';
    root.render(
      <LaravelReactI18nProvider
        locale={currentLocale} // Hoặc lấy từ props của Laravel
        fallbackLocale={'en'}
        files={import.meta.glob([
          '/lang/php_*.json', // Chỉ lấy các file đã được convert từ PHP
          '/lang/*.json'      // Lấy thêm các file JSON thuần nếu có
        ], { eager: true })}
      >
        <App {...props} />
      </LaravelReactI18nProvider>
    );
  },
  progress: {
    color: '#F87415'
  }
});
