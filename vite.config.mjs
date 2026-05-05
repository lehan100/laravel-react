import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';
import i18n from 'laravel-react-i18n/vite';
import fs from 'fs';
export default defineConfig({
    plugins: [
        laravel(['resources/js/app.tsx', 'resources/css/app.css']),
        react(),
        i18n(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        cors: {
            origin: '*',
        },
        https: {
            key: fs.readFileSync('./certs/ukimua-dev.com-key.pem'),
            cert: fs.readFileSync('./certs/ukimua-dev.com.pem'),
        },
        hmr: {
            host: 'ukimua-dev.com',
        },
    },
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        }
    },
});
