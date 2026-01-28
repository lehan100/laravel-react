import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [laravel(['resources/js/app.tsx', 'resources/css/app.scss']), react()],
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        }
    },
    build: {
        rollupOptions: {
            // Add 'react' and 'react-dom' to the external list
            external: ['react', 'react-dom'],
        },
    },
});
