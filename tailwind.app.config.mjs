import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./resources/views/app.blade.php', './resources/js/app.tsx', './resources/js/Pages/**/*.tsx', './resources/js/Components/**/*.tsx', './resources/js/Layouts/**/*.tsx', '!./resources/js/Pages/Admin/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        indigo: {
          100: '#e6e8ff',
          300: '#b2b7ff',
          400: '#7886d7',
          500: '#6574cd',
          600: '#5661b3',
          800: '#2f365f',
          900: '#191e38'
        }
      },
      fontFamily: {
        sans: ['"Cerebri Sans"', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
    // ...
  ]
};
